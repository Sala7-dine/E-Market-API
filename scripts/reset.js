import dotenv from 'dotenv';

dotenv.config();
import connectDB, { mongoose } from '../config/db.js';

async function reset() {
  if (process.env.NODE_ENV === 'production') {
    console.error('Refus: ne pas exécuter reset en production !');
    process.exit(1);
  }

  try {
    await connectDB(process.env.MONGO_URI);
    const db = mongoose.connection.db;
    // méthode native pour supprimer toute la DB
    await db.dropDatabase();
    console.log('Base de données supprimée');
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

reset();
