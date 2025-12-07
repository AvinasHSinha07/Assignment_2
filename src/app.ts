import express, { Request, Response } from "express";
import initDB from "./config/db";
import logger from "./middleware/logger";
import { authRoutes } from "./modules/auth/auth.routes";
import { userRoutes } from "./modules/users/user.routes";
import { vehicleRoutes } from "./modules/vehicles/vehicle.routes";
import { bookingRoutes } from "./modules/bookings/booking.routes";

const app = express();

app.use(express.json());

initDB();

app.get("/", logger, (req: Request, res: Response) => {
  res.send("Vehicle Rental System API is running");
});

app.use("/api/v1/auth", authRoutes);

app.use("/api/v1/users", userRoutes);

app.use("/api/v1/vehicles", vehicleRoutes);

app.use("/api/v1/bookings", bookingRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.path,
  });
});

export default app;
