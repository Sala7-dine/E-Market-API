import express from "express";
import { CreateUser, GetUsers, DeleteUser , UpdateUser } from "../controllers/userController.js";

const router = express.Router();

router.get('/' , GetUsers);
router.post('/create'  , CreateUser);
router.delete('/delete/:id' , DeleteUser);
router.put('/update/:id' , UpdateUser);

export default router;