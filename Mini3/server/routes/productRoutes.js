const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const { protect } = require("../middlewares/authMiddleware");
const { addProduct, getProducts } = require("../controllers/productController");
const Product = require("../models/Product");

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// ✅ Add product (PROTECTED)
router.post("/add-product", protect, upload.array("images", 5), addProduct);

// ✅ Get all products
router.get("/", getProducts);

// ✅ Get logged-in producer products
router.get("/my-products", protect, async (req, res) => {
  try {
    const products = await Product.find({ createdBy: req.user.id });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch producer products" });
  }
});

module.exports = router;
