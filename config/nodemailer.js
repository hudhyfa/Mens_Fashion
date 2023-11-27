const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:"hudyfaismail@gmail.com",
        password:"hudyfaismail123",
    }
})


module.exports  =  transporter;