import express from 'express';
import {
  CreateProduct,
  GetProducts,
  DeleteProduct,
  UpdateProduct,
  SearchProducts,
  GetProductById,
} from '../controllers/productController.js';
import { AddReview, GetReviews } from '../controllers/reviewController.js';
import { validate } from '../middlewares/validate.js';
import {
  createProductSchema,
  updateProductSchema,
} from '../validations/product.validations.js';
import multer from 'multer';
import { uploadToCloudinary } from '../middlewares/cloudinaryUpload.js';
import { productLimiter } from '../middlewares/rateLimiterMiddleware.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { requireProductOwnerOrAdmin, requireSellerOrAdmin } from '../middlewares/roleMiddleware.js';
import { handleMulterError } from '../middlewares/multerErrorHandler.js';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
    files: 5,
    fieldSize: 2 * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Type de fichier non autorisé'), false);
    }
  },
});


const parseFormData = (req, res, next) => {
  if (req.body.categories && typeof req.body.categories === 'string') {
    try {
      req.body.categories = JSON.parse(req.body.categories);
    } catch {}
  }
  next();
};

const router = express.Router();

// Routes publiques (accessible à tous)
router.get('/', GetProducts);
router.get('/search', SearchProducts);
//get product by id
router.get('/:id', GetProductById);

// Routes pour sellers et admins (création de produits)

router.post('/create',
  authenticate,
  productLimiter,
  upload.array('images', 5),
  handleMulterError,
  requireSellerOrAdmin,
  uploadToCloudinary,
  parseFormData,
  validate(createProductSchema),
  CreateProduct,
);


// router.post(
//   '/create',
//   authenticate,
//   productLimiter,
//   upload.array('images', 5),
//   compressImages('images/products'),
//   parseFormData,
//   validate(createProductSchema),
//   CreateProduct,
// );



// Routes pour propriétaire du produit ou admin (modification/suppression)
router.put(
  '/update/:id',
  authenticate,
  productLimiter,
  requireProductOwnerOrAdmin,
  requireSellerOrAdmin,
  upload.array('images', 5),
  uploadToCloudinary,
  parseFormData,
  validate(updateProductSchema),
  UpdateProduct,
);

router.delete(
  '/delete/:id',
  authenticate,
  productLimiter,
  requireSellerOrAdmin,
  requireProductOwnerOrAdmin,
  DeleteProduct,
);

// Routes pour les avis (tous les utilisateurs authentifiés)
router.post('/:productId/reviews', authenticate, AddReview);
router.get('/:productId/reviews', authenticate, GetReviews);

export default router;
