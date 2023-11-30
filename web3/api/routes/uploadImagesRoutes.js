const express = require("express");
const router = express.Router();
const upload = require("../middlewares/multerconfig");

// Handle POST requests to /api/images with the Multer middleware
router.post("/", upload.single("image"), (req, res) => {
  
  res.status(200).json({ message: "Image uploaded successfully", filePath: req.file.path });
});

// Export the router
module.exports = router;
