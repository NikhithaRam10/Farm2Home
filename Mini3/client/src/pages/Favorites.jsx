import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Consumer.css";

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const loadFavorites = async () => {
    if (!token) return;
    try {
      const res = await axios.get("http://localhost:5000/api/users/favorites", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFavorites(res.data || []);
    } catch (err) {
      console.error("Error loading favorites:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    loadFavorites();
  }, [token]);

  // Add to Cart
  const handleAddToCart = async (productId) => {
    if (!token) return alert("Not logged in!");
    try {
      await axios.post(
        "http://localhost:5000/api/users/cart/add",
        { productId, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("✅ Added to cart!");
    } catch (err) {
      console.error("Cart error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Error adding to cart");
    }
  };

  // Remove from Favorites
  const handleRemoveFavorite = async (productId) => {
    if (!token) return alert("Not logged in!");
    try {
      await axios.post(
        "http://localhost:5000/api/users/favorites/remove",
        { productId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      loadFavorites();
    } catch (err) {
      console.error("Remove favorite error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Error removing from favorites");
    }
  };

  if (!favorites.length)
    return <h2 className="text-center mt-10">No favorites found</h2>;

  return (
    <div className="consumer-container p-6">
      <button onClick={() => navigate(-1)} className="back-btn">
  ← Back
</button>



      <h1 className="text-2xl font-bold mb-4">My Favorites</h1>

      <div className="products-grid">
        {favorites.map((product) => {
          const imageUrl = product.images?.[0]
            ? `http://localhost:5000/uploads/${product.images[0]}`
            : "https://via.placeholder.com/200";

          return (
            <div key={product._id} className="product-card">
              <img src={imageUrl} alt={product.name} className="product-image" />
              <h3 className="product-name">{product.name}</h3>
              <p className="product-price">₹{product.pricePerKg}/Kg</p>
              <p className="product-quantity">Available: {product.quantity} Kg</p>

              <div className="product-buttons">
                <button
                  className="add-cart-btn"
                  onClick={() => handleAddToCart(product._id)}
                >
                  🛒 Add to Cart
                </button>
                <button
                  className="fav-btn"
                  onClick={() => handleRemoveFavorite(product._id)}
                >
                  ❌ Remove
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Favorites;
