"# Nightingale-clinic-web-application" 
This project is a role-based clinic management web application built using a client–server architecture. It supports multiple user roles (Admin, Staff, Clinician, Patient) with strict Role-Based Access Control (RBAC) enforced on the backend.

Tech Stack
Frontend:
-React (Vite)
-JavaScript
-HTML / CSS

Backend:
-Node.js
-Express.js
-MySQL
-RESTful API

Project Structure(Boundary–Control–Entity (BCE) architecture):
Nightingale-clinic-web-application/
│
├── client/                  # React frontend
│   └── src/
│       ├── boundary/         # UI pages (Login, Admin, Staff, etc.)
│       ├── components/       # Reusable UI components
│
├── server/                  # Express backend
│   ├── controllers/         # Control logic (Admin, Staff, Clinician, Patient)
│   ├── entities/            # Database access layer
│   ├── middlewares/         # Auth & RBAC middleware
│   ├── routes/              # API routes
│   ├── database.sql         # Database schema
│   └── server.js
│
└── README.md


Setup Instructions:
1. Clone the repository (git clone)
2. Create a MySQL database, run the SQL script (source server/database.sql;)
3. Backend setup (server will run on http://localhost:5000)
   - cd server
   - npm install
   - node server.js
4. Frontend setup (frontend will run on http://localhost:5137)
    - cd client
    - npm install
    - npm run dev

Authentication Flow:
1. User logs in using email + password
2. Backend verifies credentials against user_account
3. Backend returns:
    - user_type
    - clinic_id
4. Frontend stores:
    - email
    - userType
5. User is redirected to their role-specific page

RBAC is enforced server-side and follows the principle of least privilege.
Supported Roles: admin, staff, clinician, patient
Authorization (controllers):
each controller checks role explicitly, this ensure admin cannot access staff routes, staff cannot access clinician routes, and patients can only access their own data.

