import Categorie from '../models/Categorie.js';
import logger from '../config/logger.js';

export const createCategorie = async (data) => {
  try {
    const categorie = await Categorie.create(data);
    logger.info(`Category created: ${data.name}`);
    return categorie;
  } catch (err) {
    logger.error(`Error creating category: ${err.message}`);
    throw err;
  }
};

export const getAllCategories = async () => {
  try {
    const categories = await Categorie.find();
    logger.info(`Retrieved ${categories.length} categories`);
    return categories;
  } catch (err) {
    logger.error(`Error getting categories: ${err.message}`);
    throw err;
  }
};

export const getCategorieById = async (id) => {
  return await Categorie.findById(id);
};

export const updateCategorie = async (id, data) => {
  return await Categorie.findByIdAndUpdate(id, data, { new: true });
};

export const deleteCategorie = async (id) => {
  try {
    const categorie = await Categorie.findByIdAndDelete(id);
    logger.info(`Category deleted: ${id}`);
    return categorie;
  } catch (err) {
    logger.error(`Error deleting category: ${err.message}`);
    throw err;
  }
};