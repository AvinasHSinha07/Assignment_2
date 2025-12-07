import { pool } from "../../config/db";

const createVehicle = async (payload: {
  vehicle_name: string;
  type: string;
  registration_number: string;
  daily_rent_price: number;
  availability_status: "available" | "booked";
}) => {
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
  } = payload;

  const result = await pool.query(
    `INSERT INTO vehicles (
      vehicle_name, type, registration_number, daily_rent_price, availability_status
    ) VALUES ($1, $2, $3, $4, $5)
    RETURNING id, vehicle_name, type, registration_number, daily_rent_price, availability_status`,
    [
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
    ]
  );

  return result.rows[0];
};

const getAllVehicles = async () => {
  const result = await pool.query(
    `SELECT id, vehicle_name, type, registration_number, daily_rent_price, availability_status
     FROM vehicles
     ORDER BY id`
  );
  return result.rows;
};

const getVehicleById = async (id: number) => {
  const result = await pool.query(
    `SELECT id, vehicle_name, type, registration_number, daily_rent_price, availability_status
     FROM vehicles
     WHERE id = $1`,
    [id]
  );
  return result.rows[0];
};

const updateVehicle = async (
  id: number,
  payload: {
    vehicle_name?: string;
    type?: string;
    registration_number?: string;
    daily_rent_price?: number;
    availability_status?: "available" | "booked";
  }
) => {
  const existing = await getVehicleById(id);
  if (!existing) return null;

  const newVehicleName = payload.vehicle_name ?? existing.vehicle_name;
  const newType = payload.type ?? existing.type;
  const newReg = payload.registration_number ?? existing.registration_number;
  const newPrice =
    payload.daily_rent_price !== undefined
      ? payload.daily_rent_price
      : existing.daily_rent_price;
  const newStatus = payload.availability_status ?? existing.availability_status;

  const result = await pool.query(
    `UPDATE vehicles
     SET vehicle_name = $1,
         type = $2,
         registration_number = $3,
         daily_rent_price = $4,
         availability_status = $5,
         updated_at = NOW()
     WHERE id = $6
     RETURNING id, vehicle_name, type, registration_number, daily_rent_price, availability_status`,
    [newVehicleName, newType, newReg, newPrice, newStatus, id]
  );

  return result.rows[0];
};

const hasActiveBookingsForVehicle = async (vehicleId: number) => {
  const result = await pool.query(
    `SELECT 1 FROM bookings WHERE vehicle_id = $1 AND status = 'active' LIMIT 1`,
    [vehicleId]
  );
  return (result.rowCount ?? 0) > 0;
};

const deleteVehicle = async (id: number) => {
  const result = await pool.query(`DELETE FROM vehicles WHERE id = $1`, [id]);
  return (result.rowCount ?? 0) > 0;
};

export const vehicleServices = {
  createVehicle,
  getAllVehicles,
  getVehicleById,
  updateVehicle,
  hasActiveBookingsForVehicle,
  deleteVehicle,
};
