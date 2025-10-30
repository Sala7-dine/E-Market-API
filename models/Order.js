import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: { type: Number, default: 1 },
        price: { type: Number, required: true },
      },
    ],
    totalPrice: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['pending', 'paid', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    coupon: { type: mongoose.Schema.Types.ObjectId, ref: 'Coupon' },
    discount: { type: Number, default: 0 },
    finalTotal: { type: Number, default: 0 },
    updatedAt: { type: Date, default: Date.now },
  },

  { timestamps: true },
);
export default mongoose.model('Order', orderSchema);
