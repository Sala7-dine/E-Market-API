import { faker } from '@faker-js/faker';
import Product from '../models/Product.js';
import User from '../models/User.js';
import logger from "../config/logger.js";

export const seedProducts = async () => {
    await Product.deleteMany({});
    
    const users = await User.find();
    if (users.length === 0) {
        console.log('Aucun utilisateur trouvé. Seedez d\'abord les users.');
        return;
    }
    
    const products = [];
    for (let i = 0; i < 10; i++) {
        const user = faker.helpers.arrayElement(users);
        products.push({
            title: faker.commerce.product(),
            description: faker.commerce.productDescription(),
            prix: faker.commerce.price({ min: 100, max: 1000 }),
            stock: faker.number.int({ min: 10, max: 500 }),
            images: [faker.image.url()],
            categories: [faker.database.mongodbObjectId()],
            createdBy: user._id
        });
    }
    
    await Product.insertMany(products);
    logger.info('Products seeded');
};