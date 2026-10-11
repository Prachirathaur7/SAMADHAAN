const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
            minlength: 2,
            maxlength: 100
        },

        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true
        },

        phone: {
            type: String,
            required: [true, "Phone number is required"],
            unique: true,
            trim: true
        },

        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: 6,
            select: false
        },

        role: {
            type: String,
            enum: ["citizen", "officer", "admin"],
            default: "citizen"
        },

        department: {
            type: String,
            default: null
        },

        ward: {
            type: String,
            default: null
        },

        isActive: {
            type: Boolean,
            default: true
        },

        isVerified: {
            type: Boolean,
            default: false
        },

        profileImage: {
            type: String,
            default: null
        }
    },

    {
        timestamps: true
    }
);

module.exports = mongoose.model("User", userSchema);
