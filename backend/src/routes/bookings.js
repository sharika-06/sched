const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const controller = require('../controllers/bookingsController');

// Public endpoint → guests can create bookings
router.post('/', controller.createBooking);

router.get('/availability/:slug', controller.getAvailability);

// Organizer endpoint → must be logged in
router.get('/organizer/:organizerId', requireAuth, async (req, res, next) => {
  // only allow the organizer to see their own bookings
  if (parseInt(req.params.organizerId, 10) !== req.user.id) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  return controller.listBookingsForOrganizer(req, res, next);
});

module.exports = router;
