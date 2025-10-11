const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["producer", "consumer"], required: true },

  // 🛒 Cart
  cart: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: { type: Number, default: 1 },
    },
  ],

  // ❤️ Favorites
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],

  // 💰 Total earnings for producers
  earnings: { type: Number, default: 0 },
});

module.exports = mongoose.model("User", UserSchema);
