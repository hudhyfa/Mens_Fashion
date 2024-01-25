const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    username:{
        type:String,
        require:true,
        default:"username"
    },
    email:{
        type:String,
        require:true,
        unique:true
    },
    phone:{
        type:Number,
        require:true,
        unique:true
    },
    password:{
        type:String,
        require:true,
    },
    userProfile:{
        type:String,
        require:false,
        default:"https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png"
    },
    isAdmin:{
        type:Boolean,
        require:true,
        default:false
    },
    status:{
        type:Boolean,
        require:true,
        default:true,
    },
    usedCoupons:{
        type:Array,
        require:false
    }
})

const user =  mongoose.model("user_collection", schema)

module.exports = user;