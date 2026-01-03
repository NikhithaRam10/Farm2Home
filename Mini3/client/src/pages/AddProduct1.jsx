import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AddProduct() {
const [formData, setFormData] = useState({
  name: "",
  pricePerKg: "",
  quantity: "", // changed from availableQuantityKg
  description: "",
  image: null,
});


  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };


 const handleSubmit = async (e) => {
  e.preventDefault();

  const form = new FormData();
  form.append('name', formData.name);
  form.append('description', formData.description);
  form.append('pricePerKg', formData.pricePerKg);
  form.append('quantity', formData.quantity);
  form.append('image', formData.image); // file

  try {
    const res = await axios.post('https://farmtohome-pt2e.onrender.com/api/products', form);
    console.log('Product added:', res.data);
    setError(""); // clear error
    navigate("/dashboard");
  } catch (err) {
    console.error('Upload error:', err);
    setError('Failed to add product');
  }
};



  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-md w-full max-w-md"
        encType="multipart/form-data"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Add New Product</h2>

        <label className="block mb-2 font-semibold">Product Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full mb-4 px-4 py-2 border rounded"
        />

        <label className="block mb-2 font-semibold">Price (₹ per kg)</label>
        <input
          type="number"
          name="pricePerKg"
          value={formData.pricePerKg}
          onChange={handleChange}
          required
          className="w-full mb-4 px-4 py-2 border rounded"
        />

        <label className="block mb-2 font-semibold">Available Quantity (kg)</label>
        <input
          type="number"
          name="quantity"
          value={formData.quantity}
          onChange={handleChange}
          required
          className="w-full mb-4 px-4 py-2 border rounded"
        />

        <label className="block mb-2 font-semibold">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          className="w-full mb-4 px-4 py-2 border rounded"
        ></textarea>

        <label className="block mb-2 font-semibold">Upload Image</label>
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
          required
          className="w-full mb-6"
        />

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Add Product
        </button>
      </form>
    </div>
  );
}
