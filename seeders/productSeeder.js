import { faker } from '@faker-js/faker';
import Product from '../models/Product.js';
import logger from "../config/logger.js";

export const seedProducts = async () => {
    await Product.deleteMany({});
    
    const products = [];
    for (let i = 0; i < 10; i++) {
        products.push({
            title: faker.commerce.product(),
            description: faker.commerce.productDescription(),
            prix: faker.commerce.price({ min: 100, max: 1000 }),
            stock: faker.number.int({ min: 10, max: 500 }),
            imageUrl: faker.image.url(),
            categories: [faker.database.mongodbObjectId()],
            createdAt: faker.date.past()
        });
    }
    
    await Product.insertMany(products);
    logger.info('Products seeded');
};