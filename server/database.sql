CREATE DATABASE IF NOT EXISTS clinic_app;

USE clinic_app;

DROP TABLE IF EXISTS patient_notes;
DROP TABLE IF EXISTS admin;
DROP TABLE IF EXISTS clinician;
DROP TABLE IF EXISTS staff;
DROP TABLE IF EXISTS patient;
DROP TABLE IF EXISTS user_account;
DROP TABLE IF EXISTS clinic;

CREATE TABLE clinic (
    clinic_id VARCHAR(50) PRIMARY KEY,
    clinic_name VARCHAR(100) NOT NULL
);

CREATE TABLE user_account (
    user_id VARCHAR(50) PRIMARY KEY,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(100) NOT NULL,
    user_type VARCHAR(20) NOT NULL,
    clinic_id VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (clinic_id) REFERENCES clinic(clinic_id)
);

CREATE TABLE patient (
    patient_id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) UNIQUE NOT NULL,
    clinic_id VARCHAR(50) NOT NULL,
    patient_name VARCHAR(50) NOT NULL,

    FOREIGN KEY (user_id) REFERENCES user_account(user_id) ON DELETE CASCADE,
    FOREIGN KEY (clinic_id) REFERENCES clinic(clinic_id)
);

CREATE TABLE staff (
    staff_id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) UNIQUE NOT NULL,
    clinic_id VARCHAR(50) NOT NULL,
    staff_name VARCHAR(50) NOT NULL,

    FOREIGN KEY (user_id) REFERENCES user_account(user_id) ON DELETE CASCADE,
    FOREIGN KEY (clinic_id) REFERENCES clinic(clinic_id)
);

CREATE TABLE clinician (
    clinician_id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) UNIQUE NOT NULL,
    clinic_id VARCHAR(50) NOT NULL,
    clinician_name VARCHAR(50) NOT NULL,

    FOREIGN KEY (user_id) REFERENCES user_account(user_id) ON DELETE CASCADE,
    FOREIGN KEY (clinic_id) REFERENCES clinic(clinic_id)
);

CREATE TABLE admin (
    admin_id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) UNIQUE NOT NULL,
    clinic_id VARCHAR(50) NOT NULL,
    admin_name VARCHAR(50) NOT NULL,

    FOREIGN KEY (user_id) REFERENCES user_account(user_id) ON DELETE CASCADE,
    FOREIGN KEY (clinic_id) REFERENCES clinic(clinic_id)
);

CREATE TABLE patient_notes (
    note_id SERIAL PRIMARY KEY,
    
    patient_id VARCHAR(50) NOT NULL,
    clinic_id VARCHAR(50) NOT NULL,
    staff_id VARCHAR(50),
    clinician_id VARCHAR(50),
    
    note_text TEXT NOT NULL,
    note_type VARCHAR(20) NOT NULL,

    is_patient_visible BOOLEAN DEFAULT FALSE,
    note_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (patient_id) REFERENCES patient(patient_id) ON DELETE CASCADE,
    FOREIGN KEY (clinic_id) REFERENCES clinic(clinic_id),
    FOREIGN KEY (staff_id) REFERENCES staff(staff_id) ON DELETE SET NULL,
    FOREIGN KEY (clinician_id) REFERENCES clinician(clinician_id) ON DELETE SET NULL
);

INSERT INTO clinic (clinic_id, clinic_name)
VALUES ('CLINIC_001', 'Nightingale Clinic');

INSERT INTO user_account (user_id, email, password, user_type, clinic_id)
VALUES (
    'USER_PAT_001',
    'patient1@nightingale.com',
    '$2b$10$hashedpatientpassword',
    'patient',
    'CLINIC_001'
);

INSERT INTO user_account (user_id, email, password, user_type, clinic_id)
VALUES (
    'USER_STAFF_001',
    'staff1@nightingale.com',
    '$2b$10$hashedstaffpassword',
    'staff',
    'CLINIC_001'
);

INSERT INTO user_account (user_id, email, password, user_type, clinic_id)
VALUES (
    'USER_CLIN_001',
    'clinician1@nightingale.com',
    '$2b$10$hashedclinicianpassword',
    'clinician',
    'CLINIC_001'
);

INSERT INTO user_account (user_id, email, password, user_type, clinic_id)
VALUES (
    'USER_ADMIN_001',
    'admin1@nightingale.com',
    '$2b$10$hashedadminpassword',
    'admin',
    'CLINIC_001'
);

INSERT INTO patient (patient_id, user_id, clinic_id, patient_name)
VALUES (
    'PAT_001',
    'USER_PAT_001',
    'CLINIC_001',
    'Alice Tan'
);

INSERT INTO staff (staff_id, user_id, clinic_id, staff_name)
VALUES (
    'STAFF_001',
    'USER_STAFF_001',
    'CLINIC_001',
    'Ben Lim'
);

INSERT INTO clinician (clinician_id, user_id, clinic_id, clinician_name)
VALUES (
    'CLIN_001',
    'USER_CLIN_001',
    'CLINIC_001',
    'Dr Chen Wei'
);

INSERT INTO admin (admin_id, user_id, clinic_id, admin_name)
VALUES (
    'ADMIN_001',
    'USER_ADMIN_001',
    'CLINIC_001',
    'Sarah Ong'
);

INSERT INTO patient_notes (
    patient_id,
    clinic_id,
    staff_id,
    note_text,
    note_type,
    is_patient_visible
)
VALUES (
    'PAT_001',
    'CLINIC_001',
    'STAFF_001',
    'Patient arrived late, rescheduled appointment.',
    'staff',
    false
);

INSERT INTO patient_notes (
    patient_id,
    clinic_id,
    clinician_id,
    note_text,
    note_type,
    is_patient_visible
)
VALUES (
    'PAT_001',
    'CLINIC_001',
    'CLIN_001',
    'Blood pressure slightly elevated, monitor weekly.',
    'clinician',
    false
);

INSERT INTO patient_notes (
    patient_id,
    clinic_id,
    note_text,
    note_type,
    is_patient_visible
)
VALUES (
    'PAT_001',
    'CLINIC_001',
    'Your blood pressure was slightly high. Please monitor weekly.',
    'ai',
    true
);
