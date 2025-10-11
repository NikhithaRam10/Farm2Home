import React from 'react';

const ProductCard = ({ product }) => {
  return (
    <div className="bg-white shadow-md rounded-md p-4 m-4 w-full max-w-sm">
      <h2 className="text-lg font-semibold mb-2">{product.name}</h2>
      <p className="text-sm text-gray-600">Category: {product.category}</p>
      <p className="text-sm text-gray-600">Price: ₹{product.price}</p>
      <p className="text-sm text-gray-600">Description: {product.description}</p>
    </div>
  );
};

export default ProductCard;
