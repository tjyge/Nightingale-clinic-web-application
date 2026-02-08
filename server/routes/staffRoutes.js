const express = require('express');
const router = express.Router();

const {
  StaffViewPatientsController,
  StaffViewPatientNotesController,
  StaffUpdatePatientNoteController
} = require('../controllers/StaffManagementController');

const auth = require('../middlewares/auth');

router.get('/patients', auth, StaffViewPatientsController.viewPatients);
router.get('/patients/:patient_id/notes', auth, StaffViewPatientNotesController.viewPatientNotes);
router.put('/notes/:note_id', auth, StaffUpdatePatientNoteController.updatePatientNote);
module.exports = router;