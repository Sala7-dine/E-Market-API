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
        const { title, description, prix, stock, categories } = productData;

        const missing = [];
        if (title == null || title === "") missing.push("title");
        if (description == null || description === "") missing.push("description");
        // autoriser 0
        if (prix === undefined || prix === null) missing.push("prix");
        if (stock === undefined || stock === null || stock === "") missing.push("stock");
        if (!Array.isArray(categories) || categories.length === 0) missing.push("categories");

        if (missing.length) {
            throw new Error(`Champs obligatoires manquants ou invalides: ${missing.join(", ")}`);
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

export async function searchProducts(filter){

    try {

        const skip = (filter.page - 1) * filter.limit;  // Calcul du nombre de docs à sauter

        // Exécution de la query avec count pour total (pour renvoyer les métadonnées)
        const total = await Product.countDocuments(filter);  // Total sans pagination
        const products = await Product.find(filter)
            .skip(skip)
            .limit(Number(filter.limit))
            .sort({ createdAt: -1 });

        return {
            total,
            products,
            limit : Number(filter.limit),
            page : Number(filter.page),
            totalPages: Math.ceil(total / filter.limit),
        };
    }catch (err) {
        throw new Error(err.message);
    }

}