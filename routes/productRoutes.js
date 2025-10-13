import express from "express";
import { CreateProduct, GetProducts, DeleteProduct , UpdateProduct , SearchProducts } from "../controllers/productController.js";
import { validate } from "../middlewares/validate.js";
import { createProductSchema, updateProductSchema } from "../validations/product.validations.js";


const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Gestion des Produit
 */


/**
 * @swagger
 * /api/products/:
 *   get:
 *     summary: Liste tous les produits
 *     tags: [Products]
 *     responses:
 *       201:
 *         description: Liste des produits
 */
router.get('/' , GetProducts);


/**
 * @swagger
 * /api/products/create:
 *   post:
 *     summary: Crée un produit
 *     tags: [Products]
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
 *                            "title": "Casque Bluetooth Sony WH-1000XM5",
 *                            "description": "Casque antibruit haut de gamme avec autonomie de 30h.",
 *                            "prix": 3599,
 *                            "stock": 12,
 *                            "categorie": "Électronique",
 *                            "imageUrl": "https://example.com/sony-xm5.jpg"
 *                          }
 *
 *     responses:
 *       201:
 *         description: produit créé
 */
router.post('/create', validate(createProductSchema),  CreateProduct);


/**
 * @swagger
 * /api/products/update/{id}:
 *   put:
 *     summary: Met à jour un produit par son ID
 *     tags: [Products]
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
 *               title:
 *                 type: string
 *                 example: "Le titre du produit"
 *               description:
 *                 type: string
 *                 example: "La description du produit"
 *               prix:
 *                 type: number
 *                 example: 324
 *               stock:
 *                 type: number
 *                 example: 500
 *               categorie:
 *                 type: string
 *                 example: "Électronique"
 *               imageUrl:
 *                 type: string
 *                 example: "https://example.com/sony-xm5.jpg"
 *     responses:
 *       200:
 *         description: Produit mis à jour avec succès
 *       400:
 *         description: Données invalides
 *       404:
 *         description: Produit non trouvé
 */
router.put('/update/:id' , validate(updateProductSchema), UpdateProduct);

/**
 * @swagger
 * /api/products/delete/{id}:
 *   delete:
 *     summary: Supprime un produit par son ID
 *     tags: [Products]
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
router.delete('/delete/:id' , DeleteProduct);


router.get('/search' , SearchProducts);

export default router;