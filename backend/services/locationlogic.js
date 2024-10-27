const mongoose = require("mongoose");
const Image = require("../models/Image");

async function findMatchingCoordinates(baseLongitude, baseLatitude) {
    // First ensure the input coordinates are valid numbers
    const parsedLong = parseFloat(baseLongitude);
    const parsedLat = parseFloat(baseLatitude);
    
    if (isNaN(parsedLong) || isNaN(parsedLat)) {
        throw new Error('Invalid coordinates provided');
    }

    return await Image.find({
        // First ensure we only match documents with non-empty coordinate strings
        $and: [
            { longitude: { $ne: "" } },
            { latitude: { $ne: "" } },
            { longitude: { $exists: true } },
            { latitude: { $exists: true } },
            {
                $expr: {
                    $and: [
                        // Ensure the strings can be converted to numbers
                        { $ne: [{ $toDouble: "$longitude" }, null] },
                        { $ne: [{ $toDouble: "$latitude" }, null] },
                        {
                            $lte: [
                                {
                                    $abs: {
                                        $subtract: [
                                            { $toDouble: "$longitude" },
                                            parsedLong
                                        ]
                                    }
                                },
                                0.0001
                            ]
                        },
                        {
                            $lte: [
                                {
                                    $abs: {
                                        $subtract: [
                                            { $toDouble: "$latitude" },
                                            parsedLat
                                        ]
                                    }
                                },
                                0.0001
                            ]
                        }
                    ]
                }
            }
        ]
    }).exec();
}

  module.exports = findMatchingCoordinates