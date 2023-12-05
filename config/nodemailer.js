const nodemailer = require('nodemailer');
require('dotenv').config()


const transporter = nodemailer.createTransport({
    service:'gmail',
    auth:{
        // user: process.env.USER,
        // pass: process.env.PASS,
        user : "hudyfaismail@gmail.com",
        pass : "cjxercwuuzjriama"
    }
})


module.exports = {
    transporter
}