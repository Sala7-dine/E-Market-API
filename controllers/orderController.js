import { addOrder, getOrder, updateStatus } from "../services/orderService.js";

// add an order :
export const handleAddOrder = async (req, res, next) => {
  try {
    const cartId = req.params.cartId;
    const userId = req.user._id;
    const couponCode = req.body?.couponCode || null;

    const orderAdded = await addOrder(userId, cartId, couponCode);

    res.status(200).json({
      success : true,
      message : "order created",
      data : orderAdded
    });
  } catch (err) {
    next(err);
  }
};

// get user's orders :
export const handleGetOrder = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const order = await getOrder(userId);
    res.status(200).json(order);
  } catch (err) {
    next(err);
  }
};

// update order's status :
export const updateOrderStatus = async (req, res, next) => {
  try {
    const status = req.body.status;
    const orderId = req.params.orderId;

    const orderUpdated = await updateStatus(orderId, status);
    // Paiement Simulation :
    if (status === "paid") {
      res.status(200).json({ message: "paiement done"});
    }
    res.status(200).json({ message: "Statut updated", orderUpdated });
  } catch (err) {
    next(err);
  }
};
