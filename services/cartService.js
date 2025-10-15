import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

// get all carts :
export async function getCarts(userId) {
  const allCart = await Cart.find({userId});
console.log(JSON.stringify(allCart, null, 2));
  if (allCart.length === 0) {
    throw new Error("no carts.");
  }
  return allCart;
}

// add product to cart :
export async function addToCart(userId, productId, quantity = 1) {
  const product = await Product.findById(productId);
  if (!product) throw new Error("Product not found");

  let cart = await Cart.findOne({ userId });
  if (!cart) {
    cart = new Cart({
      userId,
      items: [{ productId, quantity, price: product.prix }],
      totalPrice: product.prix * quantity,
    });
  } else {
    const isExistItem = cart.items.find(
      (item) => item.productId.toString() === productId
    );

    if (isExistItem) {
      isExistItem.quantity += quantity;
    } else {
      cart.items.push({ productId, quantity, price: product.prix });
    }
    cart.totalPrice = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  }
  await cart.save();
  return cart;
}

// delete product from cart :
export async function deleteproduct(){
    
}