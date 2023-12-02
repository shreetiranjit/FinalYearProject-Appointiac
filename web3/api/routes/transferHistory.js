const express = require("express");
const router = express.Router();
const Transfer = require("../models/transfer");
const { authenticate } = require("./auth");

// Fetch transfer history of a specific time slot
router.get("/timeSlot/:timeSlot_id", authenticate, async (req, res) => {
  try {
    const transfers = await Transfer.find({ timeSlot_id: req.params.timeSlot_id });
    res.status(200).json(transfers);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Fetch user's overall transfer history (both as a seller and as a buyer)
router.get("/user/:user_id", authenticate, async (req, res) => {
  try {
    const userId = req.params.user_id;
    const transfers = await Transfer.find({
      $or: [{ sold_by: userId }, { purchased_by: userId }],
    });
    res.status(200).json(transfers);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;