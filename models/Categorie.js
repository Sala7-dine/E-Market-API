import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: String,
    isDelete: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

categorySchema.virtual('products', {
  ref: 'Product',
  localField: '_id',
  foreignField: 'categories',
});

export default mongoose.model('Categorie', categorySchema);
