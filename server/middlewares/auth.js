const UserAccount = require('../entities/user_account');
const db = require('../db');

module.exports = async function auth(req, res, next) {
  const email = req.headers['x-user-email'];
  console.log('AUTH HEADER email =', email);

  if (!email) {
    return res.status(401).json({ error: 'No email header' });
  }

  const user = await UserAccount.findByEmail(email);
  if (!user) {
    return res.status(401).json({ error: 'Invalid user' });
  }

  // ✅ Fetch staff_id if user is staff
  if (user.user_type === 'staff') {
    const [staffRows] = await db.execute(
      'SELECT staff_id FROM staff WHERE user_id = ?',
      [user.user_id]
    );
    
    if (staffRows.length > 0) {
      user.staff_id = staffRows[0].staff_id;
    }
  }
  
  // Similarly for clinician, patient, admin if needed
  if (user.user_type === 'clinician') {
    const [clinicianRows] = await db.execute(
      'SELECT clinician_id FROM clinician WHERE user_id = ?',
      [user.user_id]
    );
    
    if (clinicianRows.length > 0) {
      user.clinician_id = clinicianRows[0].clinician_id;
    }
  }

  console.log('AUTH USER:', user);
  // ✅ attach user, DO NOT check role here
  req.user = user;
  next();
};
