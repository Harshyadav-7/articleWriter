import express from 'express';
import { createArticle, getMyArticles, getMyArticlesbyId, updateArticle,  deleteArticle } from '../controllers/articleController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createArticle);
router.get('/my', protect, getMyArticles);
router.get('/my/:id', getMyArticlesbyId );
router.put('/:id', updateArticle);
router.delete('/:id', protect, deleteArticle);

export default router;