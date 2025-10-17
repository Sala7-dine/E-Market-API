import Order from "../models/Order";
import Cart from "../models/Cart";
import Product from "../models/Product";

// add order :
export async function addOrder(userId, cartId) {
  const cart = await Cart.findOne({ _id: cartId });
  if (!cart) {
    throw new Error("no cart exist!!!");
  }

  const newOrder = await Order.create({
    userId,
    items: cart.items,
    totalPrice: cart.totalPrice,
  });

  await Cart.findOneAndDelete({ _id: cartId });
  return newOrder;
}

// get user's orders :
export async function getOrder(userId) {
  const order = await Order.findOne({ userId });
  if (!order) {
    throw new Error("no order");
  }

  return order;
}

// update order's status :
export async function updateStatus(orderId, status) {
  const order = await Order.findById(orderId);
  if (!order) {
    throw new Error("no order");
  }
  const orderedProducts = order.items;
  
    // Paiement Simulation :
  if (status === "paid") {
      for (const item of orderedProducts) {
      const product = await Product.findById(item.productId);
      if (!product) {
        throw new Error("no product");
      }
      product.stock -= item.quantity;
      await product.save();
    }
  }
  order.status = status;
  return await order.save();
}
