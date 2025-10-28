import express from "express";
import {
  handleCreateCoupon,
  GetAllCoupons,
  GetAllUserCoupons,
  handleDeleteCoupon,
  handleUpdateCoupon,
} from "../controllers/couponController.js";

const router = express.Router();

router.post("/createCoupon", handleCreateCoupon);
router.get("/getAllCoupon", GetAllCoupons);
router.get("/getAllUserCoupon", GetAllUserCoupons);
router.delete("/deleteCoupon/:couponId", handleDeleteCoupon);
router.put("/updateCoupon/:couponId", handleUpdateCoupon);

export default router;
