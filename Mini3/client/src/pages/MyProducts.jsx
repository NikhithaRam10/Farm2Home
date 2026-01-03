import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Consumer.css"; // ✅ Reuse Consumer styles

const MyProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editQuantity, setEditQuantity] = useState("");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      if (!token) return;

      try {
        const res = await axios.get(
          "https://farmtohome-pt2e.onrender.com/api/products/my-products",
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

  const handleEditQuantity = (product) => {
    setEditingId(product._id);
    setEditQuantity(product.quantity);
  };

  const handleSaveQuantity = async (productId) => {
    if (!editQuantity || editQuantity < 0) {
      alert("Please enter a valid quantity");
      return;
    }

    try {
      const res = await axios.put(
        `https://farmtohome-pt2e.onrender.com/api/products/${productId}`,
        { quantity: parseFloat(editQuantity) },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      setProducts(products.map(p => p._id === productId ? res.data : p));
      setEditingId(null);
      setEditQuantity("");
    } catch (err) {
      console.error("Error updating quantity:", err);
      alert(err.response?.data?.message || "Failed to update quantity");
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      await axios.delete(
        `https://farmtohome-pt2e.onrender.com/api/products/${productId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      setProducts(products.filter(p => p._id !== productId));
    } catch (err) {
      console.error("Error deleting product:", err);
      alert(err.response?.data?.message || "Failed to delete product");
    }
  };

  if (loading) {
    return (
      <div className="consumer-container">
        <p className="text-center mt-10">Loading products...</p>
      </div>
    );
  }

  return (
    <div className="consumer-container p-6">
      {/* ✅ Back Button */}
      <button onClick={() => navigate("/ProducerDashboard")} className="back-btn mb-4">
        ← Back
      </button>

      <h1 className="text-2xl font-bold mb-4">My Products</h1>

      {products.length === 0 ? (
        <p className="text-center mt-10">No products added yet</p>
      ) : (
        <div className="products-grid">
          {products.map((product) => {
            const imageUrl = product.images?.[0]
              ? `https://farmtohome-pt2e.onrender.com/uploads/${product.images[0]}`
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
                
                {editingId === product._id ? (
                  <div className="product-edit-quantity">
                    <input
                      type="number"
                      value={editQuantity}
                      onChange={(e) => setEditQuantity(e.target.value)}
                      className="quantity-input"
                      step="0.1"
                      min="0"
                      placeholder="Enter quantity"
                    />
                    <div className="edit-buttons">
                      <button 
                        className="save-btn"
                        onClick={() => handleSaveQuantity(product._id)}
                      >
                        ✓ Save
                      </button>
                      <button 
                        className="cancel-btn"
                        onClick={() => setEditingId(null)}
                      >
                        ✕ Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="product-quantity">
                      Available: {product.quantity} Kg
                    </p>
                    <button
                      className="edit-qty-btn"
                      onClick={() => handleEditQuantity(product)}
                    >
                      ✏️ Edit Kg
                    </button>
                  </>
                )}
                
                <p className="product-desc">{product.description}</p>
                
                <button
                  className="delete-btn"
                  onClick={() => handleDeleteProduct(product._id)}
                >
                  🗑️ Remove Product
                </button>
              </div>
            );
          })}
        </div>
      )}

      <style>{`
        .product-edit-quantity {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin: 10px 0;
        }

        .quantity-input {
          padding: 8px;
          border: 2px solid #4CAF50;
          border-radius: 6px;
          font-size: 14px;
          width: 100%;
          box-sizing: border-box;
        }

        .quantity-input:focus {
          outline: none;
          border-color: #2e7d32;
          box-shadow: 0 0 5px rgba(46, 125, 50, 0.3);
        }

        .edit-buttons {
          display: flex;
          gap: 8px;
        }

        .save-btn, .cancel-btn {
          flex: 1;
          padding: 8px;
          border: none;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .save-btn {
          background-color: #4CAF50;
          color: white;
        }

        .save-btn:hover {
          background-color: #2e7d32;
          transform: scale(1.02);
        }

        .cancel-btn {
          background-color: #f44336;
          color: white;
        }

        .cancel-btn:hover {
          background-color: #d32f2f;
          transform: scale(1.02);
        }

        .edit-qty-btn {
          padding: 10px 18px;
          background-color: #15803d;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          margin: 8px 0;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .edit-qty-btn:hover {
          background-color: #166534;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
          transform: translateY(-2px);
        }

        .delete-btn {
          padding: 10px 18px;
          background-color: #dc2626;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .delete-btn:hover {
          background-color: #991b1b;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  );
};

export default MyProducts;
