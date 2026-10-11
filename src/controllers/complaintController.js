const Complaint = require("../models/Complaint");
const { enrichComplaint } = require("../services/aiEngineClient");
const { analyzeComplaint } = require("../services/aiService");
const { departmentCategory } = require("../services/departmentService");
const { canAccessComplaint } = require("../services/complaintAccess");

// Create a new complaint
const createComplaint = async (req, res, next) => {
    try {
        const {
            title,
            description,
            location
        } = req.body;

        if (typeof title !== "string" || !title.trim() || title.trim().length > 120) {
            return res.status(400).json({
                success: false,
                message: "Title is required and must be at most 120 characters"
            });
        }

        if (typeof description !== "string" || !description.trim() || description.trim().length > 2000) {
            return res.status(400).json({
                success: false,
                message: "Description is required and must be at most 2000 characters"
            });
        }

        const analysis = analyzeComplaint(
            `${title} ${description}`
        );

        const complaint = await Complaint.create({
            user: req.user._id,

            title,
            description,

            category: analysis.category,
            categoryConfidence: analysis.categoryConfidence,

            priority: analysis.priority,
            priorityScore: analysis.priorityScore,

            location
        });

        await enrichComplaint(complaint);

        res.status(201).json({
            success: true,
            message: "Complaint created successfully",
            complaint
        });

    } catch (error) {
        next(error);
    }
};


// Get complaints created by the logged-in user
const getMyComplaints = async (req, res, next) => {
    try {
        const complaints = await Complaint.find({
            user: req.user._id
        }).sort({
            createdAt: -1
        });

        res.status(200).json({
            success: true,
            count: complaints.length,
            complaints
        });

    } catch (error) {
        next(error);
    }
};


// Admins see all complaints; officers see complaints in their assigned category.
const getAssignedComplaints = async (req, res, next) => {
    try {
        const filter = req.user.role === "admin"
            ? {}
            : { category: departmentCategory(req.user.department) };
        const complaints = await Complaint.find(filter).sort({ createdAt: -1 });

        res.status(200).json({ success: true, count: complaints.length, complaints });
    } catch (error) {
        next(error);
    }
};

const updateComplaintStatus = async (req, res, next) => {
    try {
        if (!/^[a-f\d]{24}$/i.test(req.params.id)) {
            return res.status(400).json({ success: false, message: "Invalid complaint ID" });
        }

        const { status } = req.body || {};
        const allowedStatuses = ["in_progress", "resolved", "rejected"];
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Status must be in_progress, resolved, or rejected"
            });
        }

        const filter = { _id: req.params.id };
        if (req.user.role === "officer") filter.category = departmentCategory(req.user.department);
        const complaint = await Complaint.findOneAndUpdate(
            filter,
            { $set: { status } },
            { new: true, runValidators: true }
        );

        if (!complaint) {
            return res.status(404).json({ success: false, message: "Assigned complaint not found" });
        }
        res.status(200).json({ success: true, complaint });
    } catch (error) {
        next(error);
    }
};

// Get a single complaint
const getComplaintById = async (req, res, next) => {
    try {
        if (!/^[a-f\d]{24}$/i.test(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid complaint ID"
            });
        }

        const complaint = await Complaint.findById(
            req.params.id
        );

        // Complaint does not exist
        if (!complaint) {
            return res.status(404).json({
                success: false,
                message: "Complaint not found"
            });
        }

        if (!canAccessComplaint(req.user, complaint)) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to access this complaint"
            });
        }

        res.status(200).json({
            success: true,
            complaint
        });

    } catch (error) {
        next(error);
    }
};


module.exports = {
    createComplaint,
    getMyComplaints,
    getAssignedComplaints,
    updateComplaintStatus,
    getComplaintById
};
