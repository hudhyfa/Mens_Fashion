const Cart = require('../modal/cart')
const Product = require('../modal/product')
const Coupon = require('../modal/coupon')
const User = require('../modal/user')


const get_cart = async (req,res) => {
    try {
        const user_id = req.session.userId;
        const cart = await Cart.findOne({user_id: user_id})

        if(cart){
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

            res.render('user/shopping-cart',{cart:cart,cartItems:enrichedCartData});
        }else{
            res.render('user/shopping-cart',{cart:cart})
        }

    } catch (error) {
        console.error("error rendering cart page",error);
        throw new Error("error rendering cart page",error);
    }
}

const add_to_cart = async (req, res) => {
    try {
      const user_id = req.session.userId;
      const product_id = req.params.id;
      const { size } = req.body;
      const price = parseInt(req.body.price);
  
      if (!user_id || !product_id || !price || !size) {
        throw new Error('Invalid input');
      }
  
      const [cart, product] = await Promise.all([
        Cart.findOne({ user_id: user_id }),
        Product.findOne({ _id: product_id })
      ]);
  
      if (!cart) {
        // Create a new cart
        const new_cart = await Cart.create({
          user_id: user_id,
          products: [{
            product_id: product_id,
            quantity: 1,
            size: size,
            product_total: price
          }],
          cart_total: price
        });
        await new_cart.save();
        console.log("created and added cart item");
        res.status(200).redirect(`/get-cart`);
      } else {
        // Cart exists, check for product and stock
        const check_stock = product.stock.find(s => s.size === size);
        const productIndexWithSize = cart.products.findIndex(p => p.product_id.equals(product_id) && p.size === size);
      
        if (check_stock.quantity > 0 && productIndexWithSize !== -1) {
          // Increment quantity of existing item
          await Cart.findOneAndUpdate(
            {
              user_id: user_id,
              "products.product_id": product_id,
              "products.size": size
            },
            {
              $inc: {
                "products.$.quantity": 1,
                cart_total: price,
                'products.$.product_total':price
              }
            },
            {
              new: true
            }
          );
  
          console.log("quantity of the item updated in the cart");
          res.status(200).redirect(`/get-cart`);
        } else if (check_stock.quantity > 0) {
          // Add new item to cart
          const new_cart_item = {
            product_id: product_id,
            quantity: 1,
            size: size,
            product_total: price
          };
  
          await Cart.updateOne(
            { user_id: user_id },
            {
              $push: {
                products: new_cart_item
              },
              $inc: {
                cart_total: price
              }
            }
          );
  
          console.log("added new item to cart and updated cart total");
          res.status(200).redirect(`/get-cart`);
        } else {
          // Item out of stock
          console.log("item out of stock");
          res.status(404).redirect(`/view-product/${product_id}`);
        }
      }
    } catch (error) {
      console.error("error while adding item to cart", error);
      res.status(500).send("error adding item to cart");
    }
  };

const remove_from_cart = async (req, res) => {
  try {
    console.log("inside remove from cart");
    const user_id = req.session.userId;
    const cart_item_id = req.params.id;
    const productTotal = parseInt(req.params.price);

    await Cart.findOneAndUpdate(
        {user_id:user_id},
        {
          $pull:{products:{_id:cart_item_id}},
          $inc:{cart_total: -productTotal}
        },
        {new:true}
    )

    res.status(200).redirect('/get-cart');

    // const cart = await Cart.findOne({user_id:user_id})

    // const productIds = cart.products.map(product => product.product_id);
    // const products = await Product.find({_id:{$in:productIds}});

    // const enrichedCartData = cart.products.map(cartProduct => {
    //     const product = products.find(p => p._id.equals(cartProduct.product_id));
    //     return {
    //         ...cartProduct,
    //         name: product.name,
    //         price: product.price,
    //         image: product.image[0]
    //     }
    // })

    // return res.json({
    //   success:true,
    //   enrichedCartData
    // })

  } catch (error) {
    console.error("error removing item from cart", error);
    res.status(403).send("error removing item from cart");
  }
}

