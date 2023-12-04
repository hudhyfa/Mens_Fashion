const mongoose = require('mongoose')

//Connect to MongoDB
const connectDB = async ()=>{
    try {
        await mongoose.connect("mongodb://0.0.0.0:27017/fashionEcommerce",{
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
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
    