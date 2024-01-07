const mongoose = require('mongoose');
const Schema =  mongoose.Schema;

const schema = new Schema({
    user_id:{
        type:Schema.Types.ObjectId,
        ref:"user_collection",
        required: true
    },
    address_id:{
        type:Schema.Types.ObjectId,
        ref:"Address",
        required: true
    },
    products:[
        {
            product_id:{
                type:Schema.Types.ObjectId,
                ref:"Product",
                required: true
            },
            quantity:{
                type:Number,
                required: true
            },
            size:{
                type:String,
                required: true
            },
            product_total:{
                type:Number,
                required: true
            }
        }
    ],
    payment:{
        type:String,
        required: true
    },
    total_amount:{
        type:Number,
        required: true
    },
    status:{
        type:String,
        required: true
    },
    created_at:{
        type:Date,
        required: true
    },
    updated_at:{
        type:Date,
        required: true
    },

}) 

const Order = mongoose.model('Order', schema);
module.exports = Order;