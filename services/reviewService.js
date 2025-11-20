import Product from '../models/Product.js';
import logger from '../config/logger.js';

export async function addReview(productId, userId, rating, comment) {
  try {
    const product = await Product.findById(productId);
    if (!product) {
      throw new Error('Produit non trouvé');
    }

    const existingReview = product.reviews.find(
      (r) => r.user.toString() === userId.toString(),
    );
    if (existingReview) {
      throw new Error('Vous avez déjà évalué ce produit');
    }

    product.reviews.push({ user: userId, rating, comment });
    product.averageRating =
      product.reviews.reduce((acc, r) => acc + r.rating, 0) /
      product.reviews.length;

    await product.save();
    logger.info(`Review added for product ${productId} by user ${userId}`);
    return product;
  } catch (err) {
    logger.error(`Error adding review: ${err.message}`);
    throw err;
  }
}

export async function getProductReviews(productId) {
  try {
    const product = await Product.findById(productId).populate(
      'reviews.user',
      'fullName',
    );
    if (!product) {
      throw new Error('Produit non trouvé');
    }
    return product.reviews;
  } catch (err) {
    logger.error(`Error getting reviews: ${err.message}`);
    throw err;
  }
}

export async function getAllReviews(page = 1, limit = 10) {
  try {
    const products = await Product.find({ 'reviews.0': { $exists: true } })
      .populate('reviews.user', 'fullName email')
      .select('title reviews');
    
    const allReviews = [];
    products.forEach(product => {
      product.reviews.forEach(review => {
        allReviews.push({
          _id: review._id,
          productId: product._id,
          productTitle: product.title,
          user: review.user,
          rating: review.rating,
          comment: review.comment,
          createdAt: review.createdAt
        });
      });
    });
    
    const sortedReviews = allReviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const total = sortedReviews.length;
    const skip = (page - 1) * limit;
    const paginatedReviews = sortedReviews.slice(skip, skip + limit);
    
    return {
      reviews: paginatedReviews,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalReviews: total,
        limit
      }
    };
  } catch (err) {
    logger.error(`Error getting all reviews: ${err.message}`);
    throw err;
  }
}

export async function deleteReview(productId, reviewId) {
  try {
    const product = await Product.findById(productId);
    if (!product) {
      throw new Error('Produit non trouvé');
    }

    const reviewIndex = product.reviews.findIndex(r => r._id.toString() === reviewId);
    if (reviewIndex === -1) {
      throw new Error('Avis non trouvé');
    }

    product.reviews.splice(reviewIndex, 1);
    
    // Recalculer la moyenne
    if (product.reviews.length > 0) {
      product.averageRating = product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length;
    } else {
      product.averageRating = 0;
    }

    await product.save();
    logger.info(`Review ${reviewId} deleted from product ${productId}`);
    return product;
  } catch (err) {
    logger.error(`Error deleting review: ${err.message}`);
    throw err;
  }
}
