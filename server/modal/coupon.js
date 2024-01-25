const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    coupon_code:{
        type:String,
        required:true,
        uppercase:true
    },
    type:{
        type:String,
        required:true
    },
    min_purchase_amount:{
        type:Number,
        required:true
    },
    discount:{
        type:Number,
        required:true
    },
    max_discount_amount:{
        type:Number,
        required:true
    },
    expiry_date:{
        type:Date,
        required:true
    },
    status:{
        type:Boolean,
        required:false,
        default:true
    }
})

const Coupon = mongoose.model('Coupon',schema);

module.exports = Coupon;