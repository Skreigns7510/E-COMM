import React from 'react';
import { Link } from 'react-router-dom';
// Import icons from the library we just installed
import { FaFacebookF, FaTwitter, FaInstagram, FaDribbble } from 'react-icons/fa';
import './Footer.css'; // New dedicated CSS file for the footer

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="row">
          <div className="col-lg-6 col-md-12 mb-4 mb-md-0">
            <h5 className="footer-heading">DIOR : E-COMMERCE</h5>
            <p className="footer-text">
              Your one-stop shop for everything you need. We provide high-quality products, 
              fast shipping, and amazing customer service.
            </p>
          </div>

          <div className="col-lg-3 col-md-6 mb-4 mb-md-0">
            <h5 className="footer-heading">Quick Links</h5>
            <ul className="list-unstyled footer-links">
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/shipping-policy">Shipping Policy</Link></li>
              <li><Link to="/faq">FAQ</Link></li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6 mb-4 mb-md-0">
            <h5 className="footer-heading">Follow Us</h5>
            <p className="footer-text">Stay up to date with our latest news and products.</p>
            <div className="social-icons">
              <a href="#!"><FaFacebookF /></a>
              <a href="#!"><FaTwitter /></a>
              <a href="#!"><FaInstagram /></a>
              <a href="#!"><FaDribbble /></a>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-copyright">
        <div className="container">
          © {new Date().getFullYear()} Copyright: <a href="https://example.com/">DIOR</a>
        </div>
      </div>
    </footer>
  );
}