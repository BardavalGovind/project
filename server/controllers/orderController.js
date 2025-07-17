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
  try {
    const { productId } = req.body;
    if (!productId) return res.status(400).json({ error: 'Product ID is required' });

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    const options = {
      amount: product.price * 100,
      currency: 'INR',
      receipt: `receipt_order_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);
    res.json({ orderId: order.id, amount: order.amount, currency: order.currency });
  } catch (error) {
    console.error('Error in createOrder:', error);
    res.status(500).json({ error: 'Failed to create Razorpay order' });
  }
};

exports.verifyAndSaveOrder = async (req, res) => {
  try {
    const { razorpay_payment_id, razorpay_order_id, productId } = req.body;
    if (!razorpay_payment_id || !razorpay_order_id || !productId) {
      return res.status(400).json({ error: 'Missing payment or product information' });
    }

    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized: user not authenticated' });
    }

    const { uid, name, email } = req.user;

    let user = await User.findOne({ uid });
    if (!user) user = await User.create({ uid, name, email });

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    const order = await Order.create({
      user: user._id,
      product: product._id,
      paymentId: razorpay_payment_id,
      amount: product.price
    });

    await sendPaymentNotification({ user, product, amount: product.price });

    res.json({ success: true });
  } catch (error) {
    console.error('Error in verifyAndSaveOrder:', error);
    res.status(500).json({ error: 'Failed to process payment and save order' });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    if (!req.user || req.user.email !== process.env.SUPER_ADMIN_EMAIL) {
      return res.status(403).json({ error: 'Forbidden: Super Admin only' });
    }

    const orders = await Order.find().populate('user').populate('product');
    res.json(orders);
  } catch (error) {
    console.error('Error in getAllOrders:', error);
    res.status(500).json({ error: 'Failed to retrieve orders' });
  }
};
