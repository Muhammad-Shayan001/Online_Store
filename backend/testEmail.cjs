const dotenv = require('dotenv');
dotenv.config({ path: './.env' });
const { sendEmail } = require('./utils/emailService');

const test = async () => {
    console.log("Current Dir:", process.cwd());
    console.log("Email Config:", {
        user: process.env.ADMIN_EMAIL,
        passLength: process.env.EMAIL_PASS ? process.env.EMAIL_PASS.length : 0
    });
    console.log("Attempting to send test email to:", process.env.ADMIN_EMAIL);
    const result = await sendEmail(
        process.env.ADMIN_EMAIL, 
        "Test Email System", 
        "<h1>It Works!</h1><p>Your email service is configured correctly.</p>"
    );
    console.log("Email Result:", result ? "SUCCESS" : "FAILED");
};

test();