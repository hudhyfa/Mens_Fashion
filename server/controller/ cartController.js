const Cart = require('../modal/cart')
const Product = require('../modal/product')

const add_to_cart = async (req,res) => {
    try {

        const user_id = req.session.userId;
        const product_id = req.params.id;

        if(user_id && product_id){

            const[cart,product] = await Promise.all([
                Cart.findOne({user_id: user_id}),
                Product.findOne({_id:product_id})
            ])

            if(!cart){
                const new_cart = Cart.create({
                    user_id: user_id,
                    products:[{
                        product_id: product_id,
                        quantity: 1,
                        product_total: quantity*product.price
                    }],
                    cart_total:products.
                })
            }
        }
    
        

    } catch(error) {

    }

}

module.exports = {
    add_to_cart
}