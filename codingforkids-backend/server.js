import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';
import { Server } from 'socket.io';
import mysql from 'mysql2/promise';
import multer from 'multer';
import dotenv from 'dotenv';
import zoomRoutes from './routes/zoomRoutes.js';
import crypto from 'crypto'; // Import crypto

// Import routes
import programmeRoutes from './routes/programmeRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import recordedLectureRoutes from './routes/recordedLectureRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import authRoutes from './routes/authRoutes.js';
dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "https://codingforkidsnepal.com",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// Database connection
const db = await mysql.createPool({
  host: 'localhost',
  user: 'codingfo_hemraj',
  password: 'Heygod1234',
  database: 'codingfo_codingforkids',
  waitForConnections: true,
  connectionLimit: 10,
});

// Middleware
app.use(cors({
  origin: ['https://codingforkidsnepal.com'],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {

  res.setHeader('Access-Control-Allow-Origin', '*');
  
  // Add permissions policy
  res.setHeader('Permissions-Policy', [
    'microphone=*',
    'camera=*',
    'fullscreen=*',
    'display-capture=*',
    'screen-wake-lock=*'
  ].join(', '));
  
  next();
});
// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/uploads/lectures', express.static(path.join(__dirname, 'uploads/lectures')));
app.use('/uploads/media', express.static(path.join(__dirname, 'uploads/media')));

// Routes
app.use('/api/programmes', programmeRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/lectures', recordedLectureRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/zoom', zoomRoutes);
app.use('/api', authRoutes);
app.get('/api/zoom/signature', (req, res) => {
  try {
    const { meetingNumber, role } = req.query;

    if (!meetingNumber || !role) {
      return res.status(400).json({ error: 'Missing meetingNumber or role' });
    }

    console.log(`Generating signature for meeting: ${meetingNumber}, role: ${role}`);

    const timestamp = new Date().getTime() - 30000;
    const msg = Buffer.from(`${process.env.ZOOM_CLIENT_ID}${meetingNumber}${timestamp}${role}`).toString('base64');

    const hash = crypto
      .createHmac('sha256', process.env.ZOOM_CLIENT_SECRET)
      .update(msg)
      .digest('base64');

    const signature = Buffer.from(
      `${process.env.ZOOM_CLIENT_ID}.${meetingNumber}.${timestamp}.${role}.${hash}`
    ).toString('base64');

    // ✅ Add this to prevent CORB issues
    res.setHeader('Access-Control-Allow-Origin', 'https://codingforkidsnepal.com');
    res.setHeader('Content-Type', 'application/json');

    console.log('Signature generated successfully');
    res.status(200).json({ signature });
  } catch (error) {
    console.error('Signature generation error:', error);
    res.status(500).json({ error: 'Failed to generate signature' });
  }
});

// ✅ Replaced media upload endpoint using multer
const mediaStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/media'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const mediaUpload = multer({ storage: mediaStorage });

app.post('/api/upload-media', mediaUpload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  return res.json({ url: `/uploads/media/${req.file.filename}` });
});

// Socket.io Chat Logic
io.on('connection', socket => {
  console.log('Client connected:', socket.id);

  socket.on('join-programme', programmeId => {
    socket.join(`programme_${programmeId}`);
  });

  socket.on('group-message', async data => {
    const { programmeId, senderEmail, message, media, type } = data;

    const [rows] = await db.query(
      'SELECT * FROM enrolled_students WHERE email = ? AND programme_id = ?',
      [senderEmail, programmeId]
    );

    if (rows.length === 0) return;

    await db.query(
      'INSERT INTO programme_messages (programme_id, sender_email, message_type, content, sent_at) VALUES (?, ?, ?, ?, NOW())',
      [programmeId, senderEmail, type, message]
    );

    io.to(`programme_${programmeId}`).emit('group-message', {
      senderEmail,
      message,
      type,
      sentAt: new Date()
    });
  });

  socket.on('private-message', async data => {
    const { studentEmail, senderRole, message, media, type } = data;

    await db.query(
      'INSERT INTO private_messages (sender_email, receiver_email, message_type, content, sent_at) VALUES (?, ?, ?, ?, NOW())',
      [
        senderRole === 'admin' ? 'hemraj.221506@ncit.edu.np' : studentEmail,
        senderRole === 'admin' ? studentEmail : 'hemraj.221506@ncit.edu.np',
        type,
        message
      ]
    );

    io.emit(`private-${senderRole === 'admin' ? studentEmail : 'hemraj.221506@ncit.edu.np'}`, {
      senderEmail: senderRole === 'admin' ? 'hemraj.221506@ncit.edu.np' : studentEmail,
      message,
      type,
      sentAt: new Date()
    });
  });

  socket.on('delete-group-message', async data => {
    const { messageId, programmeId } = data;
    await db.query('DELETE FROM programme_messages WHERE id = ?', [messageId]);
    io.to(`programme_${programmeId}`).emit('delete-group-message', messageId);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log('🚀 Server running on port', PORT);
});
