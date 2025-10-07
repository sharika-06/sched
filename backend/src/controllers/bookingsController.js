const db = require('../db');

  exports.createBooking = async (req, res) => {
  console.log('📩 Booking request body:', req.body);
  const { event_type_id, slug, start, end, guest_name, guest_email } = req.body;


  // support either event_type_id or slug (frontend will send slug)
  try {
    let event;
    if (event_type_id) {
      const [r] = await db.query('SELECT * FROM event_types WHERE id = ?', [event_type_id]);
      if (!r.length) return res.status(404).json({ error: 'Event type not found' });
      event = r[0];
    } else if (slug) {
      const [r] = await db.query('SELECT * FROM event_types WHERE slug = ?', [slug]);
      if (!r.length) return res.status(404).json({ error: 'Event not found' });
      event = r[0];
    } else {
      return res.status(400).json({ error: 'event_type_id or slug required' });
    }

    if (!start || !end || !guest_name || !guest_email) return res.status(400).json({ error: 'Missing fields' });

    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      // lock event_type row
      const [ev] = await conn.query('SELECT id, organizer_id FROM event_types WHERE id = ? FOR UPDATE', [event.id]);
      if (!ev.length) { await conn.rollback(); return res.status(404).json({ error: 'Event not found' }); }

      // check conflict
      const [conflict] = await conn.query(
        'SELECT id FROM bookings WHERE event_type_id = ? AND NOT (end_datetime <= ? OR start_datetime >= ?) LIMIT 1',
        [event.id, start, end]
      );
      if (conflict.length) { await conn.rollback(); return res.status(409).json({ error: 'Slot already taken' }); }

      // create or find client user (create lightweight client user record to tie to bookings)
      const [clientRows] = await conn.query('SELECT id FROM users WHERE email = ?', [guest_email]);
      let clientId;
      if (clientRows.length) clientId = clientRows[0].id;
      else {
        const [r] = await conn.query('INSERT INTO users (name,email,password_hash,role) VALUES (?,?,?,?)', [guest_name, guest_email, '', 'client']);
        clientId = r.insertId;
      }

     // Convert ISO 8601 (with 'T' and 'Z') to MySQL DATETIME ('YYYY-MM-DD HH:MM:SS')
const formatMySQLDate = (isoString) => {
  const date = new Date(isoString);
  const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return offsetDate.toISOString().slice(0, 19).replace('T', ' ');
};

const formattedStart = formatMySQLDate(start);
const formattedEnd = formatMySQLDate(end);

const [ins] = await conn.query(
  'INSERT INTO bookings (event_type_id, client_id, start_datetime, end_datetime) VALUES (?,?,?,?)',
  [event.id, clientId, formattedStart, formattedEnd]
);


      await conn.commit();



      // 📧 Send confirmation email
const nodemailer = require('nodemailer');

try {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'sochakee70@gmail.com', // 🔒 Replace with your email
      pass: 'cxegqhvptgpxzenn',    // 🔒 Use an App Password, not your login password
    },
  });

  await transporter.sendMail({
    from: 'your_email@gmail.com',
    to: guest_email,
    subject: `Booking Confirmation: ${event.title}`,
    html: `
      <h2>Booking Confirmed ✅</h2>
      <p>Dear ${guest_name},</p>
      <p>Your booking for <strong>${event.title}</strong> is confirmed.</p>
      <p><b>Start Time:</b> ${new Date(start).toLocaleString()}</p>
      <p><b>End Time:</b> ${new Date(end).toLocaleString()}</p>
      <br/>
      <p>Thank you for scheduling with us!</p>
      <p>— Team Schedly</p>
    `,
  });

  console.log(`✅ Confirmation email sent to ${guest_email}`);
} catch (emailErr) {
  console.error('❌ Failed to send confirmation email:', emailErr);
}




      // optional: create notification rows for reminders
      // example: schedule an email 24h before
      const scheduleTime = new Date(new Date(start).getTime() - 24*60*60*1000); // 24h before
      await db.query('INSERT INTO notifications (booking_id, notification_type, message, scheduled_time) VALUES (?,?,?,?)',
        [ins.insertId, 'email', `Reminder for ${guest_name}`, scheduleTime]);

      res.json({ bookingId: ins.insertId });
    } catch (err) {
      await conn.rollback();
      console.error(err);
      res.status(500).json({ error: 'server error' });
    } finally {
      conn.release();
    }
  } catch(err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
};

