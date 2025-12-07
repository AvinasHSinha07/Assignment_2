"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authServices = void 0;
const db_1 = require("../../config/db");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../../config"));
const signupUser = async (payload) => {
    const { name, email, password, phone, role } = payload;
    const lowerEmail = email.toLowerCase();
    const existing = await db_1.pool.query(`SELECT id FROM users WHERE email = $1`, [
        lowerEmail,
    ]);
    if (existing.rowCount && existing.rowCount > 0) {
        throw new Error("Email already exists");
    }
    const hashedPass = await bcryptjs_1.default.hash(password, 10);
    const result = await db_1.pool.query(`INSERT INTO users (name, email, password, phone, role)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, name, email, phone, role`, [name, lowerEmail, hashedPass, phone, role]);
    return result.rows[0];
};
const signinUser = async (payload) => {
    const { email, password } = payload;
    const lowerEmail = email.toLowerCase();
    const result = await db_1.pool.query(`SELECT id, name, email, password, phone, role
     FROM users
     WHERE email = $1`, [lowerEmail]);
    if (result.rowCount === 0) {
        throw new Error("Invalid credentials");
    }
    const user = result.rows[0];
    const isMatch = await bcryptjs_1.default.compare(password, user.password);
    if (!isMatch) {
        throw new Error("Invalid credentials");
    }
    const token = jsonwebtoken_1.default.sign({
        id: user.id,
        email: user.email,
        role: user.role,
    }, config_1.default.jwtSecret, {
        expiresIn: "7d",
    });
    const userResponse = {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
    };
    return { token, user: userResponse };
};
exports.authServices = {
    signupUser,
    signinUser,
};
