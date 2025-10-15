import { addToCart, getCarts, deleteproduct } from "../services/cartService.js";

// Add product to the user's cart :
export const addProductToCard = async (req, res, next) => {
  try {
    const userId = req.user._id;
    console.log(userId);
    const { productId, quantity } = req.body;
    const cart = await addToCart(userId, productId, quantity);
    res.status(200).json(cart);
  } catch (err) {
    next(err);
  }
};

// get the user's cart :
export const getAllCarts = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const allCarts = await getCarts(userId);
    console.log("🔪🔪🔪", allCarts);
    res.status(200).json({
      success: true,
      data: allCarts,
    });
  } catch (err) {
    next(err);
  }
};

// Remove product from user's cart :
export const deleteProductcart = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const productId = req.params.productId;
    const productDeleted = await deleteproduct(userId, productId);
    if (!productDeleted) {
      return res.status(400).json({ success: false, message: "Delete failed" });
    }

    res
      .status(200)
      .json({ success: true, message: "Product deleted from cart" });
  } catch (err) {
    next(err);
  }
};
