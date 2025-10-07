// fetch all events for the logged-in organizer
exports.getMyEventTypes = async (req, res) => {
  const organizerId = req.user.id;
  try {
    const [rows] = await db.query(
      'SELECT id, title, description, duration_minutes, slug, color FROM event_types WHERE organizer_id = ?',
      [organizerId]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching event types' });
  }
};