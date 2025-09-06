import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.js";
import itemRoutes from "./routes/items.js";
import cartRoutes from "./routes/cart.js";

dotenv.config();

const app = express();
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());

// ✅ serve uploaded images as static files
app.use("/uploads", express.static("uploads"));

app.use("/api/auth", authRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/cart", cartRoutes);

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(7000, () => console.log("✅ Server running on http://localhost:7000"));
  })
  .catch(err => console.error(err));
