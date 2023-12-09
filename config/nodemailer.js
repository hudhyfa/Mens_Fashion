const nodemailer = require('nodemailer');
require('dotenv').config()
console.log(process.env.EMAIL)

const transporter = nodemailer.createTransport({
    service:'gmail',
    auth:{
        user: process.env.EMAIL,
        pass: process.env.PASS,
    }
})


module.exports = {
    transporter
}