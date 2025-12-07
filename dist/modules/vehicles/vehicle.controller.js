"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.vehicleControllers = void 0;
const vehicle_service_1 = require("./vehicle.service");
const createVehicle = async (req, res) => {
    try {
        const { vehicle_name, type, registration_number, daily_rent_price, availability_status, } = req.body;
        if (!vehicle_name ||
            !type ||
            !registration_number ||
            daily_rent_price === undefined ||
            !availability_status) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }
        const vehicle = await vehicle_service_1.vehicleServices.createVehicle({
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
    }
    catch (err) {
        return res.status(400).json({
            success: false,
            message: err.message || "Error creating vehicle",
        });
    }
};
const getAllVehicles = async (req, res) => {
    try {
        const vehicles = await vehicle_service_1.vehicleServices.getAllVehicles();
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
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message || "Error retrieving vehicles",
        });
    }
};
const getVehicleById = async (req, res) => {
    try {
        const { vehicleId } = req.params;
        if (!vehicleId || isNaN(Number(vehicleId))) {
            return res.status(400).json({
                success: false,
                message: "Invalid vehicle ID",
            });
        }
        const id = Number(vehicleId);
        const vehicle = await vehicle_service_1.vehicleServices.getVehicleById(id);
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
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message || "Error retrieving vehicle",
        });
    }
};
const updateVehicle = async (req, res) => {
    try {
        const { vehicleId } = req.params;
        if (!vehicleId || isNaN(Number(vehicleId))) {
            return res.status(400).json({
                success: false,
                message: "Invalid vehicle ID",
            });
        }
        const id = Number(vehicleId);
        const updated = await vehicle_service_1.vehicleServices.updateVehicle(id, req.body);
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
    }
    catch (err) {
        return res.status(400).json({
            success: false,
            message: err.message || "Error updating vehicle",
        });
    }
};
const deleteVehicle = async (req, res) => {
    try {
        const { vehicleId } = req.params;
        if (!vehicleId || isNaN(Number(vehicleId))) {
            return res.status(400).json({
                success: false,
                message: "Invalid vehicle ID",
            });
        }
        const id = Number(vehicleId);
        const hasActive = await vehicle_service_1.vehicleServices.hasActiveBookingsForVehicle(id);
        if (hasActive) {
            return res.status(400).json({
                success: false,
                message: "Cannot delete vehicle with active bookings",
            });
        }
        const deleted = await vehicle_service_1.vehicleServices.deleteVehicle(id);
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
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message || "Error deleting vehicle",
        });
    }
};
exports.vehicleControllers = {
    createVehicle,
    getAllVehicles,
    getVehicleById,
    updateVehicle,
    deleteVehicle,
};
