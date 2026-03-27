const cloudinary = require('cloudinary').v2
const fs = require('fs');
const dotenv = require('dotenv');

dotenv.config();

cloudinary.config({

    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET,
    
    });


const fileOnCloud = async(filePath) => {
    try{
       if(!filePath) return null
       const response = await cloudinary.uploader.upload(filePath,{
        resource_type:"auto"
       })
       return response;
    }
    catch(err){
        fs.unlinkSync(filePath);
        console.log(err);
    }
}

module.exports=fileOnCloud;