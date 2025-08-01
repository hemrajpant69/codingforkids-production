import db from '../config/db.js';
export const getGroupMessages = async (req, res) => {
  const prog = req.params.programmeId;
  const [msgs] = await db.query('SELECT * FROM programme_messages WHERE programme_id=? ORDER BY sent_at', [prog]);
  res.json({ success: true, data: msgs });
};
export const getPrivateMessages = async (req, res) => {
  try {
    const { senderEmail } = req.params;

    const [messages] = await db.query(
      'SELECT * FROM private_messages WHERE sender_email = ? OR receiver_email = ? ORDER BY sent_at ASC',
      [senderEmail, senderEmail]
    );

    res.status(200).json({ success: true, data: messages });
  } catch (error) {
    console.error('Error fetching private messages:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch private messages' });
  }
};

export const deleteGroupMessage = async (req, res) => {
  await db.query('DELETE FROM programme_messages WHERE id=?', [req.params.id]);
  res.json({ success: true });
};
