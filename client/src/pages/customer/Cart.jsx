// src/pages/Cart.jsx
import React, { useEffect, useState, useContext } from 'react';
import '../../styles/Cart.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { GeneralContext } from '../../context/GeneralContext';
import { HiTrash, HiShoppingBag, HiShieldCheck, HiTruck } from 'react-icons/hi';

const Cart = () => {
  const { cartCount, setCartCount } = useContext(GeneralContext);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // If your backend uses a different origin, change this
  const BACKEND_ORIGIN = 'http://localhost:3000';
  const LOCAL_FALLBACK_IMAGE = 'https://via.placeholder.com/300x300?text=No+Image';

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      };
      const response = await axios.get('http://localhost:3000/api/cart/fetch-cart', config);

      // Ensure cartItems is always an array
      const items = Array.isArray(response.data) ? response.data : [];
      setCartItems(items);

      // Update navbar count using total quantity
      const count = items.reduce((acc, item) => acc + (parseInt(item.quantity) || 0), 0);
      setCartCount(count);
    } catch (error) {
      console.error('Error fetching cart:', error);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (itemId) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      };
      await axios.delete(`http://localhost:3000/api/cart/remove-item/${itemId}`, config);
      fetchCart(); // refresh cart after deletion
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  // Note: image logic removed as requested

  const [totalPrice, setTotalPrice] = useState(0);
  const [totalDiscount, setTotalDiscount] = useState(0);
  const [deliveryCharges, setDeliveryCharges] = useState(0);

  const calculateTotalPrice = () => {
    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discount = cartItems.reduce((sum, item) => sum + ((item.price * item.discount) / 100) * item.quantity, 0);
    setTotalPrice(total);
    setTotalDiscount(Math.floor(discount));
    setDeliveryCharges(total > 1000 || cartItems.length === 0 ? 0 : 50);
  };

  useEffect(() => {
    calculateTotalPrice();
  }, [cartItems]);

  // When user clicks proceed, save summary to localStorage and navigate to checkout page
  const handleProceedToCheckout = () => {
    const checkoutPayload = {
      cartItems,
      totalPrice,
      totalDiscount,
      deliveryCharges,
    };
    // store for checkout page to read
    localStorage.setItem('checkoutPayload', JSON.stringify(checkoutPayload));
    navigate('/checkout'); // new page route (Complete Order)
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your cart...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <HiShoppingBag className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
            {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
          </span>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
            <HiShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">Your cart is empty</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Looks like you haven't added any items to your cart yet. Start shopping to find amazing products!
            </p>
            <button
              onClick={() => navigate('/product')}
              className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors duration-200"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items (image removed) */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => {
                const discountedPrice = parseInt(item.price - (item.price * item.discount) / 100);
                const totalItemPrice = discountedPrice * item.quantity;

                return (
                  <div key={item._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex flex-col sm:flex-row gap-6">
                      {/* Image removed */}

                      {/* Product Details */}
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                              {item.title}
                            </h3>
                            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                              {item.description}
                            </p>

                            {/* Size and Quantity */}
                            <div className="flex flex-wrap gap-4 mb-4">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-gray-700">Size:</span>
                                <span className="bg-gray-100 px-3 py-1 rounded-lg text-sm text-gray-700">
                                  {item.size || '-'}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-gray-700">Qty:</span>
                                <span className="bg-gray-100 px-3 py-1 rounded-lg text-sm text-gray-700">
                                  {item.quantity}
                                </span>
                              </div>
                            </div>

                            {/* Price */}
                            <div className="flex items-center gap-3">
                              <span className="text-xl font-bold text-gray-900">
                                ₹{totalItemPrice.toLocaleString()}
                              </span>
                              {item.discount > 0 && (
                                <>
                                  <span className="text-sm text-gray-500 line-through">
                                    ₹{(item.price * item.quantity).toLocaleString()}
                                  </span>
                                  <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-semibold">
                                    Save ₹{((item.price * item.discount) / 100 * item.quantity).toLocaleString()}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>

                          {/* Remove Button */}
                          <button
                            onClick={() => removeItem(item._id)}
                            className="flex items-center gap-2 text-red-600 hover:text-red-700 transition-colors duration-200 p-2"
                          >
                            <HiTrash className="w-5 h-5" />
                            <span className="text-sm font-medium">Remove</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h3>

                {/* Price Breakdown */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total MRP</span>
                    <span className="text-gray-900">₹{totalPrice.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Discount on MRP</span>
                    <span className="text-green-600 font-semibold">-₹{totalDiscount.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Delivery Charges</span>
                    <span className={deliveryCharges > 0 ? "text-red-600" : "text-green-600"}>
                      {deliveryCharges > 0 ? `+₹${deliveryCharges}` : 'FREE'}
                    </span>
                  </div>

                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-gray-900">Final Amount</span>
                      <span className="text-xl font-bold text-gray-900">
                        ₹{(totalPrice - totalDiscount + deliveryCharges).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Delivery Info */}
                {totalPrice > 1000 && (
                  <div className="bg-green-50 rounded-xl p-4 mb-6">
                    <div className="flex items-center gap-3">
                      <HiTruck className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="text-sm font-medium text-green-800">Free Delivery Unlocked!</p>
                        <p className="text-xs text-green-600">You've saved ₹50 on delivery</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Security Badge */}
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                  <HiShieldCheck className="w-4 h-4 text-green-600" />
                  <span>Secure checkout · 100% safe & protected</span>
                </div>

                {/* Proceed to Checkout -> new page */}
                <button
                  onClick={handleProceedToCheckout}
                  className="w-full bg-blue-600 text-white py-4 px-6 rounded-xl font-semibold hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Cart;
