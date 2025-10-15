import express from "express";
import { validate } from "../middlewares/validate.js";
import { createUserSchema, updateUserSchema } from "../validations/user.validation.js";

import { CreateUser, GetUsers, DeleteUser , UpdateUser, GetCurrentUser } from "../controllers/userController.js";
import {authenticate} from "../middlewares/authMiddleware.js";

const router = express.Router();


router.get('/' , GetUsers);

router.post('/create', validate(createUserSchema) ,CreateUser);

router.put('/update/:id', validate(updateUserSchema) , UpdateUser);

router.delete('/delete/:id' , DeleteUser);

router.get('/me', authenticate, GetCurrentUser);



export default router;