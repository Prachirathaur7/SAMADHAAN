const { departmentCategory } = require("./departmentService");

const canAccessComplaint = (user, complaint) => {
    const ownerId = complaint.user && complaint.user._id
        ? complaint.user._id.toString()
        : String(complaint.user);
    const isOwner = ownerId === user._id.toString();
    const isAdmin = user.role === "admin";
    const isAssignedOfficer = user.role === "officer" &&
        departmentCategory(user.department) === complaint.category;

    return isOwner || isAdmin || isAssignedOfficer;
};

module.exports = { canAccessComplaint };
