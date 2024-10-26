const express = require("express");
const router = express.Router();
const controller = require("../controllers/imageController");
const { loadIntoMemory, uploadToFirebase } = require("../services/firebase")

// image routes 
router.get(
  "/image/:imageID",
  loadIntoMemory,
  uploadToFirebase,
  controller.getImage
);
router.get('/images/:zipCode', controller.getImages)
router.post('/image', controller.uploadImage)

module.exports = router;
