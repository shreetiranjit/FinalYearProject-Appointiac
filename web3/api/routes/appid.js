const express = require("express");
const router = express.Router();
require("dotenv").config();

router.post("/profile", async (req, res) => {
  try {
    res.status(200).json({  success: true,message: process.env.PROFILE_APP_ID });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
