const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    category:{
        type:Schema.Types.ObjectId,
        ref:'Category',
        required:true,
    },
    price:{
        type:Number,
        required:true,
    },
    offer_price:{
        type:Number,
        required:false,
    },
    quantity:{
        type:Number,
        required:true,
    },
    size:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    image:{
        type:Array,
        required:true,
    },
    created_on:{
        type:Date,
        required:true,
    },
    status:{
        type:Boolean,
        required:false,
        default:true,
    }
})

const Product = mongoose.model('Product',schema);

module.exports = Product;