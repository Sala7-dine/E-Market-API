import Product from "../models/Product.js";
import Category from "../models/Categorie.js";
import logger from '../config/logger.js';

export async function getAllProducts() {
    try {
        const products = await Product.find().where({isDelete : false}).populate("categories");
        logger.info(`Retrieved ${products.length} products`);
        return products;
    }catch (err) {
        logger.error(`Error getting all products: ${err.message}`);
        throw new  Error(err.message);
    }
}

export async function createProduct(productData) {
    try {
        const {title , description , prix , stock , categories} = productData;

        if(!title || !description || !prix || !stock || !categories) {
            logger.warn("Tous les champs obligatoires doivent être remplis.")
            throw new Error("Tous les champs obligatoires doivent être remplis.");
        }

        const product = await Product.create(productData);
        logger.info(`Product created: ${title}`);
        return product;

    } catch (err) {
        logger.error(`Error creating product: ${err.message}`);
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
        const product = await Product.findByIdAndUpdate(id, { isDelete: true }, { new: true });
        logger.info(`Product deleted: ${id}`);
        return product;
    }catch(error) {
        logger.error(`Error deleting product: ${error.message}`);
        throw new Error(error.message)
    }
}

export async function searchProducts(filter){

    try {
        return await Product.find(filter);
    }catch (err) {
        throw new Error(err.message);
    }

}