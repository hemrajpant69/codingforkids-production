// controller/googleAuthController.js

export const googleLogin = async (req, res) => {
  const { email, name } = req.body;

  try {
    // Check if the student exists in DB
    const [rows] = await db.query(
      'SELECT * FROM enrolled_students WHERE email = ?',
      [email]
    );

    if (!rows.length) {
      return res.status(401).json({ success: false, message: 'Not enrolled' });
    }

    // ✅ ADD THIS: generate and store session token
    const sessionToken = crypto.randomBytes(32).toString('hex');

    await db.query(
      'UPDATE enrolled_students SET session_token = ? WHERE email = ?',
      [sessionToken, email]
    );

    // ✅ Send session token to frontend
    res.status(200).json({
      success: true,
      message: 'Login successful',
      sessionToken,
      user: rows[0],
    });

  } catch (err) {
    console.error('Google login error:', err);
    res.status(500).json({ success: false, message: 'Login failed' });
  }
};
