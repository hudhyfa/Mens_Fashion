const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    listed:{
        type:Boolean,
        required:true,
        default:true
    }
}) 

const Category =  mongoose.model('Category',schema);

module.exports = Category;