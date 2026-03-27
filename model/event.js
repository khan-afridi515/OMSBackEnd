const mongoose = require("mongoose");


const eventSchema = new mongoose.Schema({
    title : String,
    eventDate : String,
    place : String
})

module.exports = mongoose.model('myEventSchema', eventSchema);