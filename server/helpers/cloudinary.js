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

// Function to upload image to Cloudinary
const imageUploadUtil = async (imageBase64) => {
  try {
    const result = await cloudinary.uploader.upload(imageBase64);
    return result;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw new Error("Cloudinary upload failed");
  }
};

module.exports = { upload, imageUploadUtil };
