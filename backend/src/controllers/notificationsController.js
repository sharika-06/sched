const db = require('../db');

exports.getPendingNotifications = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT n.*, b.start_datetime, b.end_datetime, b.client_id FROM notifications n JOIN bookings b ON n.booking_id=b.id WHERE n.sent = FALSE AND n.scheduled_time <= NOW()');
    res.json({ notifications: rows });
  } catch(err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
};

exports.markSent = async (req, res) => {
  const id = req.params.id;
  try {
    await db.query('UPDATE notifications SET sent = TRUE WHERE id = ?', [id]);
    res.json({ ok: true });
  } catch(err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
   }
};
