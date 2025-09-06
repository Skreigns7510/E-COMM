import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  category: String,
  price: { type: Number, required: true }, // sale price
  mrp: Number, // original price
  image: String,
}, { timestamps: true });

// ✅ Check if model already exists
const Item = mongoose.models.Item || mongoose.model("Item", itemSchema);

export default Item;
