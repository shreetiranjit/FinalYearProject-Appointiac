const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { v4: uuidv4 } = require("uuid");

 
const TransferSchema = new Schema({
  sold_by: {
  type: String
},
  purchased_by: {
  type: String
  },
  
  transfer_id: {
    type: String,
    unique: true,
    default: uuidv4,
  },
  timeSlot_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TimeSlot",
  },
  amount: {
    type: Number,
    required: true,
  },
  transfer_datetime: {
    type: Date,
    default: Date.now,
  },
});

const Transfer = mongoose.model("Transfer", TransferSchema);
module.exports = Transfer;