const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: 120
        },

        description: {
            type: String,
            required: true,
            trim: true,
            maxlength: 2000
        },

        category: {
            type: String,
            enum: [
                "water",
                "electricity",
                "sanitation",
                "roads",
                "public_safety",
                "other"
            ],
            default: "other"
        },

        categoryConfidence: {
            type: Number,
            min: 0,
            max: 1,
            default: 0
        },

        priority: {
            type: String,
            enum: ["low", "medium", "high", "critical"],
            default: "medium"
        },

        priorityScore: {
            type: Number,
            min: 0,
            max: 1,
            default: 0
        },

        status: {
            type: String,
            enum: ["submitted", "in_progress", "resolved", "rejected"],
            default: "submitted"
        },

        location: {
            address: { type: String, trim: true },
            ward: { type: String, trim: true },
            latitude: { type: Number },
            longitude: { type: Number }
        },

        // ---- Added for AI / GIS integration (all optional) ----

        geo: {
            type: {
                type: String,
                enum: ["Point"]
            },
            coordinates: {
                type: [Number],
                default: undefined
            }
        },

        department: {
            type: String,
            trim: true
        },

        aiStatus: {
            type: String,
            enum: ["pending", "completed", "failed", "disabled"],
            default: "pending"
        },

        // AI duplicate matches are suggestions; they never prevent registration.
        aiDuplicateOf: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Complaint"
        },

        aiDuplicateScore: {
            type: Number,
            min: 0,
            max: 1
        },

        aiAnalysis: {
            aiCategory: String,
            aiPriority: String,
            severity: String,
            urgency: String,
            departmentConfidence: Number,
            slaHours: Number,
            etaHours: Number,
            summary: String,
            analyzedAt: Date,
            error: String
        }
    },
    {
        timestamps: true
    }
);

complaintSchema.index({ geo: "2dsphere" });

module.exports = mongoose.model("Complaint", complaintSchema);
