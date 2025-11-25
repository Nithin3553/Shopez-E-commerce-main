import React, { useEffect, useState } from 'react'
import '../../styles/AllOrders.css'
import axios from 'axios';
import {
  HiShoppingBag,
  HiTruck,
  HiCheckCircle,
  HiXCircle,
  HiCalendar,
  HiLocationMarker,
  HiUser,
  HiCurrencyRupee
} from 'react-icons/hi';

const AllOrders = () => {
  const [orders, setOrders] = useState([]);
  const [updateStatus, setUpdateStatus] = useState('');

  useEffect(() => {
    fetchOrders();
  }, [])

  const fetchOrders = async () => {
    await axios.get(`http://localhost:3000/api/orders/fetch-orders`).then(
      (response) => {
        setOrders(response.data.reverse());
      }
    )
  }

  const cancelOrder = async (orderId) => {
    try {
      const { data } = await axios.put('http://localhost:3000/api/orders/cancel-order', { orderId });
      alert(data.message || "Order cancelled!!");
      fetchOrders();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Order cancellation failed!!");
    }
  };

  const updateOrderStatus = async (id) => {
    await axios.put('http://localhost:3000/api/orders/update-order-status', { id, updateStatus }).then(
      () => {
        alert("Order status updated!!");
        setUpdateStatus('');
        fetchOrders();
      }
    ).catch(() => {
      alert("Order update failed!!");
    })
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'In-transit': return 'bg-blue-100 text-blue-800';
      case 'order placed': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered': return <HiCheckCircle className="w-4 h-4" />;
      case 'cancelled': return <HiXCircle className="w-4 h-4" />;
      case 'In-transit': return <HiTruck className="w-4 h-4" />;
      case 'order placed': return <HiShoppingBag className="w-4 h-4" />;
      default: return <HiShoppingBag className="w-4 h-4" />;
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <HiShoppingBag className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
          </div>
          <p className="text-gray-600">Manage and track all customer orders</p>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {orders.map((order) => {
            const discountedPrice =
              parseInt(order.price - (order.price * order.discount) / 100) * order.quantity;

            return (
              <div
                key={order._id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
              >
                {/* Order Header */}
                <div className="border-b border-gray-200 px-6 py-4 bg-gray-50">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4 mb-3 sm:mb-0">
                      <div
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.orderStatus)}`}
                      >
                        {getStatusIcon(order.orderStatus)}
                        {order.orderStatus}
                      </div>
                      <span className="text-sm text-gray-500">
                        Order ID: {order._id.slice(-8)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <HiCalendar className="w-4 h-4" />
                      <span>Ordered on: {order.orderDate.slice(0, 10)}</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* just details now (no image block) */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {/* Product Information */}
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold text-gray-900">{order.title}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2">{order.description}</p>

                      <div className="flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-700">Size:</span>
                          <span className="bg-gray-100 px-2 py-1 rounded text-gray-700">
                            {order.size}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-700">Qty:</span>
                          <span className="bg-gray-100 px-2 py-1 rounded text-gray-700">
                            {order.quantity}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-lg font-bold text-gray-900">
                        <HiCurrencyRupee className="w-5 h-5" />
                        {discountedPrice.toLocaleString()}
                      </div>
                    </div>

                    {/* Customer Information */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <HiUser className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="font-medium text-gray-900">{order.name}</p>
                          <p className="text-gray-600">{order.email}</p>
                          <p className="text-gray-600">{order.mobile}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2 text-sm">
                        <HiLocationMarker className="w-4 h-4 text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-gray-600">{order.address}</p>
                          <p className="text-gray-600">Pincode: {order.pincode}</p>
                        </div>
                      </div>

                      <div className="text-sm">
                        <span className="font-medium text-gray-700">Payment: </span>
                        <span className="text-gray-600 capitalize">{order.paymentMethod}</span>
                      </div>
                    </div>

                    {/* Order Actions */}
                    <div className="space-y-4">
                      {(order.orderStatus !== 'delivered' && order.orderStatus !== 'cancelled') && (
                        <div className="space-y-3">
                          <div>
                            <label
                              htmlFor={`status-${order._id}`}
                              className="block text-sm font-medium text-gray-700 mb-2"
                            >
                              Update Status
                            </label>
                            <select
                              id={`status-${order._id}`}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              value={updateStatus}
                              onChange={(e) => setUpdateStatus(e.target.value)}
                            >
                              <option value="" disabled>Select status</option>
                              <option value="Order placed">Order Placed</option>
                              <option value="In-transit">In Transit</option>
                              <option value="delivered">Delivered</option>
                            </select>
                          </div>

                          <div className="flex gap-2">
                            <button
                              onClick={() => updateOrderStatus(order._id)}
                              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors duration-200"
                              disabled={!updateStatus}
                            >
                              Update Status
                            </button>

                            {(order.orderStatus === 'order placed' || order.orderStatus === 'In-transit') && (
                              <button
                                onClick={() => cancelOrder(order._id)}
                                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors duration-200"
                              >
                                Cancel
                              </button>
                            )}
                          </div>
                        </div>
                      )}

                      {(order.orderStatus === 'delivered' || order.orderStatus === 'cancelled') && (
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-600">
                            Order {order.orderStatus === 'delivered' ? 'completed' : 'cancelled'}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}

          {orders.length === 0 && (
            <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-100">
              <HiShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Orders Found</h3>
              <p className="text-gray-600">There are no orders to display at the moment.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AllOrders
