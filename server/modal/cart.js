const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    user_id:{
        type:Schema.Types.ObjectId,
        ref:"user_collection",
        required:true
    },
    products:[
        {
            product_id:{
                type:Schema.Types.ObjectId,
                ref:"Product",
                required:true
            },
            quantity:{
                type:Number,
                required:true
            },
            size:{
                type:String,
                required:true
            },
            product_total:{
                type:Number,
                required:true
            }
        }
        
    ],
    cart_total:{
        type:Number,
        required:true
    }
})

const Cart = mongoose.model('Cart',schema);

module.exports = Cart;