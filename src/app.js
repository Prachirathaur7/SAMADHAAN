const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const complaintRoutes = require("./routes/complaintRoutes");

const errorHandler = require("./middleware/errorMiddleware");
const analyticsRoutes = require("./routes/analyticsRoutes");
const app = express();


// ===============================
// GLOBAL MIDDLEWARE
// ===============================

const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

app.use(cors({
    origin(origin, callback) {
        // Requests from tools and server-to-server clients may omit Origin.
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        const error = new Error("Origin is not allowed by CORS");
        error.statusCode = 403;
        return callback(error);
    }
}));

app.use(helmet());

app.use(morgan("dev"));

app.use(express.json({ limit: "32kb" }));

app.use(
    express.urlencoded({
        extended: true
    })
);

// ===============================
// HEALTH CHECK
// ===============================

app.get("/", (req, res) => {

    res.status(200).json({
        success: true,
        project: "NAGARDRISHTI AI",
        message:
            "AI-Powered Predictive Governance Backend",
        status: "ONLINE"
    });

});


// ===============================
// API ROUTES
// ===============================

app.use(
    "/api/auth",
    authRoutes
);

app.use(
    "/api/users",
    userRoutes
);
app.use(
    "/api/complaints",
    complaintRoutes
);
app.use(
    "/api/analytics",
     analyticsRoutes
);



// ===============================
// 404
// ===============================

app.use((req, res) => {

    res.status(404).json({
        success: false,
        message: "API endpoint not found"
    });

});


// ===============================
// ERROR HANDLER
// ===============================

app.use(errorHandler);


module.exports = app;
