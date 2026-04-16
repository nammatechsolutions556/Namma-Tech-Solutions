const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// Configure Cloudinary using the URL from .env
cloudinary.config({
  cloudinary_url: process.env.CLOUDINARY_URL
});

// Configure Storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "namma-tech-solutions/videos",
    resource_type: "video", // Specifically for videos
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
