# 🚗 Vehicle Rental System – Backend API
**Live URL:** https://assignment-2-kappa-lime.vercel.app/

## 📌 Overview
A backend REST API built using **Node.js, TypeScript, Express.js, and PostgreSQL (Neon DB)**.  
It provides user authentication, vehicle management, rental bookings, and secure role-based access.

## 🛠️ Features
- User Signup & Login (JWT Authentication)
- Roles: Admin & Customer
- Vehicle CRUD + Availability Tracking
- Booking Creation, Cancellation & Return
- Auto Price Calculation (daily rate × days)
- Prevent deleting users/vehicles with active bookings

## 🧱 Tech Stack
- Node.js + TypeScript  
- Express.js  
- PostgreSQL (Neon)  
- JWT + bcrypt  

## 📂 Project Structure


src/
├── config/
├── middleware/
├── modules/ (auth, users, vehicles, bookings)
├── app.ts
└── server.ts



## ⚙️ Setup Instructions
1. Install dependencies:

npm install

2. Create `.env` file:

PORT=5000
CONNECTION_STR=your_neon_db_connection_string
JWT_SECRET=your_secret_key


3. Start development server:


npm run dev


## 🚀 Usage

Use Postman to test all API endpoints.






