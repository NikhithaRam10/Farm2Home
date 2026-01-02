import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Consumer.css";

const ProducerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [earnings, setEarnings] = useState(0);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/users/producer-orders",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setOrders(res.data);

        const total = res.data.reduce(
          (sum, order) => sum + order.totalAmount,
          0
        );
        setEarnings(total);
      } catch (err) {
        console.error("Error fetching producer orders:", err);
      }
    };

    fetchOrders();
  }, [token]);

  return (
    <div className="consumer-container">
      {/* 🔙 Back Button */}
      <button className="back-btn mb-4" onClick={() => navigate(-1)}>
        ← Back
      </button>

      {orders.length === 0 ? (
        <p className="text-center mt-10">No sales yet.</p>
      ) : (
        <>
          {/* 💰 Earnings Banner */}
          <div className="earnings-banner">
            <h2 className="earnings-title">Total Earnings</h2>
            <p className="earnings-amount">₹{earnings}</p>
          </div>

          {/* 📦 Orders Grid */}
          <div className="products-grid">
            {orders.map((order) => (
              <div key={order._id} className="product-card order-card">
                <h3 className="product-name">{order.product?.name || "(product removed)"}</h3>

                <p className="product-quantity">
                  Quantity Sold: {order.quantity ?? "-"} Kg
                </p>

                <p className="product-price">
                  Amount Earned: ₹{order.totalAmount ?? "-"}
                </p>

                <p className="text-sm text-gray-600">
                  Buyer: {order.consumer?.fullName || "(unknown)"}
                </p>

                <p className="text-sm text-gray-500">
                  {new Date(order.createdAt || Date.now()).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ProducerOrders;
