const mongoose = require('mongoose');

const attandanceSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    date : Date,
    status : String,
})

module.exports = mongoose.model('Attandance', attandanceSchema);