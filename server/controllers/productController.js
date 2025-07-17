const Product = require('../models/Product');
exports.getProducts = async (req, res) => {
  const products = await Product.find();
  res.json(products);
};