import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Consumer.css";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // Fetch Cart
  const loadCart = async () => {
    if (!token) return;
    try {
      const res = await axios.get("http://localhost:5000/api/users/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart(res.data || []);
    } catch (err) {
      console.error("Error loading cart:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    loadCart();
  }, [token]);

  // Buy product
  const handleBuy = async (product) => {
    let quantity = prompt(
      `Enter quantity to buy (in Kg)
Available: ${product.quantity} Kg
(Minimum 0.25 Kg)`
    );

    if (!quantity) return;

    quantity = parseFloat(quantity);

    if (isNaN(quantity)) {
      alert("Please enter a valid number.");
      return;
    }

    if (quantity < 0.25) {
      alert("Minimum purchase quantity is 0.25 Kg");
      return;
    }

    if (quantity > product.quantity) {
      alert(`Only ${product.quantity} Kg available`);
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/users/buy",
        { productId: product._id, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(
        `✅ Purchase Successful!
Product: ${product.name}
Quantity: ${quantity} Kg
Amount Paid: ₹${res.data.totalAmount}`
      );

      loadCart(); // refresh cart
    } catch (err) {
      alert(err.response?.data?.message || "Purchase failed");
      console.error(err);
    }
  };

  // Remove from cart
  const handleRemove = async (productId) => {
    try {
      await axios.post(
        "http://localhost:5000/api/users/cart/remove",
        { productId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      loadCart();
    } catch (err) {
      console.error("Remove error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Error removing item");
    }
  };

  // ✅ Filter out deleted products safely
  const validCartItems = cart.filter((item) => item.productId);

  if (!validCartItems.length) {
    return (
      <div className="consumer-container p-6">
        <button onClick={() => navigate(-1)} className="back-btn mb-4">
          ← Back
        </button>
        <h2 className="text-center mt-10">
          Your cart is empty or products are no longer available.
        </h2>
      </div>
    );
  }

  return (
    <div className="consumer-container p-6">
      <button onClick={() => navigate(-1)} className="back-btn mb-4">
        ← Back
      </button>

      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>

      <div className="products-grid">
        {validCartItems.map((item) => {
          const product = item.productId;

          return (
            <div key={product._id} className="product-card">
              <img
                src={
                  product.images?.[0]
                    ? `http://localhost:5000/uploads/${product.images[0]}`
                    : "https://via.placeholder.com/200"
                }
                alt={product.name}
                className="product-image"
              />
              <h3 className="product-name">{product.name}</h3>
              <p className="product-price">₹{product.pricePerKg}/Kg</p>
              <p className="product-quantity">Qty: {item.quantity}</p>

              <div className="product-buttons">
                <button
                  className="buy-btn"
                  onClick={() => handleBuy(product)}
                >
                  Buy
                </button>
                <button
                  className="remove-btn"
                  onClick={() => handleRemove(product._id)}
                >
                  Remove
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Cart;
