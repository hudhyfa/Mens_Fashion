const express = require('express');
const path = require('path');
const mongo = require('./config/db')

const app = express();
const PORT = process.env.PORT || 4000;

// connect to mongoDB
mongo.connectDB()

// While rendering
app.set('view engine', 'ejs');
app.set('views',path.join(__dirname,'views'))

// load static files
app.use(express.static(path.join(__dirname,'public/userAssets')));
app.use(express.static(path.join(__dirname,'public')));

app.get('/',(req,res)=>{
    res.render('user/home')
})

app.listen(PORT,()=>console.log("connection established in localhost:4000"))