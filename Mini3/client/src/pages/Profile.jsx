import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Consumer.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      axios
        .get("http://localhost:5000/api/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setUser(res.data))
        .catch((err) => console.error("Error fetching profile:", err));
    }
  }, [token]);

  if (!user) return <p className="text-center mt-10">Loading profile...</p>;

  return (
    <div className="profile-container">
      {/* 🔙 Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="back-btn absolute top-4 left-4 bg-green-700 text-white px-3 py-1 rounded-lg shadow hover:bg-green-800 transition"
      >
        ← Back
      </button>

      <div className="profile-card mx-auto mt-16 p-6 bg-white rounded-xl shadow-lg w-[90%] md:w-[50%]">
        <h2 className="text-2xl font-bold mb-4 text-center text-green-700">
          Profile Details
        </h2>

        <p className="text-lg">
          <strong>Name:</strong> {user.fullName}
        </p>
        <p className="text-lg mt-2">
          <strong>Email:</strong> {user.email}
        </p>
        <p className="text-lg mt-2">
          <strong>Role:</strong>{" "}
          <span className="capitalize">{user.role}</span>
        </p>

        {/* 👇 Total Earnings (only for producers) */}
        {user.role === "producer" && (
          <p className="text-lg mt-2 text-green-800 font-semibold">
            <strong>Total Earnings:</strong> ₹{user.earnings || 0}
          </p>
        )}

        {/* Consumer or producer info */}
        {user.role === "consumer" ? (
          <p className="mt-4 text-gray-600 italic">
            You can explore and purchase farm products directly from producers.
          </p>
        ) : (
          <p className="mt-4 text-gray-600 italic">
            You can upload products and track your total earnings here.
          </p>
        )}
      </div>
    </div>
  );
};

export default Profile;
