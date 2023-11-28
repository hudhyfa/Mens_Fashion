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
    isEmailVerified:{
        type:Boolean,
        default:false
    }
})

const user_reg =  mongoose.model("user_collection", schema)