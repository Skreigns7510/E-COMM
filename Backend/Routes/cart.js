import express from "express";
import Cart from "../Models/Cart.js";
import Item from "../Models/Item.js";
import { authMiddleware } from "../Middleware/authMiddleware.js";

const router = express.Router();

// GET /api/cart - Get the user's cart
router.get("/", authMiddleware, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id })
      .populate({
        path: 'items.itemId',
        model: 'Item'
      });

    if (!cart) {
      return res.json([]); // Return an empty array if no cart exists
    }

    res.json(cart.items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error fetching cart." });
  }
});

// POST /api/cart - Add a new item to the cart
router.post("/", authMiddleware, async (req, res) => {
    const { itemId, qty } = req.body;
    const userId = req.user.id;

    try {
        let cart = await Cart.findOne({ userId });
        if (!cart) {
            cart = new Cart({ userId, items: [] });
        }

        const itemIndex = cart.items.findIndex(p => p.itemId.toString() === itemId);

        if (itemIndex > -1) {
            cart.items[itemIndex].qty += qty;
        } else {
            cart.items.push({ itemId, qty });
        }

        await cart.save();
        res.status(200).json(cart.items);
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
});

// DELETE /api/cart/item/:itemId - Remove an item from the cart
router.delete("/item/:itemId", authMiddleware, async (req, res) => {
  const { itemId } = req.params;
  const userId = req.user.id;

  try {
    let cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found." });

    cart.items = cart.items.filter(ci => ci.itemId.toString() !== itemId);

    await cart.save();
    res.status(200).json(cart.items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error removing item." });
  }
});

// POST /api/cart/merge - Merge local guest cart with DB cart after login
router.post("/merge", authMiddleware, async (req, res) => {
  const { localCart } = req.body; 
  const userId = req.user.id;

  try {
    let userCart = await Cart.findOne({ userId });
    if (!userCart) {
      userCart = new Cart({ userId, items: [] });
    }

    localCart.forEach(localItem => {
      const existingItemIndex = userCart.items.findIndex(
        dbItem => dbItem.itemId.toString() === localItem.itemId
      );
      if (existingItemIndex > -1) {
        userCart.items[existingItemIndex].qty += localItem.qty;
      } else {
        userCart.items.push({ itemId: localItem.itemId, qty: localItem.qty });
      }
    });

    await userCart.save();
    res.status(200).json({ message: "Cart merged successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error merging cart." });
  }
});

export default router;