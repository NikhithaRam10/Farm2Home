import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Consumer.css";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
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
  }, []);

  if (!profile) {
    return <p className="text-center mt-10">Loading profile...</p>;
  }

  return (
    <div className="profile-wrapper">
      {/* Back Button */}
      <button className="back-btn" onClick={() => navigate(-1)}>
        Back
      </button>

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
  );
};

export default Profile;
