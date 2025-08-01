// routes/studentRoutes.js
import express from 'express';
import multer from 'multer';
import path from 'path';
import {
  enrollStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  getPendingEnrollments,
  approveEnrollment,
  getUserCourseDetails
} from '../controllers/studentController.js';

const router = express.Router();

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/students');
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + '-' + file.fieldname + ext);
  }
});
router.get('/pending', getPendingEnrollments);
router.post('/approve/:id', approveEnrollment);
router.delete('/:id', deleteStudent);
router.get('/user-course', getUserCourseDetails);


const upload = multer({ storage });

// Routes
router.post('/enroll', upload.fields([
  { name: 'photo', maxCount: 1 },
  { name: 'payment_screenshot', maxCount: 1 }
]), enrollStudent);

router.get('/', getAllStudents);
router.get('/:id', getStudentById);
router.put('/:id', upload.fields([
  { name: 'photo', maxCount: 1 }
]), updateStudent);
router.delete('/:id', deleteStudent);

export default router;
