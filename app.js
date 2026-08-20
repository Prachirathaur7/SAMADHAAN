const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const complaintRoutes = require("./routes/complaintRoutes");

const errorHandler = require("./middleware/errorMiddleware");
const analyticsRoutes = require("./routes/analyticsRoutes");
const app = express();


// ===============================
// GLOBAL MIDDLEWARE
// ===============================

app.use(
    cors({
        origin: process.env.CLIENT_URL || "*",
        credentials: true
    })
);

app.use(helmet());

app.use(morgan("dev"));

app.use(express.json());

app.use(
    express.urlencoded({
        extended: true
    })
);

app.use(cookieParser());


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