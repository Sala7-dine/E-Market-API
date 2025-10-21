import { faker } from '@faker-js/faker';
import User from '../models/User.js';
import logger from "../config/logger.js";

export const seedUsers = async () => {
    await User.deleteMany({});
    
    const users = [];
    for (let i = 0; i < 10; i++) {
        users.push({
            fullName: faker.person.fullName(),
            email: faker.internet.email(),
            password: faker.internet.password({ length: 20 }),
            role: i === 0 ? 'admin' : 'user'
        });
    }
    
    await User.insertMany(users);
    logger.info('Users seeded');
};