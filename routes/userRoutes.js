import express from 'express';
import { validate } from '../middlewares/validate.js';
import {
  createUserSchema,
  updateUserSchema,
  updateProfileSchema,
} from '../validations/user.validation.js';
import multer from 'multer';
import {
  CreateUser,
  GetUsers,
  DeleteUser,
  UpdateUser,
  GetCurrentUser,
  UpdateProfile,
} from '../controllers/userController.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { uploadUserImageToCloudinary } from '../middlewares/userImageUpload.js';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
    ];
    allowedTypes.includes(file.mimetype)
      ? cb(null, true)
      : cb(new Error('Type de fichier non autorisé'));
  },
});
const router = express.Router();

router.get('/', GetUsers);

router.post('/create', validate(createUserSchema), CreateUser);

router.put('/update/:id', validate(updateUserSchema), UpdateUser);

router.delete('/delete/:id', DeleteUser);

router.get('/me', authenticate, GetCurrentUser);
router.patch(
  '/me',
  authenticate,
  upload.single('profileImage'),
  uploadUserImageToCloudinary,
  validate(updateProfileSchema),
  UpdateProfile,
);

export default router;
