import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ConsumerNavbar from "../components/ConsumerNavbar";
import "./Consumer.css";

const ConsumerOrders = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
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
    const fetchOrders = async () => {
      try {
        const res = await axios.get(
          "https://farmtohome-pt2e.onrender.com/api/users/orders",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setOrders(res.data);
      } catch (err) {
        console.error("Error fetching orders:", err);
      }
    };

    fetchOrders();
    loadCounts();
  }, [token]);

  // ✅ Filter orders by product name
  const filteredOrders = orders.filter((order) =>
    order.product?.name.toLowerCase().includes(searchTerm.toLowerCase())
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
      <button className="back-btn mb-4" onClick={() => navigate(-1)}>
        ← Back
      </button>

      {filteredOrders.length === 0 ? (
        <p className="text-center mt-10">No products found.</p>
      ) : (
        <div className="products-grid">
          {filteredOrders.map((order) => {
            const imageUrl = order.product?.images?.[0]
              ? `https://farmtohome-pt2e.onrender.com/uploads/${order.product.images[0]}`
              : "https://via.placeholder.com/200";

            return (
              <div key={order._id} className="product-card">
                <img
                  src={imageUrl}
                  alt={order.product?.name}
                  className="product-image"
                />
                <h3 className="product-name">{order.product?.name}</h3>
                <p className="product-quantity">
                  Quantity: {order.quantity} Kg
                </p>
                <p className="product-price">
                  Total Paid: ₹{order.totalAmount}
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
    </>
  );
};

export default ConsumerOrders;
