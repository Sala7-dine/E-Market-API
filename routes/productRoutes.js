import express from "express";
import { CreateProduct, GetProducts, DeleteProduct , UpdateProduct , SearchProducts } from "../controllers/productController.js";
import { AddReview, GetReviews } from "../controllers/reviewController.js";
import { validate } from "../middlewares/validate.js";
import { createProductSchema, updateProductSchema } from "../validations/product.validations.js";
import multer from "multer";
import { compressImages } from "../middlewares/imageCompression.js";
import {authenticate} from "../middlewares/authMiddleware.js";

const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        allowedTypes.includes(file.mimetype) ? cb(null, true) : cb(new Error('Type de fichier non autorisé'));
    }
});


const parseFormData = (req, res, next) => {
    if (req.body.categories && typeof req.body.categories === 'string') {
        try {
            req.body.categories = JSON.parse(req.body.categories);
        } catch (e) {}
    }
    next();
};

const router = express.Router();


router.get('/' , GetProducts);

router.post('/create', upload.array('images', 5), compressImages('images/products'), parseFormData, validate(createProductSchema), CreateProduct);

router.put('/update/:id', upload.array('images', 5), compressImages('images/products'), parseFormData, validate(updateProductSchema), UpdateProduct);

router.delete('/delete/:id' , DeleteProduct);


router.get('/search' , SearchProducts);

router.post('/:productId/reviews', authenticate, AddReview);
router.get('/:productId/reviews', authenticate, GetReviews);

export default router;