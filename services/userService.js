import User from "../models/User.js";
import fs from "fs";
import logger from '../config/logger.js';

export async function getAllUsers() {
    try {
        const users = await User.find().where({isDelete : false});
        logger.info(`Retrieved ${users.length} users`);
        return users;
    }catch (err) {
        logger.error(`Error getting all users: ${err.message}`);
        throw new  Error(err.message);
    }
}

export async function createUser(userData) {
    try {
        const {fullName , email , password} = userData;

        if(!fullName || !email || !password) {
            throw new Error("Tous les champs obligatoires doivent être remplis.");
        }

        const user = await User.create(userData);
        logger.info(`User created: ${email}`);
        return user;

    } catch (err) {
        logger.error(`Error creating user: ${err.message}`);
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

// gets the current user by ID
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

// updates the current user's profile information
export async function UpdateProfile(userId, updateData, userRole) {
    try {
        const user = await User.findById(userId);
        if (!user || user.isDelete) {
            throw new Error('Utilisateur non trouvé');
        }

        const { fullName, email, password, role, profileImage } = updateData;

        if (fullName) user.fullName = fullName;
        if (email) user.email = email;
        
        if (profileImage !== undefined) {
            const previousImage = user.profileImage;
            if (previousImage) {
                const imagePath = `public${previousImage}`;
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                    logger.info(`Deleted old profile image: ${previousImage}`);
                }
            }
            user.profileImage = profileImage;
        }
        
        if (password) {
            await user.setPassword(password);
        }

        if (role && userRole !== 'admin') {
            throw new Error('Seul un admin peut modifier le rôle');
        }

        await user.save();
        logger.info(`Profile updated for user: ${userId}`);
        return user;
    } catch (err) {
        logger.error(`Error updating profile: ${err.message}`);
        throw err;
    }
}
