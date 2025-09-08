import React, { useState } from "react";
import API from "../Services/api.js";
import { Link, useNavigate } from "react-router-dom";
import './css/Login.css'; // We'll create a new, modern CSS file
import logo from './css/Daco_367500.png';
import { toast } from 'react-hot-toast'; // We'll use this for error feedback too

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Function to merge guest cart with user's database cart
  const mergeLocalCartWithDB = async () => {
    const localCart = JSON.parse(localStorage.getItem("clientCart") || "[]");
    if (localCart.length > 0) {
      try {
        await API.post("/cart/merge", { localCart });
        localStorage.removeItem("clientCart"); // Clear local cart after successful merge
      } catch (error) {
        console.error("Failed to merge carts:", error);
        toast.error("Could not sync your previous cart items.");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Basic frontend validation
    if (!email || !password) {
      toast.error("Please enter both email and password.");
      setLoading(false);
      return;
    }

    try {
      const res = await API.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      
      await mergeLocalCartWithDB();
      
      setLoading(false);
      toast.success("Welcome back!");
      window.dispatchEvent(new Event("cartUpdated")); // Notify navbar to update count
      navigate("/");
    } catch (err) {
      // Use toast for a less intrusive error message
      toast.error(err.response?.data?.error || 'Login Failed. Please check your credentials.');
      setLoading(false);
    }
  };

  return (
    <div className="login-page-container">
      <div className="login-form-wrapper">
        <div className="login-header">
          <img src={logo} className="login-logo" alt="BEAST MOTORS logo" />
          <h2 className="login-title">Sign in to your account</h2>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              className="form-control-custom"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              className="form-control-custom"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <div className="form-options">
            <div className="form-check">
              <input className="form-check-input" type="checkbox" id="rememberMe" />
              <label className="form-check-label" htmlFor="rememberMe">
                Remember me
              </label>
            </div>
            <Link to="/forgot-password" className="forgot-password-link">Forgot password?</Link>
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? (
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="redirect-link">
          <p>Not a member? <Link to="/signup">Register Now</Link></p>
        </div>
      </div>
    </div>
  );
}