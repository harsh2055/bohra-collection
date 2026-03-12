import express from 'express';
import { getProducts, getProduct, createProduct, updateProduct, deleteProduct, getStats } from '../controllers/productController.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/stats', getStats);
router.get('/:id', getProduct);

// Protected admin routes
router.post('/', requireAuth, requireAdmin, createProduct);
router.put('/:id', requireAuth, requireAdmin, updateProduct);
router.delete('/:id', requireAuth, requireAdmin, deleteProduct);

export default router;
