"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userControllers = void 0;
const user_service_1 = require("./user.service");
const getAllUsers = async (req, res) => {
    try {
        const users = await user_service_1.userServices.getAllUsers();
        return res.status(200).json({
            success: true,
            message: "Users retrieved successfully",
            data: users,
        });
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message || "Error retrieving users",
        });
    }
};
const updateUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const requester = req.user;
        const id = Number(userId);
        if (!requester) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }
        if (requester.role !== "admin" && requester.id !== id) {
            return res.status(403).json({
                success: false,
                message: "Forbidden",
            });
        }
        const isAdmin = requester.role === "admin";
        const updated = await user_service_1.userServices.updateUser(id, req.body, isAdmin);
        if (!updated) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        return res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: updated,
        });
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message || "Error updating user",
        });
    }
};
const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const id = Number(userId);
        const hasActive = await user_service_1.userServices.hasActiveBookingsForUser(id);
        if (hasActive) {
            return res.status(400).json({
                success: false,
                message: "Cannot delete user with active bookings",
            });
        }
        const deleted = await user_service_1.userServices.deleteUser(id);
        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        return res.status(200).json({
            success: true,
            message: "User deleted successfully",
        });
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message || "Error deleting user",
        });
    }
};
exports.userControllers = {
    getAllUsers,
    updateUser,
    deleteUser,
};
