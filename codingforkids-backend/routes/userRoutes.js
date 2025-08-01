const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/test-db', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT 1 + 1 AS result');
    res.json(rows[0]); // should return { result: 2 }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'DB connection error' });
  }
});

module.exports = router;
