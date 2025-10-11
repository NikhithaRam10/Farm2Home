import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ProducerDashboard.css';

export default function ProducerDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="producer-dashboard">
      <div className="dashboard-header">
        <h1>Producer Dashboard</h1>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>

      <div className="dashboard-buttons">
        <button onClick={() => navigate('/add-product')}>Add Product</button>
        <button onClick={() => navigate('/Profile')}>Profile</button>
        <button onClick={() => navigate('/my-products')}>See Added Products</button>
      </div>
    </div>
  );
}
