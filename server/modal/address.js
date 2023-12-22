const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    user_id:{
        type:Schema.Types.ObjectId,
        ref:"user_collection",
        required:true,
    },
    name:{
        type:String,
        required:true,
    },
    house_name:{
        type:String,
        required:true,
    },
    state:{
        type:String,
        required:true,
    },
    country:{
        type:String,
        required:true,
    },
    pincode:{
        type:Number,
        required:true,
    },
    landmark:{
        type:String,
        required:true,
    }
    
})

const Address = mongoose.model('Address',schema);

module.exports = Address;