const Clinician = require('../entities/clinician');

class ClinicianViewPatientsController {
  async viewPatients(req, res) {
    try {
      if (req.user.user_type !== 'clinician') {
        return res.status(403).json({ error: 'Forbidden' });
      }

      const patients = await Clinician.viewPatients(req.user.clinic_id);
      res.json(patients);
    } catch (err) {
      console.error('Error viewing patients:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

class ClinicianViewPatientNotesController {
  async viewPatientNotes(req, res) {
    const { patient_id } = req.params;

    try {
      if (req.user.user_type !== 'clinician') {
        return res.status(403).json({ error: 'Forbidden' });
      }

      const notes = await Clinician.viewPatientNotes(
        patient_id,
        req.user.clinic_id
      );

      res.json(notes);
    } catch (err) {
      console.error('Error viewing patient notes:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

class ClinicianAddNoteController {
  async addClinicianNote(req, res) {
    const { patient_id, note_text, is_patient_visible } = req.body;

    try {
      if (req.user.user_type !== 'clinician') {
        return res.status(403).json({ error: 'Forbidden' });
      }

      const noteId = await Clinician.addClinicianNote(
        patient_id,
        req.user.clinic_id,
        req.user.clinician_id,
        note_text,
        is_patient_visible
      );

      res.json({ success: true, note_id: noteId });
    } catch (err) {
      console.error('Error adding clinician note:', err);
      res.status(500).json({ success: false });
    }
  }
}

class ClinicianUpdateNoteController {
  async updateClinicianNote(req, res) {
    const { note_id } = req.params;
    const { note_text, is_patient_visible } = req.body;

    try {
      if (req.user.user_type !== 'clinician') {
        return res.status(403).json({ error: 'Forbidden' });
      }

      const success = await Clinician.updateClinicianNote(
        note_id,
        req.user.clinician_id,
        req.user.clinic_id,
        note_text,
        is_patient_visible
      );

      res.json({ success });
    } catch (err) {
      console.error('Error updating clinician note:', err);
      res.status(500).json({ success: false });
    }
  }
}

module.exports = {
  ClinicianViewPatientsController: new ClinicianViewPatientsController(),
  ClinicianViewPatientNotesController: new ClinicianViewPatientNotesController(),
  ClinicianAddNoteController: new ClinicianAddNoteController(),
  ClinicianUpdateNoteController: new ClinicianUpdateNoteController()
};
