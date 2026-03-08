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

const updateEmail = async () => {
    await connectDB();
    const targetEmail = 'onlinestore7188@gmail.com';
    const oldEmail = 'testuser5875@example.com'; 

    try {
        // First check if target email already exists
        const exists = await User.findOne({ email: targetEmail });
        if (exists) {
            console.log(`User with email ${targetEmail} already exists.`);
            // Reset verification for testing
            exists.isVerified = false;
            await exists.save();
            console.log('Reset verification status to false.');
        } else {
            // Find one to update
            const userToUpdate = await User.findOne({ email: oldEmail });
            if (userToUpdate) {
                userToUpdate.email = targetEmail;
                userToUpdate.isVerified = false;
                await userToUpdate.save();
                console.log(`Updated ${oldEmail} to ${targetEmail}`);
            } else {
                console.log(`Could not find ${oldEmail} to update. Creating new user.`);
                 // Create new user if not found
                 const bcrypt = require('bcryptjs');
                 const salt = await bcrypt.genSalt(10);
                 const hashedPassword = await bcrypt.hash('123456', salt);
                 
                 await User.create({
                    name: 'Admin Test',
                    email: targetEmail,
                    password: hashedPassword,
                    isAdmin: true,
                    isVerified: false
                 });
                 console.log(`Created new user ${targetEmail} with password '123456'`);
            }
        }
    } catch (error) {
        console.error(error);
    }
    process.exit();
};

updateEmail();
