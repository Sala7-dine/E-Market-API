import mongoose from "mongoose";
const couponSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  
});
export default mongoose.model("Coupon", couponSchema);
