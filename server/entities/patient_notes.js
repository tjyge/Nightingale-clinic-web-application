const db = require('../db');

class PatientNotes {

  // 👀 View all notes for a patient (staff / clinician use)
  async viewPatientNotes(patient_id, clinic_id) {
    const [notes] = await db.execute(
      `SELECT 
          note_id,
          patient_id,
          staff_id,
          clinician_id,
          note_text,
          note_type,
          is_patient_visible,
          note_time
       FROM patient_notes
       WHERE patient_id = ?
         AND clinic_id = ?
       ORDER BY note_time DESC`,
      [patient_id, clinic_id]
    );

    return notes;
  }

  // 👀 View patient-visible notes only (patient use)
  async viewPatientVisibleNotes(patient_id, clinic_id) {
    const [notes] = await db.execute(
      `SELECT 
          note_id,
          note_text,
          note_type,
          note_time
       FROM patient_notes
       WHERE patient_id = ?
         AND clinic_id = ?
         AND is_patient_visible = true
       ORDER BY note_time DESC`,
      [patient_id, clinic_id]
    );

    return notes;
  }

  // ✍️ Create staff note
  async createStaffNote(patient_id, clinic_id, staff_id, note_text) {
    const [result] = await db.execute(
      `INSERT INTO patient_notes
       (patient_id, clinic_id, staff_id, note_text, note_type)
       VALUES (?, ?, ?, ?, 'staff')`,
      [patient_id, clinic_id, staff_id, note_text]
    );

    return result.insertId;
  }

  // ✍️ Create clinician note
  async createClinicianNote(
    patient_id,
    clinic_id,
    clinician_id,
    note_text,
    is_patient_visible = false
  ) {
    const [result] = await db.execute(
      `INSERT INTO patient_notes
       (patient_id, clinic_id, clinician_id, note_text, note_type, is_patient_visible)
       VALUES (?, ?, ?, ?, 'clinician', ?)`,
      [patient_id, clinic_id, clinician_id, note_text, is_patient_visible]
    );

    return result.insertId;
  }

  // ✏️ Update staff note (staff can edit only their own notes)
  async updateStaffNote(note_id, staff_id, clinic_id, note_text) {
    const [result] = await db.execute(
      `UPDATE patient_notes
       SET note_text = ?
       WHERE note_id = ?
         AND staff_id = ?
         AND clinic_id = ?
         AND note_type = 'staff'`,
      [note_text, note_id, staff_id, clinic_id]
    );

    return result.affectedRows > 0;
  }

  // ✏️ Update clinician note (clinician can edit only their own notes)
  async updateClinicianNote(
    note_id,
    clinician_id,
    clinic_id,
    note_text,
    is_patient_visible
  ) {
    const [result] = await db.execute(
      `UPDATE patient_notes
       SET note_text = ?, is_patient_visible = ?
       WHERE note_id = ?
         AND clinician_id = ?
         AND clinic_id = ?
         AND note_type = 'clinician'`,
      [note_text, is_patient_visible, note_id, clinician_id, clinic_id]
    );

    return result.affectedRows > 0;
  }
}

module.exports = new PatientNotes();
