import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import { HiUsers, HiShoppingBag, HiClipboardList, HiPlusCircle, HiPhotograph } from 'react-icons/hi';

const Admin = () => {

  const navigate = useNavigate();

  const [userCount, setUserCount] = useState(0);
  const [productCount, setProductCount] = useState(0);
  const [ordersCount, setOrdersCount] = useState(0);

  useEffect(() => {
    if (localStorage.getItem('userType') === 'admin') {
      navigate('/admin')
    }
  }, [localStorage])


  useEffect(() => {
    fetchCountData();
  }, [])

  const fetchCountData = async () => {
    await axios.get('http://localhost:3000/api/users/fetch-users').then(
      (response) => {
        setUserCount(response.data.length - 1);
      }
    )
    await axios.get('http://localhost:3000/api/products/fetch-products').then(
      (response) => {
        setProductCount(response.data.length);
      }
    )
    await axios.get('http://localhost:3000/api/orders/fetch-orders').then(
      (response) => {
        setOrdersCount(response.data.length);
      }
    )

  }

  const [banner, setBanner] = useState('');
  const updateBanner = async () => {
    await axios.post('http://localhost:3000/update-banner', { banner }).then(
      (response) => {
        alert("Banner updated");
        setBanner('');
      }
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your e-commerce platform</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Users Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-50 rounded-xl">
                <HiUsers className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-sm font-medium text-gray-500">Users</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{userCount}</h3>
            <p className="text-sm text-gray-600 mb-4">Total registered customers</p>
            <button
              onClick={() => navigate('/all-users')}
              className="w-full bg-blue-50 text-blue-700 py-2 px-4 rounded-lg font-medium hover:bg-blue-100 transition-colors duration-200"
            >
              View all users
            </button>
          </div>

          {/* All Products Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-50 rounded-xl">
                <HiShoppingBag className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-sm font-medium text-gray-500">Products</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{productCount}</h3>
            <p className="text-sm text-gray-600 mb-4">Products in inventory</p>
            <button
              onClick={() => navigate('/all-products')}
              className="w-full bg-green-50 text-green-700 py-2 px-4 rounded-lg font-medium hover:bg-green-100 transition-colors duration-200"
            >
              View all products
            </button>
          </div>

          {/* All Orders Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-50 rounded-xl">
                <HiClipboardList className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-sm font-medium text-gray-500">Orders</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{ordersCount}</h3>
            <p className="text-sm text-gray-600 mb-4">Total orders placed</p>
            <button
              onClick={() => navigate('/all-orders')}
              className="w-full bg-purple-50 text-purple-700 py-2 px-4 rounded-lg font-medium hover:bg-purple-100 transition-colors duration-200"
            >
              View all orders
            </button>
          </div>

          {/* Add Product Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-50 rounded-xl">
                <HiPlusCircle className="w-6 h-6 text-orange-600" />
              </div>
              <span className="text-sm font-medium text-gray-500">Add New</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Product</h3>
            <p className="text-sm text-gray-600 mb-4">Add new product to store</p>
            <button
              onClick={() => navigate('/new-product')}
              className="w-full bg-orange-50 text-orange-700 py-2 px-4 rounded-lg font-medium hover:bg-orange-100 transition-colors duration-200"
            >
              Add new product
            </button>
          </div>
        </div>

        {/* Banner Update Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-indigo-50 rounded-lg">
              <HiPhotograph className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Update Banner</h3>
              <p className="text-sm text-gray-600">Change the homepage banner image</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="banner-url" className="block text-sm font-medium text-gray-700 mb-2">
                Banner Image URL
              </label>
              <input
                type="text"
                id="banner-url"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 placeholder-gray-400"
                placeholder="Enter banner image URL"
                value={banner}
                onChange={(e) => setBanner(e.target.value)}
              />
            </div>
            
            <button
              onClick={updateBanner}
              className="bg-gray-900 text-white py-3 px-6 rounded-lg font-semibold hover:bg-indigo-700 transition-colors duration-200 flex items-center gap-2"
            >
              <HiPhotograph className="w-4 h-4" />
              Update Banner
            </button>
          </div>
        </div>

        {/* Quick Stats Summary */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-500 to-blue-600 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Active Users</p>
                <p className="text-2xl font-bold mt-1">{userCount}</p>
              </div>
              <HiUsers className="w-8 h-8 text-blue-200" />
            </div>
          </div>
          
          <div className="bg-green-500 to-green-600 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Total Products</p>
                <p className="text-2xl font-bold mt-1">{productCount}</p>
              </div>
              <HiShoppingBag className="w-8 h-8 text-green-200" />
            </div>
          </div>
          
          <div className="bg-purple-500 to-purple-600 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Total Orders</p>
                <p className="text-2xl font-bold mt-1">{ordersCount}</p>
              </div>
              <HiClipboardList className="w-8 h-8 text-purple-200" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Admin