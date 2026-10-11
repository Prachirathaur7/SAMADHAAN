const express = require("express");
const{
    validateRequiredFields
}= require("../middleware/validationMiddleware")

const {
    register,
    login
} = require("../controllers/authController");

const router = express.Router();

router.post(
    "/register",
    validateRequiredFields([
        "name",
        "email",
        "phone",
        "password"

    ]),
    register
);

router.post(
    "/login",
    validateRequiredFields([
        "email",
        "password",
    ]),
    login

);

module.exports = router;
