import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import '../index.css';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'producer',
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", formData);

      // ✅ Save token + userId after successful login
      if (res.data.token) localStorage.setItem("token", res.data.token);
      if (res.data.user && res.data.user._id) localStorage.setItem("userId", res.data.user._id);

      // ✅ Navigate by role
      if (res.data.user.role === "producer") {
        navigate("/ProducerDashboard");
      } else if (res.data.user.role === "consumer") {
        navigate("/consumer");
      }
    } catch (err) {
      if (err.response && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Login failed");
      }
    }
  };

  return (
    <div className="box">
      <h2>Welcome Back</h2>
      <p>Login to continue</p>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '12px' }}>
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: 'none' }}
          />
        </div>
        <div style={{ marginBottom: '12px' }}>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: 'none' }}
          />
        </div>
        <div style={{ marginBottom: '12px' }}>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: 'none' }}
          >
            <option value="producer">Producer</option>
            <option value="consumer">Consumer</option>
          </select>
        </div>
        <button
          type="submit"
          style={{
            padding: '12px 24px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: '#2d8f4e',
            color: '#fff',
            fontWeight: 'bold',
            cursor: 'pointer',
          }}
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
