const express = require('express');
const router = express.Router();
const {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  verifyOTP,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
  forgotPassword,
  resetPassword,
  getWishlist,
  addToWishlist,
  removeFromWishlist
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');
const asyncHandler = require('express-async-handler');

router.post('/forgot-password', asyncHandler(forgotPassword));
router.put('/reset-password/:resetToken', asyncHandler(resetPassword));

router.route('/wishlist')
  .get(protect, asyncHandler(getWishlist))
  .post(protect, asyncHandler(addToWishlist));

router.route('/wishlist/:id')
  .delete(protect, asyncHandler(removeFromWishlist));

router.post('/', asyncHandler(registerUser));
router.post('/login', asyncHandler(authUser));
router.post('/logout', logoutUser);
router.post('/verify-otp', protect, asyncHandler(verifyOTP));
router.route('/profile')
    .get(protect, asyncHandler(getUserProfile))
    .put(protect, asyncHandler(updateUserProfile));

router.route('/')
    .get(protect, admin, asyncHandler(getUsers));

router.route('/:id')
    .delete(protect, admin, asyncHandler(deleteUser))
    .get(protect, admin, asyncHandler(getUserById))
    .put(protect, admin, asyncHandler(updateUser));

module.exports = router;
