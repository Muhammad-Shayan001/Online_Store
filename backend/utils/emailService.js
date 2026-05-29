const nodemailer = require('nodemailer');
const logger = require('./logger');

const emailUser = process.env.EMAIL_USER || process.env.ADMIN_EMAIL;
const emailPass = process.env.EMAIL_PASS ? process.env.EMAIL_PASS.replace(/\s+/g, '') : null;

if (!emailUser || !emailPass) {
  logger.error('Email credentials are not configured. Set EMAIL_USER/ADMIN_EMAIL and EMAIL_PASS.');
}

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  pool: true,
  maxConnections: 5,
  maxMessages: 100,
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
  auth: {
    user: emailUser,
    pass: emailPass,
  },
});

if (emailUser && emailPass) {
  transporter.verify().then(() => {
    logger.info(`Email transporter ready for ${emailUser}`);
  }).catch((error) => {
    logger.error(`Email transporter verification failed: ${error.message}`);
  });
}

const sendEmail = async (to, subject, htmlContent) => {
  logger.info(`Email sending bypassed for ${to}. Subject: "${subject}". Content length: ${htmlContent ? htmlContent.length : 0} chars.`);
  return true;
};

const sendWelcomeEmail = async (user) => {
  const subject = 'Welcome to Online Store!';
  const html = `
    <h1>Welcome, ${user.name}!</h1>
    <p>Thank you for registering with Online Store. We are excited to have you.</p>
    <p>Start shopping now!</p>
  `;
  return await sendEmail(user.email, subject, html);
};

const generateInvoiceHTML = require('./invoiceGenerator');

const sendOrderConfirmationEmail = async (user, order) => {
  const subject = `Order Placed - #${order.invoiceNumber || order._id}`;
  // Use generateInvoiceHTML for a nice order summary, but maybe with a "Order Confirmation" title
  const html = generateInvoiceHTML(order, user, 'Order Confirmation');
  return await sendEmail(user.email, subject, html);
};

const sendPaymentConfirmedEmail = async (user, order) => {
    const subject = `Payment Received - Order #${order.invoiceNumber || order._id}`;
    const html = generateInvoiceHTML(order, user, 'Payment Receipt');
    return await sendEmail(user.email, subject, html);
};

const sendOrderDeliveredEmail = async (user, order) => {
    const subject = `Order Delivered - #${order.invoiceNumber || order._id}`;
    const html = generateInvoiceHTML(order, user, 'Delivery Confirmation');
    return await sendEmail(user.email, subject, html);
};

const sendInvoiceEmail = async (user, order) => {
    const subject = `Invoice - #${order.invoiceNumber || order._id}`;
    const html = generateInvoiceHTML(order, user, 'Invoice');
    return await sendEmail(user.email, subject, html);
};

module.exports = {
  sendEmail,
  sendWelcomeEmail,
  sendOrderConfirmationEmail,
  sendPaymentConfirmedEmail,
  sendOrderDeliveredEmail,
  sendInvoiceEmail
};
