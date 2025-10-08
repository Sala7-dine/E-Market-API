import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        title : {
            type : String,
            required : [true  ,"le titre du produit est obligatoire"]
        },
        description : {
            type : String,
            required : [true , "le description de produit est obligatoire"]
        },
        prix : {
            type : Number,
            required : [true , "le prix et obligatoire"],
            min : [0 , "le prix ne peut pas etre negatif"]
        },
        stock: {
            type: Number,
            required: [true, "Le stock est obligatoire"],
            min: [0, "Le stock ne peut pas être négatif"],
        },
        categorie: {
            type: String,
            required: [true, "La catégorie est obligatoire"],
        },
        imageUrl: {
            type: String,
            default: "",
        },
    },

    { timestamps: true }

    );


export default mongoose.model('Product' , productSchema);