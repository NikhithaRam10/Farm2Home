import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ConsumerNavbar from "../components/ConsumerNavbar";
import "./Consumer.css";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [buyModal, setBuyModal] = useState({
    isOpen: false,
    product: null,
    quantity: "",
  });

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [favouritesCount, setFavouritesCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);

  // Load counts
  const loadCounts = async () => {
    if (!token) return;
    try {
      const favRes = await axios.get("http://localhost:5000/api/users/favorites", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFavouritesCount(favRes.data.length || 0);

      const cartRes = await axios.get("http://localhost:5000/api/users/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartCount(cartRes.data.length || 0);
    } catch (err) {
      console.error(err);
    }
  };

  // Load cart
  const loadCart = async () => {
    if (!token) return;
    try {
      const res = await axios.get("http://localhost:5000/api/users/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadCounts();
    loadCart();
  }, [token]);

  // Open modal
  const openBuyModal = (product) => {
    setBuyModal({ isOpen: true, product, quantity: "" });
  };

  const closeBuyModal = () => {
    setBuyModal({ isOpen: false, product: null, quantity: "" });
  };

  // Confirm buy
  const handleBuyConfirm = async () => {
    const { product, quantity } = buyModal;
    const qty = parseFloat(quantity);

    if (!quantity || isNaN(qty)) {
      alert("Please enter a valid quantity");
      return;
    }

    if (qty < 0.25) {
      alert("Minimum purchase quantity is 0.25 Kg");
      return;
    }

    if (qty > product.quantity) {
      alert(`Only ${product.quantity} Kg available`);
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/users/buy",
        { productId: product._id, quantity: qty },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(
        `✅ Purchase Successful!
Product: ${product.name}
Quantity: ${qty} Kg
Amount Paid: ₹${res.data.totalAmount}`
      );

      closeBuyModal();
      loadCart();
      loadCounts();
    } catch (err) {
      alert(err.response?.data?.message || "Purchase failed");
    }
  };

  const handleRemove = async (productId) => {
    await axios.post(
      "http://localhost:5000/api/users/cart/remove",
      { productId },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    loadCart();
    loadCounts();
  };

  const validCartItems = cart.filter((item) => item.productId);

  return (
    <>
      <ConsumerNavbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        favouritesCount={favouritesCount}
        cartCount={cartCount}
      />

      <div className="consumer-container">
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
                  className="product-image"
                  alt={product.name}
                />
                <h3 className="product-name">{product.name}</h3>
                <p className="product-price">₹{product.pricePerKg}/Kg</p>
                <p className="product-quantity">Qty: {item.quantity}</p>

                <div className="product-buttons">
                  <button
                    className="buy-btn"
                    onClick={() => openBuyModal(product)}
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

      {/* 🔥 Buy Modal (SAME AS CONSUMER PAGE) */}
      {buyModal.isOpen && buyModal.product && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h2>Purchase {buyModal.product.name}</h2>

            <p><b>Price:</b> ₹{buyModal.product.pricePerKg}/Kg</p>
            <p><b>Available:</b> {buyModal.product.quantity} Kg</p>

            <input
              type="number"
              step="0.25"
              min="0.25"
              max={buyModal.product.quantity}
              placeholder="Enter quantity"
              value={buyModal.quantity}
              onChange={(e) =>
                setBuyModal({ ...buyModal, quantity: e.target.value })
              }
            />

            <div className="modal-buttons">
              <button className="modal-confirm" onClick={handleBuyConfirm}>
                Confirm
              </button>
              <button className="modal-cancel" onClick={closeBuyModal}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Cart;
