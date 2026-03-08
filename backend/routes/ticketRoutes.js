const express = require('express');
const router = express.Router();
const { createTicket, getTickets, updateTicket } = require('../controllers/ticketController');
const { protect, admin } = require('../middleware/authMiddleware');
const { optionalProtect } = require('../middleware/optionalProtect');

router.route('/').post(optionalProtect, createTicket).get(protect, admin, getTickets);
router.route('/:id').put(protect, admin, updateTicket);

module.exports = router;
