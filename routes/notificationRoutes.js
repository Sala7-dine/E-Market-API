import express from 'express';
import {
  getNotifications,
  markAsRead,
} from '../controllers/notificationController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', authenticate, getNotifications);
router.patch('/:id/read', authenticate, markAsRead);

export default router;
