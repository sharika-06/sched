const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const controller = require('../controllers/eventTypesController');

router.post('/', requireAuth, controller.createEventType);
router.get('/mine', requireAuth, controller.getMyEventTypes);        // added this
router.get('/:slug/slots', controller.getAvailableSlotsForSlug);   // public slots
router.get('/:slug', controller.getEventTypeBySlug);               // public metadata

module.exports = router;