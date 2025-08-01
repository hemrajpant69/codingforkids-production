import express from 'express';
import crypto from 'crypto';
const router = express.Router();

router.get('/signature', (req, res) => {
  try {
    const { meetingNumber, role } = req.query;
    const timestamp = new Date().getTime() - 30000;
    const msg = Buffer.from(`${process.env.ZOOM_CLIENT_ID}${meetingNumber}${timestamp}${role}`).toString('base64');
    const hash = crypto.createHmac('sha256', process.env.ZOOM_CLIENT_SECRET).update(msg).digest('base64');
    const signature = Buffer.from(`${process.env.ZOOM_CLIENT_ID}.${meetingNumber}.${timestamp}.${role}.${hash}`).toString('base64');
    res.json({ signature });
  } catch (error) {
    console.error('Signature error:', error);
    res.status(500).json({ error: 'Signature failed' });
  }
});

export default router;
