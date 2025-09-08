import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../Services/api';
import './FeaturedProducts.css';
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:7000';

// A Skeleton component for a better loading experience
const ProductCardSkeleton = () => (
  <div className="col-lg-3 col-md-4 col-sm-6">
    <div className="product-card skeleton">
      <div className="product-image-container skeleton-image"></div>
      <div className="product-info">
        <div className="skeleton-line title"></div>
        <div className="skeleton-line price"></div>
      </div>
    </div>
  </div>
);

export default function FeaturedProducts() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedItems = async () => {
      try {
        const res = await API.get('/items?limit=4'); 
        setItems(res.data);
      } catch (error) {
        console.error("Failed to fetch featured products:", error);
      } finally {
        setTimeout(() => setLoading(false), 500);
      }
    };
    fetchFeaturedItems();
  }, []);

  return (
    <div className="featured-products-section">
      <div className="container">
        <h2 className="section-title"> Featured Products</h2>
        <p className="section-subtitle">Discover our handpicked selection of popular items.</p>
        
        <div className="row g-4">
          {loading ? (
            [...Array(4)].map((_, index) => <ProductCardSkeleton key={index} />)
          ) : (
            items.map((item) => (
              <div key={item._id} className="col-lg-3 col-md-4 col-sm-6">
                <div className="product-card">
                  <div className="product-image-container">
                    <Link to={`/product/${item._id}`}>
                      <img
                        src={item.image ? `${API_URL}${item.image}` : "https://i.imgur.com/gJ5hJ6h.png"}
                        alt={item.name}
                        className="product-image"
                      />
                    </Link>
                  </div>
                  <div className="product-info">
                    <h5 className="product-title">
                      <Link to={`/product/${item._id}`}>{item.name}</Link>
                    </h5>
                    <div className="product-price">
                      <span className="current-price">₹{item.price}</span>
                      {item.mrp && <span className="original-price">₹{item.mrp}</span>}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="text-center mt-5">
            <Link to="/shop" className="view-all-btn">View All Products</Link>
        </div>
      </div>
    </div>
  );
}