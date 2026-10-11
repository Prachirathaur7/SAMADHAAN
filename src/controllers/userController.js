const getProfile = async (req, res) => {
    res.status(200).json({
        success: true,
        data: {
            id: req.user._id,
            name: req.user.name,
            email: req.user.email,
            phone: req.user.phone,
            role: req.user.role,
            department: req.user.department,
            ward: req.user.ward,
            isVerified: req.user.isVerified
        }
    });
};

module.exports = {
    getProfile
};
