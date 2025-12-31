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

        // Calculate earnings
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
    <div className="consumer-container p-6">
      <button className="back-btn mb-4" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <h1 className="text-2xl font-bold mb-2">My Sales</h1>
      <h2 className="text-xl font-semibold mb-4">
        Total Earnings: ₹{earnings}
      </h2>

      {orders.length === 0 ? (
        <p>No sales yet.</p>
      ) : (
        <div className="products-grid">
          {orders.map((order) => (
            <div key={order._id} className="product-card">
              <h3 className="product-name">{order.product.name}</h3>
              <p>Quantity Sold: {order.quantity} Kg</p>
              <p>Amount Earned: ₹{order.totalAmount}</p>
              <p className="text-sm text-gray-500">
                Buyer: {order.consumer.fullName}
              </p>
              <p className="text-sm text-gray-500">
                {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProducerOrders;
