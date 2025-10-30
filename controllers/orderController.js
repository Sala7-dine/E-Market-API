import { addOrder, getOrder, updateStatus } from "../services/orderService.js";
import notificationHandler from "../events/notificationHandler.js";

// add an order :
export const handleAddOrder = async (req, res, next) => {
  try {
    const cartId = req.params.cartId;
    const userId = req.user._id;
    const couponCode = req.body?.couponCode || null;

    const orderAdded = await addOrder(userId, cartId, couponCode);

    notificationHandler.emit("orderCreated", {
      userId,
      orderId: orderAdded._id,
    });

    res.status(200).json({
      success: true,
      message: "order created",
      data: orderAdded,
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

    notificationHandler.emit("orderUpdated", {
      userId: orderUpdated.userId,
      orderId,
      status,
    });

    // Paiement Simulation :
    if (status === "paid") {
      return res.status(200).json({
        message: "paiement done",
        data: orderUpdated,
      });
    }

    res.status(200).json({
      message: "Statut updated",
      data: orderUpdated,
    });
  } catch (err) {
    next(err);
  }
};
