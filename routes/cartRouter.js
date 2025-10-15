import express from "express";
import { addProductToCard, getAllCarts, deleteproduct } from "../controllers/cartController.js";

const router = express.Router();

router.post('/addtocart',addProductToCard);
router.get('/getcarts',getAllCarts);
router.delete('/deleteProduct',deleteproduct);


export default router