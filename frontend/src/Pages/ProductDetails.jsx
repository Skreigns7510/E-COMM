// src/Pages/ProductDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import API from '../Services/api';
import { toast } from 'react-hot-toast';

export default function ProductDetails() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await API.get(`/items/${id}`);
        setItem(res.data);
      } catch (error) {
        console.error("Failed to fetch product details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id]);
  
  const addToCart = async (itemId) => {
    try {
      const token = localStorage.getItem("token");
      let qty = 1;

      if (!token) {
        const localCart = JSON.parse(localStorage.getItem("clientCart") || "[]");
        const existingItem = localCart.find(i => i.itemId === itemId);
        if (existingItem) {
          existingItem.qty += 1;
        } else {
          localCart.push({ itemId, qty });
        }
        localStorage.setItem("clientCart", JSON.stringify(localCart));
      } else {
        await API.post("/cart", { itemId, qty });
      }

      toast.success("Added to cart!");
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (err) {
      console.error(err);
      toast.error("Could not add to cart.");
    }
  };

  if (loading) return <div className="text-center text-white">Loading Product...</div>;
  if (!item) return <div className="text-center text-white">Product not found.</div>;

  return (
    <div className="row">
      <div className="col-md-6">
        <img 
          src={item.image ? `http://localhost:7000${item.image}` : "https://i.imgur.com/gJ5hJ6h.png"} 
          alt={item.name} 
          className="img-fluid rounded" 
        />
      </div>
      <div className="col-md-6">
        <h1 className="text-white">{item.name}</h1>
        <p className="text-muted">{item.category}</p>
        <p>{item.description}</p>
        <h2 className="my-4 text-white">
          ₹{item.price}
          {item.mrp && <span className="fs-5 text-muted text-decoration-line-through ms-2">₹{item.mrp}</span>}
        </h2>
        <p className="text-success">In Stock</p> {/* Placeholder */}
        
        <button className="btn btn-primary btn-lg" onClick={() => addToCart(item._id)}>
          <i className="fa-solid fa-cart-plus me-2"></i> Add to Cart
        </button>

        <div className="mt-5">
          <h4 className="text-white">Reviews</h4>
          <p className="text-muted">No reviews yet.</p> {/* Placeholder */}
        </div>
      </div>
    </div>
  );
}