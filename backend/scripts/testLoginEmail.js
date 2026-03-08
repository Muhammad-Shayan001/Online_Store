const axios = require('axios');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../.env') });

const loginAndTriggerEmail = async () => {
    try {
        console.log('Testing Login Flow for: onlinestore7188@gmail.com');
        
        // This relies on the previous script (updateUserEmail.js) creating the user with password checking or updating an existing one
        // Wait, I don't know the password of the updated user if it was an existing user.
        // I should set the password explicitly to be sure.
        
        const response = await axios.post('http://localhost:5000/api/users/login', {
            email: 'onlinestore7188@gmail.com',
            password: 'password123' // I'll update the user to have this password first
        });

        console.log('Login Response Status:', response.status);
        console.log('Login Response Data:', response.data);
    } catch (error) {
        if (error.response) {
            console.log('Login Failed:', error.response.status, error.response.data);
        } else {
            console.log('Error:', error.message);
        }
    }
};

const mongoose = require('mongoose');
const User = require('../models/User');

const setupUserAndTest = async () => {
    await mongoose.connect(process.env.MONGO_URI);
    
    // Set known password
    const bcrypt = require('bcryptjs');
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash('password123', salt);
    
    let user = await User.findOne({ email: 'onlinestore7188@gmail.com' });
    if (user) {
        user.password = hash;
        user.isVerified = false; // Force OTP sending
        await user.save();
        console.log('User password reset to "password123" and isVerified=false');
    } else {
         user = await User.create({
            name: 'Test Admin',
            email: 'onlinestore7188@gmail.com',
            password: hash,
            isVerified: false
         });
         console.log('Created user with password "password123"');
    }
    
    // Now trigger the login via HTTP
    await loginAndTriggerEmail();
    
    process.exit();
};

setupUserAndTest();
