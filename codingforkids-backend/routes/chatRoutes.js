import express from 'express';
import multer from 'multer';
import { getGroupMessages, getPrivateMessages, deleteGroupMessage } from '../controllers/chatController.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/media/' });

router.get('/group/:programmeId', getGroupMessages);
router.post('/group/upload', upload.single('file'), (req, res) => res.json({ url: `/uploads/media/${req.file.filename}` }));
router.get('/private/:senderEmail', getPrivateMessages);
router.delete('/group/:id', deleteGroupMessage);

export default router;
