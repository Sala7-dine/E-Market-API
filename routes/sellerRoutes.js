import express from 'express';
import { authenticate } from '../middlewares/authMiddleware.js';
import { requireSellerOrAdmin } from '../middlewares/roleMiddleware.js';
import { 
    getSellerProducts, 
    getSellerStats, 
    getSellerOrders 
} from '../controllers/sellerController.js';

const router = express.Router();

// Routes pour les sellers
router.get('/products', authenticate, requireSellerOrAdmin, getSellerProducts);
router.get('/stats', authenticate, requireSellerOrAdmin, getSellerStats);
router.get('/orders', authenticate, requireSellerOrAdmin, getSellerOrders);

export default router;