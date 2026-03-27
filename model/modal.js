const mongoose = require('mongoose');


const mongoSchema = new mongoose.Schema({
     name : String,
     contact : String,
     email : String,
     password : String,
     img : String,
}, {timestamps:true})


module.exports = mongoose.model('User', mongoSchema);