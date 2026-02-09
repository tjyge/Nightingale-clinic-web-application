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

-- Insert Clinic
INSERT INTO clinic (clinic_id, clinic_name)
VALUES ('CLINIC_001', 'Nightingale Clinic');

-- Insert Staff/Clinician/Admin User Accounts
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

-- Insert Staff/Clinician/Admin
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

-- ==========================================
-- PATIENT 1: Alice Tan
-- ==========================================
INSERT INTO user_account (user_id, email, password, user_type, clinic_id)
VALUES ('USER_PAT_001', 'patient1@nightingale.com', '$2b$10$hashedpatientpassword', 'patient', 'CLINIC_001');

INSERT INTO patient (patient_id, user_id, clinic_id, patient_name)
VALUES ('PAT_001', 'USER_PAT_001', 'CLINIC_001', 'Alice Tan');

INSERT INTO patient_notes (patient_id, clinic_id, staff_id, note_text, note_type, is_patient_visible)
VALUES ('PAT_001', 'CLINIC_001', 'STAFF_001', 'Patient arrived late, rescheduled appointment.', 'staff', false);

INSERT INTO patient_notes (patient_id, clinic_id, clinician_id, note_text, note_type, is_patient_visible)
VALUES ('PAT_001', 'CLINIC_001', 'CLIN_001', 'Blood pressure slightly elevated, monitor weekly.', 'clinician', false);

INSERT INTO patient_notes (patient_id, clinic_id, note_text, note_type, is_patient_visible)
VALUES ('PAT_001', 'CLINIC_001', 'Your blood pressure was slightly high. Please monitor weekly.', 'ai', true);

-- ==========================================
-- PATIENT 2: Bob Wong
-- ==========================================
INSERT INTO user_account (user_id, email, password, user_type, clinic_id)
VALUES ('USER_PAT_002', 'patient2@nightingale.com', '$2b$10$hashedpatientpassword', 'patient', 'CLINIC_001');

INSERT INTO patient (patient_id, user_id, clinic_id, patient_name)
VALUES ('PAT_002', 'USER_PAT_002', 'CLINIC_001', 'Bob Wong');

INSERT INTO patient_notes (patient_id, clinic_id, staff_id, note_text, note_type, is_patient_visible)
VALUES ('PAT_002', 'CLINIC_001', 'STAFF_001', 'Patient requested digital copy of medical records.', 'staff', false);

INSERT INTO patient_notes (patient_id, clinic_id, clinician_id, note_text, note_type, is_patient_visible)
VALUES ('PAT_002', 'CLINIC_001', 'CLIN_001', 'Diagnosed with Type 2 diabetes. Started on Metformin 500mg.', 'clinician', false);

INSERT INTO patient_notes (patient_id, clinic_id, note_text, note_type, is_patient_visible)
VALUES ('PAT_002', 'CLINIC_001', 'You have been diagnosed with Type 2 diabetes. Please take your medication as prescribed.', 'ai', true);

-- ==========================================
-- PATIENT 3: Catherine Lee
-- ==========================================
INSERT INTO user_account (user_id, email, password, user_type, clinic_id)
VALUES ('USER_PAT_003', 'patient3@nightingale.com', '$2b$10$hashedpatientpassword', 'patient', 'CLINIC_001');

INSERT INTO patient (patient_id, user_id, clinic_id, patient_name)
VALUES ('PAT_003', 'USER_PAT_003', 'CLINIC_001', 'Catherine Lee');

INSERT INTO patient_notes (patient_id, clinic_id, staff_id, note_text, note_type, is_patient_visible)
VALUES ('PAT_003', 'CLINIC_001', 'STAFF_001', 'Patient completed annual physical exam paperwork.', 'staff', false);

INSERT INTO patient_notes (patient_id, clinic_id, clinician_id, note_text, note_type, is_patient_visible)
VALUES ('PAT_003', 'CLINIC_001', 'CLIN_001', 'Annual checkup completed. All vitals normal. Continue current lifestyle.', 'clinician', false);

INSERT INTO patient_notes (patient_id, clinic_id, note_text, note_type, is_patient_visible)
VALUES ('PAT_003', 'CLINIC_001', 'Your annual checkup looks great! Keep up the healthy habits.', 'ai', true);

-- ==========================================
-- PATIENT 4: David Ng
-- ==========================================
INSERT INTO user_account (user_id, email, password, user_type, clinic_id)
VALUES ('USER_PAT_004', 'patient4@nightingale.com', '$2b$10$hashedpatientpassword', 'patient', 'CLINIC_001');

