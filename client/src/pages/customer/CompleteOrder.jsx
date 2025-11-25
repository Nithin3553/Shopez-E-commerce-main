// src/pages/CompleteOrder.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { HiTruck, HiShieldCheck } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';

const CompleteOrder = () => {
    const navigate = useNavigate();

    // Read checkout info saved by Cart page
    const [checkoutPayload, setCheckoutPayload] = useState({
        cartItems: [],
        totalPrice: 0,
        totalDiscount: 0,
        deliveryCharges: 0,
    });

    useEffect(() => {
        try {
            const raw = localStorage.getItem('checkoutPayload');
            if (raw) {
                setCheckoutPayload(JSON.parse(raw));
            } else {
                // If nothing saved, redirect back to cart
                navigate('/cart');
            }
        } catch (err) {
            console.error('Error reading checkout payload', err);
            navigate('/cart');
        }
    }, [navigate]);

    // form fields
    const [name, setName] = useState('');
    const [mobile, setMobile] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [pincode, setPincode] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');

    const userId = localStorage.getItem('userId');

    // simple place order function - same endpoint as before
    const placeOrder = async () => {
        if (!name || !mobile || !address || !paymentMethod) {
            alert('Please fill required fields (name, mobile, address, payment).');
            return;
        }

        try {
            await axios.post('http://localhost:3000/api/orders/place-cart-order', {
                userId,
                name,
                mobile,
                email,
                address,
                pincode,
                paymentMethod,
                orderDate: new Date(),
                items: checkoutPayload.cartItems,
            });

            alert('Order placed!');
            // optional cleanup
            localStorage.removeItem('checkoutPayload');
            navigate('/profile');
        } catch (error) {
            console.error('Error placing order:', error);
            alert('Failed to place order. Check console.');
        }
    };

    const { cartItems, totalPrice, totalDiscount, deliveryCharges } = checkoutPayload;

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Decorative header image (uses your provided local path) */}
                <div className="mb-6 flex items-center gap-3">
                    <h1 className="text-xl font-bold tracking-wide text-gray-900">
                        DELIVERY <span className="font-normal text-gray-700">INFORMATION</span>
                    </h1>
                    
                </div>

                <div className="flex-1 h-px bg-gray-300"></div>

                <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 mt-5">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-bold text-gray-900">Complete Your Order</h2>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <HiShieldCheck className="w-5 h-5 text-green-600" />
                            <span>Secure checkout</span>
                        </div>
                    </div>

                    {/* Two column layout: left = form, right = summary/payments */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left column: Shipping form (spans 2 columns on large screens) */}
                        <div className="lg:col-span-2">
                            <h3 className="text-lg font-semibold mb-4">Delivery Information</h3>

                            {/* Use grid for the inputs to match reference layout */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                                <input
                                    type="text"
                                    placeholder="First name"
                                    value={name.split(' ')[0] || name}
                                    onChange={(e) => {
                                        // keep logic unchanged: we write to full name field
                                        setName(e.target.value);
                                    }}
                                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                                />
                                {/* <input
                                    type="text"
                                    placeholder="Last name"
                                    value={''}
                                    onChange={() => { }}
                                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                                /> */}
                            </div>

                            <div className="mb-3">
                                <input
                                    type="email"
                                    placeholder="Email address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                                />
                            </div>

                            <div className="mb-3">
                                <input
                                    type="text"
                                    placeholder="Street / Address"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                                {/* <input
                                    type="text"
                                    placeholder="City"
                                    value={''}
                                    onChange={() => { }}
                                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                                /> */}
                                {/* <input
                                    type="text"
                                    placeholder="State"
                                    value={''}
                                    onChange={() => { }}
                                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                                /> */}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                                <input
                                    type="text"
                                    placeholder="Zip code"
                                    value={pincode}
                                    onChange={(e) => setPincode(e.target.value)}
                                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                                />
                                {/* <input
                                    type="text"
                                    placeholder="Country"
                                    value={''}
                                    onChange={() => { }}
                                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                                /> */}
                            </div>

                            <div className="mb-3">
                                <input
                                    type="text"
                                    placeholder="Phone"
                                    value={mobile}
                                    onChange={(e) => setMobile(e.target.value)}
                                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                                />
                            </div>
                        </div>

                        {/* Right column: Order totals and payment */}
                        <aside className="lg:col-span-1">
                            <h3 className="text-lg font-semibold mb-4">Cart Totals</h3>

                            <div className="bg-gray-50 rounded-xl p-4 mb-6">
                                <div className="flex justify-between text-sm text-gray-600 mb-2">
                                    <span>Subtotal</span>
                                    <span>₹{(totalPrice || 0).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-600 mb-2">
                                    <span>Shipping</span>
                                    <span className={deliveryCharges > 0 ? 'text-red-600' : 'text-green-600'}>
                                        {deliveryCharges > 0 ? `+₹${deliveryCharges}` : 'Free'}
                                    </span>
                                </div>
                                <div className="border-t border-gray-200 pt-3 mt-3 flex justify-between items-center">
                                    <span className="text-sm font-semibold">Total</span>
                                    <span className="text-lg font-bold">₹{((totalPrice || 0) - (totalDiscount || 0) + (deliveryCharges || 0)).toLocaleString()}</span>
                                </div>
                            </div>

                            <h4 className="text-sm font-semibold mb-3">Payment Method</h4>

                            <div className="space-y-3 mb-6">
                                {/* Radio options styled like buttons */}
                                <label className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer ${paymentMethod === 'stripe' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 bg-white'}`}>
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="stripe"
                                        checked={paymentMethod === 'stripe'}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="form-radio"
                                    />
                                    <span className="text-sm font-medium">Stripe</span>
                                </label>

                                <label className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer ${paymentMethod === 'razorpay' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 bg-white'}`}>
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="razorpay"
                                        checked={paymentMethod === 'razorpay'}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="form-radio"
                                    />
                                    <span className="text-sm font-medium">Razorpay</span>
                                </label>

                                <label className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer ${paymentMethod === 'cod' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 bg-white'}`}>
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="cod"
                                        checked={paymentMethod === 'cod'}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="form-radio"
                                    />
                                    <span className="text-sm font-medium">Cash on Delivery</span>
                                </label>
                            </div>

                            <button
                                onClick={placeOrder}
                                className="w-full bg-black text-white py-3 rounded-xl font-semibold hover:opacity-95 transition"
                            >
                                PLACE ORDER
                            </button>

                            <div className="mt-4 text-xs text-gray-500 flex items-center gap-2">
                                <HiTruck className="w-4 h-4 text-green-600" />
                                <span>Delivery timelines may vary depending on location</span>
                            </div>
                        </aside>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompleteOrder;
