import Product from "../models/Product.js";
import Category from "../models/Categorie.js";
import logger from '../config/logger.js';
import fs from 'fs/promises';
import path from 'path';

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

export async function updateProduct(id, productUpdate, userId, userRole, newImagePaths) {
    try {
        if (!id) {
            throw new Error("L'id est requis");
        }

        const existingProduct = await Product.findById(id);
        if (!existingProduct) {
            throw new Error("Produit introuvable");
        }

        if (existingProduct.createdBy.toString() !== userId.toString() && userRole !== 'admin') {
            throw new Error("Non autorisé");
        }

        const updated = await Product.findByIdAndUpdate(id, productUpdate, { new: true });

        if (newImagePaths && existingProduct.images && existingProduct.images.length > 0) {
            const removePromises = existingProduct.images.map(async (imagePath) => {
                try {
                    const fullPath = path.join(process.cwd(), 'public', imagePath.replace(/^\//, ''));
                    await fs.unlink(fullPath);
                    logger.info(`Deleted old image: ${imagePath}`);
                } catch (err) {
                    logger.warn(`Failed to delete old image ${imagePath}: ${err.message}`);
                }
            });
            await Promise.all(removePromises);
        }

        return updated;
    } catch (err) {
        logger.error(`Error updating product: ${err.message}`);
        throw err;
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