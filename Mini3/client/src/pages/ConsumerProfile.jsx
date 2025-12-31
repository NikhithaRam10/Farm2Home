import React, { useEffect, useState } from "react";
import axios from "axios";

const ConsumerProfile = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token"); // assuming you save JWT
        const { data } = await axios.get(
  "http://localhost:5000/api/users/profile",
  {
    headers: { Authorization: `Bearer ${token}` },
  }
);

        setProfile(data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    fetchProfile();
  }, []);

  if (!profile) return <p>Loading...</p>;

  return (
    <div className="flex justify-center items-center min-h-screen bg-green-50">
      <div className="bg-white p-6 rounded-xl shadow-md w-96">
        <h1 className="text-2xl font-bold mb-4">Consumer Profile</h1>
       <p><strong>Name:</strong> {profile.fullName}</p>
        <p><strong>Email:</strong> {profile.email}</p>
        <p><strong>Role:</strong> {profile.role}</p>
      </div>
    </div>
  );
};

export default ConsumerProfile;
