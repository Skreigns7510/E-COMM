import React, { useEffect, useState, useCallback } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import API from "../Services/api";
import './Navbar.css';
import logo from './logo.png'
export default function Navbar() {
  const navigate = useNavigate();
  const [token, setToken] = useState(Boolean(localStorage.getItem("token")));
  const [cartCount, setCartCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

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
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${searchQuery.trim()}`);
    }
  };
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
    <nav className="navbar navbar-expand-lg navbar-light bg-light citrus-navbar px-4">
      <div className="container-fluid">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <img src={logo} alt="Logo" className="citrus-logo-img" />
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav mx-auto">
            <li className="nav-item">
              <NavLink className="nav-link" to="/">Home</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/shop">Shop</NavLink>
            </li>
            <li className="nav-item dropdown">
              <button
                className="nav-link dropdown-toggle"
                id="navbarDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                style={{ background: 'none', border: 'none' }}
              >
                Categories
              </button>
              <ul className="dropdown-menu dropdown-menu-light" aria-labelledby="navbarDropdown">
                <li><Link className="dropdown-item" to="/shop?category=Electronics">Electronics</Link></li>
                <li><Link className="dropdown-item" to="/shop?category=Apparel">Apparel</Link></li>
                <li><Link className="dropdown-item" to="/shop?category=Home Goods">Home Goods</Link></li>
              </ul>
            </li>
            {token && (
              <li className="nav-item">
                <NavLink className="nav-link" to="/add-product">Add Product</NavLink>
              </li>
            )}
          </ul>
        </div>
        <div className="navbar-nav d-flex flex-row align-items-center">
          <form className="d-flex me-3" onSubmit={handleSearchSubmit}>
            <input
              className="form-control form-control-sm form-control-light"
              type="search"
              placeholder="Search"
              aria-label="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
          <Link className="nav-link position-relative me-3" to="/cart" aria-label="Shopping Cart">
            <i className="fa-solid fa-cart-shopping" style={{color:'black'}}></i>
            {cartCount > 0 && (
              <span className="badge rounded-pill bg-light text-dark position-absolute top-0 start-100 translate-middle">
                {cartCount}
              </span>
            )}
          </Link>
          {token ? (
            <button className="btn btn-link nav-link" onClick={handleLogout} aria-label="Logout">
              <i className="fa-solid fa-sign-out-alt"style={{color:'black'}}></i>
            </button>
          ) : (
            <Link className="nav-link" to="/login" aria-label="Login">
              <i className="fa-solid fa-user"style={{color:'black'}}></i>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}