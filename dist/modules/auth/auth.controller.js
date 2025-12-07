"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authControllers = void 0;
const auth_service_1 = require("./auth.service");
const signup = async (req, res) => {
    try {
        const { name, email, password, phone, role } = req.body;
        if (!name || !email || !password || !phone || !role) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters long",
            });
        }
        const user = await auth_service_1.authServices.signupUser({
            name,
            email,
            password,
            phone,
            role,
        });
        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: user,
        });
    }
    catch (err) {
        return res.status(400).json({
            success: false,
            message: err.message || "Error registering user",
        });
    }
};
const signin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
        }
        const result = await auth_service_1.authServices.signinUser({ email, password });
        return res.status(200).json({
            success: true,
            message: "Login successful",
            data: {
                token: result.token,
                user: result.user,
            },
        });
    }
    catch (err) {
        return res.status(401).json({
            success: false,
            message: err.message || "Login failed",
        });
    }
};
exports.authControllers = {
    signup,
    signin,
};
