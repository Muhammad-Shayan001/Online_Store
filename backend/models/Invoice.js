const mongoose = require('mongoose');

const invoiceSchema = mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  invoiceNumber: { type: String, required: true },
  generatedAt: { type: Date, default: Date.now },
  amount: { type: Number, required: true },
  status: { type: String, default: 'Issued' }
}, {
  timestamps: true
});

const Invoice = mongoose.model('Invoice', invoiceSchema);

module.exports = Invoice;
