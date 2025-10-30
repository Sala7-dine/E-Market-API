import { faker } from '@faker-js/faker';
import Cart from '../models/Cart.js';
import User from '../models/User.js';
import Product from '../models/Product.js';
import logger from '../config/logger.js';

export const seedCarts = async () => {
  await Cart.deleteMany({});

  const users = await User.find();
  const products = await Product.find();

  if (users.length === 0 || products.length === 0) {
    logger.info(
      "Aucun utilisateur ou produit trouvé. Seedez d'abord les users et products.",
    );
    return;
  }

  const carts = [];
  for (let i = 0; i < 5; i++) {
    const user = faker.helpers.arrayElement(users);
    const cartItems = [];
    let totalPrice = 0;

    const itemCount = faker.number.int({ min: 1, max: 4 });
    for (let j = 0; j < itemCount; j++) {
      const product = faker.helpers.arrayElement(products);
      const quantity = faker.number.int({ min: 1, max: 3 });
      const price = parseFloat(product.prix);

      cartItems.push({
        productId: product._id,
        quantity,
        price,
      });
      totalPrice += price * quantity;
    }

    carts.push({
      userId: user._id,
      items: cartItems,
      totalPrice,
    });
  }

  await Cart.insertMany(carts);
  logger.info('Carts seeded');
};
