require('dotenv').config();
const cloudinary = require('cloudinary').v2;

cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.CLOUD_KEY, 
    api_secret: process.env.CLOUD_SECRET 
});

exports.uploadImage = (req, res, next) => {
    let filename = req.files[0].originalname;
    
    cloudinary.uploader.upload(`C:/Users/34641/Desktop/Proyectos/LenX/test-products/${filename}`, {
        folder: `products/${req.params.userId}/`,
        public_id: `${filename.slice(0, filename.lastIndexOf("."))}`
    }, function(error, result) {
        if (error) throw error;

        req.body.photo = result.secure_url;
        
        next();
    });
    
}

