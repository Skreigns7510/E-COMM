import express from "express";
import jwt from "jsonwebtoken";
import User from "../Models/User.js";
import { JWT_SECRET } from "../config.js";

const router = express.Router();

// POST /api/auth/signup
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ error: "Please provide name, email, and password." });
    }

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ error: "User with this email already exists." });
    }

    user = new User({ name, email, password });
    await user.save();

    const payload = { user: { id: user._id } };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });

    res.status(201).json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error during signup." });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
     if (!email || !password) {
        return res.status(400).json({ error: "Please provide email and password." });
    }

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: "Invalid credentials." });
    }
    
    const payload = { user: { id: user._id } };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });

    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error during login." });
  }
});

export default router;