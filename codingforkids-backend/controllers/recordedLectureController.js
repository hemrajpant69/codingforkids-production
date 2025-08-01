import db from '../config/db.js';

// Admin: Get all lectures
export const getAllLectures = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT rl.*, p.title AS course_title
      FROM recorded_lecture rl
      JOIN programmes p ON rl.course_id = p.id
      ORDER BY rl.uploaded_time DESC
    `);
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error('Error in getAllLectures:', err.message);
    res.status(500).json({ success: false, message: 'Error fetching lectures.' });
  }
};

// Student: Only their enrolled programme's lectures
export const getLecturesByEnrolledStudent = async (req, res) => {
  const { email } = req.query;
  if (!email) {
    return res.status(400).json({ success: false, message: 'Email is required' });
  }

  try {
    const [rows] = await db.query(`
      SELECT rl.*
      FROM enrolled_students es
      JOIN programmes p ON es.programme_id = p.id
      JOIN recorded_lecture rl ON rl.course_id = p.id
      WHERE LOWER(es.email) = LOWER(?)
      ORDER BY rl.uploaded_time DESC
    `, [email]);

    if (!rows.length) {
      return res.status(403).json({ success: false, message: 'No lectures found for your enrolled programme.' });
    }

    res.json({ success: true, data: rows });
  } catch (err) {
    console.error("Error in getLecturesByEnrolledStudent:", err.message);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

// Upload lecture (admin)
export const uploadLecture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const { course_id, title } = req.body;
    const videoPath = req.file.path;

    await db.query(
      "INSERT INTO recorded_lecture (course_id, title, video) VALUES (?, ?, ?)",
      [course_id, title, videoPath]
    );

    res.json({
      success: true,
      message: "Lecture uploaded successfully.",
      videoUrl: `/uploads/lectures/${req.file.filename}`
    });
  } catch (err) {
    console.error('Error in uploadLecture:', err.message);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

// Delete lecture (admin)
export const deleteLecture = async (req, res) => {
  try {
    const [lecture] = await db.query(
      "SELECT video FROM recorded_lecture WHERE id = ?",
      [req.params.id]
    );

    if (!lecture || lecture.length === 0) {
      return res.status(404).json({ success: false, message: "Lecture not found" });
    }

    await db.query("DELETE FROM recorded_lecture WHERE id = ?", [req.params.id]);

    res.json({ success: true, message: "Lecture deleted successfully" });
  } catch (err) {
    console.error('Error in deleteLecture:', err.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
