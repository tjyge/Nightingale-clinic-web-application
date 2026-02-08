const db = require('../db');

class Patient {

  // View own patient profile
  async viewProfile(patient_id, clinic_id) {
    const [rows] = await db.execute(
      `SELECT patient_id, patient_name
       FROM patient
       WHERE patient_id = ?
         AND clinic_id = ?`,
      [patient_id, clinic_id]
    );

    return rows[0];
  }

  // View ONLY own notes (patient-visible only)
  async viewMyNotes(patient_id, clinic_id) {
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
}

module.exports = new Patient();
