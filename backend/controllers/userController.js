const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const EmailLog = require('../models/EmailLog');
const { sendEmail } = require('../utils/emailService');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const normalizedEmail = email.toLowerCase();
  console.log(`Debug: Login attempt for ${normalizedEmail}. Body keys:`, Object.keys(req.body));
  
  const user = await User.findOne({ email: normalizedEmail });

  if (!user) {
    console.log(`Debug: No user found for ${normalizedEmail}`);
    res.status(401);
    throw new Error('Invalid email or password (User not found)');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  console.log(`Debug: Password match for ${normalizedEmail}: ${isMatch}`);

  if (isMatch) {
    console.log(`Debug: Password valid for ${email}. isVerified: ${user.isVerified}`);
    
    // Check if user is verified, if not send OTP again
    if (!user.isVerified) {
       console.log(`User ${user.email} is not verified. Resending OTP.`); 
       const otp = Math.floor(100000 + Math.random() * 900000).toString();
       const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

       user.otp = otp;
       user.otpExpiry = otpExpiry;
       await user.save();
       console.log(`New OTP generated for ${user.email}: ${otp}`);

       const emailSubject = "Verify your email - Online Store";
       const emailHtml = `
         <h1>Verify Account</h1>
         <p>Your new verification code is: <strong>${otp}</strong></p>
         <p>This code expires in 10 minutes.</p>
       `;

       // Send email and wait for it
       try {
        console.log(`Attempting to send OTP email to ${email}`);
        const emailSent = await sendEmail(email, emailSubject, emailHtml);
        console.log(`Email send result for ${email}: ${emailSent}`);
        if (!emailSent) {
             console.error("CRITICAL: Email returned false!");
             res.status(500);
             throw new Error('Email could not be sent. Please contact support.');
        }
       } catch (error) {
        console.error("Login OTP email failed", error);
       }
    } else {
        console.log(`User ${user.email} is already verified.`);
    }

    generateToken(res, user._id);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      isVerified: user.isVerified
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password (Invalid credentials)');
  }
});

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const normalizedEmail = email.toLowerCase();

  const userExists = await User.findOne({ email: normalizedEmail });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  // Generate OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

  // Hash Password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    name,
    email: normalizedEmail,
    password: hashedPassword,
    otp,
    otpExpiry,
    isAdmin: normalizedEmail === process.env.ADMIN_EMAIL
  });

  if (user) {
    // Send Real Email and wait to ensure we don't drop the connection too early
    const emailSubject = "Verify your email - Online Store";
    const emailHtml = `
      <h1>Verify Account</h1>
      <p>Your verification code is: <strong>${otp}</strong></p>
      <p>This code expires in 10 minutes.</p>
    `;

    try {
      console.log(`Attempting to send OTP email to ${email} (Register)`);
      const emailSent = await sendEmail(email, emailSubject, emailHtml);
      console.log(`Email send result for ${email}: ${emailSent}`);
    } catch (error) {
       console.error("Email send failed during registration", error);
    }

    generateToken(res, user._id);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      message: "Please check email for OTP"
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Logout user / clear cookie
// @route   POST /api/users/logout
// @access  Public
const logoutUser = (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: 'Logged out successfully' });
};

