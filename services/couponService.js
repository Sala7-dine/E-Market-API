import Coupon from "../models/Coupon.js";

// create coupon :
export async function creatCoupon(code, type, value, expirationDate, minOrderAmount, createdBy){
  const isCouponExist = await Coupon.findOne({code});
  if (isCouponExist) {
    throw new Error("this code already exist!!");
  }

  const newCoupon = await Coupon.create({
    code,
    type,
    value,
    expirationDate,
    minOrderAmount,
    createdBy,
  });
  return newCoupon;
}

// update coupon :
export async function updateCoupon(couponId, code, type, value, expirationDate, minOrderAmount, isActive) {
  const coupon = await Coupon.findByIdAndUpdate(
    couponId, 
  {
    code,
    type,
    value,
    expirationDate,
    minOrderAmount,
    isActive,
  },
  {new: true}
);
if(!coupon){
throw new Error("coupon not found");

}
return coupon;
}


// delete Coupon :
export async function deleteCoupon(couponId) {
  const deletedCoupon = await Coupon.findByIdAndDelete(couponId);
  if(!deletedCoupon){
     throw new Error("coupon not found");
  }
  return deleteCoupon;
}


// get all coupons :
export async function allCoupons() {
  const allCoupons = await Coupon.find();

  if(allCoupons.length === 0){
    throw new Error("no coupons");
  }
  return allCoupons;
}

// get all coupons created by the autentificated user :
export async function alluserCoupons(createdBy) {
  const allCoupons = await Coupon.find({createdBy});

  if(allCoupons.length === 0){
    throw new Error("no coupons");
  }
  return allCoupons;
}
