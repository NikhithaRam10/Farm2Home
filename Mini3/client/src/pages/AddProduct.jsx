import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function AddProduct() {
  const [form, setForm] = useState({
    name: '',
    description: '',
    pricePerKg: '',
    quantity: ''
  });
  const [images, setImages] = useState([]);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImages([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value);
    });
    images.forEach((img) => {
      formData.append('images', img);
    });

    try {
      await axios.post('http://localhost:5000/api/products/add-product', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMessage('✅ Product added successfully!');
      setForm({ name: '', description: '', pricePerKg: '', quantity: '' });
      setImages([]);
      setTimeout(() => navigate('/ProducerDashboard'), 1500);
    } catch (err) {
      setMessage('❌ Failed to add product');
      console.error('Upload error:', err);
    }
  };

  return (
    <>
      <style>{`
        body {
          margin: 0;
          font-family: Arial, sans-serif;
        }
        .back-btn {
          position: fixed;
          top: 16px;
          left: 16px;
          background: #f97316;
          color: white;
          border: none;
          padding: 8px 12px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.9rem;
          box-shadow: 0 2px 6px rgba(0,0,0,0.15);
        }
        .back-btn:hover {
          background: #ea580c;
        }
        form {
          background-color: white;
          padding: 24px;
          border-radius: 12px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
          width: 100%;
          max-width: 500px;
        }
        input, textarea {
          width: 100%;
          padding: 10px;
          margin-bottom: 16px;
          border: 1px solid #ccc;
          border-radius: 6px;
        }
        button[type="submit"] {
          width: 100%;
          background-color: #16a34a;
          color: white;
          padding: 10px;
          border: none;
          border-radius: 6px;
          font-size: 1rem;
          cursor: pointer;
        }
        button[type="submit"]:hover {
          background-color: #15803d;
        }
        .message {
          margin-top: 16px;
          text-align: center;
        }
      `}</style>

      <button className="back-btn" onClick={() => navigate('/ProducerDashboard')}>
        ⬅ Back
      </button>

      <div className="min-h-screen bg-gray-100 flex justify-center items-center">
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <h2>Add New Product</h2>

          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="pricePerKg"
            placeholder="Price per Kg (₹)"
            value={form.pricePerKg}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="quantity"
            placeholder="Quantity Available (Kg)"
            value={form.quantity}
            onChange={handleChange}
            required
          />
          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            required
          ></textarea>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            required
          />

          <button type="submit">Add Product</button>

          {message && <div className="message">{message}</div>}
        </form>
      </div>
    </>
  );
}
