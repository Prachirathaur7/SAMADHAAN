const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  try {
    // Get Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Authorization token required"
      });
    }

    // Check Bearer format
    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Invalid authorization format"
      });
    }

    // Get token
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token required"
      });
    }

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // IMPORTANT:
    // Login token contains userId, not id
    const userId = decoded.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Invalid token payload"
      });
    }

    // Find user
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found"
      });
    }

    // Attach user to request
    req.user = user;

    // Continue
    next();

  } catch (error) {
    console.error("Auth Middleware Error:", error);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token"
    });
  }
};

module.exports = authMiddleware;