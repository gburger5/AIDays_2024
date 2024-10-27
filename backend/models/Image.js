const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
  zipCode: {
    type: String,
    index: true,
    immutable: true,
    default: '34287'
  },
  imageUrl: {
    type: String,
    immutable: true,
  },
  createdAt: {
    type: Date,
    default: () => Date.now(),
    immutable: true,
  },
  description: {
    type: String,
    default: "",
    immutable: true,
  },
  endDate: {
    type: String,
  },
  category: {
    type: String,
    immutable: true,
  },
});

const giveCurrentDateTime = () => {
  const today = new Date();
  const date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDay();
  const time =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  const dateTime = date + time;
  return dateTime;
};

module.exports = mongoose.model("Image", imageSchema);
