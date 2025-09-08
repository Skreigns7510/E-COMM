import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config.js';

export const authMiddleware = (req, res, next) => {
  // 1. Get token from the header
  const token = req.header('authorization');

  // 2. Check if token exists
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // 3. Verify token and extract payload
    // The payload was signed as { user: { id: ... } }
    const decoded = jwt.verify(token, JWT_SECRET);

    // 4. Attach the DECODED USER PAYLOAD to the request object
    // This makes `req.user` available in the next route
    req.user = decoded.user;
    
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};