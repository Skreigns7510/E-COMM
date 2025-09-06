import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  item: { type: mongoose.Schema.Types.ObjectId, ref: "Item" },
  qty: Number
});

const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  items: [cartItemSchema]
});

export default mongoose.model("Cart", cartSchema);
