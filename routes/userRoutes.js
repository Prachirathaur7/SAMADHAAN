const express = require("express");

const router = express.Router();

const {
  getProfile,
  updateProfile,
  getUserById,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

const authMiddleware = require("../middleware/authMiddleware");

// ==========================================
// LOGGED-IN USER PROFILE
// ==========================================

router.get("/profile", authMiddleware, getProfile);

router.put("/profile", authMiddleware, updateProfile);

// ==========================================
// USER BY ID
// ==========================================

router.get("/:id", authMiddleware, getUserById);

router.put("/:id", authMiddleware, updateUser);

router.delete("/:id", authMiddleware, deleteUser);

module.exports = router;