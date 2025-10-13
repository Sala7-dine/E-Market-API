import express from "express";
import { CreateProduct, GetProducts, DeleteProduct , UpdateProduct , SearchProducts } from "../controllers/productController.js";
import { validate } from "../middlewares/validate.js";
import { createProductSchema, updateProductSchema } from "../validations/product.validations.js";


const router = express.Router();


router.get('/' , GetProducts);

router.post('/create', validate(createProductSchema),  CreateProduct);

router.put('/update/:id' , validate(updateProductSchema), UpdateProduct);

router.delete('/delete/:id' , DeleteProduct);


router.get('/search' , SearchProducts);

export default router;