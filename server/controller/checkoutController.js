const Product = require('../modal/product');
const Cart = require('../modal/cart');
const Address = require('../modal/address');
const Order = require('../modal/order');
const Wallet = require('../modal/wallet');
var easyinvoice = require('easyinvoice');
const { request } = require('../routes/user_route');

const get_checkout = async (req,res) => {
    try {
        const id = req.session.userId;
        console.log("meanwhile");

        const [cart, address] = await Promise.all([
            Cart.findOne({user_id: id}),
            Address.find({user_id: id})
        ])

        const productIds = cart.products.map(product => product.product_id);
        const products = await Product.find({_id:{$in:productIds}});

        const enrichedCartData = cart.products.map(cartProduct => {
            const product = products.find(p => p._id.equals(cartProduct.product_id));
            return {
                ...cartProduct,
                name: product.name,
                price: product.price,
                image: product.image[0],
            }
        })

        res.render('user/checkout',{cart:cart, cartItems:enrichedCartData, addresses:address});
    } catch (error) {
        console.error("error while rendering checkout page",error);
    }
}

const confirmed_message = async(req,res) => {
    try {
        req.session.order_id = req.params.id;

        const order = await Order.findOne({ _id: req.session.order_id })
        .populate({ path: 'address_id', select: 'name house_name state country pincode' })
        .populate({ path: 'products.product_id', select: 'name image price' })

        res.render('user/confirmation',{order:order})
    } catch (error) {
        console.error("error while rendering confirmed page",error);
    }
}

const post_checkout = async (req, res) => {
    try {
        const id = req.session.userId;
        const {address, payment_method} = req.body;
        
        const cart = await Cart.findOne({user_id:id});
        const cartItems = [...cart.products];
        const total = cart.cart_total;

        if(!address){
            req.flash("addressError","Invalid address");
            res.status(404).redirect('/checkout');
        }
        
        if(payment_method === "wallet"){
            const checkBalance = await Wallet.findOne({user_id:id});
            if(!checkBalance || checkBalance.amount < total){
                req.flash("walletError", "insufficient funds")
                res.status(404).redirect('/checkout');
            }
            await Wallet.updateOne({user_id:id},{$inc:{amount:-total}});
        }

        const newOrder = await Order.create({
            user_id: id,
            address_id: address,
            products: cartItems,
            payment: payment_method,
            total_amount: total,
            status: "pending",
            created_at: new Date().toDateString(),
            updated_at: new Date().toDateString()
        })

        console.log("new order created",newOrder);

        for(const cartProduct of cart.products) {
            const productId = cartProduct.product_id;
            const size = cartProduct.size;
            const quantity = cartProduct.quantity;

            await decreaseStock(productId, size, quantity);
        }

        async function decreaseStock(productId, size, quantity) {
            await Product.updateOne(
                {_id: productId},
                {$inc: {"stock.$[elem].quantity": -quantity}},
                {arrayFilters: [{"elem.size": size}]}
            )
        }

        console.log("stock updated");

        await Cart.updateOne(
            {user_id: id},
            {$set:{products:[],cart_total:0}}
        )

        console.log("cart updated");

        res.status(200).redirect(`/confirmation/${newOrder._id}`)
        
    } catch (error) {
        console.error("error while posting checkout page",error);
    }
}

const cancel_order = async (req, res) => {
    try {
       const user_id = req.session.userId;
       const order_id = req.params.id;
       
       const order = await Order.findOne({_id:order_id});

       for(const product of order.products){

        const productId = product.product_id;
        const size = product.size;
        const quantity = product.quantity;

        await updateStock(productId, size, quantity);
       }

       async function updateStock(productId, size, quantity) {
         await Product.updateOne(
            {_id:productId},
            {$inc:{"stock.$[elem].quantity": quantity}},
            {arrayFilters: [{"elem.size": size}]}
         )
       }

       console.log("stock updated after cancellation");

       await Order.findOneAndUpdate(
        {_id:order_id},
        {$set:{status:"cancelled",updated_at:new Date()}},
        {new:true}
       )

       if(order.payment === "wallet"){
        await Wallet.updateOne({user_id:user_id},{$inc:{amount:order.amount}})
        console.log("wallet updated after cancellation");
       }

       console.log("order updated after cancellation");

       res.status(200).redirect(`/orders/${user_id}`);


    } catch (error) {
       console.error("error while cancelling order",error); 
    }
}

const create_invoice = async (req, res) => {
    try {
      const order_id = req.session.order_id;
      console.log(order_id);
      const order = await Order.findOne({_id:order_id})
                                    .populate({
                                        path: 'address_id', 
                                        select: 'house_name state country pincode' 
                                    })
                                    .populate({
                                        path: 'products.product_id', 
                                        select: 'name price' 
                                    });
    console.log("order bill",order);
    
    const pdfBuffer = await generateInvoice(order);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      ` attachment; filename=invoice-${order._id}.pdf`
    );
    res.send(pdfBuffer);

    } catch (error) {
        console.error("error while creating invoice",error);
    }
}

const generateInvoice=async (order)=>{
    try{

      const data = {
        documentTitle: "Invoice",
        currency: "INR",
        marginTop: 25,
        marginRight: 25,
        marginLeft: 25,
        marginBottom: 25,
        sender: {
          company: "Men's Fashion",
          address: "123 Main Street, Banglore, India",
          zip: "651323",
          city: "Banglore",
          country: "INDIA",
          phone: "9876543210",
          email: "mensfashion@gmail.com",
          website: "www.mensfashion.shop",
        },
        invoiceNumber: "INV-${order._id}",
        invoiceDate: new Date().toJSON(),
        products: order.products.map((item) => ({
          quantity: item.quantity,
          description: item.product_id.name,
          price: item.product_id.price,
        })),
        tax:0,
        subtotal: order.total_amount,
        total: order.total_amount,
        bottomNotice: "Thank you for shopping at UrbanSole!",
      };
      
    const result = await easyinvoice.createInvoice(data);
    const pdfBuffer = Buffer.from(result.pdf, "base64");
  
    return pdfBuffer;
  }catch(error){
      console.log(error);
  }
}

module.exports = {
    get_checkout,
    post_checkout,
    confirmed_message,
    cancel_order,
    create_invoice
}