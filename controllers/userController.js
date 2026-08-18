const User = require("../models/User");

// ==========================================
// GET LOGGED-IN USER PROFILE
// ==========================================
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get profile error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ==========================================
// UPDATE LOGGED-IN USER PROFILE
// ==========================================
const updateProfile = async (req, res) => {
  try {
    const { name, phone, address, profileImage } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (name !== undefined) {
      user.name = name;
    }

    if (phone !== undefined) {
      user.phone = phone;
    }

    if (address !== undefined) {
      user.address = address;
    }

    if (profileImage !== undefined) {
      user.profileImage = profileImage;
    }

    await user.save();

    const updatedUser = await User.findById(req.user.id).select("-password");

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update profile error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ==========================================
// GET USER BY ID
// ==========================================
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get user error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ==========================================
// UPDATE USER BY ID
// ==========================================
const updateUser = async (req, res) => {
  try {
    const { name, email, phone, address, role, profileImage, isActive } =
      req.body;

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (name !== undefined) {
      user.name = name;
    }

    if (email !== undefined) {
      user.email = email;
    }

    if (phone !== undefined) {
      user.phone = phone;
    }

    if (address !== undefined) {
      user.address = address;
    }

    if (role !== undefined) {
      user.role = role;
    }

    if (profileImage !== undefined) {
      user.profileImage = profileImage;
    }

    if (isActive !== undefined) {
      user.isActive = isActive;
    }

    await user.save();

    const updatedUser = await User.findById(req.params.id).select("-password");

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update user error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ==========================================
// DELETE / DEACTIVATE USER
// ==========================================
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.isActive = false;

    await user.save();

    res.status(200).json({
      success: true,
      message: "User deactivated successfully",
    });
  } catch (error) {
    console.error("Delete user error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  getUserById,
  updateUser,
  deleteUser,
};