const dotenv = require('dotenv');
const connectDB = require('../config/db');
const User = require('../models/User');

(async () => {
  try {
    const path = require('path');
    dotenv.config({ path: path.join(__dirname, '../.env') });
    await connectDB();

    const email = process.argv[2];
    if (!email) {
      console.error('Usage: node scripts/inspectUser.js <email>');
      process.exit(1);
    }

    const user = await User.findOne({ email }).select('email isVerified otp otpExpiry createdAt updatedAt');

    if (!user) {
      console.log(`No user found for ${email}`);
    } else {
      console.log('User snapshot:', {
        email: user.email,
        isVerified: user.isVerified,
        otp: user.otp,
        otpExpiry: user.otpExpiry,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      });
    }
  } catch (error) {
    console.error('Inspection failed:', error.message);
  } finally {
    process.exit(0);
  }
})();
