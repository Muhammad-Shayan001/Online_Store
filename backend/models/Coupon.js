const mongoose = require('mongoose');

const couponSchema = mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true,
  },
  discount: {
    type: Number,
    required: true,
    min: 0,
    max: 100, // Assuming percentage discount for now
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  expirationDate: {
    type: Date,
  },
}, {
  timestamps: true,
});

const Coupon = mongoose.model('Coupon', couponSchema);

module.exports = Coupon;
