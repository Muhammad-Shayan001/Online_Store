const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const listUsers = async () => {
    try {
        await connectDB();
        const users = await User.find({}).select('email name isAdmin isVerified');
        console.table(users.map(u => ({
            email: u.email,
            name: u.name,
            role: u.isAdmin ? 'Admin' : 'User',
            verified: u.isVerified
        })));
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

listUsers();
