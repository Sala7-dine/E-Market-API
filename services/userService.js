import User from "../models/User.js";

export async function getAllUsers() {
    try {
        return await User.find().where({isDelete : false});
    }catch (err) {
        throw new  Error(err.message);
    }
}

export async function createUser(userData) {

    try {
        const {fullName , email , password} = userData;

        if(!fullName || !email || !password) {
            throw new Error("Tous les champs obligatoires doivent être remplis.");
        }

        return await User.create(userData);

    } catch (err) {
        throw new Error(err.message);
    }

}

export async function updateUser(id , user) {

    try {

        if(!id) {
            throw new Error("L'id et require");
        }

        return await User.findByIdAndUpdate(id , user , { new : true});

    }catch (err) {

        throw new Error(err.message);

    }

}

export async function deleteUser(id) {

    try {
        return await User.findByIdAndUpdate(id, { isDelete: true }, { new: true });
    }catch(error) {
        throw new Error(error.message)
    }

}

export async function getCurrentUser(userId) {
    try {
        const user = await User.findById(userId).select('-password');
        if (!user || user.isDelete) {
            throw new Error('Utilisateur non trouvé');
        }
        return user;
    } catch (err) {
        throw new Error(err.message);
    }
}
