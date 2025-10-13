import Categorie from '../models/Categorie.js';

export const createCategorie = async (data) => {
  return await Categorie.create(data);
};

export const getAllCategories = async () => {
  return await Categorie.find();
};

export const getCategorieById = async (id) => {
  return await Categorie.findById(id);
};

export const updateCategorie = async (id, data) => {
  return await Categorie.findByIdAndUpdate(id, data, { new: true });
};

export const deleteCategorie = async (id) => {
  return await Categorie.findByIdAndDelete(id);
};