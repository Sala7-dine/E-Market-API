import Notification from '../models/Notification.js';
import logger from '../config/logger.js';

export const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ userId: req.user._id })
            .sort({ createdAt: -1 });
        res.json({ success: true, data: notifications });
    } catch (err) {
        logger.error(`Error getting notifications: ${err.message}`);
        res.status(500).json({ error: err.message });
    }
};

export const markAsRead = async (req, res) => {
    try {
        const notification = await Notification.findOne({ 
            _id: req.params.id, 
            userId: req.user._id 
        });

        if (!notification) {
            return res.status(404).json({ error: 'Notification non trouvée' });
        }

        notification.read = true;
        await notification.save();

        res.json({ success: true, data: notification });
    } catch (err) {
        logger.error(`Error marking notification as read: ${err.message}`);
        res.status(500).json({ error: err.message });
    }
};
