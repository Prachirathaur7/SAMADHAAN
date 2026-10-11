const {
    getComplaintStatistics,
    getCategoryStatistics,
    getPriorityStatistics,
    getWardStatistics
} = require("../services/analyticsService");

// Overall complaint statistics
const complaintStatistics = async (req, res, next) => {
    try {
        const statistics = await getComplaintStatistics();

        res.status(200).json({
            success: true,
            data: statistics
        });
    } catch (error) {
        next(error);
    }
};


// Category-wise statistics
const categoryStatistics = async (req, res, next) => {
    try {
        const statistics = await getCategoryStatistics();

        res.status(200).json({
            success: true,
            data: statistics
        });
    } catch (error) {
        next(error);
    }
};


// Priority-wise statistics
const priorityStatistics = async (req, res, next) => {
    try {
        const statistics = await getPriorityStatistics();

        res.status(200).json({
            success: true,
            data: statistics
        });
    } catch (error) {
        next(error);
    }
};


// Ward-wise statistics
const wardStatistics = async (req, res, next) => {
    try {
        const statistics = await getWardStatistics();

        res.status(200).json({
            success: true,
            data: statistics
        });
    } catch (error) {
        next(error);
    }
};


module.exports = {
    complaintStatistics,
    categoryStatistics,
    priorityStatistics,
    wardStatistics
};
