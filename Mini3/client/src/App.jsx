import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import About from './components/About';
import Login from './components/Login';
import Register from './components/Register';
import Consumer from "./pages/Consumer";
import Profile from "./pages/Profile";
import MyProducts from "./pages/MyProducts";
import AddProduct from "./pages/AddProduct";
import ProducerDashboard from "./pages/ProducerDashboard";
import Favorites from './pages/Favorites';
import Cart from './pages/Cart';


import bgImage from './assets/bg.jpg';
import './index.css';

function App() {
  return (
    <div
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
      }}
    >
      <Router>
        <div className="app-container">
          <Navbar />
          <div className="content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/consumer" element={<Consumer />} />
              <Route path="/add-product" element={<AddProduct />} />
              <Route path="/ProducerDashboard" element={<ProducerDashboard />} />
              <Route path="/my-products" element={<MyProducts />} />
              <Route path="/Profile" element={<Profile />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/cart" element={<Cart />} />
            </Routes>
          </div>
        </div>
      </Router>
    </div>
  );
}

export default App;
