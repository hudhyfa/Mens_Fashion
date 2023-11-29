const express = require('express');
const session = require('express-session')
const flash = require('connect-flash')
const bodyParser = require('body-parser');
const path = require('path');
const mongo = require('./config/db')

const app = express();
const PORT = process.env.PORT || 4000;

// connect to mongoDB
mongo.connectDB()

const user_route = require('./server/routes/user_route')

// While rendering
app.set('view engine', 'ejs');
app.set('views',path.join(__dirname,'views'))

// load static files
app.use(express.static(path.join(__dirname,'public/userAssets')));
app.use(express.static(path.join(__dirname,'public')));

// Configurations
app.use(session({
    secret:'envStuff',
    resave:false,
    saveUninitialized:false
}))

app.use(flash());
app.use((req,res,next)=>{
    res.locals.flash = req.flash();
    next();
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.use('/',user_route);

app.get('/',(req,res)=>{
    res.render('user/home')
})

app.listen(PORT,()=>console.log("connection established in localhost:4000"))