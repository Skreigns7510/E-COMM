import React from 'react';
import { Link } from 'react-router-dom';
import FeaturedProducts from '../Components/FeaturedProducts';
import './css/HomePage.css'; // New dedicated CSS for the homepage

const HeroSection = () => (
  <div className="hero-section mb-4">
    <div className="hero-overlay">
      <div className="container text-center">
        <h1 className="hero-title">Style Meets Substance</h1>
        <p className="hero-subtitle">Discover curated collections of the finest products, designed for modern living.</p>
        <Link className="hero-btn" to="/shop">Shop Now</Link>
      </div>
    </div>
  </div>
);

const categories = [
  { 
    name: 'Electronics', 
    image: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=764&q=80',
    link: '/shop?category=Electronics'
  },
  { 
    name: 'Apparel', 
    image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    link: '/shop?category=Apparel'
  },
  { 
    name: 'Home Goods', 
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=958&q=80',
    link: '/shop?category=Home+Goods'
  }
];

const CategoriesSection = () => (
  <div className="categories-section">
    <div className="container">
      <h2 className="section-title">Shop by Category</h2>
      <p className="section-subtitle">Find what you're looking for, faster.</p>
      <div className="row g-4">
        {categories.map(category => (
          <div className="col-md-4" key={category.name}>
            <Link to={category.link} className="category-card-link">
              <div className="category-card">
                <img src={category.image} alt={category.name} className="category-image" />
                <div className="category-card-overlay">
                  <h5 className="category-card-title">{category.name}</h5>
                  <span className="category-explore-btn">Explore</span>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default function HomePage() {
  return (
    <div className="homepage-container">
      <HeroSection />
      <FeaturedProducts />
      <CategoriesSection />
    </div>
  );
}