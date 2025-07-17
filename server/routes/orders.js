const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');
const { createOrder, verifyAndSaveOrder, getAllOrders } = require('../controllers/orderController');

router.post('/create',  createOrder);
router.post('/verify', authenticateToken, verifyAndSaveOrder);
router.get('/all', authenticateToken, getAllOrders);

module.exports = router;