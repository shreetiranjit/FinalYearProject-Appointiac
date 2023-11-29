const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    minlength: 3,
    trim: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  image: {
    type: String,
    default: ""
  },
  certifications: [
    {
      type: String,
      default: ""
    },
  ],
  gender: {
    type: String,
    enum: ["male", "female", "other"],
  },
  fullname: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
  },
  skillset: {
    type: String,
    enum: [
      "web development",
      "psychiatrist",
      "blockchain developer",
    ],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastActive: {
    type: Date,
    default: Date.now,
  },
  ratings: {
    type: Number,
    min: 0,
    max: 5,
    default: 0,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  otp: {
    type: String,
  },
  otpExpires: {
    type: Date,
  },
});

const User = mongoose.model("User", UserSchema);
module.exports = User;