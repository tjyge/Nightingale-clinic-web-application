const express = require('express');
const router = express.Router();

const {
  ClinicianViewPatientsController,
  ClinicianViewPatientNotesController,
  ClinicianAddNoteController,
  ClinicianUpdateNoteController
} = require('../controllers/ClinicianManagementController');

const auth = require('../middlewares/auth');

router.get('/patients', auth, ClinicianViewPatientsController.viewPatients);
router.get('/patients/:id/notes', auth, ClinicianViewPatientNotesController.viewPatientNotes);
router.post('/notes', auth, ClinicianAddNoteController.addClinicianNote);
router.put('/notes/:note_id', auth, ClinicianUpdateNoteController.updateClinicianNote);

module.exports = router;
