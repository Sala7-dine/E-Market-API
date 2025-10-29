import express from "express";
import { CreateProduct, GetProducts, DeleteProduct , UpdateProduct , SearchProducts } from "../controllers/productController.js";
import { AddReview, GetReviews } from "../controllers/reviewController.js";
import { validate } from "../middlewares/validate.js";
import { createProductSchema, updateProductSchema } from "../validations/product.validations.js";
import multer from "multer";
import { compressImages } from "../middlewares/imageCompression.js";
import { productLimiter } from "../middlewares/rateLimiterMiddleware.js";
import { authenticate } from "../middlewares/authMiddleware.js";
import { requireSellerOrAdmin, requireProductOwnerOrAdmin } from "../middlewares/roleMiddleware.js";

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

// Routes publiques (accessible à tous les utilisateurs authentifiés)
router.get('/', productLimiter, GetProducts);
router.get('/search', productLimiter, SearchProducts);

// Routes pour sellers et admins (création de produits)
router.post('/create', 
    productLimiter, 
    
    upload.array('images', 5), 
    compressImages('images/products'), 
    parseFormData, 
    validate(createProductSchema), 
    CreateProduct
);

// Routes pour propriétaire du produit ou admin (modification/suppression)
router.put('/update/:id', 
    productLimiter, 
    requireProductOwnerOrAdmin,
    upload.array('images', 5), 
    compressImages('images/products'), 
    parseFormData, 
    validate(updateProductSchema), 
    UpdateProduct
);

router.delete('/delete/:id', 
    productLimiter, 
    requireProductOwnerOrAdmin, 
    DeleteProduct
);

// Routes pour les avis (tous les utilisateurs authentifiés)
router.post('/:productId/reviews', authenticate, AddReview);
router.get('/:productId/reviews', authenticate, GetReviews);

export default router;