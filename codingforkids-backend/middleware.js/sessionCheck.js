import db from '../config/db.js';

const sessionCheck = async (req, res, next) => {
  const { email, sessiontoken } = req.headers;

  if (!email || !sessiontoken) {
    return res.status(401).json({ message: 'Missing auth headers' });
  }

  try {
    const [rows] = await db.query('SELECT session_token FROM enrolled_students WHERE email = ?', [email]);

    if (!rows.length || rows[0].session_token !== sessiontoken) {
      return res.status(401).json({ message: 'Invalid session. Please login again.' });
    }

    next();
  } catch (err) {
    console.error('Session check error:', err);
    res.status(500).json({ message: 'Server error during session check' });
  }
};

export default sessionCheck;
