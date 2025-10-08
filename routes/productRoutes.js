import express from "express";
import { CreateProduct, GetProducts, DeleteProduct , UpdateProduct } from "../controllers/productController.js";

const router = express.Router();

router.get('/' , GetProducts);
router.post('/create'  , CreateProduct);
router.delete('/delete/:id' , DeleteProduct);
router.put('/update/:id' , UpdateProduct);

export default router;