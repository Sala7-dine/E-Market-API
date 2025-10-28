# 🛒 E-Market API

Une API RESTful complète pour une plateforme e-commerce avec gestion des utilisateurs, produits, commandes, coupons et notifications.

## 🎯 Objectifs du Projet

- Concevoir une API RESTful sécurisée avec Node.js/Express/MongoDB
- Implémenter l'authentification JWT et la gestion des rôles
- Gérer panier, commandes, réductions et avis produits
- Upload sécurisé d'images avec compression
- Système de notifications asynchrone avec EventEmitter
- Logging avancé avec Winston
- Tests unitaires et d'intégration

## 🚀 Technologies Utilisées

- **Backend**: Node.js, Express.js
- **Base de données**: MongoDB, Mongoose
- **Authentification**: JWT, bcrypt
- **Upload & Images**: Multer, Sharp
- **Logging**: Winston, winston-daily-rotate-file, winston-mongodb
- **Email**: Nodemailer (Mailgun/Mailpit)
- **Sécurité**: Helmet, CORS, express-rate-limit
- **Validation**: Yup
- **Tests**: Mocha, Chai, Supertest
- **Documentation**: Swagger/OpenAPI

## 📦 Installation

```bash
# Cloner le dépôt
git clone https://github.com/Sala7-dine/E-Market-API.git
cd E-Market-API

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env
# Éditer .env avec vos configurations

# Lancer le serveur
npm start

# Mode développement
npm run dev
```

## 🔧 Configuration

Créer un fichier `.env` à la racine :

```env
PORT=3000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/Market
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
ACCESS_TOKEN_EXP=15m
REFRESH_TOKEN_EXP=30d
NODE_ENV=development

# Email
EMAIL_FROM=noreply@emarket.com
MAILGUN_SMTP_HOST=smtp.mailgun.org
MAILGUN_SMTP_USER=your_user
MAILGUN_SMTP_PASS=your_pass
```

## 📚 Documentation API

Accéder à la documentation Swagger : `http://localhost:3000/api-docs`

## 🏗️ Architecture

```
E-Market-API/
├── config/          # Configuration (DB, logger, mailer, swagger)
├── controllers/     # Logique des routes
├── events/          # EventEmitter pour notifications
├── middlewares/     # Auth, validation, logging, cache, compression
├── models/          # Schémas Mongoose
├── routes/          # Définition des endpoints
├── services/        # Logique métier
├── validations/     # Schémas de validation Yup
├── public/          # Images et logs
└── test/            # Tests unitaires et d'intégration
```

## 🔐 Fonctionnalités

### 1️⃣ Gestion des Utilisateurs

- Inscription et connexion avec JWT
- Profil utilisateur avec photo
- Rôles : `user`, `seller`, `admin`
- Routes : `/api/auth/*`, `/api/users/*`

### 2️⃣ Gestion des Produits

- CRUD complet pour les produits
- Upload multiple d'images (compression avec Sharp)
- Recherche et filtrage
- Avis et notes
- Routes : `/api/products/*`

### 3️⃣ Panier et Commandes

- Gestion du panier utilisateur
- Création et suivi de commandes
- Statuts : pending, paid, shipped, delivered, cancelled
- Routes : `/api/cart/*`, `/api/orders/*`

### 4️⃣ Système de Coupons

- Création et gestion de coupons
- Réduction en pourcentage ou montant fixe
- Validation et application
- Routes : `/api/coupons/*`

### 5️⃣ Avis Produits

- Notation et commentaires
- Un avis par utilisateur par produit
- Routes : `/api/products/:id/reviews`

### 6️⃣ Notifications

- Système asynchrone avec EventEmitter
- Notifications email (Mailgun/Mailpit)
- Événements : productCreated, orderCreated, orderUpdated
- Routes : `/api/notifications/*`

### 7️⃣ Sécurité

- JWT avec refresh tokens
- Helmet pour headers sécurisés
- CORS configuré
- Validation des données
- Gestion globale des erreurs

### 8️⃣ Logging

- Winston avec rotation quotidienne
- Logs : requêtes, erreurs, exceptions, rejections
- Stockage MongoDB pour erreurs
- Fichiers : `public/logs-*.log`

## 🧪 Tests

```bash
# Lancer les tests
npm test

# Avec couverture
npm run test:coverage
```

## 📊 Scripts Disponibles

```bash
npm start          # Démarrer le serveur
npm run dev        # Mode développement avec hot reload
npm test           # Lancer les tests
npm run seed       # Générer des données de test
npm run reset-db   # Réinitialiser la base
```

## 🔑 Endpoints Principaux

### Authentification

- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `POST /api/auth/refresh` - Renouveler le token
- `POST /api/auth/logout` - Déconnexion

### Utilisateurs

- `GET /api/users/me` - Profil utilisateur
- `PATCH /api/users/me` - Modifier profil (avec avatar)

### Produits

- `GET /api/products` - Liste des produits
- `POST /api/products/create` - Créer un produit (multipart/form-data)
- `PUT /api/products/update/:id` - Modifier un produit
- `DELETE /api/products/delete/:id` - Supprimer un produit
- `GET /api/products/search` - Rechercher des produits
- `POST /api/products/:id/reviews` - Ajouter un avis
- `GET /api/products/:id/reviews` - Voir les avis

### Panier

- `POST /api/cart/addtocart` - Ajouter au panier
- `GET /api/cart/getcarts` - Voir le panier
- `PUT /api/cart/updateCart/:id` - Modifier le panier
- `DELETE /api/cart/deleteProduct/:id` - Retirer du panier

### Commandes

- `POST /api/orders/addOrder/:cartId` - Créer une commande
- `GET /api/orders/getOrder` - Voir ses commandes
- `PUT /api/orders/updateStatus/:id` - Modifier le statut

### Notifications

- `GET /api/notifications` - Liste des notifications
- `PATCH /api/notifications/:id/read` - Marquer comme lu

## 🐳 Docker

```bash
# Copier l'exemple
cp docker-compose.example.yml docker-compose.yml

# Éditer avec vos configurations
nano docker-compose.yml

# Lancer
docker-compose up -d
```

## 📝 Améliorations Futures

- [ ] Versioning API (/api/v1, /api/v2)
- [ ] Cache Redis
- [ ] Paiement réel (Stripe)
- [ ] WebSocket pour notifications temps réel
- [ ] Elasticsearch pour recherche avancée
- [ ] CI/CD avec GitHub Actions

## 👥 Équipe

Projet réalisé en squad dans le cadre de la formation YouCode.

## 📄 Licence

GPL-3.0 License

## 🔗 Liens Utiles

- [Documentation Swagger](http://localhost:3000/api-docs)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Mailpit (Dev)](http://localhost:8025)
