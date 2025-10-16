import express from "express";
import connectDB from "./config/db.js";
import { swaggerUi, swaggerDocument } from './config/swagger.js';
import dotenv from "dotenv";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import categorieRoute from "./routes/categoryRoutes.js";
import  logger from "./middlewares/logger.js"
import  notFound from "./middlewares/notFound.js"
import errorHandler from "./middlewares/errorHandler.js";
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import { authenticate } from './middlewares/authMiddleware.js';
import cartRoutes from "./routes/cartRouter.js";

const app = express();

dotenv.config();

const Port = process.env.PORT || 3000;
const MongoUri = process.env.NODE_ENV === 'test'
    ? process.env.MONGO_URI_TEST
    : process.env.MONGO_URI;

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(logger);
app.use('/images', express.static('public/images'));

if (process.env.NODE_ENV !== 'test') {
    await connectDB(MongoUri);
}

app.get('/', (req, res) => {
    res.redirect('/api-docs');
});

if (process.env.NODE_ENV !== 'test') {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {explorer: true}));
}

app.use('/api/auth', authRoutes);

if (process.env.NODE_ENV === 'test') {
    app.use('/api/products', productRoutes);
} else {
    app.use('/api/products', authenticate, productRoutes);
}

app.use('/api/users' , userRoutes);
app.use('/api/carts' , authenticate,cartRoutes);

app.use('/api/categories' , categorieRoute);

app.use(notFound);
app.use(errorHandler);

export default app;

if (process.env.NODE_ENV !== 'test') {
    app.listen(Port, () => {
        console.log(`server successfully connect to http://localhost:${Port}`);
    });
}