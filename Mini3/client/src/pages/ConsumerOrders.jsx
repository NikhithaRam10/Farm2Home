import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Consumer.css";

const ConsumerOrders = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/users/orders",
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
  }, [token]);

  return (
    <div className="consumer-container p-6">
      {/* ✅ Same Back Button as other pages */}
      <button className="back-btn mb-4" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <h1 className="text-2xl font-bold mb-4">My Orders</h1>

      {orders.length === 0 ? (
        <p className="text-center mt-10">No orders yet.</p>
      ) : (
        <div className="products-grid">
          {orders.map((order) => {
            const imageUrl = order.product?.images?.[0]
              ? `http://localhost:5000/uploads/${order.product.images[0]}`
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
  );
};

export default ConsumerOrders;
