import { addToCart, getCarts } from "../services/cartService.js";

export const addProductToCard = async (req, res, next) => {
  try {
    const userId = req.user._id;
    console.log(userId);
    const { productId, quantity} = req.body;
    const cart = await addToCart(userId, productId, quantity);
    res.status(200).json(cart);
  } catch (err) {
    next(err);
  }
};


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
