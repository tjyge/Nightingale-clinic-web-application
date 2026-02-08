const Patient = require('../entities/patient');

class PatientViewProfileController {
  async viewProfile(req, res) {
    try {
      // Role check
      if (req.user.user_type !== 'patient') {
        return res.status(403).json({ error: 'Forbidden' });
      }

      const profile = await Patient.viewProfile(
        req.user.patient_id,
        req.user.clinic_id
      );

      res.json(profile);
    } catch (err) {
      console.error('Error viewing patient profile:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

class PatientViewNotesController {
  async viewMyNotes(req, res) {
    try {
      // Role check
      if (req.user.user_type !== 'patient') {
        return res.status(403).json({ error: 'Forbidden' });
      }

      const notes = await Patient.viewMyNotes(
        req.user.patient_id,
        req.user.clinic_id
      );

      res.json(notes);
    } catch (err) {
      console.error('Error viewing patient notes:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = {
  PatientViewProfileController: new PatientViewProfileController(),
  PatientViewNotesController: new PatientViewNotesController()
};
