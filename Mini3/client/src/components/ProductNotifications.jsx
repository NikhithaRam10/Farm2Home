import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ProductNotifications.css";

const ProductNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProductNotifications = async () => {
      if (!token) return;

      try {
        const res = await axios.get(
          "https://farmtohome-pt2e.onrender.com/api/products/my-products",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // Filter products below 3kg
        const lowQuantityProducts = res.data.filter((product) => product.quantity < 3);
        setNotifications(lowQuantityProducts);
      } catch (err) {
        console.error("Error fetching product notifications:", err);
      }
    };

    fetchProductNotifications();
    // Refresh notifications every 30 seconds
    const interval = setInterval(fetchProductNotifications, 30000);
    return () => clearInterval(interval);
  }, [token]);

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className="notification-container">
      <button
        className="notification-bell"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        🔔
        <span className="notification-badge">{notifications.length}</span>
      </button>

      {showDropdown && (
        <div className="notification-dropdown">
          <h4 className="notification-title">Low Stock Alert</h4>
          <div className="notification-list">
            {notifications.map((product) => (
              <div key={product._id} className="notification-item">
                <div className="notification-product-info">
                  <p className="notification-product-name">{product.name}</p>
                  <p className="notification-product-qty">
                    Only {product.quantity} Kg left
                  </p>
                </div>
                <span
                  className={`notification-status ${
                    product.status === "in_stock" ? "in-stock" : "out-of-stock"
                  }`}
                >
                  {product.status === "in_stock" ? "✓ In Stock" : "✗ Out"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductNotifications;