const inc_quantity = async (req, res) => {
  try {
    const user_id = req.session.userId;
    const item_id = req.params.id;
    const price = parseInt(req.params.price);

    updatedCart = await Cart.findOneAndUpdate(
      { user_id: user_id },
      {
        $inc: { cart_total: price }
      },
      { new: true }
    );

    if (updatedCart) {
      const productIndex = updatedCart.products.findIndex(p => p._id.equals(item_id));
      if (productIndex !== -1) {
        updatedCart.products[productIndex].quantity += 1;
        updatedCart.products[productIndex].product_total += price;
        await updatedCart.save(); // Save the modified document
      } else {
        throw new Error("Product not found in cart");
      }
    }

    res.status(202).redirect('/get-cart');
    
  } catch (error) {
    console.log("error increasing quantity",error);
    res.status(404).send("error increasing quantity");
  }
}

const dec_quantity = async (req, res) => {
  try {
    const user_id = req.session.userId;
    const item_id = req.params.id;
    const price = parseInt(req.params.price);

    updatedCart = await Cart.findOneAndUpdate(
      { user_id: user_id },
      {
        $inc: { cart_total: -price }
      },
      { new: true }
    );

    if (updatedCart) {
      const productIndex = updatedCart.products.findIndex(p => p._id.equals(item_id));
      if (productIndex !== -1) {
        updatedCart.products[productIndex].quantity -= 1;
        updatedCart.products[productIndex].product_total -= price;
        await updatedCart.save(); // Save the modified document
      } else {
        throw new Error("Product not found in cart");
      }
    }

    res.status(202).redirect('/get-cart');
    
  } catch (error) {
    console.log("error decreasing quantity",error);
    res.status(404).send("error decreasing quantity");
  }
}

const apply_coupon = async (req, res) => {
  try {
    const couponCode = req.body.couponCode;
    const cart_id = req.body.cartId;

    const [checkCoupon, user, cart] = await Promise.all([
      Coupon.findOne({coupon_code: couponCode}),
      User.findOne({_id: req.session.userId}),
      Cart.findOne({_id: cart_id})
    ])
    
    if(!checkCoupon) return res.json({success:false,errMsg:"invalid coupon"});
    if(user.usedCoupons.includes(checkCoupon._id)) return res.json({success:false,errMsg:"coupon already used before"});
    if(cart.cart_total <= checkCoupon.min_purchase_amount) return res.json({success:false,errMsg:`you should purchase for at least $${checkCoupon.min_purchase_amount} to redeem the coupon, `});
    
    if(checkCoupon.type == "flat"){
      const order_total = cart.cart_total - checkCoupon.discount;
      req.session.finalAmount = order_total;
      req.session.discountAmount = checkCoupon.discount;
      req.session.coupon_id = checkCoupon._id;

      return res.json({
        success:true, 
        discount:checkCoupon.discount,
        orderTotal:order_total,
      });
    }

    if(checkCoupon.type == "percentage"){
      let discounted_price = (checkCoupon.discount/100)*cart.cart_total;
      if(discounted_price > checkCoupon.max_discount_amount) discounted_price = checkCoupon.max_discount_amount;

      const order_total = cart.cart_total - discounted_price;
      req.session.finalAmount = order_total;
      req.session.discountAmount = discounted_price;
      req.session.coupon_id = checkCoupon._id;

      return res.json({
        success:true, 
        discount:discounted_price,
        orderTotal:order_total,
      })
    }


  } catch (error) {
    console.log("error applying coupon",error);
    res.status(404).render('user/error',{errMsg: "error while applying coupon code try again!"})
  }
}
  

module.exports = {
    get_cart,
    add_to_cart,
    remove_from_cart,
    inc_quantity,
    dec_quantity,
    apply_coupon
}