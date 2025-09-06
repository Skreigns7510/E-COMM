// src/pages/Signup.jsx
import React, { useState } from "react";
import API from "../Services/api";
import { useNavigate, Link } from "react-router-dom"; // Import Link

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post("/auth/signup", { name, email, password });
      localStorage.setItem("token", res.data.token);
      // Fire event to update navbar immediately
      window.dispatchEvent(new Event("storage")); 
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center" style={{ minHeight: "80vh" }}>
      <div className="col-lg-4 col-md-6 col-sm-8">
        <div className="card-dark p-4 p-md-5 rounded-3">
            <h2 className="text-center mb-4 text-white">Create Account</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label form-label-dark">Name</label>
                    <input
                        className="form-control form-control-dark"
                        placeholder="Enter your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label form-label-dark">Email address</label>
                    <input
                        type="email"
                        className="form-control form-control-dark"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label form-label-dark">Password</label>
                    <input
                        type="password"
                        className="form-control form-control-dark"
                        placeholder="Create a password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="d-grid mt-4">
                    <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                       {loading ? "Signing up..." : "Sign Up"}
                    </button>
                </div>
            </form>
            <div className="text-center mt-4 text-muted">
                Already have an account? <Link to="/login">Log In</Link>
            </div>
        </div>
      </div>
    </div>
  );
}