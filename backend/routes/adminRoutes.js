import express from 'express';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import { getAllArticles } from '../controllers/articleController.js';
import User from '../models/User.js';

const router = express.Router();

router.get('/users', protect, adminOnly, async (req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
});

router.get('/articles', protect, adminOnly, getAllArticles);

export default router;