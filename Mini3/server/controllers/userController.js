const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");


// ADD TO CART
const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    if (!productId || !quantity) return res.status(400).json({ message: "ProductId and quantity required" });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const existingItem = user.cart.find(item => item.productId.toString() === productId);
    if (existingItem) {
      existingItem.quantity += parseInt(quantity);
    } else {
      user.cart.push({ productId, quantity: parseInt(quantity) });
    }

    await user.save();
    await user.populate("cart.productId");
    res.json(user.cart);
  } catch (err) {
    console.error("Cart error:", err);
    res.status(500).json({ message: "Error adding to cart", error: err.message });
  }
};

// GET CART
const getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("cart.productId");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user.cart);
  } catch (err) {
    console.error("Get cart error:", err);
    res.status(500).json({ message: "Error fetching cart", error: err.message });
  }
};

// REMOVE FROM CART
const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId) return res.status(400).json({ message: "ProductId required" });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.cart = user.cart.filter(item => item.productId.toString() !== productId);
    await user.save();
    await user.populate("cart.productId");

    res.json(user.cart);
  } catch (err) {
    console.error("Remove cart error:", err);
    res.status(500).json({ message: "Error removing from cart", error: err.message });
  }
};

// ADD TO FAVORITES
const addToFavorites = async (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId) return res.status(400).json({ message: "ProductId required" });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.favorites.includes(productId)) {
      user.favorites.push(productId);
      await user.save();
    }

    await user.populate("favorites");
    res.json(user.favorites);
  } catch (err) {
    console.error("Favorites error:", err);
    res.status(500).json({ message: "Error adding to favorites", error: err.message });
  }
};

// REMOVE FROM FAVORITES
const removeFromFavorites = async (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId) return res.status(400).json({ message: "ProductId required" });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.favorites = user.favorites.filter(id => id.toString() !== productId);
    await user.save();
    await user.populate("favorites");

    res.json(user.favorites);
  } catch (err) {
    console.error("Remove favorite error:", err);
    res.status(500).json({ message: "Error removing favorite", error: err.message });
  }
};

// GET FAVORITES
const getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("favorites");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user.favorites);
  } catch (err) {
    console.error("Get favorites error:", err);
    res.status(500).json({ message: "Error fetching favorites", error: err.message });
  }
};

// GET PROFILE
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate("cart.productId")
      .populate("favorites");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      cart: user.cart,
      favorites: user.favorites,
    });
  } catch (err) {
    console.error("Profile error:", err);
    res.status(500).json({ message: "Error fetching profile", error: err.message });
  }
};
// BUY PRODUCT
const buyProduct = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (quantity < 0.25)
      return res.status(400).json({ message: "Minimum order is 0.25 Kg" });

    if (quantity > product.quantity)
      return res.status(400).json({ message: "Insufficient stock" });

    const producer = await User.findById(product.createdBy);
    if (!producer)
      return res.status(404).json({ message: "Producer not found" });

    const totalAmount = quantity * product.pricePerKg;

    // 1️⃣ Reduce stock
    product.quantity -= quantity;
    await product.save();

    // 2️⃣ Add earnings to producer
    producer.earnings += totalAmount;
    await producer.save();

    // 3️⃣ CREATE ORDER (THIS IS THE KEY)
    const order = new Order({
      consumer: req.user.id,
      producer: producer._id,
      product: product._id,
      quantity,
      totalAmount,
    });
    await order.save();

    res.json({
      message: "Purchase successful",
      totalAmount,
    });
  } catch (err) {
    console.error("Buy error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// 🧾 Consumer order history
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ consumer: req.user.id })
      .populate("product", "name images pricePerKg")
      .populate("producer", "fullName email")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    console.error("Get orders error:", err);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

// 🧾 Producer Sales / Orders
const getProducerOrders = async (req, res) => {
  try {
    const orders = await Order.find({ producer: req.user.id })
      .populate("product", "name pricePerKg")
      .populate("consumer", "fullName email")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    console.error("Producer orders error:", err);
    res.status(500).json({ message: "Failed to fetch sales" });
  }
};


module.exports = {
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
};

