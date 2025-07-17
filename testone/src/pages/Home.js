import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import ProductCard from "../components/ProductCard";


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
    axios
      .get("https://dummyjson.com/products")
      .then((res) => setProducts(res.data.products))
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  const handleBuy = async (productId) => {
    if (!idToken) {
      toast.error("Please sign in first!");
      return;
    }

    try {
      const scriptLoaded = await loadRazorpayScript("https://checkout.razorpay.com/v1/checkout.js");
      if (!scriptLoaded) {
        toast.error("Razorpay SDK failed to load.");
        return;
      }

      const res = await axios.post("http://localhost:5000/api/orders/create", { productId });
      const { orderId, amount, currency } = res.data;

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount,
        currency,
        name: "E-Commerce",
        description: "Test Transaction",
        order_id: orderId,
        handler: async function (response) {
          try {
            await axios.post(
              "http://localhost:5000/api/orders/verify",
              {
                razorpay_payment_id: response.razorpay_payment_id || "test_payment_id",
                razorpay_order_id: response.razorpay_order_id || orderId,
                productId,
              },
              {
                headers: {
                  Authorization: `Bearer ${idToken}`,
                },
              }
            );
            toast.success("✅ Payment successful! Super admin will be notified.");
          } catch (err) {
            console.error("Payment verification failed:", err);
            toast.error("❌ Payment verification failed!");
          }
        },
        prefill: {
          name: user.displayName,
          email: user.email,
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

      setTimeout(() => {
        rzp.close();
        options.handler({
          razorpay_payment_id: "test_payment_id",
          razorpay_order_id: orderId,
        });
      }, 2000);
    } catch (err) {
      console.error("Error in handleBuy:", err.response?.data || err.message);
      toast.error("❌ Error creating order!");
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-center mb-6">Products</h2>
      <div className="flex flex-wrap justify-center gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} onBuy={handleBuy} />
        ))}
      </div>
      <div className="text-center mt-6">
        <a href="/admin" className="text-blue-600 hover:underline">Go to Admin Dashboard</a>
      </div>
    </div>
  );
};

export default Home;
