import { pool } from "../../config/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../../config";

const signupUser = async (payload: {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: "admin" | "customer";
}) => {
  const { name, email, password, phone, role } = payload;

  const lowerEmail = email.toLowerCase();

  const existing = await pool.query(`SELECT id FROM users WHERE email = $1`, [
    lowerEmail,
  ]);

  if (existing.rowCount && existing.rowCount > 0) {
    throw new Error("Email already exists");
  }

  const hashedPass = await bcrypt.hash(password, 10);

  const result = await pool.query(
    `INSERT INTO users (name, email, password, phone, role)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, name, email, phone, role`,
    [name, lowerEmail, hashedPass, phone, role]
  );

  return result.rows[0];
};

const signinUser = async (payload: { email: string; password: string }) => {
  const { email, password } = payload;

  const lowerEmail = email.toLowerCase();

  const result = await pool.query(
    `SELECT id, name, email, password, phone, role
     FROM users
     WHERE email = $1`,
    [lowerEmail]
  );

  if (result.rowCount === 0) {
    throw new Error("Invalid credentials");
  }

  const user = result.rows[0];

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    config.jwtSecret as string,
    { expiresIn: "1h" }
  );

  const userResponse = {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
  };

  return { token, user: userResponse };
};

export const authServices = {
  signupUser,
  signinUser,
};
