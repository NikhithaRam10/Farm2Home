import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ConsumerNavbar.css";

const ConsumerNavbar = ({ searchTerm, onSearchChange, favouritesCount, cartCount, hideSearch = false }) => {
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setShowLogoutModal(false);
    navigate("/login");
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  return (
    <nav className="consumer-navbar">
      {/* Left: Project Title */}
      <div className="navbar-left">
        <h2 className="navbar-logo">🌾 Farm to Home</h2>
      </div>

      {/* Center: Search Bar */}
      {!hideSearch && (
        <div className="navbar-center">
          <input
            type="text"
            placeholder="Search products..."
            className="navbar-search"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      )}

      {/* Right: Nav Items */}
      <div className="navbar-right">
        <div className="nav-item" onClick={() => {
          onSearchChange("");
          navigate("/consumer");
        }} title="View All Products">
          <span className="nav-icon">🏠</span>
          <span className="nav-label">Home</span>
        </div>

        <div className="nav-item" onClick={() => navigate("/favorites")} title="View Favorites">
          <span className="nav-icon">❤️</span>
          <span className="nav-label">Favorites</span>
        </div>

        <div className="nav-item" onClick={() => navigate("/cart")} title="View Cart">
          <span className="nav-icon">🛒</span>
          <span className="nav-label">Cart</span>
        </div>

        <div className="nav-item" onClick={() => navigate("/my-orders")} title="View Orders">
          <span className="nav-icon">📦</span>
          <span className="nav-label">Orders</span>
        </div>

        <div className="nav-item" onClick={() => navigate("/profile")} title="View Profile">
          <span className="nav-icon">👤</span>
          <span className="nav-label">Profile</span>
        </div>

        <div className="nav-item logout-item" onClick={handleLogoutClick}>
            <span className="nav-icon">🔓</span>
          <span className="nav-label">Logout</span>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h2>Confirm Logout</h2>
            <p className="modal-message">Are you sure you want to logout?</p>
            <div className="modal-buttons">
              <button className="modal-confirm" onClick={confirmLogout}>
                ✓ Yes, Logout
              </button>
              <button className="modal-cancel" onClick={cancelLogout}>
                ✕ Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default ConsumerNavbar;
