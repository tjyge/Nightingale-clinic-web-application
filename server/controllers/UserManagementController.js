const UserAccount = require('../entities/user_account');

//
// CREATE USER (ADMIN ONLY)
//
class UACreateUserAccountController {
  async createUserAccount(req, res) {
    const { user_id, email, password, user_type, clinic_id } = req.body;

    try {
      // req.user.user_type should be set during login
      if (req.user.user_type !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Only admin can create user accounts'
        });
      }

      const success = await UserAccount.createUserAccount(
        user_id,
        email,
        password,
        user_type,
        clinic_id
      );

      if (!success) {
        return res.status(400).json({ success: false });
      }

      res.json({ success: true });
    } catch (err) {
      console.error('Error creating user:', err);
      res.status(500).json({ success: false });
    }
  }
}

//
// VIEW ALL USERS (ADMIN)
//
class UAViewUserAccountController {
  async viewUserAccount(req, res) {
    try {
      // if (req.user.user_type !== 'admin') {
      //   return res.status(403).json({ error: 'Forbidden' });
      // }

      const users = await UserAccount.viewUserAccounts();
      res.json(users);
    } catch (err) {
      console.error('Error fetching users:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

//
// UPDATE USER PASSWORD
//
class UAUpdateUserAccountController {
  async updateUserAccount(req, res) {
    const { user_id } = req.params;
    const { password } = req.body;

    try {
      // Admin OR self-update
      if (
        req.user.user_type !== 'admin' &&
        req.user.user_id !== user_id
      ) {
        return res.status(403).json({ success: false });
      }

      const success = await UserAccount.updatePassword(user_id, password);
      res.json({ success });
    } catch (err) {
      console.error('Error updating user:', err);
      res.status(500).json({ success: false });
    }
  }
}

//
// DELETE USER (ADMIN ONLY)
//
class UADeleteUserAccountController {
  async deleteUserAccount(req, res) {
    const { user_id } = req.params;

    try {
      if (req.user.user_type !== 'admin') {
        return res.status(403).json({ success: false });
      }

      const success = await UserAccount.deleteUserAccount(user_id);
      res.json({ success });
    } catch (err) {
      console.error('Error deleting user:', err);
      res.status(500).json({ success: false });
    }
  }
}

//
// SEARCH USERS BY EMAIL (ADMIN)
//
class UASearchUserAccountController {
  async searchUserAccount(req, res) {
    const email = req.query.email || '';

    try {
      // if (req.user.user_type !== 'admin') {
      //   return res.status(403).json({ error: 'Forbidden' });
      // }

      const users = await UserAccount.searchUserAccount(email);
      res.json(users);
    } catch (err) {
      console.error('Error searching users:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = {
  UACreateUserAccountController: new UACreateUserAccountController(),
  UAViewUserAccountController: new UAViewUserAccountController(),
  UAUpdateUserAccountController: new UAUpdateUserAccountController(),
  UADeleteUserAccountController: new UADeleteUserAccountController(),
  UASearchUserAccountController: new UASearchUserAccountController()
};