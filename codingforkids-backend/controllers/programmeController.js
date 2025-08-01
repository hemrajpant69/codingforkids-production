import db from '../config/db.js'; // Adjust path if needed

export const getAllProgrammes = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM programmes ORDER BY id DESC');
    res.json(rows);
  } catch (err) {
    console.error('Error in getAllProgrammes:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getProgramme = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM programmes WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Programme not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error('Error in getProgramme:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const createProgramme = async (req, res) => {
  try {
    const { title, price, start_time } = req.body;
    const photo = req.files?.photo?.[0]?.filename || null;
    const payment_qr = req.files?.payment_qr?.[0]?.filename || null;

    const sql = 'INSERT INTO programmes (title, price, start_time, photo, payment_qr, description) VALUES (?, ?, ?, ?, ?,?)';
    const [result] = await db.query(sql, [title, price, start_time, photo, payment_qr, description]);

    res.status(201).json({ id: result.insertId, message: 'Programme added successfully' });
  } catch (err) {
    console.error('Error in createProgramme:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const updateProgramme = async (req, res) => {
  try {
    const { title, price, description, start_time, zoom_link } = req.body;
    const sql = 'UPDATE programmes SET title=?, price=?, description=?, start_time=?, zoom_link=? WHERE id=?';
    await db.query(sql, [title, price, description, start_time, zoom_link, req.params.id]);
    res.json({ message: 'Programme updated successfully' });
  } catch (err) {
    console.error('Error in updateProgramme:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const deleteProgramme = async (req, res) => {
  try {
    await db.query('DELETE FROM programmes WHERE id = ?', [req.params.id]);
    res.json({ message: 'Programme deleted successfully' });
  } catch (err) {
    console.error('Error in deleteProgramme:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
