import { faker } from '@faker-js/faker';
import Order from '../models/Order.js';
import User from '../models/User.js';
import Product from '../models/Product.js';
import logger from "../config/logger.js";

export const seedOrders = async () => {
    await Order.deleteMany({});
    
    const users = await User.find();
    const products = await Product.find();
    
    if (users.length === 0 || products.length === 0) {
        logger.info('Aucun utilisateur ou produit trouvé. Seedez d\'abord les users et products.');
        return;
    }
    
    const orders = [];
    const statuses = ['pending', 'paid', 'shipped', 'delivered', 'cancelled'];
    
    for (let i = 0; i < 8; i++) {
        const user = faker.helpers.arrayElement(users);
        const orderItems = [];
        let totalPrice = 0;
        
        const itemCount = faker.number.int({ min: 1, max: 3 });
        for (let j = 0; j < itemCount; j++) {
            const product = faker.helpers.arrayElement(products);
            const quantity = faker.number.int({ min: 1, max: 2 });
            const price = parseFloat(product.prix);
            
            orderItems.push({
                productId: product._id,
                quantity,
                price
            });
            totalPrice += price * quantity;
        }
        
        orders.push({
            userId: user._id,
            items: orderItems,
            totalPrice,
            status: faker.helpers.arrayElement(statuses)
        });
    }
    
    await Order.insertMany(orders);
    logger.info('Orders seeded');
};