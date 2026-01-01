import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ConsumerNavbar from "../components/ConsumerNavbar";
import "./Consumer.css";

const Consumer = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [favouritesCount, setFavouritesCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [buyModal, setBuyModal] = useState({ isOpen: false, product: null, quantity: "" });
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

  // Open buy modal
  const openBuyModal = (product) => {
    if (!token) {
      alert("Please login to buy products");
      return;
    }
    setBuyModal({ isOpen: true, product, quantity: "" });
  };

  // Close buy modal
  const closeBuyModal = () => {
    setBuyModal({ isOpen: false, product: null, quantity: "" });
  };

  // Handle buy with modal input
  const handleBuyConfirm = async () => {
    const { product, quantity: quantityStr } = buyModal;
    let quantity = parseFloat(quantityStr);

    // Validation
    if (!quantityStr.trim()) {
      alert("Please enter a quantity");
      return;
    }

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

      // Reload products to reflect updated stock
      const updatedProducts = await axios.get("http://localhost:5000/api/products");
      setProducts(updatedProducts.data);

      loadCounts(); // refresh cart/fav count
      closeBuyModal(); // close modal

    } catch (err) {
      alert(err.response?.data?.message || "Purchase failed");
      console.error(err);
    }
  };

// Buy product (same logic as Cart)
const handleBuy = async (product) => {
  openBuyModal(product);
};


  return (
    <div>
      {/* Consumer Navbar with Search and Icons */}
      <ConsumerNavbar 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        favouritesCount={favouritesCount}
        cartCount={cartCount}
      />

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
                    <button
                      className="buy-btn"
                      disabled={product.quantity === 0}
                      onClick={() => handleBuy(product)}
                    >
                      {product.quantity === 0 ? "Out of Stock" : "Buy"}
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

      {/* Buy Modal */}
      {buyModal.isOpen && buyModal.product && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h2>Purchase {buyModal.product.name}</h2>
            <div className="modal-content">
              <p className="modal-detail">
                <strong>Price:</strong> ₹{buyModal.product.pricePerKg}/Kg
              </p>
              <p className="modal-detail">
                <strong>Available:</strong> {buyModal.product.quantity} Kg
              </p>
              <p className="modal-detail modal-warning">
                <strong>Minimum:</strong> 0.25 Kg
              </p>
              
              <div className="modal-input-group">
                <label htmlFor="quantity">Quantity (Kg):</label>
                <input
                  type="number"
                  id="quantity"
                  placeholder="Enter quantity"
                  value={buyModal.quantity}
                  onChange={(e) => setBuyModal({ ...buyModal, quantity: e.target.value })}
                  step="0.25"
                  min="0.25"
                  max={buyModal.product.quantity}
                />
              </div>
            </div>

            <div className="modal-buttons">
              <button className="modal-confirm" onClick={handleBuyConfirm}>
                ✓ Confirm Purchase
              </button>
              <button className="modal-cancel" onClick={closeBuyModal}>
                ✕ Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Consumer;
