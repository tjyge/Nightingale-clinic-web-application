const db = require('../db');

class UserAccount {

  async findByEmail(email) {
    const [rows] = await db.execute(
      'SELECT * FROM user_account WHERE email = ?',
      [email]
    );
    return rows[0]; // undefined if not found
  }

  // LOGIN (PLAINTEXT PASSWORD)
  async verifyUserAccount(email, password) {
    const [rows] = await db.execute(
      'SELECT * FROM user_account WHERE email = ?',
      [email]
    );

    const user = rows[0];
    if (!user) return null;

    // Plaintext comparison
    if (user.password !== password) return null;

    return {
      user_id: user.user_id,
      user_type: user.user_type,
      clinic_id: user.clinic_id
    };
  }

  // CREATE USER ACCOUNT
  async createUserAccount(user_id, email, password, user_type, clinic_id) {
    // Check duplicate email
    const [existing] = await db.execute(
      'SELECT 1 FROM user_account WHERE email = ?',
      [email]
    );
    if (existing.length > 0) return false;

    await db.execute(
      `INSERT INTO user_account 
       (user_id, email, password, user_type, clinic_id)
       VALUES (?, ?, ?, ?, ?)`,
      [user_id, email, password, user_type, clinic_id]
    );

    return true;
  }

  // VIEW ALL USERS
  async viewUserAccounts() {
    const [rows] = await db.execute(
      'SELECT user_id, email, user_type, clinic_id FROM user_account'
    );
    return rows;
  }

  // UPDATE PASSWORD
  async updatePassword(user_id, newPassword) {
    const [result] = await db.execute(
      'UPDATE user_account SET password = ? WHERE user_id = ?',
      [newPassword, user_id]
    );
    return result.affectedRows > 0;
  }

  // DELETE USER
  async deleteUserAccount(user_id) {
    const [result] = await db.execute(
      'DELETE FROM user_account WHERE user_id = ?',
      [user_id]
    );
    return result.affectedRows > 0;
  }

  // SEARCH USERS BY EMAIL
  async searchUserAccount(email) {
    let query = 'SELECT user_id, email, user_type, clinic_id FROM user_account';
    let params = [];

    if (email) {
      query += ' WHERE email LIKE ?';
      params.push(`%${email}%`);
    }

    const [rows] = await db.execute(query, params);
    return rows;
  }
}

module.exports = new UserAccount();
