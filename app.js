const express = require('express');
const app = express();
const path = require('path');

// setting up view engine and views folder //
app.set('view engine', 'ejs');
// app.set('views',path.join(__dirname,'views/user'))
app.set('views',path.join(__dirname,'views'))


// setting up static public folder //
app.use(express.static(path.join(__dirname,'public/userAssets')));
app.use(express.static(path.join(__dirname,'public')));
// app.use(express.static(path.join(__dirname,'public')));


app.get('/admin',(req,res)=>{ 
    res.render('admin/dashboard')
})
app.get('/user',(req,res)=>{
    res.render('user/home')
})
app.get('/al',(req,res)=>{
    res.render('admin/adminLogin')
})
app.listen(3000,()=>console.log("connection established in localhost:3000"))