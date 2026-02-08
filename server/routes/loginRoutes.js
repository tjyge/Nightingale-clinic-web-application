// routes/loginRoutes.js
// client-> route (calls controller function) -> controller (calls entity function) -> entity (calls db function) -> db
// router maps incoming URL request to specific API endpoints

const express = require('express');
const router = express.Router();
const UserLoginController = require('../controllers/UserLoginController');

//router.post('/', controller.method.bind(controller))
router.post('/', UserLoginController.authenticateLogin.bind(UserLoginController));

module.exports = router;
