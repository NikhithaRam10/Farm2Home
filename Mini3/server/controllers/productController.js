const Product = require("../models/Product");

// Add product (multiple images)
const addProduct = async (req, res) => {
  try {
    const { name, pricePerKg, quantity, description } = req.body;


    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "At least one image is required" });
    }

    const imageFilenames = req.files.map(file => file.filename);

    const product = new Product({
  name,
  pricePerKg,
  quantity,
  description,
  images: imageFilenames,
  createdBy: req.user.id   // ✅ LOGGED-IN PRODUCER
});


    await product.save();
    res.status(201).json({ message: "Product added successfully", product });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all products
const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

module.exports = { addProduct, getProducts };
