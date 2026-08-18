const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const registerUser = async ({ name, email, password, phone }) => {
  // Check if user already exists
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new Error("User already exists");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    phone,
    role: "citizen"
  });

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role
  };
};

const loginUser = async (email, password) => {
  // Find user
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  // Check password
  const isPasswordCorrect = await bcrypt.compare(
    password,
    user.password
  );

  if (!isPasswordCorrect) {
    throw new Error("Invalid email or password");
  }

  if (!user.isActive) {
    throw new Error("User account is inactive");
  }

  // Create JWT
  const token = jwt.sign(
    {
      userId: user._id,
      role: user.role
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d"
    }
  );

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  };
};

module.exports = {
  registerUser,
  loginUser
};