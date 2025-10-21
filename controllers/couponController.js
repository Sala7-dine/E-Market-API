import {creatCoupon, updateCoupon, deleteCoupon, allCoupons, alluserCoupons} from "../services/couponService.js"

// add coupon :
export const handleCreateCoupon = async(req, res, next) => {
    try{
        const {code, type, value, expirationDate, minOrderAmount} = req.body;
        const createdBy = req.user._id;

        const coupon = await creatCoupon(code, type, value, expirationDate, minOrderAmount, createdBy);
         res.status(201).json({
            success : true,
            message : "coupon created",
            data : coupon
        });
    }catch(err){
        next(err);
    }
}

// update coupon :
export const handleUpdateCoupon = async(req, res, next) => {
try{
const {code, type, value, expirationDate, minOrderAmount, isActive} = req.body;
const couponId = req.params.couponId;
const updatedCoupon = await updateCoupon(couponId, code, type, value, expirationDate, minOrderAmount, isActive);
 res.status(200).json({
     success : true,
     message: "Coupon updated successfully",
     data: updatedCoupon,
    });
}catch(err){
    next(err);
}
}

// delete coupon :
export const handleDeleteCoupon = async(req, res, next) => {
try{
const couponId = req.params.couponId;
await deleteCoupon(couponId);
res.status(200).json({
    success : true,
    message: "Coupon deleted successfully",
    });
}catch(err){
    next(err);
}
}

// get all coupons :
export const GetAllCoupons = async(req, res, next) => {
    try{
   const Coupons = await allCoupons();
   res.status(201).json({
    success:true,
    data: Coupons
   });
    }catch(err){
        next(err);
    }
}

// get all coupons created by the autentificated user :
export const GetAllUserCoupons = async(req, res, next) => {
    try{
const createdBy = req.user._id;
const Coupons = await alluserCoupons(createdBy);
res.status(201).json({
    success:true,
    data: Coupons
});
    }catch(err){
        next(err);
    }
}

