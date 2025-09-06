import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import Navbar from "./Components/Navbar.js";
import Login from "./Pages/Login.jsx";
import Signup from "./Pages/Signup.jsx";
import Products from "./Pages/Products.jsx";
import Cart from "./Pages/Cart.jsx";
import PrivateRoute from "./Components/PrivateRoute.js";
import AddProduct from "./Pages/AddProduct.jsx";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="w-100">
        <Routes>
          <Route path="/" element={<Products />} />
          <Route path="/shop" element={<Products />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/add-product" element={<PrivateRoute><AddProduct /></PrivateRoute>} />
          <Route
            path="/cart"
            element={
              <PrivateRoute>
                <Cart />
              </PrivateRoute>
            }
          />
        </Routes>
        <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#333',
            color: '#fff',
          },
        }}
      />
      </div>
    </BrowserRouter>
  );
}

export default App;
