import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Consumer.css"; // ✅ Reuse Consumer styles

const MyProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      if (!token) return;

      try {
        const res = await axios.get(
          "http://localhost:5000/api/products/my-products",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setProducts(res.data);
      } catch (err) {
        console.error(
          "Error fetching products:",
          err.response?.data || err.message
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [token]);

  if (loading) {
    return (
      <div className="consumer-container">
        <p className="text-center mt-10">Loading products...</p>
      </div>
    );
  }
    <button className="back-btn" onClick={() => navigate("/ProducerDashboard")}>
        ⬅ Back
      </button>
  return (
    <div className="consumer-container p-6">
      {/* ✅ Back Button */}
      <button onClick={() => navigate(-1)} className="back-btn mb-4">
        ← Back
      </button>

      <h1 className="text-2xl font-bold mb-4">My Products</h1>

      {products.length === 0 ? (
        <p className="text-center mt-10">No products added yet</p>
      ) : (
        <div className="products-grid">
          {products.map((product) => {
            const imageUrl = product.images?.[0]
              ? `http://localhost:5000/uploads/${product.images[0]}`
              : "https://via.placeholder.com/200";

            return (
              <div key={product._id} className="product-card">
                <img
                  src={imageUrl}
                  alt={product.name}
                  className="product-image"
                />

                <h3 className="product-name">{product.name}</h3>
                <p className="product-price">₹{product.pricePerKg} / Kg</p>
                <p className="product-quantity">
                  Available: {product.quantity} Kg
                </p>
                <p className="product-desc">{product.description}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyProducts;
