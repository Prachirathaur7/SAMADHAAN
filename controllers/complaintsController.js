const mongoose = require("mongoose");
const Complaint = require("../models/Complaint");

// ==========================================
// CREATE COMPLAINT
// POST /api/complaints
// ==========================================
const createComplaint = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      priority,
      location,
      address,
      image,
    } = req.body || {};

    if (
      !title ||
      !description ||
      !category ||
      !location ||
      !address
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Title, description, category, location and address are required",
      });
    }

    const complaint = await Complaint.create({
      citizen: req.user._id,
      title,
      description,
      category,
      priority: priority || "medium",
      location,
      address,
      image: image || "",
    });

    const populatedComplaint = await Complaint.findById(
      complaint._id
    ).populate("citizen", "name email");

    return res.status(201).json({
      success: true,
      message: "Complaint created successfully",
      complaint: populatedComplaint,
    });
  } catch (error) {
    console.error("Create complaint error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while creating complaint",
      error: error.message,
    });
  }
};

// ==========================================
// GET ALL COMPLAINTS
// GET /api/complaints
// ==========================================
const getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate("citizen", "name email")
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: complaints.length,
      complaints,
    });
  } catch (error) {
    console.error("Get all complaints error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching complaints",
      error: error.message,
    });
  }
};

// ==========================================
// GET MY COMPLAINTS
// GET /api/complaints/my
// ==========================================
const getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({
      citizen: req.user._id,
    })
      .populate("citizen", "name email")
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: complaints.length,
      complaints,
    });
  } catch (error) {
    console.error("Get my complaints error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching your complaints",
      error: error.message,
    });
  }
};

// ==========================================
// GET SINGLE COMPLAINT
// GET /api/complaints/:id
// ==========================================
const getComplaintById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid complaint ID",
      });
    }

    const complaint = await Complaint.findById(id)
      .populate("citizen", "name email")
      .populate("assignedTo", "name email");

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }

    return res.status(200).json({
      success: true,
      complaint,
    });
  } catch (error) {
    console.error("Get complaint error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching complaint",
      error: error.message,
    });
  }
};

// ==========================================
// UPDATE COMPLAINT
// PUT /api/complaints/:id
// ==========================================
const updateComplaint = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid complaint ID",
      });
    }

    const complaint = await Complaint.findById(id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }

    const {
      title,
      description,
      category,
      priority,
      location,
      address,
      image,
      status,
      assignedTo,
      resolutionNote,
    } = req.body;

    if (title !== undefined) complaint.title = title;
    if (description !== undefined) complaint.description = description;
    if (category !== undefined) complaint.category = category;
    if (priority !== undefined) complaint.priority = priority;
    if (location !== undefined) complaint.location = location;
    if (address !== undefined) complaint.address = address;
    if (image !== undefined) complaint.image = image;
    if (status !== undefined) complaint.status = status;
    if (assignedTo !== undefined) complaint.assignedTo = assignedTo;
    if (resolutionNote !== undefined) {
      complaint.resolutionNote = resolutionNote;
    }

    await complaint.save();

    const updatedComplaint = await Complaint.findById(id)
      .populate("citizen", "name email")
      .populate("assignedTo", "name email");

    return res.status(200).json({
      success: true,
      message: "Complaint updated successfully",
      complaint: updatedComplaint,
    });
  } catch (error) {
    console.error("Update complaint error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while updating complaint",
      error: error.message,
    });
  }
};

// ==========================================
// DELETE COMPLAINT
// DELETE /api/complaints/:id
// ==========================================
const deleteComplaint = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid complaint ID",
      });
    }

    const complaint = await Complaint.findById(id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }

    await Complaint.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Complaint deleted successfully",
    });
  } catch (error) {
    console.error("Delete complaint error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while deleting complaint",
      error: error.message,
    });
  }
};

module.exports = {
  createComplaint,
  getAllComplaints,
  getMyComplaints,
  getComplaintById,
  updateComplaint,
  deleteComplaint,
};