import { pool } from "../../config/db";

const getAllUsers = async () => {
  const result = await pool.query(
    `SELECT id, name, email, phone, role FROM users ORDER BY id`
  );
  return result.rows;
};

const getUserById = async (id: number) => {
  const result = await pool.query(
    `SELECT id, name, email, phone, role FROM users WHERE id = $1`,
    [id]
  );
  return result.rows[0];
};

const updateUser = async (
  id: number,
  payload: { name?: string; email?: string; phone?: string; role?: string },
  isAdmin: boolean
) => {
  const existingResult = await pool.query(
    `SELECT id, name, email, phone, role FROM users WHERE id = $1`,
    [id]
  );

  if (existingResult.rowCount === 0) {
    return null;
  }

  const existing = existingResult.rows[0];

  const newName = payload.name ?? existing.name;
  const newEmail = (payload.email ?? existing.email).toLowerCase();
  const newPhone = payload.phone ?? existing.phone;
  let newRole = existing.role;


  if (isAdmin && payload.role) {
    newRole = payload.role;
  }

  const result = await pool.query(
    `UPDATE users
     SET name = $1,
         email = $2,
         phone = $3,
         role = $4,
         updated_at = NOW()
     WHERE id = $5
     RETURNING id, name, email, phone, role`,
    [newName, newEmail, newPhone, newRole, id]
  );

  return result.rows[0];
};

const hasActiveBookingsForUser = async (userId: number) => {
  const result = await pool.query(
    `SELECT 1 FROM bookings WHERE customer_id = $1 AND status = 'active' LIMIT 1`,
    [userId]
  );
  return (result.rowCount ?? 0) > 0;
};

const deleteUser = async (id: number) => {
  const result = await pool.query(
    `DELETE FROM users WHERE id = $1`,
    [id]
  );
  return (result.rowCount ?? 0) > 0;
};

export const userServices = {
  getAllUsers,
  getUserById,
  updateUser,
  hasActiveBookingsForUser,
  deleteUser,
};
