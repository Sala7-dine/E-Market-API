import express from "express";
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import { validate } from "../middlewares/validate.js";
import { createUserSchema, updateUserSchema } from "../validations/user.validation.js";

import { CreateUser, GetUsers, DeleteUser , UpdateUser } from "../controllers/userController.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Utilisateurs
 *   description: Gestion des utilisateurs
 */


/**
 * @swagger
 * /api/users/:
 *   get:
 *     summary: Liste tous les utilisateurs
 *     tags: [Utilisateurs]
 *     responses:
 *       201:
 *         description: Liste des utilisateurs
 */
router.get('/' , GetUsers);

/**
 * @swagger
 * /api/users/create:
 *   post:
 *     summary: Crée un utilisateur
 *     tags: [Utilisateurs]
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
 *                                  "fullName" : "adil",
 *                                "email" : "adilAit@gmail.com",
 *                                "password" : "salah1234"
 *                             }
 *     responses:
 *       201:
 *         description: Utilisateur créé
 */
router.post('/create', validate(createUserSchema) ,CreateUser);



/**
 * @swagger
 * /api/users/update/{id}:
 *   put:
 *     summary: Met à jour un utilisateur par son ID
 *     tags: [Utilisateurs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de l'utilisateur à mettre à jour
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
 *               fulLName:
 *                 type: string
 *                 example: "Nouveau nom"
 *               email:
 *                 type: string
 *                 example: "nouveau@example.com"
 *               password:
 *                 type: string
 *                 exemple: ........
 *
 *     responses:
 *       200:
 *         description: Utilisateur mis à jour avec succès
 *       400:
 *         description: Données invalides
 *       404:
 *         description: Utilisateur non trouvé
 */
router.put('/update/:id', validate(updateUserSchema) , UpdateUser);


/**
 * @swagger
 * /api/users/delete/{id}:
 *   delete:
 *     summary: Supprime un utilisateur par son ID
 *     tags: [Utilisateurs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de l'utilisateur à supprimer
 *         schema:
 *           type: string
 *           format: ObjectId
 *           pattern: '^[0-9a-fA-F]{24}$'
 *           example: 68e7b5010bf901dfd66d774a
 *     responses:
 *       200:
 *         description: Utilisateur supprimé avec succès
 *       404:
 *         description: Utilisateur non trouvé
 */
router.delete('/delete/:id' , DeleteUser);




export default router;