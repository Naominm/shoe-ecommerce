const cloudinary = require("cloudinary").v2;
const multer = require("multer");
require("dotenv").config(); // Load environment variables from .env file

// Cloudinary configuration, getting values from .env file
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Set up Multer to store files in memory
const storage = multer.memoryStorage();

// Function to upload an image to Cloudinary
async function imageUploadUtil(file) {
  const result = await cloudinary.uploader.upload(file, {
    resource_type: "auto", // Automatically detect the file type
  });

  return result; // Return the Cloudinary response
}

// Multer middleware for handling file uploads
const upload = multer({ storage });

module.exports = { upload, imageUploadUtil };
