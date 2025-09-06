import express from "express";
import multer from "multer";
import Item from "../Models/Item.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});
const upload = multer({ storage });

// ✅ Add product with image
router.post("/", authMiddleware, upload.single("image"), async (req, res) => {
  try {
    const { name, description, category, price, mrp } = req.body;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : "";

    const item = new Item({
      name,
      description,
      category,
      price,
      mrp,
      image: imagePath
    });

    await item.save();
    res.status(201).json(item);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
});

// ✅ Get all products (with filters)
router.get("/", async (req, res) => {
  const { category, minPrice, maxPrice } = req.query;
  let query = {};
  if (category) query.category = category;
  if (minPrice || maxPrice) {
    query.price = { $gte: minPrice || 0, $lte: maxPrice || 1000000 };
  }

  const items = await Item.find(query);
  res.json(items);
});

export default router;
