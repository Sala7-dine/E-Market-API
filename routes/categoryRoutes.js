import express from "express";
import { CreateCategorie, GetCategories, DeleteCategorie , UpdateCategorie } from "../controllers/categorieController.js";
import { validate } from "../middlewares/validate.js";
import { createCategorieSchema, updateCategorieSchema } from "../validations/categorie.validations.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Gestion des Produit
 */


/**
 * @swagger
 * /api/categories/:
 *   get:
 *     summary: Liste tous les produits
 *     tags: [Categories]
 *     responses:
 *       201:
 *         description: Liste des produits
 */
router.get('/' , GetCategories);


/**
 * @swagger
 * /api/categories/create:
 *   post:
 *     summary: Crée un produit
 *     tags: [Categories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: {
 *                            "name": "Electronique",
 *                            "description": "tout les accessoire Electronique.",
 *                          }
 *
 *     responses:
 *       201:
 *         description: produit créé
 */
router.post('/create', validate(createCategorieSchema),  CreateCategorie);


/**
 * @swagger
 * /api/categories/update/{id}:
 *   put:
 *     summary: Met à jour un produit par son ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID du produit à mettre à jour
 *         schema:
 *           type: string
 *           format: ObjectId
 *           pattern: '^[0-9a-fA-F]{24}$'
 *           example: 68e7b5010bf901dfd66d774a
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Le nom du produit"
 *               description:
 *                 type: string
 *                 example: "La description du produit"
 *     responses:
 *       200:
 *         description: Produit mis à jour avec succès
 *       400:
 *         description: Données invalides
 *       404:
 *         description: Produit non trouvé
 */
router.put('/update/:id' , validate(updateCategorieSchema), UpdateCategorie);

/**
 * @swagger
 * /api/categories/delete/{id}:
 *   delete:
 *     summary: Supprime un produit par son ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de l'produit à supprimer
 *         schema:
 *           type: string
 *           format: ObjectId
 *           pattern: '^[0-9a-fA-F]{24}$'
 *           example: 68e7b5010bf901dfd66d774a
 *     responses:
 *       200:
 *         description: Produit supprimé avec succès
 *       404:
 *         description: Produit non trouvé
 */
router.delete('/delete/:id' , DeleteCategorie);

export default router;