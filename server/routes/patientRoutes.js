const express = require('express');
const router = express.Router();

const {
  PatientViewProfileController,
  PatientViewNotesController
} = require('../controllers/PatientManagementController');

const auth = require('../middlewares/auth');

// View own profile
router.get('/profile',auth, PatientViewProfileController.viewProfile);
router.get('/notes', auth, PatientViewNotesController.viewMyNotes);

module.exports = router;
