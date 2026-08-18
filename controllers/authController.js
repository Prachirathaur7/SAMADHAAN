const {
    registerUser,
    loginUser
} = require("../services/autoService");

// ===============================
// REGISTER USER
// ===============================
const register = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;

        // Check required fields
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Name, email and password are required"
            });
        }

        // Call service
        const user = await registerUser({
            name,
            email,
            password,
            phone
        });

        return res.status(201).json({
            message: "User registered successfully",
            user
        });

    } catch (error) {
        console.error("Register Error:", error);

        return res.status(400).json({
            message: error.message
        });
    }
};


// ===============================
// LOGIN USER
// ===============================
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check required fields
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        // Call service
        const result = await loginUser(email, password);

        return res.status(200).json({
            message: "Login successful",
            ...result
        });

    } catch (error) {
        console.error("Login Error:", error);

        return res.status(401).json({
            message: error.message
        });
    }
};


// ===============================
// EXPORT CONTROLLERS
// ===============================
module.exports = {
    register,
    login
};