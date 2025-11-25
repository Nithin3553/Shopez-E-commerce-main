import React, { useEffect, useState } from 'react'
import '../../styles/AllUsers.css'
import axios from 'axios'
import { HiUsers, HiShoppingBag, HiMail, HiIdentification, HiUserCircle } from 'react-icons/hi';

const AllUsers = () => {

  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchUsersData();
  }, [])

  const fetchUsersData = async () => {
    await axios.get('http://localhost:3000/api/users/fetch-users').then(
      (response) => {
        setUsers(response.data.filter(user => user.usertype === 'customer'));
      }
    )

    await axios.get('http://localhost:3000/api/orders/fetch-orders').then(
      (response) => {
        setOrders(response.data);
      }
    )
  }

  const getUserOrderCount = (userId) => {
    return orders.filter(order => order.userId === userId).length;
  }

  const getInitials = (username) => {
    return username ? username.charAt(0).toUpperCase() : 'U';
  }

  const getRandomColor = (str) => {
    const colors = [
      'bg-blue-500', 'bg-green-500', 'bg-purple-500', 
      'bg-pink-500', 'bg-indigo-500', 'bg-teal-500',
      'bg-orange-500', 'bg-cyan-500', 'bg-rose-500'
    ];
    const index = str ? str.charCodeAt(0) % colors.length : 0;
    return colors[index];
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <HiUsers className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Customer Management</h1>
          </div>
          <p className="text-gray-600">View and manage all registered customers</p>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Customers</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{users.length}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl">
                <HiUsers className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{orders.length}</p>
              </div>
              <div className="p-3 bg-green-50 rounded-xl">
                <HiShoppingBag className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Orders per Customer</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {users.length > 0 ? (orders.length / users.length).toFixed(1) : 0}
                </p>
              </div>
              <div className="p-3 bg-purple-50 rounded-xl">
                <HiUserCircle className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Users Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {users.map((user) => {
            const orderCount = getUserOrderCount(user._id);
            const userColor = getRandomColor(user.username);
            
            return (
              <div key={user._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
                {/* User Avatar and Basic Info */}
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-12 h-12 ${userColor} rounded-full flex items-center justify-center text-white font-semibold text-lg`}>
                    {getInitials(user.username)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{user.username}</h3>
                    <p className="text-sm text-gray-500 truncate">{user.email}</p>
                  </div>
                </div>

                {/* User Details */}
                <div className="space-y-3">
                  {/* User ID */}
                  <div className="flex items-center gap-3 text-sm">
                    <HiIdentification className="w-4 h-4 text-gray-400 " />
                    <div className="min-w-0">
                      <p className="font-medium text-gray-700">User ID</p>
                      <p className="text-gray-600 truncate text-xs">{user._id.slice(-8)}</p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-center gap-3 text-sm">
                    <HiMail className="w-4 h-4 text-gray-400" />
                    <div className="min-w-0">
                      <p className="font-medium text-gray-700">Email</p>
                      <p className="text-gray-600 truncate text-xs">{user.email}</p>
                    </div>
                  </div>

                  {/* Orders */}
                  <div className="flex items-center gap-3 text-sm">
                    <HiShoppingBag className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-700">Orders</p>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600">{orderCount}</span>
                        {orderCount > 0 && (
                          <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-medium">
                            Active
                          </span>
                        )}
                        {orderCount === 0 && (
                          <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs font-medium">
                            No orders
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Progress Bar */}
                {orderCount > 0 && (
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Order Activity</span>
                      <span>{orderCount} order{orderCount !== 1 ? 's' : ''}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${Math.min((orderCount / Math.max(...users.map(u => getUserOrderCount(u._id)))) * 100, 100)}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Empty State */}
        {users.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
            <HiUsers className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Customers Found</h3>
            <p className="text-gray-600">There are no registered customers in the system yet.</p>
          </div>
        )}

        {/* Summary Footer */}
        {users.length > 0 && (
          <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h4 className="font-semibold text-gray-900">Customer Summary</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Showing {users.length} customer{users.length !== 1 ? 's' : ''} with {orders.length} total orders
                </p>
              </div>
              <div className="flex items-center gap-4 mt-4 sm:mt-0">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{users.length}</p>
                  <p className="text-xs text-gray-600">Customers</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{orders.length}</p>
                  <p className="text-xs text-gray-600">Total Orders</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">
                    {users.length > 0 ? (orders.length / users.length).toFixed(1) : 0}
                  </p>
                  <p className="text-xs text-gray-600">Avg per Customer</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AllUsers