INSERT INTO patient (patient_id, user_id, clinic_id, patient_name)
VALUES ('PAT_004', 'USER_PAT_004', 'CLINIC_001', 'David Ng');

INSERT INTO patient_notes (patient_id, clinic_id, staff_id, note_text, note_type, is_patient_visible)
VALUES ('PAT_004', 'CLINIC_001', 'STAFF_001', 'Patient called to confirm appointment for next week.', 'staff', false);

INSERT INTO patient_notes (patient_id, clinic_id, clinician_id, note_text, note_type, is_patient_visible)
VALUES ('PAT_004', 'CLINIC_001', 'CLIN_001', 'Complaint of persistent headaches. Ordered MRI scan.', 'clinician', false);

INSERT INTO patient_notes (patient_id, clinic_id, note_text, note_type, is_patient_visible)
VALUES ('PAT_004', 'CLINIC_001', 'Your MRI has been scheduled. Please fast for 4 hours before the scan.', 'ai', true);

-- ==========================================
-- PATIENT 5: Emily Koh
-- ==========================================
INSERT INTO user_account (user_id, email, password, user_type, clinic_id)
VALUES ('USER_PAT_005', 'patient5@nightingale.com', '$2b$10$hashedpatientpassword', 'patient', 'CLINIC_001');

INSERT INTO patient (patient_id, user_id, clinic_id, patient_name)
VALUES ('PAT_005', 'USER_PAT_005', 'CLINIC_001', 'Emily Koh');

INSERT INTO patient_notes (patient_id, clinic_id, staff_id, note_text, note_type, is_patient_visible)
VALUES ('PAT_005', 'CLINIC_001', 'STAFF_001', 'Patient updated insurance information.', 'staff', false);

INSERT INTO patient_notes (patient_id, clinic_id, clinician_id, note_text, note_type, is_patient_visible)
VALUES ('PAT_005', 'CLINIC_001', 'CLIN_001', 'Seasonal allergies. Prescribed antihistamine for 2 weeks.', 'clinician', false);

INSERT INTO patient_notes (patient_id, clinic_id, note_text, note_type, is_patient_visible)
VALUES ('PAT_005', 'CLINIC_001', 'Take your allergy medication once daily. Avoid outdoor activities during high pollen days.', 'ai', true);

-- ==========================================
-- PATIENT 6: Frank Tan
-- ==========================================
INSERT INTO user_account (user_id, email, password, user_type, clinic_id)
VALUES ('USER_PAT_006', 'patient6@nightingale.com', '$2b$10$hashedpatientpassword', 'patient', 'CLINIC_001');

INSERT INTO patient (patient_id, user_id, clinic_id, patient_name)
VALUES ('PAT_006', 'USER_PAT_006', 'CLINIC_001', 'Frank Tan');

INSERT INTO patient_notes (patient_id, clinic_id, staff_id, note_text, note_type, is_patient_visible)
VALUES ('PAT_006', 'CLINIC_001', 'STAFF_001', 'Patient scheduled follow-up for lab results.', 'staff', false);

INSERT INTO patient_notes (patient_id, clinic_id, clinician_id, note_text, note_type, is_patient_visible)
VALUES ('PAT_006', 'CLINIC_001', 'CLIN_001', 'Cholesterol levels high. Recommended dietary changes and statin therapy.', 'clinician', false);

INSERT INTO patient_notes (patient_id, clinic_id, note_text, note_type, is_patient_visible)
VALUES ('PAT_006', 'CLINIC_001', 'Your cholesterol is elevated. Please reduce saturated fats and start medication.', 'ai', true);

-- ==========================================
-- PATIENT 7: Grace Lim
-- ==========================================
INSERT INTO user_account (user_id, email, password, user_type, clinic_id)
VALUES ('USER_PAT_007', 'patient7@nightingale.com', '$2b$10$hashedpatientpassword', 'patient', 'CLINIC_001');

INSERT INTO patient (patient_id, user_id, clinic_id, patient_name)
VALUES ('PAT_007', 'USER_PAT_007', 'CLINIC_001', 'Grace Lim');

INSERT INTO patient_notes (patient_id, clinic_id, staff_id, note_text, note_type, is_patient_visible)
VALUES ('PAT_007', 'CLINIC_001', 'STAFF_001', 'Patient requested prescription refill for hypertension medication.', 'staff', false);

