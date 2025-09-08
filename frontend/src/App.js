import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from 'react-hot-toast';

import Navbar from "./Components/Navbar.js";
import Footer from "./Components/Footer.jsx";
import HomePage from "./Pages/HomePage.jsx";
import Login from "./Pages/Login.jsx";
import Signup from "./Pages/Signup.jsx";
import Products from "./Pages/Products.jsx";
import ProductDetails from "./Pages/ProductDetails.jsx";
import Cart from "./Pages/Cart.jsx";
import PrivateRoute from "./Components/PrivateRoute.js";
import AddProduct from "./Pages/AddProduct.jsx";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main className="container my-4" style={{ minHeight: '80vh' }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<Products />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Protected Routes */}
          <Route path="/add-product" element={<PrivateRoute><AddProduct /></PrivateRoute>} />
          <Route path="/cart" element={<PrivateRoute><Cart /></PrivateRoute>} />
        </Routes>
      </main>
      <Footer />
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#333',
            color: '#fff',
          },
        }}
      />
    </BrowserRouter>
  );
}

export default App;