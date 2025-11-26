import User from '../models/User.js';
import logger from '../config/logger.js';
import bcrypt from 'bcryptjs';
import { deleteUserImageFromCloudinary } from '../middlewares/userImageUpload.js';

export async function getAllUsers(page = 1, limit = 10) {
  try {
    const skip = (page - 1) * limit;
    
    const users = await User.find({ isDelete: false })
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip(skip);
    
    const total = await User.countDocuments({ isDelete: false });
    
    logger.info(`Retrieved ${users.length} users (page ${page})`);
    
    return {
      success: true,
      data: users,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalUsers: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    };
  } catch (err) {
    logger.error(`Error getting all users: ${err.message}`);
    throw new Error(err.message);
  }
}

export async function createUser(userData) {
  try {
    const { fullName, email, password } = userData;

    if (!fullName || !email || !password) {
      throw new Error('Tous les champs obligatoires doivent être remplis.');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      ...userData,
      password: hashedPassword,
    });

    logger.info(`User created: ${email}`);
    return user;
  } catch (err) {
    logger.error(`Error creating user: ${err.message}`);
    throw new Error(err.message);
  }
}

export async function updateUser(id, user) {
  try {
    if (!id) {
      throw new Error("L'id et require");
    }

    return await User.findByIdAndUpdate(id, user, { new: true });
  } catch (err) {
    throw new Error(err.message);
  }
}

export async function deleteUser(id) {
  try {
    return await User.findByIdAndUpdate(id, { isDelete: true }, { new: true });
  } catch (error) {
    throw new Error(error.message);
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

    const { fullName, email, password, role, profileImage, cloudinaryId } = updateData;

    if (fullName) user.fullName = fullName;
    if (email) user.email = email;

    if (profileImage !== undefined) {
      // Delete old image from Cloudinary if exists
      if (user.cloudinaryId) {
        await deleteUserImageFromCloudinary(user.cloudinaryId);
      }
      user.profileImage = profileImage;
      user.cloudinaryId = cloudinaryId;
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
