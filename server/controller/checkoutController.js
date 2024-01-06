const Product = require('../modal/product');
const Cart = require('../modal/cart');
const Address = require('../modal/address');


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

module.exports = {
    get_checkout
}