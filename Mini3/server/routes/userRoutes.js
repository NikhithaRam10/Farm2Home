const express = require("express");
const router = express.Router();

const { protect } = require("../middlewares/authMiddleware");

const {
  addToCart,
  getCart,
  removeFromCart,
  addToFavorites,
  removeFromFavorites,
  getFavorites,
  getProfile,
  buyProduct,
  getProducerOrders,
  getMyOrders, // ✅ ADD THIS
} = require("../controllers/userController");



const Product = require("../models/Product");
const User = require("../models/User");

// 🛒 CART ROUTES
router.post("/cart/add", protect, addToCart);
router.get("/cart", protect, getCart);
router.post("/cart/remove", protect, removeFromCart);
router.post("/buy", protect, buyProduct);
router.get("/orders", protect, getMyOrders);
// 👨‍🌾 Producer sales / orders
router.get("/producer-orders", protect, getProducerOrders);



// ❤️ FAVORITES ROUTES
router.post("/favorites/add", protect, addToFavorites);
router.post("/favorites/remove", protect, removeFromFavorites);
router.get("/favorites", protect, getFavorites);

// 👤 PROFILE
router.get("/profile", protect, getProfile);

// 💸 BUY PRODUCT
router.post("/buy", protect, async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || !quantity)
      return res.status(400).json({ message: "Product ID and quantity required" });

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (quantity < 0.25)
      return res.status(400).json({ message: "Minimum order is 0.25 Kg" });

    if (quantity > product.quantity)
      return res.status(400).json({ message: "Insufficient stock available" });

    product.quantity -= quantity;
    await product.save();

    const producer = await User.findById(product.createdBy); // use createdBy instead of producerId
    if (!producer)
      return res.status(404).json({ message: "Producer not found" });

    const totalAmount = quantity * product.pricePerKg;
    producer.earnings = (producer.earnings || 0) + totalAmount;
    await producer.save();

    res.json({
      message: `Successfully bought ${quantity} Kg of ${product.name}`,
      totalAmount,
      producerEarnings: producer.earnings,
    });
  } catch (err) {
    console.error("Buy error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
