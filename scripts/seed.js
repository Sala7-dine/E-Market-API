import dotenv from "dotenv";
dotenv.config();

import connectDB , { mongoose } from '../config/db.js';
import User from '../models/User.js';
import Product from '../models/Product.js';
import { faker } from '@faker-js/faker';
import Categorie from "../models/Categorie.js";


async function seed() {
    try {
        const conn = await connectDB(process.env.MONGO_URI);
        console.log('Connecté à MongoDB');

        await User.deleteMany({});
        await Product.deleteMany({});
        console.log('Users $ Products $ Categories supprimés');

        const users = [];
        const products = [];
        const categories = [];

        for (let i = 0; i < 10; i++) {
            users.push({
                fullName: faker.person.fullName(),
                email: faker.internet.email(),
                password: faker.internet.password({ length: 20 }),
                role: i === 0 ? 'admin' : 'user'
            });

            products.push({
                    title: faker.commerce.product(),
                    description: faker.commerce.productDescription(),
                    prix: faker.commerce.price({ min: 100, max: 1000 }),
                    stock: faker.number.int({ min: 10, max: 500 }),
                    imageUrl: faker.image.url(),
                    categories : [
                        "68e8080a186e0c45a07b0574"
                    ]
                });

            categories.push({
                name : faker.commerce.product(),
                description : faker.lorem.lines({ min: 1, max: 3 })
            });
        }

        await User.insertMany(users);
        await Product.insertMany(products);
        await Categorie.insertMany(categories);
        console.log('Seeds insérés');

        await mongoose.disconnect();
        console.log('Déconnecté');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

seed();
