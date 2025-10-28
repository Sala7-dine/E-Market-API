import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "le titre du produit est obligatoire"],
    },
    description: {
      type: String,
      required: [true, "le description de produit est obligatoire"],
    },
    prix: {
      type: Number,
      required: [true, "le prix et obligatoire"],
      min: [0, "le prix ne peut pas etre negatif"],
    },
    stock: {
      type: Number,
      required: [true, "Le stock est obligatoire"],
      min: [0, "Le stock ne peut pas être négatif"],
    },
    images: {
      type: [String],
      default: [],
    },
    isDelete: {
      type: Boolean,
      default: false,
    },

    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Categorie",
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reviews: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        rating: {
          type: Number,
          required: true,
          min: 1,
          max: 5,
        },
        comment: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    averageRating: {
      type: Number,
      default: 0,
    },
  },

  { timestamps: true },
);

export default mongoose.model("Product", productSchema);
