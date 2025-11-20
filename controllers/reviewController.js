import { addReview, getProductReviews, getAllReviews, deleteReview } from '../services/reviewService.js';
import mongoose from 'mongoose';
import logger from '../config/logger.js';

export const AddReview = async (req, res) => {
  try {
    const { productId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: 'ID invalide' });
    }

    const product = await addReview(productId, userId, rating, comment);
    res.status(201).json({ success: true, data: product });
  } catch (err) {
    logger.error(`AddReview error: ${err.message}`);
    res.status(400).json({ error: err.message });
  }
};

export const GetReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: 'ID invalide' });
    }

    const reviews = await getProductReviews(productId);
    res.json({ success: true, data: reviews });
  } catch (err) {
    logger.error(`GetReviews error: ${err.message}`);
    res.status(400).json({ error: err.message });
  }
};

export const GetAllReviews = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const result = await getAllReviews(page, limit);
    res.json({ success: true, data: result.reviews, pagination: result.pagination });
  } catch (err) {
    logger.error(`GetAllReviews error: ${err.message}`);
    res.status(500).json({ error: err.message });
  }
};

export const DeleteReview = async (req, res) => {
  try {
    const { productId, reviewId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId) || !mongoose.Types.ObjectId.isValid(reviewId)) {
      return res.status(400).json({ message: 'ID invalide' });
    }

    await deleteReview(productId, reviewId);
    res.json({ success: true, message: 'Avis supprimé avec succès' });
  } catch (err) {
    logger.error(`DeleteReview error: ${err.message}`);
    res.status(400).json({ error: err.message });
  }
};
