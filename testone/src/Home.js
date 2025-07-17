import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function loadRazorpayScript(src) {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

const Home = ({ idToken, user }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/products")
      .then(res => setProducts(res.data))
      .catch(err => console.error("Error fetching products:", err));
  }, []);

  const handleBuy = async (productId) => {
    if (!idToken) {
      alert("Please sign in first!");
      return;
    }
    try {
      await loadRazorpayScript("https://checkout.razorpay.com/v1/checkout.js");

      const res = await axios.post("http://localhost:5000/api/orders/create", { productId }, {
        headers: { Authorization: `Bearer ${idToken}` }
      });

      const { orderId, amount, currency } = res.data;

      const options = {
        key: "YOUR_RAZORPAY_KEY_ID", // Replace with your actual Razorpay key
        amount,
        currency,
        name: "E-Commerce",
        description: "Test Transaction",
        handler: async function (response) {
          try {
            await axios.post("http://localhost:5000/api/orders/verify", {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              productId
            }, {
              headers: { Authorization: `Bearer ${idToken}` }
            });
            alert("Payment successful! Super admin will be notified.");
          } catch (error) {
            alert("Payment verification failed!");
          }
        },
        prefill: {
          name: user.displayName,
          email: user.email
        },
        theme: { color: "#3399cc" }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      alert("Error creating order!");
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map(product => (
          <div key={product._id} className="bg-white p-4 rounded shadow">
            <h3 className="text-lg font-semibold">{product.name}</h3>
            <p className="text-gray-600">{product.description}</p>
            <p className="font-bold mt-2">₹{product.price}</p>
            <button
              className="mt-4 bg-green-500 text-white px-4 py-2 rounded"
              onClick={() => handleBuy(product._id)}
            >
              Buy
            </button>
          </div>
        ))}
      </div>
      <div className="mt-8">
        <Link to="/admin" className="text-blue-600 underline">Go to Admin Dashboard</Link>
      </div>
    </div>
  );
};

export default Home;