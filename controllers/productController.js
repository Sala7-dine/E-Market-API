import { createProduct , getAllProducts ,  deleteProduct , updateProduct , searchProducts} from "../services/productService.js";
import mongoose from "mongoose";

export const GetProducts = async (req , res) => {

    try {

        const data = await getAllProducts();

        if(!data) {
            throw new Error('aucun data dans database');
        }

        res.status(201).json({
            success : true,
            data : data
        });

    }catch (err) {
        throw new Error(err.message);
    }

}


export const CreateProduct = async (req , res , next) => {

        console.log("chi l3ba : " ,  req.body);

    try{
        const productData = req.body;

        const newProduct = await createProduct(productData);

        res.status(201).json({
            success : true,
            message : "Produit cree avec succes",
            data : newProduct
        });

    }catch(err){
        throw new Error(err.message);
    }

}


export const UpdateProduct = async (req , res) => {

    try {

        const id = req.params.id;
        const product = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "ID invalide" });
        }

        const data = await updateProduct(id , product);

        res.status(201).json({
            success : true,
            message : "le produit modifier avec succee",
            data : data
        });


    }catch (err){
        throw new Error(err.message);
    }

}

export const DeleteProduct = async (req , res) => {

    try {
        const id = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "ID invalide" });
        }

        const newProduit = await deleteProduct(id);

        res.status(201).json({
            success : true,
            data : newProduit
        });

    }catch(err){
        throw new Error(err.message);
    }

}

export const SearchProducts = async (req , res) => {

    try {

        const { title, description , categories , minPrice, maxPrice , page = 1 , limit = 10 } = req.query;

        const filter = {};

        if (title) {
            filter.title = { $regex: title, $options: "i" };
        }

        if (description) {
            filter.description = { $regex: description , $options: "i" } ;
        }

        if (categories) {
            filter.categories = categories;
        }

        if (minPrice || maxPrice) {
            filter.prix = {};
            if (minPrice) filter.prix.$gte = Number(minPrice); // >= minPrice
            if (maxPrice) filter.prix.$lte = Number(maxPrice); // <= maxPrice
        }

        const products = await searchProducts(filter , page , limit);

        res.json({
            success: true,
            products
        });


    }catch (err) {
        throw new Error(err.message);
    }


}
