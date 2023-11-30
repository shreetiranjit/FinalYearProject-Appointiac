const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const nodemailer = require("nodemailer");
require("dotenv").config();


router.post("/register", async (req, res) => {
  try {
    const { username, email, password, fullname, skillset } = req.body;
    if(!username || !email || !password || !fullname || !skillset) {
      return res.status(400).json({ error: "Please fill in all fields" });
    }


    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const otp = Math.floor(100000 + Math.random() * 900000).toString(); 

    const otpExpires = Date.now() + 5 * 60 * 1000; // OTP expires in 5 minutes

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      fullname,
      skillset,
      otp,
      otpExpires,
      isVerified: false,
    });

    await newUser.save();

    sendOtp(email, otp);

    res.status(201).json({  success: true,message: "User registered successfully, please verify your email" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;
  
  const user = await User.findOne({ email }); 
  if (!user) {
    return res.status(400).json({ error: 'User not found' });
  }

  if (user.otp != otp) { 
    return res.status(400).json({ error: 'Invalid OTP' });
  }

  if (user.otpExpires < Date.now()) {
    return res.status(400).json({ error: 'OTP has expired' });
  }

  user.isVerified = true;
  user.otp = undefined; 
  user.otpExpires = undefined; 

  await user.save();

  return res.status(200).json({ message: 'Email verified successfully' });
});

router.post('/resend-otp', async (req, res) => {
  const { email } = req.body;
  
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({ error: 'User not found' });
  }

  user.otp = Math.floor(100000 + Math.random() * 900000).toString(); 
  user.otpExpires = Date.now() + 5 * 60 * 1000; // OTP expires in 5 minutes

  await user.save();

  sendOtp(email, user.otp);

  return res.status(200).json({ message: 'OTP resent successfully' });
});

async function sendOtp(email, otp) {
  let transporter = nodemailer.createTransport({
    host: 'smtp-relay.sendinblue.com',
    port: 587, 
    secure: false,
    auth: {
      user: process.env.USER,
      pass: process.env.STMP_KEY
    }
  });
  let mailOptions = {
    from: 'appointiac@gmail.com', 
    to: email, 
    subject: 'Email Verification OTP', 
    text:  `Your otp is ${otp}`, 
    html: `<b> Your otp is ${otp} </b>` 
  };
  
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
    }
  });
}

router.post("/loginroutes", authenticate, async (req, res) => { 
  try {
    var userFound = await User.findById(req.user._id);
    res.status(200).json({ success: true,  userFound});
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// User login route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid email" });
    }
    // Compare the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid password" });
    }
    // Create a JWT token*
    const token = jwt.sign({ user:user}, process.env.SECRET, {
      expiresIn: "1d",
    });
    // Return the token and user_id in the response
    res.status(200).json({ token:token, user:user,  message: "Login Successful"});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Middleware for protected routes
function authenticate(req, res, next) {
  const bearerToken = req.headers.authorization;

  if (!bearerToken) {
    return res.status(401).json({ error: "No token. Authorization denied" });
  }

  // Extract the token without the "Bearer " prefix
  const token = bearerToken.split(" ")[1];
 

  try {
    const decoded = jwt.verify(token, process.env.SECRET);
    req.user = decoded;
    
    req.user.id = decoded.user._id;
  
    
    next();
  } catch (error) {
    res.status(400).json({ error: "Invalid token" });
  }
}


module.exports.router = router;
module.exports.authenticate = authenticate;

