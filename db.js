const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const dbUrl4 = process.env.DB_URL

const connectDB = async() =>{
    try{
        await mongoose.connect(dbUrl4);
        console.log("db Connected");
    }
    catch(err){
        console.log(err)
    }
}

module.exports = connectDB;


