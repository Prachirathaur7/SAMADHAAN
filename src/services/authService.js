const bcrypt = require("bcrypt");
const User = require("../models/user");
const generateToken = require("../utils/generateToken");

const registerUser = async ({
    name,
    email,
    phone,
    password
}) => {
    email = email.trim().toLowerCase();
    phone = phone.trim();

    const existingUser = await User.findOne({
        $or: [
            { email },
            { phone }
        ]
    });

    if (existingUser) {
        const error = new Error("User with this email or phone already exists");
        error.statusCode = 409;
        throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
        name,
        email,
        phone,
        password: hashedPassword
    });

    const token = generateToken(
        user._id,
        user.role
    );

    return {
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role
        },
        token
    };
};


const loginUser = async (email, password) => {
    email = email.trim().toLowerCase();

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        const error = new Error("Invalid email or password");
        error.statusCode = 401;
        throw error;
    }

    const isPasswordCorrect = await bcrypt.compare(
        password,
        user.password
    );

    if (!isPasswordCorrect) {
        const error = new Error("Invalid email or password");
        error.statusCode = 401;
        throw error;
    }

    if (!user.isActive) {
        const error = new Error("Account is disabled");
        error.statusCode = 403;
        throw error;
    }

    const token = generateToken(
        user._id,
        user.role
    );

    return {
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            department: user.department,
            ward: user.ward
        },
        token
    };
};


module.exports = {
    registerUser,
    loginUser
};
