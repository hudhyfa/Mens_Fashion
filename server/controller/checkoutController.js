const Product = require('../modal/product');
const Cart = require('../modal/cart');
const Address = require('../modal/address');
const Order = require('../modal/order')

const get_checkout = async (req,res) => {
    try {
        const id = req.session.userId;

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
        res.render('user/confirmation')
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

        res.status(200).redirect('/confirmation')
        
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

       console.log("order updated after cancellation");

       res.status(200).redirect(`/orders/${user_id}`);


    } catch (error) {
       console.error("error while cancelling order",error); 
    }
}

module.exports = {
    get_checkout,
    post_checkout,
    confirmed_message,
    cancel_order
}