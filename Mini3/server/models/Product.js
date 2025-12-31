const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  pricePerKg: { type: Number, required: true },
  quantity: { type: Number, required: true },
  description: { type: String, required: true },
  images: { type: [String], required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  status: {
    type: String,
    default: "in_stock"
  }
});

module.exports = mongoose.model("Product", productSchema);
