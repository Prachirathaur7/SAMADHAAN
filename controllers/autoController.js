const {
  registerUser,
  loginUser
} = require("../services/autoService");

const register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required"
      });
    }

    const user = await registerUser({
      name,
      email,
      password,
      phone
    });

    res.status(201).json({
      message: "Registration successful",
      user
    });
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    const result = await loginUser(email, password);

    res.status(200).json({
      message: "Login successful",
      ...result
    });
  } catch (error) {
    res.status(401).json({
      message: error.message
    });
  }
};

module.exports = {
  register,
  login
};