// server.js
const express = require('express');
const cors = require('cors');

const loginRoutes = require('./routes/loginRoutes');
const userAccountRoutes = require('./routes/userAccountRoutes');
const patientRoutes = require('./routes/patientRoutes');
const staffRoutes = require('./routes/staffRoutes');
const clinicianRoutes = require('./routes/clinicianRoutes');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// Login
app.use('/api/login', loginRoutes);
// Admin – user account management
app.use('/api/users', userAccountRoutes);
// Patient routes
app.use('/api/patient', patientRoutes);
// Staff routes
app.use('/api/staff', staffRoutes);
// Clinician routes
app.use('/api/clinician', clinicianRoutes);

app.listen(5000, () => console.log('Server running on port 5000'));