import express from "express";
import connectDB from "./config/db.js";
import { swaggerUi, swaggerDocument } from './config/swagger.js';
import dotenv from "dotenv";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import categorieRoute from "./routes/categoryRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import loggerMiddleware from "./middlewares/logger.js";
import notFound from "./middlewares/notFound.js";
import errorHandler from "./middlewares/errorHandler.js";
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes.js';
import { authenticate } from './middlewares/authMiddleware.js';
import { requireSellerOrAdmin } from './middlewares/roleMiddleware.js';
import couponRoutes from "./routes/couponRoutes.js";
import helmet from 'helmet';
import cors from 'cors';

import cartRoutes from "./routes/cartRoutes.js"
import orderRoutes from "./routes/orderRoutes.js"
import notificationRoutes from "./routes/notificationRoutes.js"
import logger from './config/logger.js';

import {cacheMiddleware } from "./middlewares/cacheMiddleware.js";

const app = express();

dotenv.config();

const Port = process.env.PORT || 3000;
const MongoUri = process.env.MONGO_URI;

app.use(cors());
app.use(express.json());

// secure headers
app.use(helmet());
app.use(cookieParser());
app.use(loggerMiddleware);
app.use('/images', express.static('public/images'));

app.get('/', (req, res) => {
    res.redirect('/api-docs');
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, { explorer: true }));

// Routes publiques
app.use('/api/auth', authRoutes);
app.use('/api/categories', categorieRoute);

// Routes protégées par authentification
app.use('/api/users', authenticate ,userRoutes);
app.use('/api/carts', cacheMiddleware, authenticate, cartRoutes);
app.use('/api/orders', cacheMiddleware, authenticate, orderRoutes);
app.use('/api/notifications', authenticate, notificationRoutes);

// Routes pour sellers et admins (gestion des produits)
if (process.env.NODE_ENV === 'test') {
    app.use('/api/products', authenticate, productRoutes);
} else {
    app.use('/api/products', authenticate, requireSellerOrAdmin, productRoutes);
}

// Routes pour admins et sellers (gestion des coupons)
app.use('/api/coupons', cacheMiddleware, authenticate, requireSellerOrAdmin, couponRoutes);

// Routes admin uniquement
app.use('/api/admin', adminRoutes);

app.use(notFound);
app.use(errorHandler);

if (process.env.NODE_ENV !== 'test') {
    await connectDB(MongoUri);
    app.listen(Port, () => {
        logger.info(`Server successfully connected to http://localhost:${Port}`);
    });
}

export default app;