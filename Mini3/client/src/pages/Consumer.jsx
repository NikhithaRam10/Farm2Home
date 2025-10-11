import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Consumer.css";

const Consumer = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [favouritesCount, setFavouritesCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  // Load products
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/products")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error(err));
  }, []);

  // Load favorites & cart count
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
      console.error("Error loading counts:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    loadCounts();
  }, [token]);

  // Add to favorites
  const handleAddFavourite = async (productId) => {
    if (!token) {
      alert("Please login to add favorites");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/api/users/favorites/add",
        { productId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Added to favorites!");
      loadCounts(); // Refresh counts
    } catch (err) {
      console.error("Error adding to favorites:", err.response?.data || err.message);
      alert("Error adding to favorites");
    }
  };

  // Add to cart
  const handleAddToCart = async (productId) => {
    if (!token) {
      alert("Please login to add to cart");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/api/users/cart/add",
        { productId, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Added to cart");
      loadCounts();
    } catch (err) {
      console.error("Error adding to cart:", err.response?.data || err.message);
      alert("Error adding to cart");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {/* TOP NAVBAR */}
      <div className="top-navbar">
        <div className="nav-item" onClick={() => navigate("/favorites")}>
          ❤️ Favourites ({favouritesCount})
        </div>
        <div className="nav-item" onClick={() => navigate("/cart")}>
          🛒 Cart ({cartCount})
        </div>
        <div className="nav-item" onClick={() => navigate("/profile")}>
          👤 Profile
        </div>

        <input
          type="text"
          placeholder="Search for vegetables..."
          className="search-bar"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* PRODUCTS GRID */}
      <div className="consumer-container">
        <div className="products-grid">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => {
              const imageUrl = product.images?.[0]
                ? `http://localhost:5000/uploads/${product.images[0]}`
                : "https://via.placeholder.com/200";

              return (
                <div key={product._id} className="product-card">
                  <img src={imageUrl} alt={product.name} className="product-image" />
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-price">{product.pricePerKg} ₹/Kg</p>
                  <p className="product-quantity">Available: {product.quantity} Kg</p>
                  <div className="product-buttons">
                    <button
                      className="fav-btn"
                      onClick={() => handleAddFavourite(product._id)}
                    >
                      ❤️ Favourite
                    </button>
                    <button
                      className="add-cart-btn"
                      onClick={() => handleAddToCart(product._id)}
                    >
                      🛒 Add to Cart
                    </button>
                    <button className="buy-btn">Buy</button>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="no-results">No products found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Consumer;
