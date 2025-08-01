import express from 'express';
import multer from 'multer';
import path from 'path';
import {
  uploadLecture,
  getAllLectures,
  getLecturesByEnrolledStudent,
  deleteLecture,
} from '../controllers/recordedLectureController.js';

const router = express.Router();

// Multer storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/lectures'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// Routes
router.get('/', getAllLectures); // For admin
router.get('/by-student', getLecturesByEnrolledStudent); // For student with ?email=
router.post('/', upload.single('video'), uploadLecture);
router.delete('/:id', deleteLecture);

export default router;
