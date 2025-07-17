const Razorpay = require('razorpay');
const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');
const sendPaymentNotification = require('../utils/sendEmail');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

exports.createOrder = async (req, res) => {
  const { productId } = req.body;
  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ error: 'Product not found' });

  const options = {
    amount: product.price * 100, // in paise
    currency: 'INR',
    receipt: `receipt_order_${Date.now()}`
  };
  const order = await razorpay.orders.create(options);
  res.json({ orderId: order.id, amount: order.amount, currency: order.currency });
};

exports.verifyAndSaveOrder = async (req, res) => {
  const { razorpay_payment_id, razorpay_order_id, productId } = req.body;
  const { uid, name, email } = req.user;

  // Find or create user
  let user = await User.findOne({ uid });
  if (!user) user = await User.create({ uid, name, email });

  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ error: 'Product not found' });

  // Save order
  const order = await Order.create({
    user: user._id,
    product: product._id,
    paymentId: razorpay_payment_id,
    amount: product.price
  });

  // Send email to super admin
  await sendPaymentNotification({ user, product, amount: product.price });

  res.json({ success: true });
};

exports.getAllOrders = async (req, res) => {
  // Only allow super admin (by email)
  if (req.user.email !== process.env.SUPER_ADMIN_EMAIL) return res.status(403).json({ error: 'Forbidden' });
  const orders = await Order.find().populate('user').populate('product');
  res.json(orders);
};