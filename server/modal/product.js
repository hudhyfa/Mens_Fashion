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
    quantity:[{
        small:{
            type:Number,
            required:true,
        },
        medium:{
            type:Number,
            required:true
        },
        large:{
            type:Number,
            required:true
        }
    }],
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
    }
})

const Product = mongoose.model('Product',schema);

module.exports = Product;