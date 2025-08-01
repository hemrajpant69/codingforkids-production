// routes/authRoutes.js
import express from 'express';

const router = express.Router();

router.post('/logout', (req, res) => {
  const { email } = req.body;

  console.log(`Logging out user: ${email}`);
  // If you had sessions or token invalidation logic, you'd do it here

  res.status(200).json({ message: 'Logout successful' });
});

export default router;
