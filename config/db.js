import mongoose from "mongoose";

const connectDB = async (uri) => {
    try {

        const conn = await mongoose.connect(uri);

        console.log(`MongoDB connecté : ${conn.connection.host}`);
    } catch (error) {
        console.error(`Erreur de connexion MongoDB : ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;
