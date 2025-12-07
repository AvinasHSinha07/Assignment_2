"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingControllers = void 0;
const booking_service_1 = require("./booking.service");
const createBooking = async (req, res) => {
    try {
        const { customer_id, vehicle_id, rent_start_date, rent_end_date } = req.body;
        const user = req.user;
        if (!customer_id || !vehicle_id || !rent_start_date || !rent_end_date) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }
        if (user.role === "customer" && Number(customer_id) !== user.id) {
            return res.status(403).json({
                success: false,
                message: "You can only create bookings for your own account",
            });
        }
        const booking = await booking_service_1.bookingServices.createBooking({
            customer_id,
            vehicle_id,
            rent_start_date,
            rent_end_date,
        });
        return res.status(201).json({
            success: true,
            message: "Booking created successfully",
            data: booking,
        });
    }
    catch (err) {
        return res.status(400).json({
            success: false,
            message: err.message || "Error creating booking",
        });
    }
};
const getBookings = async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }
        await booking_service_1.bookingServices.autoReturnExpiredBookings();
        if (user.role === "admin") {
            const bookings = await booking_service_1.bookingServices.getBookingsForAdmin();
            return res.status(200).json({
                success: true,
                message: "Bookings retrieved successfully",
                data: bookings,
            });
        }
        else {
            const bookings = await booking_service_1.bookingServices.getBookingsForCustomer(user.id);
            return res.status(200).json({
                success: true,
                message: "Your bookings retrieved successfully",
                data: bookings,
            });
        }
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message || "Error retrieving bookings",
        });
    }
};
const updateBooking = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const { status } = req.body;
        const user = req.user;
        if (!bookingId || isNaN(Number(bookingId))) {
            return res.status(400).json({
                success: false,
                message: "Invalid booking ID",
            });
        }
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }
        if (status !== "cancelled" && status !== "returned") {
            return res.status(400).json({
                success: false,
                message: "Invalid status",
            });
        }
        const id = Number(bookingId);
        const booking = await booking_service_1.bookingServices.getBookingById(id);
        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found",
            });
        }
        if (user.role === "customer") {
            if (booking.customer_id !== user.id) {
                return res.status(403).json({
                    success: false,
                    message: "Forbidden",
                });
            }
            if (status !== "cancelled") {
                return res.status(400).json({
                    success: false,
                    message: "Customers can only cancel bookings",
                });
            }
            const today = new Date();
            const startDate = new Date(booking.rent_start_date);
            if (startDate <= today) {
                return res.status(400).json({
                    success: false,
                    message: "Booking can only be cancelled before start date",
                });
            }
            const updated = await booking_service_1.bookingServices.updateBookingStatus(id, "cancelled");
            await booking_service_1.bookingServices.setVehicleAvailable(booking.vehicle_id);
            return res.status(200).json({
                success: true,
                message: "Booking cancelled successfully",
                data: {
                    id: updated.id,
                    customer_id: updated.customer_id,
                    vehicle_id: updated.vehicle_id,
                    rent_start_date: updated.rent_start_date,
                    rent_end_date: updated.rent_end_date,
                    total_price: updated.total_price,
                    status: updated.status,
                },
            });
        }
        if (user.role === "admin") {
            if (status !== "returned") {
                return res.status(400).json({
                    success: false,
                    message: "Admin can only mark booking as returned",
                });
            }
            const updated = await booking_service_1.bookingServices.updateBookingStatus(id, "returned");
            await booking_service_1.bookingServices.setVehicleAvailable(booking.vehicle_id);
            return res.status(200).json({
                success: true,
                message: "Booking marked as returned. Vehicle is now available",
                data: {
                    id: updated.id,
                    customer_id: updated.customer_id,
                    vehicle_id: updated.vehicle_id,
                    rent_start_date: updated.rent_start_date,
                    rent_end_date: updated.rent_end_date,
                    total_price: updated.total_price,
                    status: updated.status,
                    vehicle: {
                        availability_status: "available",
                    },
                },
            });
        }
        return res.status(403).json({
            success: false,
            message: "Forbidden",
        });
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message || "Error updating booking",
        });
    }
};
exports.bookingControllers = {
    createBooking,
    getBookings,
    updateBooking,
};
