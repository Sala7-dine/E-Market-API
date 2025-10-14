import express from "express";
import { validate } from "../middlewares/validate.js";
import { createUserSchema, updateUserSchema, updateProfileSchema } from "../validations/user.validation.js";
import multer from "multer";
import { CreateUser, GetUsers, DeleteUser , UpdateUser, GetCurrentUser, UpdateProfile } from "../controllers/userController.js";
import {authenticate} from "../middlewares/authMiddleware.js";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images/users/')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        const ext = file.originalname.split('.').pop()
        cb(null, file.fieldname + '-' + uniqueSuffix + '.' + ext)
    }
})

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Type de fichier non autorisé'));
        }
    }
})
const router = express.Router();


router.get('/' , GetUsers);

router.post('/create', validate(createUserSchema) ,CreateUser);

router.put('/update/:id', validate(updateUserSchema) , UpdateUser);

router.delete('/delete/:id' , DeleteUser);

router.get('/me', authenticate, GetCurrentUser);
router.patch('/me', authenticate, upload.single('avatar'), validate(updateProfileSchema), UpdateProfile);


export default router;