import Categorie from "../models/Categorie.js";

export async function getAllCategories() {
    try {
        return await Categorie.find().where({isDelete : false});
    }catch (err) {
        throw new  Error(err.message);
    }
}

export async function createCategorie(categorieData) {

    try {
        const { name , description } = categorieData;

        if(!name || !description ) {
            throw new Error("Tous les champs obligatoires doivent être remplis.");
        }

        return await Categorie.create(categorieData);

    } catch (err) {
        throw new Error(err.message);
    }

}

export async function updateCategorie(id , categorie) {

    try {

        if(!id) {
            throw new Error("L'id et require");
        }

        return await Categorie.findByIdAndUpdate(id , categorie , { new : true });

    }catch (err) {

        throw new Error(err.message);

    }

}

export async function deleteCategorie(id) {

    try {
        // return await Categorie.findByIdAndDelete(id);
        return await Categorie.findByIdAndUpdate(id, { isDelete: true }, { new: true });

    }catch(error) {
        throw new Error(error.message)
    }

}