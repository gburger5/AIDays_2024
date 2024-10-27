const express = require("express");
const router = express.Router();
const controller = require("../controllers/imageController");
const { loadIntoMemory, uploadToFirebase } = require("../services/firebase");
const titleGeneration = require("../services/titlecreationAI")
const titleComparison = require("../services/titlecomparisonAI")

// image routes
router.get("/image/:imageID", controller.getImage);
router.get("/images/:zipCode", controller.getImages);
router.post("/image", titleGeneration, titleComparison, loadIntoMemory, uploadToFirebase, controller.uploadImage);

module.exports = router;
