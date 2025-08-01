// controllers/studentController.js
import db from '../config/db.js';

export const enrollStudent = async (req, res) => {
  try {
    const { name, email, phone_number, course, course_id } = req.body;
    const paymentScreenshot = req.files?.payment_screenshot?.[0]?.filename || null;
    const photo = req.body.photo || null;

    const sql = `
      INSERT INTO students (name, email, phone_number, course, course_id, photo, payment_screenshot, enrolled_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
    `;

    const [result] = await db.query(sql, [
      name, email, phone_number, course, course_id, photo, paymentScreenshot
    ]);

    res.status(201).json({
      success: true,
      message: 'Enrollment successful',
      studentId: result.insertId
    });
  } catch (error) {
    console.error('Enrollment error:', error);
    res.status(500).json({
      success: false,
      message: 'Enrollment failed',
      error: error.message
    });
  }
};
