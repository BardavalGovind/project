const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});
async function sendPaymentNotification({ user, product, amount }) {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: process.env.SUPER_ADMIN_EMAIL,
    subject: 'New Payment Received',
    text: `Payment received for product "${product.name}" by user "${user.name}" (${user.email}). Amount: ₹${amount}`
  });
}
module.exports = sendPaymentNotification;