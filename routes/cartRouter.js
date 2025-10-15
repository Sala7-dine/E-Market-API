import express from "express";
import { addProductToCard, getAllCarts, deleteProductcart } from "../controllers/cartController.js";

const router = express.Router();

router.post('/addtocart',addProductToCard);
router.get('/getcarts',getAllCarts);
router.delete('/deleteProduct/:productId',deleteProductcart);


export default router