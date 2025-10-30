import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

// get user's cart :
export async function getCarts(userId) {
  const allCart = await Cart.find({ userId });
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
  
  // Check if adding this quantity would exceed stock
  const existingItem = cart?.items.find(
    (item) => item.productId.toString() === productId
  );
  const totalQuantity = (existingItem?.quantity || 0) + quantity;
  
  if (totalQuantity > product.stock) {
    return 0;
  }
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
export async function deleteproduct(userId, productId) {
  let cart = await Cart.findOne({ userId });
  const updatedcart = cart.items.filter(
    (item) => item.productId.toString() !== productId
  );
  cart.items = updatedcart;
  return await cart.save();
}

// update Product Quantity and total price in the cart :
export async function updateProductQuantity(userId, productId, quantity) {
  if (!cart) {
    throw new Error("Cart not found for this user");
  }
  const item = cart.items.find((i) => i.productId.toString() === productId);
  if (!item) {
    throw new Error("Product not found in cart");
  }

  //   update quantity:
  item.quantity = quantity;

  //   update the total price:
  cart.totalPrice = cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  await cart.save();
  return cart;
}
