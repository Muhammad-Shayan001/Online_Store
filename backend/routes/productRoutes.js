const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');
const asyncHandler = require('express-async-handler');

router.route('/')
  .get(asyncHandler(getProducts))
  .post(protect, admin, asyncHandler(createProduct));
router.route('/:id/reviews').post(protect, asyncHandler(createProductReview));
router.route('/:id')
  .get(asyncHandler(getProductById))
  .put(protect, admin, asyncHandler(updateProduct))
  .delete(protect, admin, asyncHandler(deleteProduct));

module.exports = router;
