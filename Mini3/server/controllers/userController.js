const User = require("../models/User");

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

module.exports = {
  addToCart,
  getCart,
  removeFromCart,
  addToFavorites,
  removeFromFavorites,
  getFavorites,
  getProfile
};
