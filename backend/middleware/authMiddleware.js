const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  token = req.cookies?.jwt;
  console.log(`Debug: Auth token present: ${!!token}`);

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log(`Debug: Token decoded for userId: ${decoded.userId}`);

      req.user = await User.findById(decoded.userId).select('-password');
      if (!req.user) console.log(`Debug: User ID ${decoded.userId} not found in DB`);

      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      return next(new Error('Not authorized, token failed'));
    }
  } else {
    res.status(401);
    return next(new Error('Not authorized, no token'));
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401);
    throw new Error('Not authorized as an admin');
  }
};

const optionalProtect = async (req, res, next) => {
  let token;
  token = req.cookies?.jwt;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.userId).select('-password');
    } catch (error) {
      console.error("Optional Auth Failed:", error);
      // We do NOT block. Just continue as guest.
    }
  }
  next();
};

module.exports = { protect, admin, optionalProtect };
