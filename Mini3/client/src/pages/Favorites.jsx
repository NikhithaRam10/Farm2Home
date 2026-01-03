import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ConsumerNavbar from "../components/ConsumerNavbar";
import "./Consumer.css";

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [favouritesCount, setFavouritesCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);

  // Load counts
  const loadCounts = async () => {
    if (!token) return;
    try {
      const favRes = await axios.get("https://farmtohome-pt2e.onrender.com/api/users/favorites", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFavouritesCount(favRes.data.length || 0);

      const cartRes = await axios.get("https://farmtohome-pt2e.onrender.com/api/users/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartCount(cartRes.data.length || 0);
    } catch (err) {
      console.error("Error loading counts:", err);
    }
  };

  useEffect(() => {
    loadCounts();
  }, [token]);

  const loadFavorites = async () => {
    if (!token) return;
    try {
      const res = await axios.get("https://farmtohome-pt2e.onrender.com/api/users/favorites", {
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
        "https://farmtohome-pt2e.onrender.com/api/users/cart/add",
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
        "https://farmtohome-pt2e.onrender.com/api/users/favorites/remove",
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
    return (
      <>
        <ConsumerNavbar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          favouritesCount={favouritesCount}
          cartCount={cartCount}
        />
        <div className="consumer-container p-6">
          <h2 className="text-center mt-10">No favorites found</h2>
        </div>
      </>
    );

  // ✅ Filter favorites by search term
  const filteredFavorites = favorites.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          {filteredFavorites.length > 0 ? (
            filteredFavorites.map((product) => {
            const imageUrl = product.images?.[0]
              ? `https://farmtohome-pt2e.onrender.com/uploads/${product.images[0]}`
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
          })
          ) : (
            <p className="no-results">No products found</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Favorites;
