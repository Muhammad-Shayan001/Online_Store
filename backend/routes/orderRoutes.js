const express = require('express');
const router = express.Router();
const {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
  getOrders,
  getInvoice,
  cancelOrder,
  trackOrder,
  cancelOrderWithReason,
  requestReturn,
  adminUpdateOrder
} = require('../controllers/orderController');
const { protect, admin, optionalProtect } = require('../middleware/authMiddleware');
const asyncHandler = require('express-async-handler');

// For "Guest" checkout, protect middleware will fail if we use it blindly.
// We need a way to support both. 
// A custom middleware "optionalProtect" could work, or just check inside the controller if we make the route public.
// I'll make the POST / route public, but inside the controller I check req.user (which needs token parsing even if not strictly required).
// BUT standard `protect` throws 401.
// I will create `protectOptional` logical approach or just parse token if present.
// For now, I'll make it Public, but I need middleware that *decodes* if existing but doesn't *reject* if missing.
// I'll add `optionalProtect` to `authMiddleware` later or simply manual check in controller?
// Actually `protect` sets `req.user`. If I don't use `protect`, `req.user` is undefined.
// But if the user Sends a token, I want to know about it.
// I'll modify authMiddleware to add `optionalAuth`.

router.route('/')
  .post(optionalProtect, asyncHandler(addOrderItems)) // Make public, but handle user logic if token header exists?
  // Current Issue: If I don't run `protect`, `req.user` is never set even if token is there.
  // I need middleware to *attempt* decoding.
  .get(protect, admin, asyncHandler(getOrders));


router.route('/myorders').get(protect, asyncHandler(getMyOrders));

// Order tracking
router.route('/:id/track').get(optionalProtect, asyncHandler(trackOrder));

router.route('/:id')
  .get(optionalProtect, asyncHandler(getOrderById));

router.route('/:id/pay')
  .put(protect, asyncHandler(updateOrderToPaid));

router.route('/:id/deliver')
  .put(protect, admin, asyncHandler(updateOrderToDelivered));

// Cancel order with reason
router.route('/:id/cancel').put(protect, asyncHandler(cancelOrder));

// Return/refund request
router.route('/:id/return').post(protect, asyncHandler(requestReturn));

// Admin order management
router.route('/:id/admin').put(protect, admin, asyncHandler(adminUpdateOrder));

// Guest order lookup
// router.route('/guest-lookup').post(asyncHandler(guestOrderLookup));

// Pagination/filtering for admin
// router.route('/paginated').get(protect, admin, asyncHandler(getOrdersPaginated));

// Invoice PDF download
// router.route('/:id/invoice/download').get(protect, asyncHandler(downloadInvoicePdf));

module.exports = router;
