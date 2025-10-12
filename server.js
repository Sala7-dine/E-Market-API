import express from "express";
import connectDB from "./config/db.js";
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import dotenv from "dotenv";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import categorieRoute from "./routes/categoryRoutes.js";
import  logger from "./middlewares/logger.js"
import  notFound from "./middlewares/notFound.js"
import errorHandler from "./middlewares/errorHandler.js";

const app = express();

dotenv.config();

const Port = process.env.PORT || 3000;
const MongoUri = process.env.MONGO_URI;

app.use(express.json());

app.use(logger);

await connectDB(MongoUri);


const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Utilisateurs - Swagger',
            version: '1.0.0',
            description: 'Une API simple avec Swagger et Express.js',
        },
        servers: [
            {
                url: 'http://localhost:3000',
            },
        ],
    },
    apis: ['./routes/*.js'], // chemin vers les commentaires d’API
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec , {explorer : true}) );


app.use('/api/products' , productRoutes);

app.use('/api/users' , userRoutes);

app.use('/api/categorie' , categorieRoute);


app.use(notFound);
app.use(errorHandler);

app.listen(Port , () => {
    console.log(" server successfully connect to http://localhost:3000");
});
