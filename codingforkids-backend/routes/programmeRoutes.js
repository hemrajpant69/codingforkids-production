import express from 'express';
import multer from 'multer';
import path from 'path';
import {
  getAllProgrammes,
  getProgramme,
  createProgramme,
  updateProgramme,
  deleteProgramme
} from '../controllers/programmeController.js';

const router = express.Router();

// File storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// Routes
router.get('/', getAllProgrammes);
router.get('/:id', getProgramme);
router.post('/', upload.fields([{ name: 'photo' }, { name: 'payment_qr' }]), createProgramme);
router.put('/:id', updateProgramme);
router.delete('/:id', deleteProgramme);

export default router;