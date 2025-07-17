import React from "react";

const OrderTable = ({ orders }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full border border-gray-200 shadow-md rounded">
      <thead className="bg-gray-100">
        <tr>
          <th className="p-3 text-left">User</th>
          <th className="p-3 text-left">Product</th>
          <th className="p-3 text-left">Amount</th>
          <th className="p-3 text-left">Payment ID</th>
          <th className="p-3 text-left">Date</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((order) => (
          <tr key={order.id} className="border-t">
            <td className="p-3">
              {order.user?.name} <br />
              <span className="text-xs text-gray-500">{order.user?.email}</span>
            </td>
            <td className="p-3">{order.product?.name}</td>
            <td className="p-3 font-semibold">₹{order.amount}</td>
            <td className="p-3 text-sm text-gray-600">{order.paymentId}</td>
            <td className="p-3 text-sm">{new Date(order.createdAt).toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default OrderTable;
