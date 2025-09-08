import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  // ✅ RENAMED 'item' to 'itemId' for consistency across the app
  itemId: { type: mongoose.Schema.Types.ObjectId, ref: "Item", required: true },
  qty: { type: Number, required: true, min: 1, default: 1 }
});

const cartSchema = new mongoose.Schema({
  // ✅ RENAMED 'user' to 'userId' for consistency
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  items: [cartItemSchema]
});

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;