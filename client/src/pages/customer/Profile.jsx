import React, { useContext, useEffect, useState } from 'react'
import { GeneralContext } from '../../context/GeneralContext'
import axios from 'axios';

const Profile = () => {
  const { logout } = useContext(GeneralContext);

  const username = localStorage.getItem('username');
  const email = localStorage.getItem('email');

  const [orders, setOrders] = useState([]);

  // load orders once when component mounts
  useEffect(() => {
    fetchOrders();
  }, []);

  // fetch orders from backend (basic normalization included)
  const fetchOrders = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/orders/fetch-orders');
      // normalize different response shapes
      const data = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data.orders)
        ? res.data.orders
        : Array.isArray(res.data.data)
        ? res.data.data
        : [];
      console.log('Fetched orders (normalized):', data);
      setOrders(data.slice().reverse());
    } catch (err) {
      console.error('Error fetching orders:', err);
      setOrders([]);
    }
  };

  // cancel order (unchanged)
  const cancelOrder = async (orderId) => {
    if (!orderId) {
      alert('Order ID is required');
      return;
    }

    try {
      const { data } = await axios.put('http://localhost:3000/api/orders/cancel-order', { orderId });
      console.log('Order cancelled:', data);
      alert('Order cancelled successfully!');

      // update local state so UI shows "Cancelled"
      setOrders((prev) =>
        prev.map((order) => (order._id === orderId ? { ...order, orderStatus: 'Cancelled' } : order))
      );
    } catch (error) {
      console.error('Cancel order frontend error:', error);
      alert(error.response?.data?.message || 'Error cancelling order');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      {/* Profile Card */}
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-md border border-gray-100 p-6 md:p-8 flex flex-col md:flex-row items-center gap-6">
        {/* avatar placeholder */}
        <div className="w-20 h-20 rounded-full bg-teal-400 to-cyan-500 flex items-center justify-center text-white text-xl font-bold">
          {username ? username.charAt(0).toUpperCase() : 'U'}
        </div>

        <div className="flex-1 w-full">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-sm text-gray-500">Username</div>
              <div className="text-lg font-semibold text-gray-900">{username || 'N/A'}</div>
            </div>

            <div>
              <div className="text-sm text-gray-500">Email</div>
              <div className="text-lg font-semibold text-gray-900">{email || 'N/A'}</div>
            </div>

            <div>
              <div className="text-sm text-gray-500">Orders</div>
              <div className="text-lg font-semibold text-gray-900">{orders.length}</div>
            </div>
          </div>
        </div>

        <div>
          <button
            onClick={logout}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold shadow-sm transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Orders List (image removed) */}
      <div className="max-w-5xl mx-auto mt-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Your Orders</h3>

        <div className="grid grid-cols-1 gap-6">
          {orders.length === 0 && (
            <div className="bg-white border rounded-lg p-6 text-center text-gray-500">
              You have no orders yet.
            </div>
          )}

          {orders.map((order) => (
            <div
              key={order._id || order.id}
              className="bg-white border border-gray-100 rounded-xl shadow-sm p-4 flex flex-col md:flex-row gap-4 md:gap-6"
            >
              {/* Image section intentionally removed (per your request) */}
              {/* Details */}
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-gray-900">{order.title || order.name || 'Untitled'}</h4>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{order.description}</p>

                <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-700">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">Size:</span>
                    <span className="font-medium">{order.size || '-'}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">Qty:</span>
                    <span className="font-medium">{order.quantity}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">Price:</span>
                    <span className="text-semibold text-gray-900">
                      &#8377; {parseInt(order.price - (order.price * order.discount) / 100) * order.quantity}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">Payment:</span>
                    <span className="font-medium">{order.paymentMethod || '-'}</span>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600">
                  <div>
                    <div className="text-gray-500">Address</div>
                    <div className="text-gray-800">{order.address}</div>
                  </div>

                  <div>
                    <div className="text-gray-500">Pincode</div>
                    <div className="text-gray-800">{order.pincode}</div>
                  </div>

                  <div>
                    <div className="text-gray-500">Ordered on</div>
                    <div className="text-gray-800">{order.orderDate ? order.orderDate.slice(0, 10) : '-'}</div>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between gap-4 flex-wrap">
                  <div className="text-sm">
                    <span className="text-gray-500">Status: </span>
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-semibold
                        ${order.orderStatus === 'Cancelled' ? 'bg-red-100 text-red-700' :
                          order.orderStatus === 'Delivered' ? 'bg-green-100 text-green-800' :
                          'bg-yellow-100 text-yellow-800'}`}
                    >
                      {order.orderStatus}
                    </span>
                  </div>

                  <div>
                    {(order.orderStatus === 'order placed' || order.orderStatus === 'In-transit') ? (
                      <button
                        onClick={() => cancelOrder(order._id)}
                        className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md font-semibold shadow-sm"
                      >
                        Cancel Order
                      </button>
                    ) : (
                      <button className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md font-medium" disabled>
                        {order.orderStatus}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

        </div>
      </div>
    </div>
  );
};

export default Profile;
