const errorMiddleware = (err, req, res, next) => {
    console.error("ERROR:", err);

    let statusCode = err.statusCode || 500;
    let safeMessage = err.message;

    if (err.code === 11000) {
        statusCode = 409;
        safeMessage = "A record with those details already exists";
    } else if (err.name === "ValidationError" || err.name === "CastError") {
        statusCode = 400;
        safeMessage = "Request data is invalid";
    }

    const message = statusCode < 500
        ? safeMessage
        : "Internal Server Error";

    res.status(statusCode).json({
        success: false,
        message,

        ...(process.env.NODE_ENV === "development" && {
            stack: err.stack
        })
    });
};

module.exports = errorMiddleware;
