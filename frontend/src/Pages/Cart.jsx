// src/Pages/Cart.jsx
import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import API from "../Services/api";
import { toast } from 'react-hot-toast'; // Import toast for notifications

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadCart = useCallback(async () => {
    try {
        setLoading(true);
        const token = localStorage.getItem("token");
        let itemsData = [];

        if (!token) {
            const localCart = JSON.parse(localStorage.getItem("clientCart") || "[]");
            if (localCart.length > 0) {
                const itemDetailsPromises = localCart.map(c => API.get(`/items/${c.itemId}`));
                const itemDetailsResponses = await Promise.all(itemDetailsPromises);
                itemsData = itemDetailsResponses.map((res, index) => ({
                    ...res.data,
                    qty: localCart[index].qty,
                }));
            }
        } else {
            const res = await API.get("/cart");
            // Simplified and corrected mapping
            itemsData = res.data.map(cartItem => ({
                ...cartItem.itemId,
                qty: cartItem.qty
            }));
        }
        setCartItems(itemsData);
    } catch (err) {
        console.error("Failed to load cart:", err);
        toast.error("Could not load your cart.");
        setCartItems([]);
    } finally {
        setLoading(false);
    }
  }, []);

  useEffect(() => { 
    loadCart();
    // Listen for the custom event to reload cart when updated from other pages
    window.addEventListener('cartUpdated', loadCart);
    return () => {
        window.removeEventListener('cartUpdated', loadCart);
    }
  }, [loadCart]);

  const updateQty = async (itemId, qty) => {
    if (qty < 1) return removeItem(itemId); // If qty is 0, remove the item

    const originalCart = [...cartItems];
    const newCartItems = cartItems.map(item => item._id === itemId ? { ...item, qty } : item);
    setCartItems(newCartItems); // Optimistic update
    
    const token = localStorage.getItem("token");
    try {
      if (token) {
        // ✅ CORRECTED API ROUTE: Using PUT for updating a specific item
        await API.put(`/cart/item/${itemId}`, { qty });
      } else {
        const localCart = newCartItems.map(i => ({ itemId: i._id, qty: i.qty }));
        localStorage.setItem("clientCart", JSON.stringify(localCart));
      }
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      console.error("Failed to update quantity", error);
      toast.error("Failed to update quantity.");
      setCartItems(originalCart); // ✅ Revert on error
    }
  };

  const removeItem = async (itemId) => {
    const originalCart = [...cartItems];
    const newCartItems = cartItems.filter(item => item._id !== itemId);
    setCartItems(newCartItems); // Optimistic update

    const token = localStorage.getItem("token");
    try {
        if (token) {
            // ✅ CORRECTED API ROUTE: Using DELETE for a specific item
            await API.delete(`/cart/item/${itemId}`);
        } else {
            const localCart = newCartItems.map(i => ({ itemId: i._id, qty: i.qty }));
            localStorage.setItem("clientCart", JSON.stringify(localCart));
        }
        toast.success("Item removed from cart.");
        window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
        console.error("Failed to remove item", error);
        toast.error("Failed to remove item.");
        setCartItems(originalCart); // ✅ Revert on error
    }
  };

  const total = cartItems.reduce((sum, i) => sum + i.price * i.qty, 0);

  if (loading) return <div className="text-center py-5 text-white">Loading Cart...</div>;

  if (!cartItems.length) return (
    <div className="text-center py-5 text-muted">
        <h2>Your Cart is Empty</h2>
        <p>Looks like you haven't added anything to your cart yet.</p>
        <Link to="/shop" className="btn btn-primary mt-3">Continue Shopping</Link>
    </div>
  );

  return (
    <div className="container my-5">
      <h2 className="mb-4 text-white">Shopping Cart</h2>
      <div className="row">
        <div className="col-lg-8">
          {cartItems.map(item => (
            <div key={item._id} className="card-dark d-flex flex-column flex-md-row align-items-center p-3 mb-3 rounded-3">
              <img 
                src={item.image ? `http://localhost:7000${item.image}` : "https://i.imgur.com/gJ5hJ6h.png"} 
                alt={item.name} 
                className="rounded"
                style={{ width: '120px', height: '120px', objectFit: 'cover' }} 
              />
              <div className="flex-grow-1 ms-md-4 mt-3 mt-md-0">
                <h5 className="mb-1 text-white">{item.name}</h5>
                <p className="mb-1 text-muted">Category: {item.category || "N/A"}</p>
                <p className="mb-1 fw-bold fs-5">₹{item.price}</p>
              </div>
              <div className="d-flex align-items-center mt-3 mt-md-0">
                   <input 
                     type="number" 
                     className="form-control form-control-dark text-center" 
                     value={item.qty} 
                     min={1} 
                     style={{ width: '70px' }}
                     onChange={e => updateQty(item._id, parseInt(e.target.value))} 
                   />
                   <button className="btn btn-outline-danger ms-3" onClick={() => removeItem(item._id)}>
                     <i className="fa-solid fa-trash"></i>
                   </button>
              </div>
            </div>
          ))}
        </div>
        <div className="col-lg-4">
          <div className="card-dark p-4 rounded-3">
            <h4 className="mb-3 text-white">Cart Summary</h4>
            <div className="d-flex justify-content-between mb-2">
              <span>Subtotal</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
            <div className="d-flex justify-content-between mb-3">
              <span>Shipping</span>
              <span>FREE</span>
            </div>
            <hr style={{borderColor: '#444'}}/>
            <div className="d-flex justify-content-between fw-bold fs-5">
              <span className="text-white">Total</span>
              <span className="text-white">₹{total.toFixed(2)}</span>
            </div>
            <div className="d-grid mt-4">
              <button className="btn btn-primary btn-lg">Proceed to Checkout</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
