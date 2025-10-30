import {
  createCategorie,
  getAllCategories,
  deleteCategorie,
  updateCategorie,
} from '../services/categorieService.js';
import mongoose from 'mongoose';

export const GetCategories = async (req, res) => {
  try {
    const data = await getAllCategories();

    if (!data) {
      throw new Error('aucun data dans database');
    }

    res.status(200).json(data);
  } catch (err) {
    throw new Error(err.message);
  }
};

export const CreateCategorie = async (req, res) => {
  try {
    const categorieData = req.body;
    const newCategorie = await createCategorie(categorieData);

    res.status(201).json(newCategorie);
  } catch (err) {
    throw new Error(err.message);
  }
};

export const UpdateCategorie = async (req, res) => {
  try {
    const id = req.params.id;
    const categorie = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'ID invalide' });
    }

    const data = await updateCategorie(id, categorie);

    res.status(200).json({
      message: 'categorie updated',
      data: data,
    });
  } catch (err) {
    throw new Error(err.message);
  }
};

export const DeleteCategorie = async (req, res) => {
  try {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'ID invalide' });
    }

    const newCategorie = await deleteCategorie(id);

    res
      .status(200)
      .json({ message: 'Categorie supprimée', data: newCategorie });
  } catch (err) {
    throw new Error(err.message);
  }
};
