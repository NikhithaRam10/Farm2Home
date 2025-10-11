import React, { useEffect, useState } from "react";
import axios from "axios";

const MyProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProducts = async () => {
      if (!token) return;

      try {
        const res = await axios.get(
          "http://localhost:5000/api/products/my-products",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setProducts(res.data);
      } catch (err) {
        console.error("Error fetching products:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl font-semibold">Loading products...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
      <h1 className="text-3xl font-bold mb-6">My Products</h1>
      {products.length === 0 ? (
        <p className="text-lg text-gray-500">No products added yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((product) => {
            const imageUrl = product.images?.[0]
              ? `http://localhost:5000/uploads/${product.images[0]}`
              : "https://via.placeholder.com/200";

            return (
              <div
                key={product._id}
                className="bg-white shadow-md rounded-lg overflow-hidden"
              >
                <img
                  src={imageUrl}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
                  <p className="text-gray-700 mb-1">₹{product.pricePerKg} / Kg</p>
                  <p className="text-gray-700 mb-2">Available: {product.quantity} Kg</p>
                  <p className="text-gray-600 text-sm">{product.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyProducts;
