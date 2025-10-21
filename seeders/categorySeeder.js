import { faker } from '@faker-js/faker';
import Categorie from '../models/Categorie.js';
import logger from "../config/logger.js";

export const seedCategories = async () => {
    await Categorie.deleteMany({});
    
    const categories = [];
    const usedNames = new Set();
    
    for (let i = 0; i < 10; i++) {
        let name;
        do {
            name = faker.commerce.department();
        } while (usedNames.has(name));
        
        usedNames.add(name);
        categories.push({
            name,
            description: faker.lorem.lines({ min: 1, max: 3 })
        });
    }
    
    await Categorie.insertMany(categories);
    logger.info('Categories seeded');
};