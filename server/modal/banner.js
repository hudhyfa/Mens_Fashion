const mongoose = require('mongoose');
const schema = new mongoose.Schema({
    bg_img:{
        type:String,
        required:true
    },
    heading:{
        type:String,
        required:true
    },
    sub_heading:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    status:{
        type:Boolean,
        required:false,
        default:true
    }
});

const Banner = mongoose.model('Banner',schema);
module.exports = Banner;