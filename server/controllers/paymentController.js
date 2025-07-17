
const nodemailer = require("nodemailer");

exports.verifyPayment = async (req, res) => {
  const { razorpay_payment_id, razorpay_order_id, user, product } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,    
        pass: process.env.EMAIL_PASS,     
      },
    });

  
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.SUPER_ADMIN_EMAIL, 
      subject: "💰 New Payment Received",
      html: `
        <h3>Payment Notification</h3>
        <p><strong>User:</strong> ${user.name} (${user.email})</p>
        <p><strong>Product:</strong> ${product.name} - ₹${product.price}</p>
        <p><strong>Razorpay Order ID:</strong> ${razorpay_order_id}</p>
        <p><strong>Razorpay Payment ID:</strong> ${razorpay_payment_id}</p>
        <p><em>Timestamp:</em> ${new Date().toLocaleString()}</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully to super admin.");
    res.status(200).json({ success: true, message: "Email sent to admin." });
  } catch (error) {
    console.error("Email sending failed:", error);
    res.status(500).json({ success: false, message: "Failed to send email." });
  }
};
