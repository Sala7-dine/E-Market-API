import { EventEmitter } from "events";
import Notification from "../models/Notification.js";
import logger from "../config/logger.js";
import { sendEmail } from "../config/mailer.js";
import User from "../models/User.js";

class NotificationHandler extends EventEmitter {}

const notificationHandler = new NotificationHandler();

notificationHandler.on("productCreated", async ({ userId, productTitle }) => {
  try {
    await Notification.create({
      userId,
      message: `Nouveau produit créé: ${productTitle}`,
      type: "productCreated",
    });

    const user = await User.findById(userId);
    if (user) {
      await sendEmail({
        to: user.email,
        subject: "Nouveau produit créé",
        text: `Votre produit "${productTitle}" a été créé avec succès.`,
        html: `<p>Votre produit <strong>${productTitle}</strong> a été créé avec succès.</p>`,
      });
    }

    logger.info(`Notification created for product: ${productTitle}`);
  } catch (err) {
    logger.error(`Error creating notification: ${err.message}`);
  }
});

notificationHandler.on("orderCreated", async ({ userId, orderId }) => {
  try {
    await Notification.create({
      userId,
      message: `Nouvelle commande créée: ${orderId}`,
      type: "orderCreated",
    });

    const user = await User.findById(userId);
    if (user) {
      await sendEmail({
        to: user.email,
        subject: "Commande confirmée",
        text: `Votre commande ${orderId} a été créée avec succès.`,
        html: `<p>Votre commande <strong>${orderId}</strong> a été créée avec succès.</p>`,
      });
    }

    logger.info(`Notification created for order: ${orderId}`);
  } catch (err) {
    logger.error(`Error creating notification: ${err.message}`);
  }
});

notificationHandler.on("orderUpdated", async ({ userId, orderId, status }) => {
  try {
    await Notification.create({
      userId,
      message: `Commande ${orderId} mise à jour: ${status}`,
      type: "orderUpdated",
    });

    const user = await User.findById(userId);
    if (user) {
      await sendEmail({
        to: user.email,
        subject: "Mise à jour de commande",
        text: `Votre commande ${orderId} a été mise à jour: ${status}`,
        html: `<p>Votre commande <strong>${orderId}</strong> a été mise à jour: <strong>${status}</strong></p>`,
      });
    }

    logger.info(`Notification created for order update: ${orderId}`);
  } catch (err) {
    logger.error(`Error creating notification: ${err.message}`);
  }
});

export default notificationHandler;
