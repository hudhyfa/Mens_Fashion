const mongoose = require('mongoose');

const schema  = new mongoose.Schema({
    email:{
        type:String,
        required:true,
    },
    otp:{
        type:String,
        required:true,
    },
    expirationTime:{
        type: Date,
        required:true,
        expires: 60
    }
})

const Otp = new mongoose.model('Otp',schema);

module.exports = Otp;