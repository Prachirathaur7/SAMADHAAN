const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    title: {
      type: String,
      required: true
    },

    message: {
      type: String,
      required: true
    },

    type: {
      type: String,
      enum: [
        "complaint_created",
        "complaint_assigned",
        "status_updated",
        "complaint_resolved",
        "complaint_rejected",
        "system"
      ],
      required: true
    },

    complaint: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Complaint",
      default: null
    },

    isRead: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Notification", notificationSchema);