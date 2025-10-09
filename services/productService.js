import Product from "../models/Product.js";

export async function getAllProducts() {
    try {
        return await Product.find().where({isDelete : false});
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