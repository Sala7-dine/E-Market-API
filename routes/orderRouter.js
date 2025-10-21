import express from "express";

import {handleAddOrder, handleGetOrder, updateOrderStatus } from "../controllers/orderController.js";

const router = express.Router();

router.post('/addOrder/:cartId',handleAddOrder);
router.get('/getOrder',handleGetOrder);
router.put('/updateStatus/:orderId',updateOrderStatus);


export default router;