const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./backend/models/User');
const connectDB = require('./backend/config/db');

dotenv.config({ path: './backend/.env' });

const makeAdmin = async () => {
  try {
    await connectDB();
    
    const email = process.argv[2];
    
    if (!email) {
      console.log('Please provide an email address. Usage: node makeAdmin.cjs <email>');
      process.exit(1);
    }

    const user = await User.findOne({ email });

    if (user) {
      user.isAdmin = true;
      await user.save();
      console.log(`User ${user.name} (${user.email}) is now an Admin.`);
    } else {
      console.log(`User ${email} not found.`);
    }

    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

makeAdmin();
