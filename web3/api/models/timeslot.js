const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TimeSlotSchema = new Schema({
  frequency: {
    type: String,
    required: true,
  },
  timestamp: {
    type: String,
    required: true,
  },
  owner: {
    type: String,
    required: true,
  },
  current: {
    type: String,
    default: null
  },
  description: {
    type: String
  },
  for_auction: {
    type: Boolean,
    default: false,
    required: true,
  },
  forsale: {
    type: Boolean,
    default: false,
  },
  listed_price: {
    type: Number,
  },
  amount_per_session: {
    type: Number,
    required: true,
  },
  auction_price: {
    type: Number,
    required: true,
    default: 0.0,
    get: v => parseFloat(v.toFixed(2))
  },
  expiry_date: {
    type: String,
    required: true,
  },
  is_expired: {
    type: Boolean,
    default: false,
  },
    is_booked: {
    type: Boolean,
    default: false,
  },
  // list of users who have booked this slot 
  booked_users: [{
    type: String,
    default: null
  }],
  owned_by: {
    type: String,
    default: null
  },
  is_owned: {
    type: Boolean,
    default: false,
  }
  

});

const TimeSlot = mongoose.model("TimeSlot", TimeSlotSchema);
module.exports = TimeSlot;
