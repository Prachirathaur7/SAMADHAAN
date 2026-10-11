const jwt = require("jsonwebtoken");
// Keep the path casing identical to the actual filename (`user.js`).
// Windows resolves mismatched casing; Linux deployments do not.
const User = require("../models/user");

const protect = async (req, res, next) => {

    try {

        let token;

        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ) {

            token =
                req.headers.authorization.split(" ")[1];
        }

        if (!token) {

            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });

        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        const user = await User.findById(decoded.id);

        if (!user) {

            return res.status(401).json({
                success: false,
                message: "User no longer exists"
            });

        }

        if (!user.isActive) {

            return res.status(403).json({
                success: false,
                message: "Account is disabled"
            });

        }

        req.user = user;

        next();

    } catch (error) {

        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });

    }
};


// ROLE AUTHORIZATION

const authorize = (...roles) => {

    return (req, res, next) => {

        if (!roles.includes(req.user.role)) {

            return res.status(403).json({
                success: false,
                message: "You are not authorized to access this resource"
            });

        }

        next();
    };
};


module.exports = {
    protect,
    authorize
};
