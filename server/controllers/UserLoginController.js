// controllers/userLoginController.js
const UserAccount = require('../entities/user_account');

class UserLoginController {
  async authenticateLogin(req, res) {
    const { email, password } = req.body;

    // Call entity
    const user = await UserAccount.verifyUserAccount(email, password);

    // Debug logging
    console.log('Login attempt:', { email, password });
    console.log('User verified:', user);

    // If login fails
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Login success
    res.json({
      success: true,
      user: {
        user_id: user.user_id,
        user_type: user.user_type,
        clinic_id: user.clinic_id
      }
    });
  }
}

module.exports = new UserLoginController();
