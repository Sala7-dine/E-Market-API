import Product from "../models/Product.js";

export async function getAllProducts() {
    try {
        return await Product.find();
    }catch (err) {
        throw new  Error(err.message);
    }

}

export async function createProduct(productData) {

    try {
        const {title , description , prix , stock , categorie} = productData;

        if(!title || !description || !prix || !stock || !categorie) {
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

        const { title , description , prix , stock , categorie } = product;

        if(!title || !description || !prix || !stock || !categorie) {
            throw new Error("Tous les champs obligatoires doivent être remplis.");
        }

        return await Product.findByIdAndUpdate(id , product);

    }catch (err) {

        throw new Error(err.message);

    }

}

export async function deleteProduct(id) {

    try {
        return await Product.findByIdAndDelete(id);
    }catch(error) {
        throw new Error(error.message)
    }

}