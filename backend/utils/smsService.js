// SMS notification utility using Twilio
const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_FROM_NUMBER;

let client;
if (accountSid && authToken) {
  client = twilio(accountSid, authToken);
}

const sendSMS = async (to, message) => {
  if (!client) throw new Error('Twilio credentials not set');
  return client.messages.create({
    body: message,
    from: fromNumber,
    to
  });
};

module.exports = { sendSMS };