const {
    registerUser,
    loginUser
} = require("../services/authService");


// REGISTER
const register = async (req, res, next) => {
    try {
        const {
            name,
            email,
            phone,
            password
        } = req.body;

        if (!name || !email || !phone || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        if (typeof name !== "string" || name.trim().length < 2 || name.trim().length > 100) {
            return res.status(400).json({ success: false, message: "Name must be between 2 and 100 characters" });
        }

        if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
            return res.status(400).json({ success: false, message: "Enter a valid email address" });
        }

        if (typeof phone !== "string" || !/^\+?[0-9]{8,15}$/.test(phone.trim())) {
            return res.status(400).json({ success: false, message: "Phone number must contain 8 to 15 digits" });
        }

        if (typeof password !== "string" || password.length < 8 || Buffer.byteLength(password, "utf8") > 72) {
            return res.status(400).json({ success: false, message: "Password must be at least 8 characters and at most 72 bytes" });
        }

        const result = await registerUser({
            name,
            email,
            phone,
            password
        });

        res.status(201).json({
            success: true,
            message: "Registration successful",
            data: result
        });

    } catch (error) {
        next(error);
    }
};


// LOGIN
const login = async (req, res, next) => {
    try {
        const {
            email,
            password
        } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) || typeof password !== "string" || Buffer.byteLength(password, "utf8") > 72) {
            return res.status(400).json({ success: false, message: "Enter a valid email and password" });
        }

        const result = await loginUser(
            email,
            password
        );

        res.status(200).json({
            success: true,
            message: "Login successful",
            data: result
        });

    } catch (error) {
        next(error);
    }
};


module.exports = {
    register,
    login
};
