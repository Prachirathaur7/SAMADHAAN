const express = require("express");

const router = express.Router();

const {
  createComplaint,
  getAllComplaints,
  getMyComplaints,
  getComplaintById,
  updateComplaint,
  deleteComplaint,
} = require("../controllers/complaintsController");

const authMiddleware = require("../middleware/authMiddleware");

// ==========================================
// CREATE COMPLAINT
// POST /api/complaints
// ==========================================
router.post(
  "/",
  authMiddleware,
  createComplaint
);

// ==========================================
// GET ALL COMPLAINTS
// GET /api/complaints
// ==========================================
router.get(
  "/",
  authMiddleware,
  getAllComplaints
);

// ==========================================
// GET MY COMPLAINTS
// GET /api/complaints/my
// ==========================================
router.get(
  "/my",
  authMiddleware,
  getMyComplaints
);

// ==========================================
// GET SINGLE COMPLAINT
// GET /api/complaints/:id
// ==========================================
router.get(
  "/:id",
  authMiddleware,
  getComplaintById
);

// ==========================================
// UPDATE COMPLAINT
// PUT /api/complaints/:id
// ==========================================
router.put(
  "/:id",
  authMiddleware,
  updateComplaint
);

// ==========================================
// DELETE COMPLAINT
// DELETE /api/complaints/:id
// ==========================================
router.delete(
  "/:id",
  authMiddleware,
  deleteComplaint
);

module.exports = router;