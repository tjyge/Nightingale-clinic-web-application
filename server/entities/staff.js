const db = require('../db');

class Staff {

  // View all patients in the same clinic
  async viewPatients(clinic_id) {
    const [patients] = await db.execute(
      `SELECT patient_id, patient_name
       FROM patient
       WHERE clinic_id = ?`,
      [clinic_id]
    );
    return patients;
  }

  // View patient notes (staff can see staff + clinician + AI notes)
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

  // Update a STAFF note only
  async updatePatientNote(note_id, staff_id, clinic_id, updatedText) {
    const [result] = await db.execute(
      `UPDATE patient_notes
       SET note_text = ?
       WHERE note_id = ?
         AND staff_id = ?
         AND clinic_id = ?
         AND note_type = 'staff'`,
      [updatedText, note_id, staff_id, clinic_id]
    );

    return result.affectedRows > 0;
  }
}

module.exports = new Staff();
