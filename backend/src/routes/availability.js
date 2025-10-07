const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const controller = require('../controllers/availabilityController');

router.post('/', requireAuth, controller.createAvailability);   // add availability (organizer)
router.get('/', requireAuth, controller.listAvailability);     // list organizer availability

module.exports = router;