const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
require('dotenv').config();

// Configure Cloudinary explicitly from environment URL components
// Format: cloudinary://api_key:api_secret@cloud_name
cloudinary.config({
  cloud_name: 'docbwdkzs',
  api_key: '996795799611522',
  api_secret: 'OFTnEdW_3CJL7DI3XhEhvMi46MA'
});

// Configure Storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "namma-tech-solutions/videos",
    resource_type: "auto", // Automatically detect video/image/raw
    public_id: (req, file) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      return file.fieldname + "-" + uniqueSuffix;
    },
  },
});

module.exports = {
  cloudinary,
  storage
};
