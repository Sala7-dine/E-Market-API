import express from "express";
import { addProductToCard, getAllCarts } from "../controllers/cartController.js";

const router = express.Router();

router.post('/addtocart',addProductToCard);
router.get('/getcarts',getAllCarts);


export default router