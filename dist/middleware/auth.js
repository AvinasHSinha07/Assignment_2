"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
const auth = (...roles) => {
    return async (req, res, next) => {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader) {
                return res.status(401).json({
                    success: false,
                    message: "Missing authorization header",
                });
            }
            if (!authHeader.startsWith("Bearer ")) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid authorization format",
                });
            }
            const token = authHeader.split(" ")[1];
            const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwtSecret);
            req.user = decoded;
            if (roles.length && !roles.includes(decoded.role)) {
                return res.status(403).json({
                    success: false,
                    message: "Forbidden: You do not have access to this resource",
                });
            }
            next();
        }
        catch (err) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: " + (err.message || "Invalid token"),
            });
        }
    };
};
exports.default = auth;
