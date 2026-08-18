const express = require("express");

const {
    getNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead
} = require("../controllers/notificationController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Get all notifications for logged-in user
router.get("/", authMiddleware, getNotifications);

// Mark one notification as read
router.put("/:id/read", authMiddleware, markNotificationAsRead);

// Mark all notifications as read
router.put("/read-all", authMiddleware, markAllNotificationsAsRead);

module.exports = router;