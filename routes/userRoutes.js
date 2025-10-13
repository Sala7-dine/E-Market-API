import express from "express";
import { validate } from "../middlewares/validate.js";
import { createUserSchema, updateUserSchema } from "../validations/user.validation.js";

import { CreateUser, GetUsers, DeleteUser , UpdateUser } from "../controllers/userController.js";

const router = express.Router();


router.get('/' , GetUsers);

router.post('/create', validate(createUserSchema) ,CreateUser);

router.put('/update/:id', validate(updateUserSchema) , UpdateUser);

router.delete('/delete/:id' , DeleteUser);




export default router;