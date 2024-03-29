const express = require('express');
const session = require('express-session')
const flash = require('connect-flash')
const cors = require('cors')
const multer = require('multer');
const path = require('path');
const mongo = require('./config/db')

const app = express();

require('dotenv').config();

// connect to mongoDB
mongo.connectDB()

// importing routes
const user_route = require('./server/routes/user_route')
const admin_route = require('./server/routes/admin_route')

// While rendering
app.set('view engine', 'ejs');
app.set('views',path.join(__dirname,'views'))

// load static files
app.use(express.static(path.join(__dirname,'public')));
app.use(express.static(path.join(__dirname,'public/userAssets')));
app.use(express.static(path.join(__dirname,'public/adminAssets')));

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

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(cors());

// error handler
const errorHandlerMiddleware = require('./middlewares/error/errorHandler');
app.use(errorHandlerMiddleware);

// multer config
app.use('/uploads/',express.static('uploads'));
const storage = multer.diskStorage({
    destination:function (req,file,cb){
        cb(null,'uploads/')
    },
    filename:function (req,file,cb){
        cb(null,file.originalname)
    }
})
const upload = multer({storage:storage})

// setting routes
app.use('/',user_route);
app.use('/',admin_route);


app.listen(process.env.PORT,()=>console.log(`connection on port ${process.env.PORT}`));