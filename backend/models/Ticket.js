const mongoose = require('mongoose');

const ticketSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Allow guest tickets
  },
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  status: { 
    type: String, 
    required: true, 
    default: 'Open',
    enum: ['Open', 'In Progress', 'Resolved', 'Closed']
  },
  priority: {
    type: String,
    required: true,
    default: 'Medium',
    enum: ['Low', 'Medium', 'High']
  },
  adminResponse: { type: String }
}, {
  timestamps: true
});

const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;
