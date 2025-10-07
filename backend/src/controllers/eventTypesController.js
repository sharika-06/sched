const db = require('../db');
const { DateTime } = require('luxon');

// create event type (organizer)
exports.createEventType = async (req, res) => {
  const organizerId = req.user.id;
  const { title, description, duration_minutes, slug, color } = req.body;
  if (!title || !duration_minutes || !slug) return res.status(400).json({ error: 'Missing fields' });
  try {
    const [exists] = await db.query('SELECT id FROM event_types WHERE slug = ?', [slug]);
    if (exists.length) return res.status(400).json({ error: 'That event name is already used. Try a different name' });
    const [r] = await db.query('INSERT INTO event_types (organizer_id, title, description, duration_minutes, slug, color) VALUES (?,?,?,?,?,?)',
      [organizerId, title, description||'', duration_minutes, slug, color||'#3b82f6']);
    res.json({ id: r.insertId });
  } catch(err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
};

exports.getEventTypeBySlug = async (req, res) => {
  const slug = req.params.slug;
  try {
    const [rows] = await db.query('SELECT et.*, u.name as organizer_name FROM event_types et JOIN users u ON et.organizer_id = u.id WHERE et.slug = ?', [slug]);
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    res.json({ event: rows[0] });
  } catch(err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
};

/*
  Simple slots generator using weekly availability (availability table stores organizer availability by day).
  NOTE: This MVP assumes availability times are in UTC. If you want organizer-local times, read profile.timezone and convert.
*/
exports.getMyEventTypes = async (req, res) => {
  const organizerId = req.user.id;
  try {
    const [rows] = await db.query('SELECT * FROM event_types WHERE organizer_id = ?', [organizerId]);
    res.json({ events: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
};
exports.getAvailableSlotsForSlug = async (req, res) => {
  const slug = req.params.slug;
  const days = Number(req.query.days || 14);
  try {
    const [evRows] = await db.query('SELECT * FROM event_types WHERE slug = ?', [slug]);
    if (!evRows.length) return res.status(404).json({ error: 'Event not found' });
    const event = evRows[0];

    // get organizer availability rows
    const [avail] = await db.query('SELECT day_of_week, start_time, end_time FROM availability WHERE organizer_id = ?', [event.organizer_id]);

    const now = DateTime.utc().startOf('day');
    const slots = [];

    for (let i=0;i<days;i++){
      const date = now.plus({ days: i });
      const luxonWeekday = date.weekday; // 1=Mon ... 7=Sun
      const dowStr = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][date.weekday % 7]; // map

      const rowsForDay = avail.filter(a => a.day_of_week === dowStr);
      for (const a of rowsForDay) {
        const [sh, sm] = a.start_time.split(':').map(Number);
        const [eh, em] = a.end_time.split(':').map(Number);
        let cursor = DateTime.utc(date.year, date.month, date.day, sh, sm);
        const endOfWindow = DateTime.utc(date.year, date.month, date.day, eh, em);
        while (cursor.plus({ minutes: event.duration_minutes }) <= endOfWindow) {
          slots.push({ start: cursor.toISO(), end: cursor.plus({ minutes: event.duration_minutes }).toISO() });
          cursor = cursor.plus({ minutes: event.duration_minutes });
        }
      }
    }

    if (!slots.length) return res.json({ slots: [] });

    // fetch bookings that overlap range
    const earliest = slots[0].start;
    const latest = slots[slots.length -1].end;
    const [bookings] = await db.query('SELECT start_datetime, end_datetime FROM bookings WHERE event_type_id = ? AND NOT (end_datetime <= ? OR start_datetime >= ?)', [event.id, earliest, latest]);
    const overlaps = (slotStart, slotEnd, bookingStart, bookingEnd) => {
  return !(slotEnd <= bookingStart || slotStart >= bookingEnd);
};

// Mark each slot as booked or free
const processedSlots = slots.map(s => {
  const slotStart = new Date(s.start);
  const slotEnd = new Date(s.end);
  
  const isBooked = bookings.some(b =>
    overlaps(slotStart, slotEnd, new Date(b.start_datetime), new Date(b.end_datetime))
  );

  return { ...s, isBooked };
});

res.json({ slots: processedSlots });
   
  } catch(err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
};
