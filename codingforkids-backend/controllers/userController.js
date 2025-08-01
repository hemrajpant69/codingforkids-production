const db = require('../config/db');

const getAllUsers = async (req, res) => {
  try {
    const [users] = await db.query('SELECT * FROM users');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Database error' });
  }
};

module.exports = { getAllUsers };
