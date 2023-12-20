const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const schema = new Schema({
    user_id:{
        type:Schema.Types.ObjectId,
        ref:"user_collection",
        required:true
    },
    amount:{
        type:Number,
        required:false,
        default:100
    },
    transactions:[
        {
            transaction_amount:{
                type:Number,
                required:true,
            },
            transaction_type:{
                type:String,
                required:true
            },
            transaction_date:{
                type:Date,
                required:true
            }
        }
    ]
})

const Wallet = mongoose.model('Wallet',schema);

module.exports = Wallet;