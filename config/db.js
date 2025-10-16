import mongoose from "mongoose";
import logger from './logger.js';

const connectDB = async (uri) => {
    try {
        const conn = await mongoose.connect(uri);
        logger.info(`MongoDB connecté : ${conn.connection.host}`);
    } catch (error) {
        logger.error(`Erreur de connexion MongoDB : ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;
