const validateRequiredFields = (fields) => {
    return (req, res, next) => {
        if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
            return res.status(400).json({
                success: false,
                message: "Request body must be a JSON object"
            });
        }

        const missingFields = [];

        fields.forEach((field) => {
            if (
                req.body[field] === undefined ||
                req.body[field] === null ||
                String(req.body[field]).trim() === ""
            ) {
                missingFields.push(field);
            }
        });

        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Required fields are missing",
                missingFields
            });
        }

        next();
    };
};

module.exports = {
    validateRequiredFields
};
