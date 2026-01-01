import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ConsumerNavbar from "../components/ConsumerNavbar";
import "./Consumer.css";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [favouritesCount, setFavouritesCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const token = localStorage.getItem("token");

  // Load counts
  const loadCounts = async () => {
    if (!token) return;
    try {
      const favRes = await axios.get("http://localhost:5000/api/users/favorites", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFavouritesCount(favRes.data.length || 0);

      const cartRes = await axios.get("http://localhost:5000/api/users/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartCount(cartRes.data.length || 0);
    } catch (err) {
      console.error("Error loading counts:", err);
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/users/profile",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setProfile(res.data);
      } catch (err) {
        console.error("Profile fetch error:", err);
      }
    };

    fetchProfile();
    loadCounts();
  }, []);

  if (!profile) {
    return (
      <>
        {profile?.role === "consumer" && (
          <ConsumerNavbar 
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            favouritesCount={favouritesCount}
            cartCount={cartCount}
          />
        )}
        <p className="text-center mt-10">Loading profile...</p>
      </>
    );
  }

  return (
    <>
      {profile.role === "consumer" && (
        <ConsumerNavbar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          favouritesCount={favouritesCount}
          cartCount={cartCount}
          hideSearch={true}
        />
      )}
      {profile.role === "producer" && (
        <button className="back-btn" onClick={() => navigate("/ProducerDashboard")}>
          ⬅ Back
        </button>
      )}
      <div className={`profile-wrapper ${profile.role === "consumer" ? "with-navbar" : ""}`}>
        {/* Profile Card */}
        <div className="profile-card">
          <div className="profile-avatar">
            {profile.fullName.charAt(0).toUpperCase()}
          </div>

          <h2 className="profile-name">{profile.fullName}</h2>

          <p className="profile-email">📧 {profile.email}</p>

          <span
            className={`role-badge ${
              profile.role === "producer" ? "producer" : "consumer"
            }`}
          >
            {profile.role.toUpperCase()}
          </span>

          <p className="profile-desc">
            {profile.role === "consumer"
              ? "You can explore and purchase fresh farm products directly from producers."
              : "You can add products, track orders, and manage your farm sales."}
          </p>
        </div>
      </div>
    </>
  );
};

export default Profile;
