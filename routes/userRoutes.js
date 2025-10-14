import express from "express";
import { validate } from "../middlewares/validate.js";
import { createUserSchema, updateUserSchema } from "../validations/user.validation.js";
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

const upload = multer({ storage: storage })
const router = express.Router();


router.get('/' , GetUsers);

router.post('/create', validate(createUserSchema) ,CreateUser);

router.put('/update/:id', validate(updateUserSchema) , UpdateUser);

router.delete('/delete/:id' , DeleteUser);

router.get('/me', authenticate, GetCurrentUser);
router.patch('/update-profile', upload.single('profile-photo'), authenticate, UpdateProfile);


export default router;