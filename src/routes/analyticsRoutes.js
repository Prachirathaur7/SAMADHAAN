const express = require("express");

const {
    complaintStatistics,
    categoryStatistics,
    priorityStatistics,
    wardStatistics
} = require("../controllers/analyticsController");

const {
    protect,
    authorize
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
    "/complaints",
    protect,
    authorize("admin"),
    complaintStatistics
);

router.get(
    "/categories",
    protect,
    authorize("admin"),
    categoryStatistics
);

router.get(
    "/priorities",
    protect,
    authorize("admin"),
    priorityStatistics
);

router.get(
    "/wards",
    protect,
    authorize("admin"),
    wardStatistics
);

module.exports = router;
