const mongoose = require("mongoose");
const Image = require("../models/Image");

async function findMatchingCoordinates(baseLongitude, baseLatitude) {
    return await Image.find({
      $and: [
        {
          $expr: {
            $lte: [
              {
                $abs: {
                  $subtract: ['$longitude', baseLongitude]
                }
              },
              0.0001
            ]
          }
        },
        {
          $expr: {
            $lte: [
              {
                $abs: {
                  $subtract: ['$latitude', baseLatitude]
                }
              },
              0.0001
            ]
          }
        }
      ]
    });
  }

  module.exports = findMatchingCoordinates