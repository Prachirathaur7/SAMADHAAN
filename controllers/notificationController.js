const Notification = require("../models/Notification");

// Get notifications for logged-in user
const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({
            user: req.user.id
        })
            .populate("complaint")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            notifications
        });
    } catch (error) {
        console.error("Get notifications error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch notifications"
        });
    }
};

// Mark one notification as read
const markNotificationAsRead = async (req, res) => {
    try {
        const notification = await Notification.findOneAndUpdate(
            {
                _id: req.params.id,
                user: req.user.id
            },
            {
                isRead: true
            },
            {
                new: true
            }
        );

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: "Notification not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Notification marked as read",
            notification
        });
    } catch (error) {
        console.error("Mark notification as read error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to mark notification as read"
        });
    }
};

// Mark all notifications as read
const markAllNotificationsAsRead = async (req, res) => {
    try {
        await Notification.updateMany(
            {
                user: req.user.id,
                isRead: false
            },
            {
                isRead: true
            }
        );

        res.status(200).json({
            success: true,
            message: "All notifications marked as read"
        });
    } catch (error) {
        console.error("Mark all notifications as read error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to mark all notifications as read"
        });
    }
};

module.exports = {
    getNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead
};