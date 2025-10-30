import Product from "../models/Product.js";
import logger from "../config/logger.js";

export async function addReview(productId, userId, rating, comment) {
  try {
    const product = await Product.findById(productId);
    if (!product) {
      throw new Error("Produit non trouvé");
    }

    const existingReview = product.reviews.find(
      (r) => r.user.toString() === userId.toString(),
    );
    if (existingReview) {
      throw new Error("Vous avez déjà évalué ce produit");
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
      "reviews.user",
      "fullName",
    );
    if (!product) {
      throw new Error("Produit non trouvé");
    }
    return product.reviews;
  } catch (err) {
    logger.error(`Error getting reviews: ${err.message}`);
    throw err;
  }
}
