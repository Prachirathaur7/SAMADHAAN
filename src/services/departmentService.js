const departmentCategory = (department) => {
    const normalized = String(department || "").trim().toLowerCase().replace(/\s+/g, " ");
    const aliases = {
        "water supply": "water",
        "roads & transport": "roads",
        "roads and transport": "roads",
        "public safety": "public_safety"
    };
    return aliases[normalized] || normalized;
};

module.exports = { departmentCategory };
