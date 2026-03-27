const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, path.join(__dirname, 'uploads'))
    },

    filename: function(req, file, cb){
        cb(null, file.originalname);
    }
})

const upload = multer({storage,
    limits:{
        fileSize:1*1024*1024
    }
})

module.exports=upload;