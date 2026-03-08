const Coupon = require('../models/Coupon');
const asyncHandler = require('express-async-handler');

// @desc    Create a new coupon
// @route   POST /api/coupons
// @access  Private/Admin
const createCoupon = asyncHandler(async (req, res) => {
    const { code, discount, expirationDate } = req.body;

    const couponExists = await Coupon.findOne({ code });

    if (couponExists) {
        res.status(400);
        throw new Error('Coupon already exists');
    }

    const coupon = await Coupon.create({
        code,
        discount,
        expirationDate
    });

    if (coupon) {
        res.status(201).json(coupon);
    } else {
        res.status(400);
        throw new Error('Invalid coupon data');
    }
});

// @desc    Get all coupons
// @route   GET /api/coupons
// @access  Private/Admin
const getCoupons = asyncHandler(async (req, res) => {
    const coupons = await Coupon.find({});
    res.json(coupons);
});

const Product = require('../models/Product');

// @desc    Validate coupon
// @route   POST /api/coupons/validate
// @access  Private
const validateCoupon = asyncHandler(async (req, res) => {
    const { code } = req.body;
    const coupon = await Coupon.findOne({ code, isActive: true });

    if (coupon) {
        if (coupon.expirationDate && new Date() > coupon.expirationDate) {
            res.status(400);
            throw new Error('Coupon expired');
        }

        // Find products associated with this coupon
        const products = await Product.find({ coupon: coupon._id }).select('_id');
        const productIds = products.map(p => p._id);

        res.json({
            _id: coupon._id,
            code: coupon.code,
            discount: coupon.discount,
            applicableProducts: productIds
        });
    } else {
        res.status(404);
        throw new Error('Invalid or inactive coupon');
    }
});

// @desc    Delete coupon
// @route   DELETE /api/coupons/:id
// @access  Private/Admin
const deleteCoupon = asyncHandler(async (req, res) => {
    const coupon = await Coupon.findById(req.params.id);

    if (coupon) {
        await coupon.deleteOne();
        res.json({ message: 'Coupon removed' });
    } else {
        res.status(404);
        throw new Error('Coupon not found');
    }
});

module.exports = {
    createCoupon,
    getCoupons,
    validateCoupon,
    deleteCoupon
};
