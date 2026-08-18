// Load environment variables from .env
require("dotenv").config();

const express = require("express");
const cors = require("cors");

// Routes
const authRoutes = require("./routes/authRoutes");
const complaintRoutes = require("./routes/complaintRoutes");
const autoRoutes = require("./routes/autoRoutes");
const userRoutes = require("./routes/userRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

// Database
const connectDB = require("./config/db");

const app = express();

// -------------------------
// Middleware
// -------------------------
app.use(cors());
app.use(express.json());

// -------------------------
// Connect MongoDB
// -------------------------
connectDB();

// -------------------------
// API Routes
// -------------------------
app.use("/api/auth", authRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/auto", autoRoutes);
app.use("/api/users", userRoutes);
app.use("/api/notifications", notificationRoutes);

// -------------------------
// Root Route
// -------------------------
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "NagarDrishti Backend is running"
  });
});

// -------------------------
// Server
// -------------------------
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});