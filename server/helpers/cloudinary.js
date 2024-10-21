// helpers/cloudinary.js
const cloudinary = require("cloudinary").v2;
const multer = require("multer");
require("dotenv").config(); // Load environment variables from .env file

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Set up Multer to store files in memory for easy handling with Cloudinary
const storage = multer.memoryStorage();
const upload = multer({ storage });

module.exports = { upload };
