🚗 Vehicle Rental System – Backend API

Live URL: https://assignment-2-kappa-lime.vercel.app/

📌 Project Overview

The Vehicle Rental System is a backend REST API built using Node.js, TypeScript, and PostgreSQL (Neon DB).
It provides complete functionality for:

User authentication (Admin & Customer)

Managing vehicles

Handling bookings

Role-based access control

Automatic booking return logic

The project follows a clean modular architecture (Routes → Controllers → Services) for scalability and maintainability.

🛠️ Features
🔐 Authentication

User signup & login

Password hashing using bcrypt

JWT-based authentication

Role validation: admin, customer

🚗 Vehicle Management

Add, view, update, delete vehicles

Prevent deletion if vehicle has active bookings

Track availability (available, booked)

👤 User Management

Admin can update/delete any user

Customers can update only their own profile

Prevent deleting users with active bookings

📅 Booking Management

Create bookings with automatic total price calculation

Auto-update vehicle availability

Admin views all bookings

Customers view only their own bookings

Cancel bookings (customer)

Mark as returned (admin)

Automatic return for expired bookings

🧱 Technology Stack
Layer	Technology
Runtime	Node.js
Language	TypeScript
Framework	Express.js
Database	PostgreSQL (Neon)
Authentication	JWT + bcrypt
Architecture	Modular MVC pattern
📂 Project Structure
src/
 ├── config/
 ├── middleware/
 ├── modules/
 │     ├── auth/
 │     ├── users/
 │     ├── vehicles/
 │     └── bookings/
 ├── app.ts
 └── server.ts


Each module contains:

*.routes.ts

*.controller.ts

*.service.ts

Ensuring clean separation of concerns.

⚙️ Setup Instructions
1️⃣ Clone the project
git clone https://github.com/AvinasHSinha07/Assignment_2
cd vehicle-rental-system

2️⃣ Install dependencies
npm install

3️⃣ Create .env file
PORT=5000
CONNECTION_STR=your_neon_postgres_connection_string
JWT_SECRET=your_secret_key

4️⃣ Start development server
npm run dev


Server will run at:

http://localhost:5000

🚀 Usage

Use Postman to test API endpoints:
Examples:

POST /api/v1/auth/signup

POST /api/v1/auth/signin

GET /api/v1/vehicles

POST /api/v1/bookings

PUT /api/v1/bookings/:id