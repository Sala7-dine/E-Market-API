import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import Coupon from "../models/Coupon.js";

// add order :
export async function addOrder(userId, cartId, couponCode = null) {
  const cart = await Cart.findOne({ _id: cartId });
  if (!cart) {
    throw new Error("no cart exist!!!");
  }
  let discount = 0;
  let finalTotal = cart.totalPrice;
  let coupon = null;

  // check if the user provided the coupon code :
  if (couponCode) {
    coupon = await Coupon.findOne({ code: couponCode, isActive: true });
    // check if the coupon code exist :
    if (!coupon) {
      throw new Error("Invalid coupon");
    }

    // check the expirate date of the coupon :
    if (new Date() > Date(coupon.expirationDate)) {
      throw new Error("Coupon expired");
    }

    // Ensure order meets coupon minimum :
    if (cart.totalPrice < coupon.minOrderAmount) {
      throw new Error(
        `Minimum order amount for this coupon is ${coupon.minOrderAmount}`
      );
    }
    // check the coupon 's type :
    if (coupon.type === "percentage") {
      discount = (cart.totalPrice * coupon.value) / 100;
    } else if (coupon.type === "fixed") {
      discount = coupon.value;
    }
  }

  finalTotal = cart.totalPrice - discount;

  // Ensure the finalTotal isn't a negative number :
  if (finalTotal < 0) finalTotal = 0;
  const newOrder = await Order.create({
    userId,
    items: cart.items,
    totalPrice: cart.totalPrice,
    coupon: coupon ? coupon._id : null,
    discount,
    finalTotal,
  });

  await Cart.findOneAndDelete({ _id: cartId });
  return newOrder;
}

// get user's orders :
export async function getOrder(userId) {
  const order = await Order.find({ userId });
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
