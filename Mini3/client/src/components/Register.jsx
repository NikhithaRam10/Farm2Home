import React, { useState } from 'react';
import axios from 'axios'; // ✅ Import axios
import '../index.css'; // global styles

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    contact: '',
    role: 'consumer',
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validateContact = (contact) =>
    /^[0-9]{10}$/.test(contact);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { fullName, email, password, contact, role } = formData;

    if (!fullName || !email || !password || !contact) {
      alert('Please fill out all fields!');
      return;
    }

    if (!validateEmail(email)) {
      alert('Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      alert('Password should be at least 6 characters long.');
      return;
    }

    if (!validateContact(contact)) {
      alert('Contact number must be 10 digits.');
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/auth/register", {
        fullName: fullName,
        email,
        password,
        contact,
        role,
      });

      alert(response.data.message); // Show success message
      console.log("Registered:", response.data);

      // Clear form after successful registration
      setFormData({
        fullName: '',
        email: '',
        password: '',
        contact: '',
        role: 'consumer',
      });

    } catch (error) {
      console.error("Registration failed:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Registration failed!");
    }
  };

  return (
    <div className="box">
      <h2>Join Us</h2>
      <p>Select your role to get started</p>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '12px' }}>
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: 'none' }}
          />
        </div>
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
            placeholder="Password (min 6 characters)"
            value={formData.password}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: 'none' }}
          />
        </div>
        <div style={{ marginBottom: '12px' }}>
          <input
            type="text"
            name="contact"
            placeholder="Contact Number"
            value={formData.contact}
            onChange={handleChange}
            required
            maxLength="10"
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: 'none' }}
          />
        </div>
        <div style={{ marginBottom: '16px' }}>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: 'none' }}
          >
            <option value="consumer">Join as Consumer</option>
            <option value="producer">Join as Producer</option>
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
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;