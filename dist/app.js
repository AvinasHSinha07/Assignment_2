"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("./config/db"));
const logger_1 = __importDefault(require("./middleware/logger"));
const auth_routes_1 = require("./modules/auth/auth.routes");
const user_routes_1 = require("./modules/users/user.routes");
const vehicle_routes_1 = require("./modules/vehicles/vehicle.routes");
const booking_routes_1 = require("./modules/bookings/booking.routes");
const app = (0, express_1.default)();
app.use(express_1.default.json());
(0, db_1.default)();
app.get("/", logger_1.default, (req, res) => {
    res.send("Vehicle Rental System API is running");
});
app.use("/api/v1/auth", auth_routes_1.authRoutes);
app.use("/api/v1/users", user_routes_1.userRoutes);
app.use("/api/v1/vehicles", vehicle_routes_1.vehicleRoutes);
app.use("/api/v1/bookings", booking_routes_1.bookingRoutes);
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
        path: req.path,
    });
});
exports.default = app;
