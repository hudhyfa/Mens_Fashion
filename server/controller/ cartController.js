const Cart = require('../modal/cart')
const Product = require('../modal/product')

const get_cart = async (req,res) => {
    try {
        const user_id = req.session.userId;
        const cart = await Cart.findOne({user_id: user_id})

        res.render('user/shopping-cart',{cart});

    } catch (error) {
        console.error("error rendering cart page",error);
        throw new Error("error rendering cart page",error);
    }
}

const add_to_cart = async (req,res) => {
    try {

        const user_id = req.session.userId;
        const product_id = req.params.id;

        console.log(req.body);
        const { price,size } = req.body;

        if (!user_id || !product_id || !price || !size) {
            throw new Error('Invalid input'); // Handle invalid input
        }
      

        if(user_id){

            const cart = await Cart.findOne({user_id: user_id});

            if(!cart){
                console.log("creating new cart and adding to cart");
                const new_cart = await Cart.create({
                    user_id: user_id,
                    products:[{
                        product_id: product_id,
                        quantity: 1,
                        size:size,
                        product_total: price
                    }],
                    cart_total: price
                })
                await new_cart.save()
                console.log("created and added cart item");

            }else{
                console.log("cart already exists");
                const productIndexWithSize = cart.products.findIndex(p => p.product_id === product_id && p.size === size);
            
                if(productIndexWithSize !== -1){
                    console.log("item exist in the cart with same size");
                    await Cart.updateOne(
                        {
                            _id:user_id,
                            'products.product_id':product_id,
                            'products.$.size':size
                        },
                        {
                            $inc:{
                                'products.$.quantity': 1,
                                 cart_total: price
                            }
                        }
                    )
                    console.log("quantity updated and cart_total too");
                }else{
                    console.log("item doesn't exist adding new");
                    const new_cart_item = {
                        product_id: product_id,
                        quantity: 1,
                        size:size,
                        product_total: price
                    }

                    cart.products.push(new_cart_item);
                    cart.cart_total += new_cart_item.product_total;
                    
                    await cart.save();
                    console.log("added new item to cart and updated cart total");
                    
                }
                
            }
        }
    
        

    } catch(error) {
        console.error("error while adding item to cart",error);
        res.status(500).send("error adding item to cart");
    }

}

module.exports = {
    get_cart,
    add_to_cart
}