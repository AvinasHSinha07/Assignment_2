import { pool } from "../../config/db";

const getVehicleWithPrice = async (vehicleId: number) => {
  const result = await pool.query(
    `SELECT id, vehicle_name, daily_rent_price, availability_status
     FROM vehicles
     WHERE id = $1`,
    [vehicleId]
  );
  return result.rows[0];
};

const createBooking = async (payload: {
  customer_id: number;
  vehicle_id: number;
  rent_start_date: string;
  rent_end_date: string;
}) => {
  const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;

  const vehicle = await getVehicleWithPrice(vehicle_id);

  if (!vehicle || vehicle.availability_status !== "available") {
    throw new Error("Vehicle not available");
  }

  const start = new Date(rent_start_date);
  const end = new Date(rent_end_date);

  const diffTime = end.getTime() - start.getTime();
  if (diffTime <= 0) {
    throw new Error("rent_end_date must be after rent_start_date");
  }

  const msPerDay = 1000 * 60 * 60 * 24;
  const numberOfDays = Math.round(diffTime / msPerDay);

  const totalPrice = Number(vehicle.daily_rent_price) * numberOfDays;

  const result = await pool.query(
    `INSERT INTO bookings (
      customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status
    ) VALUES ($1, $2, $3, $4, $5, 'active')
    RETURNING id, customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status`,
    [customer_id, vehicle_id, rent_start_date, rent_end_date, totalPrice]
  );

  await pool.query(
    `UPDATE vehicles
     SET availability_status = 'booked', updated_at = NOW()
     WHERE id = $1`,
    [vehicle_id]
  );

  const booking = result.rows[0];

  return {
    ...booking,
    vehicle: {
      vehicle_name: vehicle.vehicle_name,
      daily_rent_price: vehicle.daily_rent_price,
    },
  };
};

const autoReturnExpiredBookings = async () => {
  const result = await pool.query(
    `UPDATE bookings
     SET status = 'returned'
     WHERE status = 'active' AND rent_end_date < CURRENT_DATE
     RETURNING id, vehicle_id`
  );

  for (const row of result.rows) {
    await pool.query(
      `UPDATE vehicles
       SET availability_status = 'available', updated_at = NOW()
       WHERE id = $1`,
      [row.vehicle_id]
    );
  }
};

const getBookingsForAdmin = async () => {
  const result = await pool.query(
    `SELECT 
       b.id,
       b.customer_id,
       b.vehicle_id,
       b.rent_start_date,
       b.rent_end_date,
       b.total_price,
       b.status,
       (SELECT u.name FROM users u WHERE u.id = b.customer_id) AS customer_name,
       (SELECT u.email FROM users u WHERE u.id = b.customer_id) AS customer_email,
       (SELECT v.vehicle_name FROM vehicles v WHERE v.id = b.vehicle_id) AS vehicle_name,
       (SELECT v.registration_number FROM vehicles v WHERE v.id = b.vehicle_id) AS registration_number
     FROM bookings b
     ORDER BY b.id`
  );

  return result.rows.map((row) => ({
    id: row.id,
    customer_id: row.customer_id,
    vehicle_id: row.vehicle_id,
    rent_start_date: row.rent_start_date,
    rent_end_date: row.rent_end_date,
    total_price: row.total_price,
    status: row.status,
    customer: {
      name: row.customer_name,
      email: row.customer_email,
    },
    vehicle: {
      vehicle_name: row.vehicle_name,
      registration_number: row.registration_number,
    },
  }));
};

const getBookingsForCustomer = async (customerId: number) => {
  const result = await pool.query(
    `SELECT 
       b.id,
       b.vehicle_id,
       b.rent_start_date,
       b.rent_end_date,
       b.total_price,
       b.status,
       (SELECT v.vehicle_name FROM vehicles v WHERE v.id = b.vehicle_id) AS vehicle_name,
       (SELECT v.registration_number FROM vehicles v WHERE v.id = b.vehicle_id) AS registration_number,
       (SELECT v.type FROM vehicles v WHERE v.id = b.vehicle_id) AS type
     FROM bookings b
     WHERE b.customer_id = $1
     ORDER BY b.id`,
    [customerId]
  );

  return result.rows.map((row) => ({
    id: row.id,
    vehicle_id: row.vehicle_id,
    rent_start_date: row.rent_start_date,
    rent_end_date: row.rent_end_date,
    total_price: row.total_price,
    status: row.status,
    vehicle: {
      vehicle_name: row.vehicle_name,
      registration_number: row.registration_number,
      type: row.type,
    },
  }));
};

const getBookingById = async (bookingId: number) => {
  const result = await pool.query(`SELECT * FROM bookings WHERE id = $1`, [
    bookingId,
  ]);
  return result.rows[0];
};

const updateBookingStatus = async (
  bookingId: number,
  newStatus: "cancelled" | "returned"
) => {
  const result = await pool.query(
    `UPDATE bookings
     SET status = $1
     WHERE id = $2
     RETURNING *`,
    [newStatus, bookingId]
  );
  return result.rows[0];
};

const setVehicleAvailable = async (vehicleId: number) => {
  await pool.query(
    `UPDATE vehicles
     SET availability_status = 'available', updated_at = NOW()
     WHERE id = $1`,
    [vehicleId]
  );
};

export const bookingServices = {
  createBooking,
  autoReturnExpiredBookings,
  getBookingsForAdmin,
  getBookingsForCustomer,
  getBookingById,
  updateBookingStatus,
  setVehicleAvailable,
};
