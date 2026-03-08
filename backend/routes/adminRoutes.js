const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');
const asyncHandler = require('express-async-handler');

// @desc    Get Admin Dashboard Stats
// @route   GET /api/admin/stats
// @access  Private/Admin
router.get('/stats', protect, admin, asyncHandler(async (req, res) => {
  // Parallel Fetching for Performance
  const [
      userCount,
      orderCount,
      productCount,
      totalRevenueData,
      recentOrders,
      lowStockProducts
  ] = await Promise.all([
      User.countDocuments(),
      Order.countDocuments(),
      Product.countDocuments(),
      Order.aggregate([
          { $group: { _id: null, total: { $sum: "$total" } } }
      ]),
      Order.find().sort({ createdAt: -1 }).limit(5).populate('user', 'name email'),
      Product.find({ countInStock: { $lt: 5 } }).select('name countInStock')
  ]);

  const totalRevenue = totalRevenueData.length > 0 ? totalRevenueData[0].total : 0;

  // Monthly Sales Chart Data (Last 6 months)
  const monthlySales = await Order.aggregate([
      {
          $match: {
              createdAt: { 
                  $gte: new Date(new Date().setMonth(new Date().getMonth() - 6)) 
              }
          }
      },
      {
          $group: {
              _id: { $month: "$createdAt" },
              sales: { $sum: "$total" },
              count: { $sum: 1 }
          }
      },
      { $sort: { "_id": 1 } }
  ]);
  
  // Map month numbers to names
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const formattedChartData = monthlySales.map(item => ({
      name: months[item._id - 1],
      sales: item.sales,
      orders: item.count
  }));

  res.json({
      userCount,
      orderCount,
      productCount,
      totalRevenue,
      recentOrders,
      lowStockProducts,
      chartData: formattedChartData
  });
}));

// @desc    Get Detailed Analytics
// @route   GET /api/admin/analytics
// @access  Private/Admin
router.get('/analytics', protect, admin, asyncHandler(async (req, res) => {
   // More complex analytics could go here (e.g., repeating customers, category breakdown)
   const categoryBreakdown = await Product.aggregate([
       { $group: { _id: "$category", count: { $sum: 1 } } }
   ]);

   res.json({ categoryBreakdown });
}));

module.exports = router;