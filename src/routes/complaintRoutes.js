const express = require("express");

const {
    createComplaint,
    getMyComplaints,
    getAssignedComplaints,
    updateComplaintStatus,
    getComplaintById
} = require("../controllers/complaintController");

const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();


// Create complaint
router.post(
    "/",
    protect,
    createComplaint
);


// Get logged-in user's complaints.3
router.get(
    "/my",
    protect,
    getMyComplaints
);

router.get(
    "/assigned",
    protect,
    authorize("officer", "admin"),
    getAssignedComplaints
);

router.get(
    "/",
    protect,
    authorize("admin"),
    getAssignedComplaints
);

router.patch(
    "/:id/status",
    protect,
    authorize("officer", "admin"),
    updateComplaintStatus
);


// Get complaint by ID
router.get(
    "/:id",
    protect,
    getComplaintById
);


module.exports = router;
