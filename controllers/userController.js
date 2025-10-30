import {
  createUser,
  getAllUsers,
  deleteUser,
  updateUser,
  getCurrentUser,
  UpdateProfile as UpdateProfileService,
} from '../services/userService.js';
import mongoose from 'mongoose';

export const GetUsers = async (req, res) => {
  try {
    const data = await getAllUsers();

    if (!data) {
      throw new Error('aucun data dans database');
    }

    res.status(200).json(data);
  } catch (err) {
    throw new Error(err.message);
  }
};

export const CreateUser = async (req, res) => {
  try {
    const userData = req.body;
    const newUser = await createUser(userData);
    const { password, ...userWithoutPassword } = newUser.toObject();

    res.status(201).json(userWithoutPassword);
  } catch (err) {
    throw new Error(err.message);
  }
};

export const UpdateUser = async (req, res) => {
  try {
    const id = req.params.id;
    const user = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'ID invalide' });
    }

    const data = await updateUser(id, user);

    res.status(200).json(data);
  } catch (err) {
    throw new Error(err.message);
  }
};

export const DeleteUser = async (req, res) => {
  try {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'ID invalide' });
    }

    const newProduit = await deleteUser(id);

    res.status(200).json({ message: 'Utilisateur supprimé', data: newProduit });
  } catch (err) {
    throw new Error(err.message);
  }
};

export const GetCurrentUser = async (req, res) => {
  try {
    const user = await getCurrentUser(req.user._id);
    res.json(user);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

export const UpdateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const userRole = req.user.role;
    const updateData = { ...req.body };

    if (req.file) {
      updateData.profileImage = `/images/users/${req.file.filename}`;
    }
    const updatedUser = await UpdateProfileService(
      userId,
      updateData,
      userRole,
    );
    const { password, ...userWithoutPassword } = updatedUser.toObject();
    res.json({ message: 'Profil mis à jour', user: userWithoutPassword });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
