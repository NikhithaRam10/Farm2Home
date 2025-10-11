const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const Product = require("../models/Product");
const { protect } = require("../middlewares/authMiddleware"); // ✅ Import auth middleware

// ✅ Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Save files to /uploads folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique name (e.g., 1691234567890.jpg)
  },
});

const upload = multer({ storage });

// ✅ Add new product (with images)
router.post("/", protect, upload.array("images", 5), async (req, res) => {
  try {
    const { name, pricePerKg, quantity, description } = req.body;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "At least one image is required" });
    }

    const imageFilenames = req.files.map((file) => file.filename);

    const newProduct = new Product({
      name,
      pricePerKg,
      quantity,
      description,
      images: imageFilenames,
      createdBy: req.user._id, // ✅ Automatically use the logged-in producer
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error("❌ Error adding product:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ✅ Get all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().populate("createdBy", "fullName email");
    res.json(products);
  } catch (error) {
    console.error("❌ Error fetching products:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Get products added by the logged-in producer
router.get("/my-products", protect, async (req, res) => {
  try {
    const products = await Product.find({ createdBy: req.user._id });
    res.json(products);
  } catch (error) {
    console.error("❌ Error fetching producer products:", error);
    res.status(500).json({ message: "Server error" });
  }
});
// ✅ Get single product by ID
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("createdBy", "fullName email");
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    console.error("❌ Error fetching product:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
