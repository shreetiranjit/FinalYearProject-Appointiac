const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require('cors');
require("dotenv").config();

const app = express();
const MongoDVURI = process.env.NODE_ENV === "test" ? process.env.WEB3_DB_URI : process.env.WEB3_DB_URI;

mongoose
  .connect(MongoDVURI , {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log(`MongoDB connected to : ${MongoDVURI} `))
  .catch((error) => console.error("MongoDB connection error:", error));

const appidRoutes = require("./routes/appid");
const userProfileRoutes = require("./routes/userProfile");
const timeslotRoutes = require('./routes/timeSlotManagement');
const ratingsRoutes = require('./routes/ratingsAndReviews');

// Connect to MongoDB

// Middleware
const morgan = require("morgan");
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cors());

// Route handlers
app.use("/api/appid", appidRoutes);
app.use('/api/profile', userProfileRoutes);
app.use('/api/timeslot', timeslotRoutes);
app.use('/api/ratings', ratingsRoutes);
app.use("/api/public", express.static("public"));

module.exports = app;