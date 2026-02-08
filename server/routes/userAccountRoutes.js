const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');

const {
  UACreateUserAccountController,
  UAViewUserAccountController,
  UAUpdateUserAccountController,
  UADeleteUserAccountController,
  UASearchUserAccountController
} = require('../controllers/UserManagementController');

router.get('/all', auth, UAViewUserAccountController.viewUserAccount);
router.get('/', auth, UASearchUserAccountController.searchUserAccount);
router.post('/', auth, UACreateUserAccountController.createUserAccount);
router.put('/:user_id', auth, UAUpdateUserAccountController.updateUserAccount);
router.delete('/:user_id', auth, UADeleteUserAccountController.deleteUserAccount);

module.exports = router;