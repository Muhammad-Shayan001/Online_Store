const asyncHandler = require('express-async-handler');
const Ticket = require('../models/Ticket');
const logger = require('../utils/logger');

// @desc    Create a new support ticket
// @route   POST /api/tickets
// @access  Public
const createTicket = asyncHandler(async (req, res) => {
  const { name, email, subject, message } = req.body;

  const ticket = await Ticket.create({
    user: req.user ? req.user._id : null,
    name,
    email,
    subject,
    message
  });

  if (ticket) {
      logger.info(`New Ticket created: ${ticket._id} by ${email}`);
      res.status(201).json(ticket);
  } else {
      res.status(400);
      throw new Error('Invalid ticket data');
  }
});

// @desc    Get all tickets
// @route   GET /api/tickets
// @access  Private/Admin
const getTickets = asyncHandler(async (req, res) => {
  const tickets = await Ticket.find({}).sort({ createdAt: -1 });
  res.json(tickets);
});

// @desc    Update ticket status/response
// @route   PUT /api/tickets/:id
// @access  Private/Admin
const updateTicket = asyncHandler(async (req, res) => {
  const ticket = await Ticket.findById(req.params.id);

  if (ticket) {
    ticket.status = req.body.status || ticket.status;
    ticket.adminResponse = req.body.adminResponse || ticket.adminResponse;
    ticket.priority = req.body.priority || ticket.priority;

    const updatedTicket = await ticket.save();
    res.json(updatedTicket);
  } else {
    res.status(404);
    throw new Error('Ticket not found');
  }
});

module.exports = {
  createTicket,
  getTickets,
  updateTicket
};
