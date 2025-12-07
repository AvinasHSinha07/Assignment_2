import { Request, Response } from "express";
import { vehicleServices } from "./vehicle.service";

const createVehicle = async (req: Request, res: Response) => {
  try {
    const {
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
    } = req.body;

    if (
      !vehicle_name ||
      !type ||
      !registration_number ||
      daily_rent_price === undefined ||
      !availability_status
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const vehicle = await vehicleServices.createVehicle({
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
    });

    return res.status(201).json({
      success: true,
      message: "Vehicle created successfully",
      data: vehicle,
    });
  } catch (err: any) {
    return res.status(400).json({
      success: false,
      message: err.message || "Error creating vehicle",
    });
  }
};

const getAllVehicles = async (req: Request, res: Response) => {
  try {
    const vehicles = await vehicleServices.getAllVehicles();

    if (!vehicles.length) {
      return res.status(200).json({
        success: true,
        message: "No vehicles found",
        data: [],
      });
    }

    return res.status(200).json({
      success: true,
      message: "Vehicles retrieved successfully",
      data: vehicles,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message || "Error retrieving vehicles",
    });
  }
};

const getVehicleById = async (req: Request, res: Response) => {
  try {
    const { vehicleId } = req.params;

    if (!vehicleId || isNaN(Number(vehicleId))) {
      return res.status(400).json({
        success: false,
        message: "Invalid vehicle ID",
      });
    }

    const id = Number(vehicleId);

    const vehicle = await vehicleServices.getVehicleById(id);
    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Vehicle retrieved successfully",
      data: vehicle,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message || "Error retrieving vehicle",
    });
  }
};

const updateVehicle = async (req: Request, res: Response) => {
  try {
    const { vehicleId } = req.params;

    if (!vehicleId || isNaN(Number(vehicleId))) {
      return res.status(400).json({
        success: false,
        message: "Invalid vehicle ID",
      });
    }

    const id = Number(vehicleId);

    const updated = await vehicleServices.updateVehicle(id, req.body);

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Vehicle updated successfully",
      data: updated,
    });
  } catch (err: any) {
    return res.status(400).json({
      success: false,
      message: err.message || "Error updating vehicle",
    });
  }
};

const deleteVehicle = async (req: Request, res: Response) => {
  try {
    const { vehicleId } = req.params;

    if (!vehicleId || isNaN(Number(vehicleId))) {
      return res.status(400).json({
        success: false,
        message: "Invalid vehicle ID",
      });
    }

    const id = Number(vehicleId);

    const hasActive = await vehicleServices.hasActiveBookingsForVehicle(id);
    if (hasActive) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete vehicle with active bookings",
      });
    }

    const deleted = await vehicleServices.deleteVehicle(id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Vehicle deleted successfully",
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message || "Error deleting vehicle",
    });
  }
};

export const vehicleControllers = {
  createVehicle,
  getAllVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
};
