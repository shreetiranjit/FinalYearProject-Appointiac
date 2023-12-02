const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RatingSchema = new Schema({
  reviewer: {
    type: String
    // required: true,
  },
  rated_user: {
    type: String,
  },
  stars: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  review: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Rating = mongoose.model("Rating", RatingSchema);
module.exports = Rating;
