const express = require("express");
const adminRoutes = express.Router();
const Admin = require("../models/admin");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const TimeSlot = require("../models/timeslot");

function authenticateAdmin(req, res, next) {
  const bearerToken = req.headers.authorization;
  if (!bearerToken) {
    return res.status(401).json({ error: "No token. Authorization denied" });
  }

  // Extract the token without the "Bearer " prefix
  const token = bearerToken.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.ADMINSECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ error: "Invalid token" });
  }
}

adminRoutes.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await Admin.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Admin already exists." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newAdmin = new Admin({
      email: email,
      password: hashedPassword,
    });

    const savedAdmin = await newAdmin.save();

    res
      .status(201)
      .json({ message: "Admin registered successfully", user: savedAdmin });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

adminRoutes.post("/login", async (req, res) => {
  try {
    const { email } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ error: "Invalid email" });
    }

    const isMatch = await bcrypt.compare(req.body.password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid password" });
    }
    const token = jwt.sign(
      {
        id: admin._id,
        email: admin.email,
      },
      process.env.ADMINSECRET,
      { expiresIn: "5h" }
    );

    console.log(token);

    res.status(200).json({ token, user: admin });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

adminRoutes.post("/loginWithToken", async (req, res) => {
  const bearerToken = req.headers.authorization;

  if (!bearerToken) {
    return res.status(401).json({ error: "No token. Authorization denied" });
  }

  const token = bearerToken.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.ADMINSECRET);
    req.user = decoded;
    res.status(200).json(decoded);
  } catch (error) {
    res.status(400).json({ error: "Invalid token" });
  }
});

// Fetch all users
adminRoutes.get("/users", authenticateAdmin, async (req, res) => {
  const users = await User.find({});
  return res.status(200).json(users);
});

// Fetch all the appointments
adminRoutes.get("/timeslots", authenticateAdmin, async (req, res) => {
  const timeslots = await TimeSlot.find({});
  return res.status(200).json(timeslots);
});

module.exports =  adminRoutes;