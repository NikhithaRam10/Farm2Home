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
    const products = await Product.find({ createdBy: req.user._id });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch producer products" });
  }
});

// ✅ Update product (quantity)
router.put("/:id", protect, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if user is the creator
    const productCreatorId = product.createdBy.toString();
    const currentUserId = req.user.id.toString();
    
    if (productCreatorId !== currentUserId) {
      return res.status(403).json({ message: "Not authorized to update this product" });
    }

    // Update only allowed fields
    if (req.body.quantity !== undefined) product.quantity = req.body.quantity;
    if (req.body.status !== undefined) product.status = req.body.status;

    await product.save();
    res.json(product);
  } catch (err) {
    console.error("Update product error:", err);
    res.status(500).json({ message: err.message || "Failed to update product" });
  }
});

// ✅ Delete product
router.delete("/:id", protect, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if user is the creator
    const productCreatorId = product.createdBy.toString();
    const currentUserId = req.user.id.toString();
    
    if (productCreatorId !== currentUserId) {
      return res.status(403).json({ message: "Not authorized to delete this product" });
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error("Delete product error:", err);
    res.status(500).json({ message: err.message || "Failed to delete product" });
  }
});

module.exports = router;
