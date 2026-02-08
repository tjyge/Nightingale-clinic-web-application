const Staff = require('../entities/staff');

class StaffViewPatientsController {
  async viewPatients(req, res) {
    try {
      // Role check
      if (req.user.user_type !== 'staff') {
        return res.status(403).json({ error: 'Forbidden' });
      }

      const patients = await Staff.viewPatients(req.user.clinic_id);
      res.json(patients);
    } catch (err) {
      console.error('Error viewing patients:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

class StaffViewPatientNotesController {
  async viewPatientNotes(req, res) {
    const { patient_id } = req.params;

    try {
      if (req.user.user_type !== 'staff') {
        return res.status(403).json({ error: 'Forbidden' });
      }

      const notes = await Staff.viewPatientNotes(
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

class StaffUpdatePatientNoteController {
  async updatePatientNote(req, res) {
    const { note_id } = req.params;
    const { note_text } = req.body;

    try {
      if (req.user.user_type !== 'staff') {
        return res.status(403).json({ error: 'Forbidden' });
      }

      const success = await Staff.updatePatientNote(
        note_id,
        req.user.staff_id,
        req.user.clinic_id,
        note_text
      );

      res.json({ success });
    } catch (err) {
      console.error('Error updating patient note:', err);
      res.status(500).json({ success: false });
    }
  }
}

module.exports = {
  StaffViewPatientsController: new StaffViewPatientsController(),
  StaffViewPatientNotesController: new StaffViewPatientNotesController(),
  StaffUpdatePatientNoteController: new StaffUpdatePatientNoteController()
};
