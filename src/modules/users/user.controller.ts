import { Request, Response } from "express";
import { userServices } from "./user.service";

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await userServices.getAllUsers();

    return res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: users,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message || "Error retrieving users",
    });
  }
};

const updateUser = async (req: Request, res: Response) => {
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

    const updated = await userServices.updateUser(id, req.body, isAdmin);

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
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message || "Error updating user",
    });
  }
};

const deleteUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const id = Number(userId);

    const hasActive = await userServices.hasActiveBookingsForUser(id);
    if (hasActive) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete user with active bookings",
      });
    }

    const deleted = await userServices.deleteUser(id);

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
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message || "Error deleting user",
    });
  }
};

export const userControllers = {
  getAllUsers,
  updateUser,
  deleteUser,
};