INSERT INTO patient_notes (patient_id, clinic_id, clinician_id, note_text, note_type, is_patient_visible)
VALUES ('PAT_007', 'CLINIC_001', 'CLIN_001', 'Blood pressure well-controlled. Continued current medication regimen.', 'clinician', false);

INSERT INTO patient_notes (patient_id, clinic_id, note_text, note_type, is_patient_visible)
VALUES ('PAT_007', 'CLINIC_001', 'Your blood pressure is well-controlled. Continue taking your medication daily.', 'ai', true);

-- ==========================================
-- PATIENT 8: Henry Ong
-- ==========================================
INSERT INTO user_account (user_id, email, password, user_type, clinic_id)
VALUES ('USER_PAT_008', 'patient8@nightingale.com', '$2b$10$hashedpatientpassword', 'patient', 'CLINIC_001');

INSERT INTO patient (patient_id, user_id, clinic_id, patient_name)
VALUES ('PAT_008', 'USER_PAT_008', 'CLINIC_001', 'Henry Ong');

INSERT INTO patient_notes (patient_id, clinic_id, staff_id, note_text, note_type, is_patient_visible)
VALUES ('PAT_008', 'CLINIC_001', 'STAFF_001', 'Patient cancelled tomorrow appointment, rescheduled for next month.', 'staff', false);

INSERT INTO patient_notes (patient_id, clinic_id, clinician_id, note_text, note_type, is_patient_visible)
VALUES ('PAT_008', 'CLINIC_001', 'CLIN_001', 'Lower back pain assessment. Recommended physiotherapy sessions.', 'clinician', false);

INSERT INTO patient_notes (patient_id, clinic_id, note_text, note_type, is_patient_visible)
VALUES ('PAT_008', 'CLINIC_001', 'Start physiotherapy for your back pain. Avoid heavy lifting for 2 weeks.', 'ai', true);

-- ==========================================
-- PATIENT 9: Iris Chen
-- ==========================================
INSERT INTO user_account (user_id, email, password, user_type, clinic_id)
VALUES ('USER_PAT_009', 'patient9@nightingale.com', '$2b$10$hashedpatientpassword', 'patient', 'CLINIC_001');

INSERT INTO patient (patient_id, user_id, clinic_id, patient_name)
VALUES ('PAT_009', 'USER_PAT_009', 'CLINIC_001', 'Iris Chen');

INSERT INTO patient_notes (patient_id, clinic_id, staff_id, note_text, note_type, is_patient_visible)
VALUES ('PAT_009', 'CLINIC_001', 'STAFF_001', 'Patient inquired about vaccination schedule for travel.', 'staff', false);

INSERT INTO patient_notes (patient_id, clinic_id, clinician_id, note_text, note_type, is_patient_visible)
VALUES ('PAT_009', 'CLINIC_001', 'CLIN_001', 'Administered Hepatitis A and Typhoid vaccines for upcoming trip.', 'clinician', false);

INSERT INTO patient_notes (patient_id, clinic_id, note_text, note_type, is_patient_visible)
VALUES ('PAT_009', 'CLINIC_001', 'Your travel vaccines are complete. Safe travels!', 'ai', true);

-- ==========================================
-- PATIENT 10: James Teo
-- ==========================================
INSERT INTO user_account (user_id, email, password, user_type, clinic_id)
VALUES ('USER_PAT_010', 'patient10@nightingale.com', '$2b$10$hashedpatientpassword', 'patient', 'CLINIC_001');

INSERT INTO patient (patient_id, user_id, clinic_id, patient_name)
VALUES ('PAT_010', 'USER_PAT_010', 'CLINIC_001', 'James Teo');

INSERT INTO patient_notes (patient_id, clinic_id, staff_id, note_text, note_type, is_patient_visible)
VALUES ('PAT_010', 'CLINIC_001', 'STAFF_001', 'Patient submitted health screening consent form.', 'staff', false);

INSERT INTO patient_notes (patient_id, clinic_id, clinician_id, note_text, note_type, is_patient_visible)
VALUES ('PAT_010', 'CLINIC_001', 'CLIN_001', 'Routine health screening completed. Awaiting blood test results.', 'clinician', false);

INSERT INTO patient_notes (patient_id, clinic_id, note_text, note_type, is_patient_visible)
VALUES ('PAT_010', 'CLINIC_001', 'Your health screening is complete. Blood test results will be ready in 3 days.', 'ai', true);