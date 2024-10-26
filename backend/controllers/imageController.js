const AppError = require("../config/AppError");
const mongoose = require("mongoose");
const Image = require("../models/Image");


// all controller functions either respond or pass along an error

// frontend needs to give zip code, description, end date, category, and uri in form
async function uploadImage(req, res, next) {
    try {
        const url = req.fileUpload.imageURL;
        const { zip, desc, end, category } = req.body;
        const image = await Image.create({ zipCode: zip, imageUrl: url, endDate: end, category: category, description: desc })
        res.status(200).json({ image })
    } catch (error) {
        next(error)
    }
}

// frontend needs to give image ID in link
async function getImage(req, res, next) {
  try {
    const { imageID } = req.params
    const image = await Image.findById(imageID);
    res.status(200).json({ image })
  } catch (error) {
    next(error)
  }
}

// frontend needs to give zipcode in link
async function getImages(req, res, next) {
  try {
    const { zipCode } = req.params;
    const images = await Image.find({ zipCode: zipCode })
    res.status(200).json({ images });
  } catch (error) {
    next(error);
  }
}

module.exports = {
    uploadImage,
    getImage, 
    getImages
}
