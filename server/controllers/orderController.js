const axios = require('axios');
const orders = require('../models/Order');
const transporter = require('../config/nodemailer');
const razorpay = require('../config/razorpay');

const SUPER_ADMIN_EMAIL = process.env.SUPER_ADMIN_EMAIL || 'superadmin@example.com';

exports.createOrder = async (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId) return res.status(400).json({ error: 'Product ID is required' });
    const response = await axios.get(`https://dummyjson.com/products/${productId}`);
    const product = response.data;
    const options = {
      amount: product.price * 100,
      currency: 'INR',
      receipt: `receipt_order_${Date.now()}`
    };
    const order = await razorpay.orders.create(options);
    res.json({ orderId: order.id, amount: order.amount, currency: order.currency, product });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create Razorpay order' });
  }
};

exports.verifyAndSaveOrder = async (req, res) => {
  try {
    const { razorpay_payment_id, razorpay_order_id, productId } = req.body;
    if (!razorpay_payment_id || !razorpay_order_id || !productId) {
      return res.status(400).json({ error: 'Missing payment or product information' });
    }
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const response = await axios.get(`https://dummyjson.com/products/${productId}`);
    const product = response.data;
    const order = {
      id: orders.length + 1,
      user: {
        name: req.user.name || req.user.displayName || req.user.email,
        email: req.user.email
      },
      product: {
        id: product.id,
        name: product.title,
        price: product.price,
        description: product.description
      },
      paymentId: razorpay_payment_id,
      amount: product.price,
      createdAt: new Date()
    };
    orders.push(order);
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: SUPER_ADMIN_EMAIL,
      subject: 'New Payment Received',
      text: `Payment received for product "${product.title}" by user "${order.user.name}" (${order.user.email}). Amount: ₹${product.price}`
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to process payment and save order' });
  }
};

exports.getAllOrders = (req, res) => {
  if (req.user.email !== SUPER_ADMIN_EMAIL) {
    return res.status(403).json({ error: 'Forbidden: Super Admin only' });
  }
  res.json(orders);
};