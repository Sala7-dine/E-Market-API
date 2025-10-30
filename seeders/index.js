import dotenv from "dotenv";
dotenv.config();

import connectDB from "../config/db.js";
import mongoose from "mongoose";
import { seedUsers } from "./userSeeder.js";
import { seedCategories } from "./categorySeeder.js";
import { seedProducts } from "./productSeeder.js";
import { seedCarts } from "./cartSeeder.js";
import { seedOrders } from "./orderSeeder.js";
import logger from "../config/logger.js";

const args = process.argv.slice(2);
const seedType = args.find((arg) => arg.startsWith("--")) || "--all";

async function runSeeders() {
  try {
    const mongoUri =
      process.env.MONGO_URI || "mongodb://localhost:27017/Market";
    console.log("Using MONGO_URI:", mongoUri);
    await connectDB(mongoUri);
    logger.info("Connecté à MongoDB");

    switch (seedType) {
      case "--users":
        await seedUsers();
        logger.info("Users seedés avec succès");
        break;
      case "--categories":
        await seedCategories();
        logger.info("Categories seedées avec succès");
        break;
      case "--products":
        await seedProducts();
        logger.info("Products seedés avec succès");
        break;
      case "--carts":
        await seedCarts();
        logger.info("Carts seedés avec succès");
        break;
      case "--orders":
        await seedOrders();
        logger.info("Orders seedés avec succès");
        break;
      case "--all":
      default:
        await seedUsers();
        await seedCategories();
        await seedProducts();
        await seedCarts();
        await seedOrders();
        logger.info("Tous les seeders exécutés avec succès");
        break;
    }

    await mongoose.disconnect();
    logger.info("Déconnecté");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

runSeeders();
