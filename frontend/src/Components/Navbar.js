// src/components/Navbar.jsx
import React, { useEffect, useState, useCallback } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import API from "../Services/api";
import './Navbar.css'; // Make sure to create and import this CSS file

export default function Navbar() {
  const navigate = useNavigate();
  const [token, setToken] = useState(Boolean(localStorage.getItem("token")));
  const [cartCount, setCartCount] = useState(0);

  const loadCartCount = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        const localCart = JSON.parse(localStorage.getItem("clientCart") || "[]");
        setCartCount(localCart.reduce((s, i) => s + (i.qty || 0), 0));
        return;
      }
      const res = await API.get("/cart");
      const count = (res.data || []).reduce((s, it) => s + (it.qty || 0), 0);
      setCartCount(count);
    } catch (err) {
      console.error("Error fetching cart count:", err);
      const localCart = JSON.parse(localStorage.getItem("clientCart") || "[]");
      setCartCount(localCart.reduce((s, i) => s + (i.qty || 0), 0));
    }
  }, []);

  useEffect(() => {
    const checkToken = () => {
        setToken(Boolean(localStorage.getItem("token")));
    };

    checkToken();
    loadCartCount();

    const onStorage = (e) => {
      if (e.key === "token" || e.key === "clientCart") {
        checkToken();
        loadCartCount();
      }
    };

    window.addEventListener("storage", onStorage);
    // Custom event listener for cart updates from other components
    window.addEventListener("cartUpdated", loadCartCount);

    return () => {
        window.removeEventListener("storage", onStorage);
        window.removeEventListener("cartUpdated", loadCartCount);
    };
  }, [loadCartCount]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("clientCart"); // Also clear guest cart on logout
    setToken(false);
    setCartCount(0); // Reset cart count in UI
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark citrus-navbar px-4">
      <div className="container-fluid">

        {/* 1. Left Side: Logo */}
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <img src="https://1000logos.net/wp-content/uploads/2016/11/Chanel-logo.png" alt="Logo" className="citrus-logo-img" />
        </Link>

        {/* Hamburger Menu for Mobile */}
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* 2. Center: Navigation Links */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav mx-auto">
            <li className="nav-item">
              <NavLink className="nav-link" to="/">Home</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/shop">Shop</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/about">About</NavLink>
            </li>
            {token && (
               <li className="nav-item">
                <NavLink className="nav-link" to="/add-product">Add Product</NavLink>
              </li>
            )}
          </ul>
        </div>

        {/* 3. Right Side: Icons and Actions */}
        <div className="navbar-nav d-flex flex-row align-items-center">
            {/* Search Icon */}
            <Link className="nav-link me-3" to="/shop" aria-label="Search">
                <i className="fa-solid fa-magnifying-glass"></i>
            </Link>

            {/* Cart Icon */}
            <Link className="nav-link position-relative me-3" to="/cart" aria-label="Shopping Cart">
                <i className="fa-solid fa-cart-shopping"></i>
                {cartCount > 0 && (
                // CHANGED: Badge is now light with dark text for contrast
                <span className="badge rounded-pill bg-light text-dark position-absolute top-0 start-100 translate-middle">
                    {cartCount}
                </span>
                )}
            </Link>
            
            {/* User/Login Icon */}
            {token ? (
                 <button className="btn btn-link nav-link" onClick={handleLogout} aria-label="Logout">
                    <i className="fa-solid fa-sign-out-alt"></i>
                </button>
            ) : (
                <Link className="nav-link" to="/login" aria-label="Login">
                    <i className="fa-solid fa-user"></i>
                </Link>
            )}
        </div>
      </div>
    </nav>
  );
}