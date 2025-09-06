// src/pages/AddProduct.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const API_URL = "http://localhost:7000/api/items";

const AddProduct = () => {
  const [form, setForm] = useState({
    name: "", description: "", category: "", mrp: "", price: ""
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Initialize navigate

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price) {
      alert("❌ Name and Price are required");
      return;
    }
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const formData = new FormData();
      Object.keys(form).forEach(key => formData.append(key, form[key]));
      if (image) formData.append("image", image);

      await axios.post(API_URL, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("✅ Product added successfully!");
      navigate("/"); // Navigate to home page after success
    } catch (err) {
      console.error(err);
      alert("❌ Error adding product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <h2 className="mb-4 text-center text-white">Add New Product</h2>
          <form onSubmit={handleSubmit} className="card-dark p-4 p-md-5 rounded-3">
            <div className="mb-3">
              <label className="form-label form-label-dark">Product Name *</label>
              <input className="form-control form-control-dark" name="name" value={form.name} onChange={handleChange} required />
            </div>

            <div className="mb-3">
              <label className="form-label form-label-dark">Description</label>
              <textarea className="form-control form-control-dark" name="description" value={form.description} onChange={handleChange} rows={4} />
            </div>

            <div className="mb-3">
              <label className="form-label form-label-dark">Category</label>
              <input className="form-control form-control-dark" name="category" value={form.category} onChange={handleChange} />
            </div>

            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <label className="form-label form-label-dark">MRP (Optional)</label>
                <input className="form-control form-control-dark" name="mrp" type="number" placeholder="e.g., 999" value={form.mrp} onChange={handleChange} />
              </div>
              <div className="col-md-6">
                <label className="form-label form-label-dark">Sale Price *</label>
                <input className="form-control form-control-dark" name="price" type="number" placeholder="e.g., 799" value={form.price} onChange={handleChange} required />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label form-label-dark">Product Image</label>
              <input className="form-control form-control-dark" type="file" onChange={handleFileChange} accept="image/*" />
            </div>

            {preview && (
              <div className="mb-4 text-center">
                <img src={preview} alt="preview" className="img-fluid rounded" style={{ maxHeight: "250px", border: "1px solid #444" }} />
              </div>
            )}

            <div className="d-grid">
                <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                    {loading ? "Adding..." : "Add Product"}
                </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;