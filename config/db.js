const mongoose = require('mongoose')
// require('dotenv').config();


//Connect to MongoDB
const connectDB = async ()=>{
    try {
        await mongoose.connect('mongodb+srv://hudhaifa:mhone4Atlas@cluster0.uhxckro.mongodb.net/MensFashion');
        console.log("connected to MongoDB")
    } catch (error) {
        console.error("Error connecting to MongoDB");
        console.error(error.message);
        process.exit(1);
    }
}

module.exports={
    connectDB
}
    