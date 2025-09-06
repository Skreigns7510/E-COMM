import express from "express";
import Cart from "../models/Cart.js";
import Item from "../models/Item.js";
import { authMiddleware } from "../Middleware/authMiddleware.js";

const router = express.Router();

// get cart
router.get("/", authMiddleware, async (req, res) => {
  let cart = await Cart.findOne({ user: req.userId }).populate("items.item");
  if (!cart) cart = new Cart({ user: req.userId, items: [] });
  res.json(cart.items);
});

// add/update item
router.post("/", authMiddleware, async (req, res) => {
  const { itemId, qty } = req.body;
  let cart = await Cart.findOne({ user: req.userId });
  if (!cart) cart = new Cart({ user: req.userId, items: [] });

  const idx = cart.items.findIndex(ci => ci.item.equals(itemId));
  if (idx >= 0) cart.items[idx].qty = qty;
  else cart.items.push({ item: itemId, qty });

  await cart.save();
  res.json(cart.items);
});

// remove item
router.delete("/:itemId", authMiddleware, async (req, res) => {
  let cart = await Cart.findOne({ user: req.userId });
  if (!cart) return res.json([]);
  cart.items = cart.items.filter(ci => !ci.item.equals(req.params.itemId));
  await cart.save();
  res.json(cart.items);
});

// merge local cart after login
router.post("/merge", authMiddleware, async (req, res) => {
  const { clientCart } = req.body;
  let cart = await Cart.findOne({ user: req.userId });
  if (!cart) cart = new Cart({ user: req.userId, items: [] });

  clientCart.forEach(c => {
    const idx = cart.items.findIndex(ci => ci.item.equals(c.itemId));
    if (idx >= 0) cart.items[idx].qty += c.qty;
    else cart.items.push({ item: c.itemId, qty: c.qty });
  });

  await cart.save();
  cart = await cart.populate("items.item");
  res.json(cart.items);
});

export default router;
