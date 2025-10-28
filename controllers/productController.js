import {
  createProduct,
  getAllProducts,
  deleteProduct,
  updateProduct,
  searchProducts,
} from "../services/productService.js";
import mongoose from "mongoose";
import logger from "../config/logger.js";
import notificationHandler from "../events/notificationHandler.js";

export const GetProducts = async (req, res) => {
  try {
    const data = await getAllProducts();

    if (!data) {
      throw new Error("aucun data dans database");
    }

    res.status(201).json({
      success: true,
      data: data,
    });
  } catch (err) {
    throw new Error(err.message);
  }
};

export const CreateProduct = async (req, res) => {
  try {
    const productData = { ...req.body, createdBy: req.user._id };
    if (req.compressedFiles && req.compressedFiles.length > 0) {
      productData.images = req.compressedFiles.map((file) => {
        logger.info(
          `Image compressed: ${file.filename}, type: ${file.mimetype}, size: ${(file.size / 1024).toFixed(2)}KB`,
        );
        return `/images/products/${file.filename}`;
      });
    }
    const newProduct = await createProduct(productData);

    notificationHandler.emit("productCreated", {
      userId: req.user._id,
      productTitle: newProduct.title,
    });

    res.status(201).json({
      success: true,
      message: "Produit cree avec succes",
      data: newProduct,
    });
  } catch (err) {
    throw new Error(err.message);
  }
};

export const UpdateProduct = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID invalide" });
    }

    const productUpdate = { ...req.body };
    let newImagePaths = null;

    if (req.compressedFiles && req.compressedFiles.length > 0) {
      newImagePaths = req.compressedFiles.map((file) => {
        logger.info(
          `Image compressed for product ${id}: ${file.filename}, type: ${file.mimetype}, size: ${(file.size / 1024).toFixed(2)}KB`,
        );
        return `/images/products/${file.filename}`;
      });
      productUpdate.images = newImagePaths;
    }

    const updated = await updateProduct(
      id,
      productUpdate,
      req.user._id,
      req.user.role,
      newImagePaths,
    );

    return res.status(200).json({
      success: true,
      message: "Le produit a été modifié avec succès",
      data: updated,
    });
  } catch (err) {
    logger.error(`UpdateProduct error: ${err.stack || err.message}`);
    const status =
      err.message === "Non autorisé"
        ? 403
        : err.message === "Produit introuvable"
          ? 404
          : 500;
    return res.status(status).json({ success: false, message: err.message });
  }
};

export const DeleteProduct = async (req, res) => {
  try {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID invalide" });
    }

    const newProduit = await deleteProduct(id);

    res.status(201).json({
      success: true,
      data: newProduit,
    });
  } catch (err) {
    throw new Error(err.message);
  }
};

export const SearchProducts = async (req, res) => {
  try {
    const {
      title,
      description,
      categories,
      minPrice,
      maxPrice,
      page = 1,
      limit = 10,
    } = req.query;

    const filter = {};

    if (title) {
      filter.title = { $regex: title, $options: "i" };
    }

    if (description) {
      filter.description = { $regex: description, $options: "i" };
    }

    if (categories) {
      filter.categories = categories;
    }

    if (minPrice || maxPrice) {
      filter.prix = {};
      if (minPrice) filter.prix.$gte = Number(minPrice); // >= minPrice
      if (maxPrice) filter.prix.$lte = Number(maxPrice); // <= maxPrice
    }

    const products = await searchProducts(filter, page, limit);

    res.json({
      success: true,
      products,
    });
  } catch (err) {
    throw new Error(err.message);
  }
};