// @desc    Verify OTP
// @route   POST /api/users/verify-otp
// @access  Private
const verifyOTP = async (req, res) => {
    const { otp } = req.body;
    const user = await User.findById(req.user._id);

    if (user && user.otp === otp && user.otpExpiry > Date.now()) {
        user.isVerified = true;
        user.otp = undefined;
        user.otpExpiry = undefined;
        await user.save();
        res.json({ message: 'Email verified successfully' });
    } else {
        res.status(400);
        throw new Error('Invalid or expired OTP');
    }
}

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      isVerified: user.isVerified
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email ? req.body.email.toLowerCase() : user.email;
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.password, salt);
    }
    if (req.body.addresses) {
        user.addresses = req.body.addresses;
    }
    if (req.body.cart) {
        user.cart = req.body.cart;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      isVerified: updatedUser.isVerified,
      cart: updatedUser.cart,
      addresses: updatedUser.addresses,
      wishlist: updatedUser.wishlist
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
};

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    if (user.isAdmin && user.email === process.env.ADMIN_EMAIL) {
       res.status(400);
       throw new Error('Cannot delete super admin owner');
    }
    await User.deleteOne({ _id: user._id });
    res.json({ message: 'User removed' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    
    if (req.body.isAdmin !== undefined) {
        user.isAdmin = req.body.isAdmin;
    }
    
    // Prevent removing super admin status
    if (user.email === process.env.ADMIN_EMAIL && req.body.isAdmin === false) {
        res.status(400);
        throw new Error('Cannot remove super admin status');
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Forgot Password
// @route   POST /api/users/forgot-password
// @access  Public
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const normalizedEmail = email.toLowerCase();
  const user = await User.findOne({ email: normalizedEmail });

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Generate token
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hash token and set to resetPasswordToken field
  user.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set expire
  user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

  await user.save();

  // Create reset url (frontend url)
  // Use referer or origin header if env not set, but better to rely on env vars
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const resetUrl = `${frontendUrl}/#/reset-password/${resetToken}`;

  const message = `
    <h1>You have requested a password reset</h1>
    <p>Please go to this link to reset your password:</p>
    <a href="${resetUrl}">${resetUrl}</a>
    <p>This link expires in 10 minutes.</p>
  `;

  // Send email and wait for it to ensure it completes before response
  try {
    const emailSent = await sendEmail(user.email, 'Password Reset Request', message);
    if (!emailSent) {
      // In case credentials are not configured or transporter fails
      res.status(500);
      throw new Error('Email could not be sent');
    }
  } catch (error) {
    // If it fails, clear the token so the user can try again
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    console.error('Password reset email failed:', error);
    res.status(500);
    throw new Error('Email could not be sent');
  }

  res.status(200).json({ success: true, data: 'Email sent successfully' });
});

// @desc    Reset Password
// @route   PUT /api/users/reset-password/:resetToken
// @access  Public
const resetPassword = asyncHandler(async (req, res) => {
  // Get hashed token
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resetToken)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    res.status(400);
    throw new Error('Invalid token');
  }

  // Set new password
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(req.body.password, salt);

  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();
  
  // Wait for the success email
  try {
      await sendEmail(user.email, 'Password Reset Successful', message);
  } catch(e) {
      console.error('Failed to send success email:', e);
  }

  res.status(200).json({ success: true, data: 'Password reset success' });
});

// @desc    Get user wishlist
// @route   GET /api/users/wishlist
// @access  Private
const getWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('wishlist');
  if (user) {
    res.json(user.wishlist);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Add to wishlist
// @route   POST /api/users/wishlist
// @access  Private
const addToWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  const user = await User.findById(req.user._id);

  if (user) {
    if (user.wishlist.includes(productId)) {
        res.status(400);
        throw new Error('Product already in wishlist');
    }
    user.wishlist.push(productId);
    await user.save();
    
    // Return populated wishlist
    const updatedUser = await User.findById(req.user._id).populate('wishlist');
    res.status(201).json(updatedUser.wishlist);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Remove from wishlist
// @route   DELETE /api/users/wishlist/:id
// @access  Private
const removeFromWishlist = asyncHandler(async (req, res) => {
  const productId = req.params.id;
  const user = await User.findById(req.user._id);

  if (user) {
    user.wishlist = user.wishlist.filter(id => id.toString() !== productId);
    await user.save();
    
    // Return populated wishlist
    const updatedUser = await User.findById(req.user._id).populate('wishlist');
    res.json(updatedUser.wishlist);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

module.exports = {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  verifyOTP,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
  forgotPassword,
  resetPassword,
  getWishlist,
  addToWishlist,
  removeFromWishlist,
};
