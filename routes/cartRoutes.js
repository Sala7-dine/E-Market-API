import express from 'express';
import {
  addProductToCard,
  getAllCarts,
  deleteProductcart,
  updateCart,
} from '../controllers/cartController.js';

const router = express.Router();

router.post('/addtocart', addProductToCard);
router.get('/getcarts', getAllCarts);
router.delete('/deleteProduct/:productId', deleteProductcart);
router.put('/updateCart/:id', updateCart);

export default router;