exports.listBookingsForOrganizer = async (req, res) => {
  const organizerId = req.params.organizerId;
  try {
    const [rows] = await db.query(
      `SELECT b.*, et.title, u.name as client_name, u.email as client_email
       FROM bookings b
       JOIN event_types et ON b.event_type_id = et.id
       JOIN users u ON b.client_id = u.id
       WHERE et.organizer_id = ? ORDER BY b.start_datetime DESC`, [organizerId]);
    res.json({ bookings: rows });
  } catch(err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
};

const generateSlots = (event, startDate, endDate) => {
  const slots = [];
  const durationMinutes = event.slot_duration || 30;
  const startHour = event.start_hour || 9;
  const endHour = event.end_hour || 17;

  // ✅ Prevent crash if available_days is missing or empty
  const availableDays = event.available_days
    ? event.available_days.split(',').map(Number)
    : [1, 2, 3, 4, 5]; // default: Monday–Friday

  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    if (availableDays.includes(currentDate.getDay())) {
      for (let h = startHour; h < endHour; h++) {
        for (let m = 0; m < 60; m += durationMinutes) {
          const start = new Date(currentDate);
          start.setHours(h, m, 0, 0);
          const end = new Date(start.getTime() + durationMinutes * 60000);
          slots.push({ start, end });
        }
      }
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return slots;
};

exports.getAvailability = async (req, res) => {
  const slug = req.params.slug;
  try {
    // ⿡ Get event by slug
    const [eventRows] = await db.query('SELECT * FROM event_types WHERE slug = ?', [slug]);
    if (!eventRows.length) return res.status(404).json({ error: 'Event not found' });
    const event = eventRows[0];

    // ⿢ Get organizer's availability
    const [availabilityRows] = await db.query(
      'SELECT * FROM availability WHERE organizer_id = ?',
      [event.organizer_id]
    );

    if (!availabilityRows.length) {
      return res.json({ event, availableSlots: [] });
    }

    // ⿣ Prepare helper mappings
    const dayMap = {
      Sunday: 0,
      Monday: 1,
      Tuesday: 2,
      Wednesday: 3,
      Thursday: 4,
      Friday: 5,
      Saturday: 6
    };

    const durationMinutes = event.duration_minutes || 30;
    const today = new Date();
    const endDate = new Date();
    endDate.setMonth(today.getMonth() + 1); // Generate for next 1 month

    let slots = [];

    // ⿤ Loop through availability and generate slots for each day/time range
    for (const avail of availabilityRows) {
      const targetDay = dayMap[avail.day_of_week];
      const current = new Date(today);

      while (current <= endDate) {
        if (current.getDay() === targetDay) {
          const [sh, sm] = avail.start_time.split(':').map(Number);
          const [eh, em] = avail.end_time.split(':').map(Number);

          let slotStart = new Date(current);
          slotStart.setHours(sh, sm, 0, 0);
          let slotEnd = new Date(slotStart.getTime() + durationMinutes * 60000);

          while (slotEnd.getHours() * 60 + slotEnd.getMinutes() <= eh * 60 + em) {
            slots.push({ start: new Date(slotStart), end: new Date(slotEnd) });
            slotStart = new Date(slotEnd);
            slotEnd = new Date(slotStart.getTime() + durationMinutes * 60000);
          }
        }
        current.setDate(current.getDate() + 1);
      }
    }

    // ⿥ Get existing bookings to filter out taken slots
    const [bookings] = await db.query(
      'SELECT start_datetime, end_datetime FROM bookings WHERE event_type_id = ?',
      [event.id]
    );

const availableSlots = slots.map(slot => {
  const slotStart = slot.start.getTime();
  const slotEnd = slot.end.getTime();

  const isBooked = bookings.some(b => {
    const bookingStart = new Date(b.start_datetime).getTime();
    const bookingEnd = new Date(b.end_datetime).getTime();

    return slotStart < bookingEnd && slotEnd > bookingStart;
  });

  return { 
    start: slot.start.toISOString(), 
    end: slot.end.toISOString(), 
    isBooked
  };
});                                                                      

  console.log('📅 Available slots:', availableSlots.map(s => ({
  start: s.start,
  end: s.end,
  isBooked: s.isBooked
})));                                             



  

    // ⿦ Send back the final available slots
 res.json({ event, availableSlots });               
 


  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};


