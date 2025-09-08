// src/pages/Products.jsx
import React, { useEffect, useState, useCallback } from "react";
import API from "../Services/api";
import { Link } from "react-router-dom"; // Import Link
import "./css/Product.css";

export default function Products() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ search: "", category: "", minPrice: "", maxPrice: "" });
  const [showFilters, setShowFilters] = useState(false);
  const [sort, setSort] = useState("alpha-asc"); // Default sort
  const [view, setView] = useState("grid"); // 'grid' or 'list'

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      const params = { ...filters };
      const res = await API.get("/items", { params });
      let data = res.data || [];

      // Client-side sorting after fetching
      if (sort === "price-asc") data.sort((a, b) => a.price - b.price);
      if (sort === "price-desc") data.sort((a, b) => b.price - a.price);
      if (sort === "alpha-asc") data.sort((a, b) => a.name.localeCompare(b.name));
      if (sort === "alpha-desc") data.sort((a, b) => b.name.localeCompare(a.name));

      setItems(data);
    } catch (err) {
      console.error(err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [filters, sort]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const addToCart = async (itemId) => {
    try {
      const localCart = JSON.parse(localStorage.getItem("clientCart") || "[]");
      const found = localCart.find((c) => c.itemId === itemId);
      if (found) found.qty += 1;
      else localCart.push({ itemId, qty: 1 });
      localStorage.setItem("clientCart", JSON.stringify(localCart));

      const token = localStorage.getItem("token");
      if (token) {
        await API.post("/cart", { itemId, qty: localCart.find((c) => c.itemId === itemId).qty });
      }
      alert("Added to cart ✅"); 
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (err) {
      console.error(err);
      alert("Could not add to cart");
    }
  };

  const renderStars = (rating = 5) => {
    return (
      <div className="star-rating">
        {[...Array(5)].map((_, i) => (
          <i key={i} className={`fa-solid fa-star ${i < rating ? 'filled' : ''}`}></i>
        ))}
      </div>
    );
  };

  return (
    <div className="container my-5 product-page">
      {/* Toolbar */}
      <div className="toolbar d-flex justify-content-between align-items-center mb-4">
        <div className="view-switcher">
          <button className={`btn ${view === 'grid' ? 'active' : ''}`} onClick={() => setView('grid')}>
            <i className="fa-solid fa-grip"></i>
          </button>
          <button className={`btn ${view === 'list' ? 'active' : ''}`} onClick={() => setView('list')}>
            <i className="fa-solid fa-list"></i>
          </button>
           <button className="btn btn-secondary ms-3" onClick={() => setShowFilters(!showFilters)}>
            <i className="fa-solid fa-filter me-2"></i> Filters
          </button>
        </div>
        <div className="sort-by-container">
          <label htmlFor="sort-select">Sort by:</label>
          <select id="sort-select" className="form-select" value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="alpha-asc">Alphabetically, A-Z</option>
            <option value="alpha-desc">Alphabetically, Z-A</option>
            <option value="price-asc">Price, low to high</option>
            <option value="price-desc">Price, high to low</option>
          </select>
        </div>
      </div>
      {showFilters && (
        <div className="filter-section card card-body mb-4">
             <div className="row g-2">
                <div className="col-md-4">
                    <input className="form-control" placeholder="Search by name..." value={filters.search} onChange={e => setFilters({ ...filters, search: e.target.value })} />
                </div>
                <div className="col-md-4">
                    <input className="form-control" placeholder="Category" value={filters.category} onChange={e => setFilters({ ...filters, category: e.target.value })} />
                </div>
                <div className="col-md-2">
                    <input className="form-control" placeholder="Min Price" type="number" value={filters.minPrice} onChange={e => setFilters({ ...filters, minPrice: e.target.value })} />
                </div>
                <div className="col-md-2">
                    <input className="form-control" placeholder="Max Price" type="number" value={filters.maxPrice} onChange={e => setFilters({ ...filters, maxPrice: e.target.value })} />
                </div>
             </div>
        </div>
      )}


      {/* Products Grid/List */}
      {loading ? (
        <div className="text-center py-5">
            <div className="spinner-border text-success" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-5 text-muted"><h2>No products found</h2></div>
      ) : (
        <div className={`row ${view === 'grid' ? 'g-4' : 'g-2'}`}>
          {items.map((item) => (
            <div key={item._id} className={view === 'grid' ? 'col-lg-3 col-md-4 col-sm-6' : 'col-12'}>
              <div className="product-card">
                {/* Product Image and Badges */}
                <div className="product-image-container">
                  <Link to={`/product/${item._id}`}> 
                    <img
                      src={item.image ? `http://localhost:7000${item.image}` : "https://i.imgur.com/gJ5hJ6h.png"}
                      alt={item.name || "product"}
                      className="product-image"
                    />
                  </Link>
                  <div className="product-badges">
                    {item.mrp && item.mrp > item.price && (
                      <span className="badge offer-badge">OFF</span>
                    )}
                    {item.stock === 0 && (
                        <span className="badge sold-out-badge">SOLD OUT</span>
                    )}
                  </div>
                   <div className="product-actions">
                        {item.stock !== 0 && (
                            <button className="btn action-btn" title="Add to Cart" onClick={() => addToCart(item._id)}>
                                <i className="fa-solid fa-cart-plus"></i>
                            </button>
                        )}
                        <Link to={`/product/${item._id}`} className="btn action-btn" title="View Details">
                           <i className="fa-solid fa-eye"></i>
                        </Link>
                    </div>
                </div>

                {/* Product Details */}
                <div className="product-info">
                  <h5 className="product-title">
                    <Link to={`/product/${item._id}`}>{item.name}</Link>
                  </h5>
                  <div className="product-price">
                    {item.mrp && item.mrp > item.price ? (
                      <>
                        <span className="current-price">₹{item.price}</span>
                        <span className="original-price">₹{item.mrp}</span>
                      </>
                    ) : (
                      <span className="current-price">₹{item.price}</span>
                    )}
                  </div>
                  {renderStars(item.rating)} {/* Assuming you have a 'rating' field */}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}