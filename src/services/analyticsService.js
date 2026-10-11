const Complaint = require("../models/Complaint");

// Get overall complaint statistics
const getComplaintStatistics = async () => {
    const total = await Complaint.countDocuments();

    const submitted = await Complaint.countDocuments({
        status: "submitted"
    });

    const inProgress = await Complaint.countDocuments({
        status: "in_progress"
    });

    const resolved = await Complaint.countDocuments({
        status: "resolved"
    });

    const rejected = await Complaint.countDocuments({
        status: "rejected"
    });

    return {
        total,
        submitted,
        inProgress,
        resolved,
        rejected
    };
};


// Get complaints grouped by category
const getCategoryStatistics = async () => {
    return Complaint.aggregate([
        {
            $group: {
                _id: "$category",
                count: {
                    $sum: 1
                }
            }
        },
        {
            $sort: {
                count: -1
            }
        }
    ]);
};


// Get complaints grouped by priority
const getPriorityStatistics = async () => {
    return Complaint.aggregate([
        {
            $group: {
                _id: "$priority",
                count: {
                    $sum: 1
                }
            }
        },
        {
            $sort: {
                count: -1
            }
        }
    ]);
};


// Get complaints grouped by ward
const getWardStatistics = async () => {
    return Complaint.aggregate([
        {
            $match: {
                "location.ward": {
                    $exists: true,
                    $ne: ""
                }
            }
        },
        {
            $group: {
                _id: "$location.ward",
                count: {
                    $sum: 1
                }
            }
        },
        {
            $sort: {
                count: -1
            }
        }
    ]);
};


module.exports = {
    getComplaintStatistics,
    getCategoryStatistics,
    getPriorityStatistics,
    getWardStatistics
};
