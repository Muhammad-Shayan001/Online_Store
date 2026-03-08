const axios = require('axios');

(async () => {
  try {
    const [,, emailArg] = process.argv;
    const email = emailArg || `test${Date.now()}@example.com`;

    const payload = {
      name: 'Debug User',
      email,
      password: 'Password123!'
    };

    const response = await axios.post('http://localhost:5000/api/users', payload);
    console.log('Register response:', response.data);
  } catch (error) {
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Body:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  } finally {
    process.exit(0);
  }
})();
