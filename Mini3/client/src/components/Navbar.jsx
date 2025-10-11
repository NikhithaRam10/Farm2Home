import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const location = useLocation();

  // Hide navbar on /consumer
  if (location.pathname === "/consumer") {
    return null;
  }
  if(location.pathname === "/add-product"){
    return null;
  }
  if(location.pathname === "/ProducerDashboard"){
    return null;
  }
  if(location.pathname=== "/favorites"){
    return null;
  }
  if(location.pathname === "/cart"){
    return null;
  }
  if(location.pathname ==="/profile"){
    return null;
  }
   if(location.pathname ==="/Profile"){
    return null;
  }

  return (
    <nav className="navbar">
      <h2 className="logo">Farm to Home</h2>
      <div className="links">
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/register">Register</Link>
        <Link to="/login">Login</Link>
      </div>
    </nav>
  );
}
