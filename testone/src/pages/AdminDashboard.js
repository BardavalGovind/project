import React, { useEffect, useState } from "react";
import axios from "axios";
import OrderTable from "../components/OrderTable";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminDashboard = ({ idToken, user }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        if (!user || !idToken) {
          toast.error("Authentication failed");
          return;
        }
        const res = await axios.get("http://localhost:5000/api/orders/all", {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        });
        setOrders(res.data);
        toast.success("Orders fetched successfully!");
      } catch (err) {
        toast.error("Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [idToken, user]);

  return (
    <div className="p-6">
      <ToastContainer />
      <h2 className="text-2xl font-bold mb-2">Admin Dashboard</h2>
      <p className="mb-4 text-gray-600">
        Welcome, {user?.displayName} ({user?.email})
      </p>
      {loading ? (
        <p className="text-blue-500 font-semibold">Loading orders...</p>
      ) : (
        <OrderTable orders={orders} />
      )}
    </div>
  );
};

export default AdminDashboard;
