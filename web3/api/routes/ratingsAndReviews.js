const express = require("express");
const router = express.Router();
const Rating = require("../models/rating");
const User = require("../models/user");

// Create a new rating and review
router.post("/", async (req, res) => {
  try {
    const { rated_user, stars, review, addr } = req.body;
    const reviewer = addr; 
    // console.log(user)
    const newRating = new Rating({ reviewer, rated_user, stars, review });
    await newRating.save();
    res.status(201).json(newRating);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Fetch ratings and reviews of a user
router.get("/user/:user_id", async (req, res) => {
  try {
    const ratings = await Rating.find({ rated_user: req.params.user_id });
    res.status(200).json(ratings);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Fetch average rating of a user
// Fetch average rating for a user
router.get("/user/:user_id/average", async (req, res) => {
  try {
    const ratings = await Rating.find({ rated_user: req.params.user_id });
    console.log(ratings);

    // Check if ratings array is empty or not
    if (ratings.length === 0) {
      return res.status(200).json({ averageRating: 0 });
    }

    // Compute the average rating
    // Compute the average rating
    const sum = ratings.reduce((acc, current) => acc + current.stars, 0);
    console.log(sum);
    const averageRating = sum / ratings.length;

    res.status(200).json({ averageRating });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Delete a rating and review
router.delete("/:rating_id", async (req, res) => {
  try {
    const rating = await Rating.findById(req.params.rating_id);

    if (!rating) {
      return res.status(404).json({ error: "Rating not found" });
    }

    if (req.user.id !== rating.reviewer.toString()) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    await rating.deleteOne();
    res.status(200).json({ message: "Rating deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
