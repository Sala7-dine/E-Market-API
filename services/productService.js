import Product from "../models/Product.js";
import Category from "../models/Categorie.js";

export async function getAllProducts() {
    try {
        return await Product.find().where({isDelete : false}).populate("categories");
    }catch (err) {
        throw new  Error(err.message);
    }
}

export async function createProduct(productData) {

    try {
        const {title , description , prix , stock , categories} = productData;

        if(!title || !description || !prix || !stock || !categories) {
            throw new Error("Tous les champs obligatoires doivent être remplis.");
        }

        return await Product.create(productData);

    } catch (err) {
        throw new Error(err.message);
    }

}

export async function updateProduct(id , product) {

    try {

        if(!id) {
            throw new Error("L'id et require");
        }

        return await Product.findByIdAndUpdate(id , product , { new : true });

    }catch (err) {

        throw new Error(err.message);

    }

}

export async function deleteProduct(id) {

    try {
        // return await Product.findByIdAndDelete(id);

        return await Product.findByIdAndUpdate(id, { isDelete: true }, { new: true });
     
    }catch(error) {
        throw new Error(error.message)
    }

}

export async function searchProducts(filter , page , limit){

    try {

        const skip = (page - 1) * limit;  // Calcul du nombre de docs à sauter

        // Exécution de la query avec count pour total (pour renvoyer les métadonnées)
        const total = await Product.countDocuments(filter);  // Total sans pagination
        const products = await Product.find(filter)
            .skip(skip)
            .limit(Number(limit))
            .sort({ createdAt: -1 });

        return {
            total,
            products : products,
            limit : Number(limit),
            page : Number(page),
            totalPages: Math.ceil(total / limit),
        };
    }catch (err) {
        throw new Error(err.message);
    }

}