const express = require('express');
const router = express.Router();
const controller = require('../controllers/notificationsController');

router.get('/pending', controller.getPendingNotifications);
router.post('/:id/mark-sent', controller.markSent);

module.exports = router;