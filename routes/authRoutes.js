const express = require("express");

const router = express.Router();

const {
    register,
    login
} = require("../controllers/authController");

// ==============================
// AUTHENTICATION ROUTES
// ==============================

// Register new user
router.post("/register", register);

// Login existing user
router.post("/login", login);

module.exports = router;