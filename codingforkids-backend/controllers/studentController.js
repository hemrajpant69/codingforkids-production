// controllers/studentController.js
import db from '../config/db.js';
import path from 'path';
import fs from 'fs';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const downloadAndSaveImage = async (url, subfolder) => {
  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const uploadDir = path.join('./uploads/students', subfolder);
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    const ext = url.split('.').pop().split('?')[0] || 'jpg';
    const filename = `${uuidv4()}.${ext}`;
    const filepath = path.join(uploadDir, filename);

    fs.writeFileSync(filepath, response.data);
    return `/uploads/students/${subfolder}/${filename}`;
  } catch (error) {
    console.error(`Error downloading image from ${url}:`, error);
    return url;
  }
};

const handleMulterFile = async (file, subfolder) => {
  const uploadDir = path.join('./uploads/students', subfolder);
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

  const ext = path.extname(file.originalname);
  const filename = `${uuidv4()}${ext}`;
  const filepath = path.join(uploadDir, filename);

  fs.writeFileSync(filepath, fs.readFileSync(file.path));
  return `/uploads/students/${subfolder}/${filename}`;
};

export const enrollStudent = async (req, res) => {
  try {
    const { name, email, phone_number, course, photo_url } = req.body;

    const [programme] = await db.query(
      'SELECT id FROM programmes WHERE title = ?',
      [course]
    );

    if (!programme.length) {
      return res.status(400).json({ success: false, message: 'Invalid course selected' });
    }

    const programmeId = programme[0].id;

    let photo = '';
    if (photo_url && photo_url.includes('googleusercontent.com')) {
      photo = await downloadAndSaveImage(photo_url, 'photos');
    } else if (req.files?.photo?.[0]) {
      photo = await handleMulterFile(req.files.photo[0], 'photos');
    }

    let paymentScreenshotPath = '';
    if (req.files?.payment_screenshot?.[0]) {
      paymentScreenshotPath = await handleMulterFile(req.files.payment_screenshot[0], 'payments');
    }

    const sql = `
      INSERT INTO students 
        (name, email, phone_number, course, photo, payment_screenshot, programme_id, enrolled_at)
      VALUES 
        (?, ?, ?, ?, ?, ?, ?, NOW())
    `;

    const [result] = await db.query(sql, [
      name,
      email,
      phone_number,
      course,
      photo,
      paymentScreenshotPath,
      programmeId
    ]);

    res.status(201).json({
      success: true,
      message: 'Enrollment successful',
      studentId: result.insertId,
      photoPath: photo
    });
  } catch (error) {
    console.error('Enrollment error:', error);
    res.status(500).json({ success: false, message: 'Enrollment failed', error: error.message });
  }
};


export const getAllStudents = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT s.*, p.title as programme_title
      FROM students s
      LEFT JOIN programmes p ON s.course = p.title
      ORDER BY s.enrolled_at DESC
    `);

    res.status(200).json({ success: true, data: rows });
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch students', error: error.message });
  }
};

export const getStudentById = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT s.*, p.title as programme_title
      FROM students s
      LEFT JOIN programmes p ON s.course = p.title
      WHERE s.id = ?
    `, [req.params.id]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    res.status(200).json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Error fetching student:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch student', error: error.message });
  }
};

export const updateStudent = async (req, res) => {
  try {
    const { name, email, phone_number, course, photo_url } = req.body;
    const studentId = req.params.id;
    const [currentStudent] = await db.query('SELECT * FROM students WHERE id = ?', [studentId]);

    if (currentStudent.length === 0) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    let photo = currentStudent[0].photo;
    if (photo_url && photo_url.includes('googleusercontent.com')) {
      if (photo && photo.startsWith('/uploads/')) fs.unlinkSync(`.${photo}`);
      photo = await downloadAndSaveImage(photo_url, 'photos');
    } else if (req.files?.photo?.[0]) {
      if (photo && photo.startsWith('/uploads/')) fs.unlinkSync(`.${photo}`);
      photo = await handleMulterFile(req.files.photo[0], 'photos');
    }

    const sql = `
      UPDATE students
      SET name = ?, email = ?, phone_number = ?, course = ?, photo = ?
      WHERE id = ?
    `;

    const [result] = await db.query(sql, [name, email, phone_number, course, photo, studentId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Student not found or no changes made' });
    }

    res.status(200).json({ success: true, message: 'Student updated successfully', photoPath: photo });
  } catch (error) {
    console.error('Error updating student:', error);
    res.status(500).json({ success: false, message: 'Failed to update student', error: error.message });
  }
};

export const deleteStudent = async (req, res) => {
  try {
    const studentId = req.params.id;
    const [student] = await db.query('SELECT * FROM students WHERE id = ?', [studentId]);

    if (student.length === 0) return res.status(404).json({ success: false, message: 'Student not found' });

    const studentData = student[0];
    if (studentData.photo && studentData.photo.startsWith('/uploads/')) fs.unlinkSync(`.${studentData.photo}`);
    if (studentData.payment_screenshot && studentData.payment_screenshot.startsWith('/uploads/')) fs.unlinkSync(`.${studentData.payment_screenshot}`);

    const [result] = await db.query('DELETE FROM students WHERE id = ?', [studentId]);

    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Student not found' });

    res.status(200).json({ success: true, message: 'Student deleted successfully' });
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).json({ success: false, message: 'Failed to delete student', error: error.message });
  }
};


// Get all pending enrollments
export const getPendingEnrollments = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        s.id,
        s.name,
        s.email,
        s.phone_number,
        s.payment_screenshot,
        s.course AS course_title,
        TIMESTAMPDIFF(MINUTE, s.enrolled_at, NOW()) AS time_ago
      FROM students s
      WHERE s.status IS NULL
    `);

    res.status(200).json({ success: true, data: rows });
  } catch (error) {
    console.error('Error fetching pending enrollments:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch pending enrollments' });
  }
};


export const approveEnrollment = async (req, res) => {
  try {
    const { id } = req.params;

    const [student] = await db.query('SELECT * FROM students WHERE id = ?', [id]);
    if (student.length === 0) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    const s = student[0];

    await db.query(
      `INSERT INTO enrolled_students (name, email, phone_number, course_title, programme_id)
       VALUES (?, ?, ?, ?, ?)`,
      [s.name, s.email, s.phone_number, s.course, s.programme_id]
    );

    await db.query('UPDATE students SET status = "approved" WHERE id = ?', [id]);

    res.status(200).json({ success: true, message: 'Student approved' });
  } catch (error) {
    console.error('Error approving enrollment:', error);
    res.status(500).json({ success: false, message: 'Approval failed' });
  }
};




export const getUserCourseDetails = async (req, res) => {
  try {
    const { email } = req.query;

    // Fetch programme_id directly
    const [enrolled] = await db.query(
      `SELECT programme_id FROM enrolled_students WHERE email = ?`,
      [email]
    );

    if (enrolled.length === 0 || !enrolled[0].programme_id) {
      return res.status(404).json({ success: false, message: 'No enrolled programme found' });
    }

    const programmeId = enrolled[0].programme_id;

    const [programme] = await db.query(
      `SELECT * FROM programmes WHERE id = ?`,
      [programmeId]
    );

    if (programme.length === 0) {
      return res.status(404).json({ success: false, message: 'Programme not found' });
    }

    res.status(200).json({ success: true, data: programme[0] });
  } catch (error) {
    console.error('Error fetching user course:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
