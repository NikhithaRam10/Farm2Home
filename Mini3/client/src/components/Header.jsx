import React from "react";

const Header = ({ title }) => {
  return (
    <header className="bg-green-700 text-white py-4 px-6 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">{title || "FARM 2 HOME Dashboard"}</h1>
        <div>
          <button
            onClick={() => window.location.href = "/"}
            className="bg-white text-green-700 px-4 py-2 rounded hover:bg-gray-200"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
