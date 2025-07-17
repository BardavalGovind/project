const axios = require('axios');
exports.getProducts = async (req, res) => {
  try {
    const response = await axios.get('https://dummyjson.com/products');
    res.json(response.data.products);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};