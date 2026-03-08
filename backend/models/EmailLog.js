const mongoose = require('mongoose');

const emailLogSchema = mongoose.Schema({
  recipient: { type: String, required: true },
  subject: { type: String, required: true },
  type: { type: String, required: true }, // 'OTP', 'INVOICE', 'ORDER_CONFIRMATION'
  status: { type: String, required: true }, // 'Sent', 'Failed'
  sentAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

const EmailLog = mongoose.model('EmailLog', emailLogSchema);

module.exports = EmailLog;
