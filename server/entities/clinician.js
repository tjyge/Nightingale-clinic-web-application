const db = require('../db');

class Clinician {

  // View all patients in the clinic
  async viewPatients(clinic_id) {
    const [patients] = await db.execute(
      `SELECT patient_id, patient_name
       FROM patient
       WHERE clinic_id = ?`,
      [clinic_id]
    );
    return patients;
  }

  // View ALL notes for a patient (staff + clinician + AI)
  async viewPatientNotes(patient_id, clinic_id) {
    const [notes] = await db.execute(
      `SELECT
          pn.note_id,
          pn.note_text,
          pn.note_type,
          pn.is_patient_visible,
          pn.note_time,
          s.staff_name,
          c.clinician_name
       FROM patient_notes pn
       LEFT JOIN staff s ON pn.staff_id = s.staff_id
       LEFT JOIN clinician c ON pn.clinician_id = c.clinician_id
       WHERE pn.patient_id = ?
         AND pn.clinic_id = ?
       ORDER BY pn.note_time DESC`,
      [patient_id, clinic_id]
    );

    return notes;
  }

  // Add a clinician note
  async addClinicianNote(
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

  // Update clinician's OWN notes only
  async updateClinicianNote(
    note_id,
    clinician_id,
    clinic_id,
    updatedText,
    is_patient_visible
  ) {
    const [result] = await db.execute(
      `UPDATE patient_notes
       SET note_text = ?, is_patient_visible = ?
       WHERE note_id = ?
         AND clinician_id = ?
         AND clinic_id = ?
         AND note_type = 'clinician'`,
      [updatedText, is_patient_visible, note_id, clinician_id, clinic_id]
    );

    return result.affectedRows > 0;
  }
}

module.exports = new Clinician();
