const db = require('../db');

// create availability: body { day_of_week: 'Monday', start_time: '09:00', end_time: '17:00' }
exports.createAvailability = async (req, res) => {
  const organizerId = req.user.id;
  const { day_of_week, start_time, end_time } = req.body;
  if (!day_of_week || !start_time || !end_time) return res.status(400).json({ error: 'Missing fields' });
  try {
    const [r] = await db.query('INSERT INTO availability (organizer_id, day_of_week, start_time, end_time) VALUES (?,?,?,?)', [organizerId, day_of_week, start_time, end_time]);
    res.json({ id: r.insertId });
  } catch(err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
};

exports.listAvailability = async (req, res) => {
  const organizerId = req.user.id;
  try {
    const [rows] = await db.query('SELECT * FROM availability WHERE organizer_id = ?', [organizerId]);
    res.json({ availability: rows });
  } catch(err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
};
