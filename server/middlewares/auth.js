const UserAccount = require('../entities/user_account');

module.exports = async function authMiddleware(req, res, next) {
  const email = req.headers['x-user-email'];
console.log('AUTH HEADER email =', req.headers['x-user-email']);

  if (!email) {
    return res.status(401).json({ error: 'Unauthenticated' });
  }

  try {
    const [rows] = await require('../db').execute(
      'SELECT user_id, user_type, clinic_id FROM user_account WHERE email = ?',
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid user' });
    }

    req.user = rows[0]; // ✅ THIS WAS MISSING
    next();
  } catch (err) {
    return res.status(500).json({ error: 'Auth error' });
  }
};
