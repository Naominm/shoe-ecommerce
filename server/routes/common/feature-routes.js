const express = require("express");

const {
  addFeatureImage,
  getFeatureImages,
  deleteFeatureImage, // Import the delete function
} = require("../../controllers/common/feature-controller");

const router = express.Router();

router.post("/add", addFeatureImage);
router.get("/get", getFeatureImages);
router.delete("/delete/:id", deleteFeatureImage); // Add the delete route

module.exports = router;
