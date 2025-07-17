import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminDashboard = ({ idToken, user }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);

        if (!user || !idToken) {
          setError("No user logged in or missing token");
          setLoading(false);
          return;
        }
        console.log("AdminDashboard: idToken being sent:", idToken);

        const response = await axios.get("http://localhost:5000/api/orders/all", {
          headers: {
            Authorization: `Bearer ${idToken}`,
            "Content-Type": "application/json"
          }
        });

        setOrders(response.data);
        setError(null);
      } catch (err) {
        if (err.response?.status === 401) {
          setError("Authentication failed. Please log in again.");
        } else if (err.response?.status === 403) {
          setError("Access denied. You don't have admin privileges.");
        } else {
          setError(`Failed to fetch orders: ${err.message}`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [idToken, user]);

  if (loading) {
    return (
      <div className="p-8">
        <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
        <p>Loading orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
        <p className="text-red-500">Error: {error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 text-blue-500 text-white px-4 py-2 rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
      <p className="mb-4">Welcome, {user?.displayName} ({user?.email})</p>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="py-2 px-4 border">User</th>
              <th className="py-2 px-4 border">Product</th>
              <th className="py-2 px-4 border">Amount</th>
              <th className="py-2 px-4 border">Payment ID</th>
              <th className="py-2 px-4 border">Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order._id}>
                <td className="py-2 px-4 border">
                  {order.user?.name || 'N/A'} <br />
                  {order.user?.email || 'N/A'}
                </td>
                <td className="py-2 px-4 border">{order.product?.name || 'N/A'}</td>
                <td className="py-2 px-4 border">₹{order.amount || 'N/A'}</td>
                <td className="py-2 px-4 border">{order.paymentId || 'N/A'}</td>
                <td className="py-2 px-4 border">
                  {order.createdAt ? new Date(order.createdAt).toLocaleString() : 'N/A'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminDashboard;