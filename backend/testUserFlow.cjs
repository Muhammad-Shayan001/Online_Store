const axios = require('axios');

const API_URL = 'http://localhost:5000/api/users';

const runflow = async () => {
    const randomNum = Math.floor(Math.random() * 10000);
    const email = `testuser${randomNum}@example.com`;
    const password = 'password123';
    const name = 'Test User';

    try {
        console.log(`1. Registering user: ${email}`);
        const regRes = await axios.post(`${API_URL}`, {
            name,
            email,
            password
        });
        console.log('Registration Response:', regRes.data);

        console.log('2. Waiting 2 seconds...');
        await new Promise(resolve => setTimeout(resolve, 2000));

        console.log('3. Logging in (should trigger OTP check)...');
        const loginRes = await axios.post(`${API_URL}/login`, {
            email,
            password
        });
        console.log('Login Response:', loginRes.data);

    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
        if (error.response) console.error('Status:', error.response.status);
    }
};

runflow();