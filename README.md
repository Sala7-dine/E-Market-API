# 📊 E-MARKET API

## 📖 Contexte du Projet

L’entreprise souhaite concevoir une **plateforme e-commerce** évolutive, capable de gérer des produits, des utilisateurs et des commandes.

Avant d’aborder la logique métier complète, il faut d’abord **établir les fondations techniques du backend** :

- Un **serveur Express** fonctionnel,
- Une **connexion à la base MongoDB**,
- Et les **routes initiales** pour les produits et les utilisateurs.

Ce premier projet marque le passage vers un vrai développement **backend orienté API REST**, avec une première approche de la **persistance de données** et de la **structuration professionnelle du code** (routes, contrôleurs, modèles, middlewares).

L’objectif est de disposer d’un **serveur stable et modulaire** qui servira de base aux fonctionnalités plus avancées (CRUD complet, authentification JWT, gestion des commandes, etc.) prévues dans les briefs suivants du sprint.

---

## 🛠️ Installation et Configuration

### Prérequis
- Node.js (version 14 ou supérieure)
- MongoDB (installé localement ou via un service cloud comme MongoDB Atlas)
- Un éditeur de code (ex. : VS Code)

### Étapes d'Installation
1. **Cloner le dépôt** :
   ```
   git clone https://github.com/Sala7-dine/E-Market-API.git
   cd E-Market-API
   ```

2. **Installer les dépendances** :
   ```
   npm install
   ```

3. **Configurer les variables d'environnement** :
   Créez un fichier `.env` à la racine du projet avec les variables suivantes :
   ```
   PORT=3000
   MONGO_URI=mongodb://localhost:27017/emarketdb
   ```

4. **Lancer le serveur** :
   ```
   npm start
   ```
   Le serveur sera accessible à `http://localhost:3000`.

5. **Documentation Swagger** :
   Accédez à la documentation de l'API via `http://localhost:3000/api-docs`.

---

## 📦 Fonctionnalités Minimales

### 🛍️ Gestion des Produits (`/products`)

Les produits sont les éléments centraux de la plateforme. Chaque produit est stocké dans MongoDB avec les champs suivants :

| Champ       | Type    | Obligatoire | Description                          |
|-------------|---------|-------------|--------------------------------------|
| `title`     | String  | ✅          | Nom du produit                       |
| `description` | String | ✅          | Brève description du produit         |
| `price`     | Number  | ✅          | Prix du produit (en DH)              |
| `stock`     | Number  | ✅          | Quantité disponible                  |
| `category`  | String  | ✅          | Catégorie du produit (ex : "Électronique", "Mode") |
| `imageUrl`  | String  | ❌          | Lien de l’image du produit           |
| `createdAt` | Date    | Auto       | Date de création (gérée par Mongoose)|

#### Routes pour les Produits
| Méthode | Route             | Description                          |
|---------|-------------------|--------------------------------------|
| GET     | `/products`       | Renvoie la liste de tous les produits |
| GET     | `/products/:id`   | Renvoie les détails d’un produit spécifique |
| POST    | `/products`       | Ajoute un nouveau produit (avec validation) |
| PUT     | `/products/:id`   | Met à jour un produit existant       |
| DELETE  | `/products/:id`   | Supprime un produit                  |

**Règles et Validations** :
- Vérification des types (`price` et `stock` doivent être numériques).
- Erreurs gérées proprement (produit non trouvé, champ manquant, id invalide).
- Pas de persistance d’image réelle pour l’instant (simple URL simulée).

### 👥 Gestion des Utilisateurs (`/users`)

Les utilisateurs sont enregistrés dans la base pour simuler les comptes de la future plateforme e-commerce.

| Champ       | Type    | Obligatoire | Description                          |
|-------------|---------|-------------|--------------------------------------|
| `fullname`  | String  | ✅          | Nom complet de l’utilisateur         |
| `email`     | String  | ✅          | Email unique                         |
| `password`  | String  | ✅          | Mot de passe (non chiffré pour l’instant) |
| `role`      | String  | ❌          | Valeur par défaut : `"user"` (peut être `"admin"`) |
| `createdAt` | Date    | Auto       | Date d’inscription                   |

#### Routes pour les Utilisateurs
| Méthode | Route             | Description                          |
|---------|-------------------|--------------------------------------|
| GET     | `/users`          | Renvoie la liste des utilisateurs    |
| GET     | `/users/:id`      | Renvoie les informations d’un utilisateur spécifique |
| POST    | `/users`          | Crée un utilisateur après vérification de l’unicité de l’email |
| DELETE  | `/users/:id`      | Supprime un utilisateur (optionnel, bonus) |

**Règles et Validations** :
- Vérification que `email` n’existe pas déjà avant insertion.
- Champs obligatoires : `fullname`, `email`, `password`.
- Structure prête pour intégrer le chiffrement et l’authentification JWT dans le **brief suivant**.

--- 

- **Relation entre Produits et Catégories** : Création d'une collection `categories` séparée, avec association via `ObjectId`.

  | Champ       | Type    | Obligatoire | Description                          |
      |-------------|---------|-------------|--------------------------------------|
  | `name`      | String  | ✅          | Nom de la catégorie                  |
  | `description` | String | ❌         | Description de la catégorie          |

  Routes CRUD pour les catégories :
  | Méthode | Route             | Description                          |
  |---------|-------------------|--------------------------------------|
  | GET     | `/categories`     | Liste des catégories                 |
  | POST    | `/categories`     | Ajoute une catégorie                 |
  | PUT     | `/categories/:id` | Met à jour une catégorie             |
  | DELETE  | `/categories/:id` | Supprime une catégorie               |

- **Recherche Filtrée** : Route `GET /products/search` avec critères (catégorie, nom, prix min/max).


---

## ⚙️ Middlewares et Structure

- **Middleware `logger`** : Journalise la méthode, l’URL et la date de chaque requête.
- **Middleware `errorHandler`** : Capture et renvoie les erreurs au format JSON.
- **Middleware `notFound`** : Message JSON standard pour les routes inexistantes.

Le projet suit une architecture MVC simplifiée :
- **Modèles** : Définition des schémas Mongoose (ex. : `Product.js`, `User.js`).
- **Contrôleurs** : Logique métier (ex. : `productController.js`).
- **Routes** : Définition des endpoints (ex. : `productRoutes.js`).

---

## 🚨 Contraintes et Exigences Techniques

### Technologies Utilisées
| Technologie | Description                          |
|-------------|--------------------------------------|
| Node.js     | Runtime JavaScript                   |
| Express.js  | Framework web pour API REST          |
| MongoDB     | Base de données NoSQL                |
| Mongoose    | ODM pour MongoDB                     |
| Dotenv      | Gestion des variables d’environnement|
| Swagger     | Documentation API (OpenAPI)          |


---
