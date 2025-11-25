import React, { useContext, useEffect, useState } from 'react'
import '../../styles/IndividualProduct.css'
import { HiOutlineArrowSmLeft, HiStar, HiShieldCheck, HiTruck } from 'react-icons/hi'
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { GeneralContext } from '../../context/GeneralContext';

const IndividualProduct = () => {

    const { id } = useParams();
    const navigate = useNavigate()

    const userId = localStorage.getItem('userId');

    const { fetchCartCount } = useContext(GeneralContext);

    const [productName, setProductName] = useState('');
    const [productDescription, setProductDescription] = useState('');
    const [productMainImg, setProductMainImg] = useState('');
    const [productCarouselImg1, setProductCarouselImg1] = useState('');
    const [productCarouselImg2, setProductCarouselImg2] = useState('');
    const [productCarouselImg3, setProductCarouselImg3] = useState('');
    const [productSizes, setProductSizes] = useState([]);
    const [productPrice, setProductPrice] = useState(0);
    const [productDiscount, setProductDiscount] = useState(0);


    useEffect(() => {
        fetchProduct();
    }, [])

    const fetchProduct = async () => {
        await axios.get(`http://localhost:3000/api/products/fetch-product-details/${id}`).then(
            (response) => {
                setProductName(response.data.title);
                setProductDescription(response.data.description);
                setProductMainImg(response.data.mainImg);
                setProductCarouselImg1(response.data.carousel && response.data.carousel[0]);
                setProductCarouselImg2(response.data.carousel && response.data.carousel[1]);
                setProductCarouselImg3(response.data.carousel && response.data.carousel[2]);
                setProductSizes(response.data.sizes || []);
                setProductPrice(response.data.price || 0);
                setProductDiscount(response.data.discount || 0);
            }
        )
    }

    const [productQuantity, setProductQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState('');

    const [size, setSize] = useState('');

    useEffect(() => {
        if (productMainImg) {
            setSelectedImage(productMainImg);
        }
    }, [productMainImg]);

    // buyNow simplified: only send product/order details (no shipping fields)
    const buyNow = async () => {
        const token = localStorage.getItem("token");
        await axios.post(
            'http://localhost:3000/api/orders/buy-product',
            {
                title: productName,
                description: productDescription,
                mainImg: productMainImg,
                size,
                quantity: productQuantity,
                price: productPrice,
                discount: productDiscount,
                orderDate: new Date()
            },
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        )
            .then((response) => {
                alert('Order placed!!');
                navigate('/profile');
            })
            .catch((err) => {
                alert("Order failed!!");
            });
    }

    const handleAddToCart = async () => {
        await axios.post('http://localhost:3000/api/cart/add-to-cart', { userId, title: productName, description: productDescription, mainImg: productMainImg, size, quantity: productQuantity, price: productPrice, discount: productDiscount }).then(
            (response) => {
                alert("product added to cart!!");
                navigate('/cart');
            }
        ).catch((err) => {
            alert("Operation failed!!");
        })
    }

    const discountedPrice = parseInt(productPrice - (productPrice * productDiscount) / 100) || 0;
    const savings = (productPrice || 0) - discountedPrice;

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Navigation */}
                <button
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors duration-200 group"
                >
                    <HiOutlineArrowSmLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
                    <span className="font-medium text-sm">Back to Products</span>
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                    {/* Image Gallery */}
                    <div className="lg:col-span-7">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="flex flex-col md:flex-row gap-6 p-6">
                                {/* Thumbnails */}
                                <div className="hidden md:flex flex-col gap-4 order-2 md:order-1">
                                    {[productCarouselImg1, productCarouselImg2, productCarouselImg3].map((img, index) => (
                                        img && (
                                            <div
                                                key={index}
                                                className={`w-20 h-20 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:border-blue-500 ${selectedImage === img ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'
                                                    }`}
                                                onClick={() => setSelectedImage(img)}
                                            >
                                                <img
                                                    src={img}
                                                    alt={`Thumbnail ${index + 1}`}
                                                    className="w-full h-full object-cover rounded-lg"
                                                />
                                            </div>
                                        )
                                    ))}
                                </div>

                                {/* Main Image */}
                                <div className="flex-1 order-1 md:order-2">
                                    <div className="bg-gray-50 rounded-xl p-8 flex items-center justify-center min-h-[500px]">
                                        <img
                                            src={selectedImage || productMainImg}
                                            alt={productName}
                                            className="w-full h-auto max-h-[400px] object-contain transition-opacity duration-300"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Product Description */}
                            <div className="border-t border-gray-100 px-6 py-6">
                                <div className="flex items-center gap-4 mb-4">
                                    <HiShieldCheck className="w-5 h-5 text-green-600" />
                                    <h3 className="text-lg font-semibold text-gray-900">Product Description</h3>
                                </div>
                                <p className="text-gray-600 leading-relaxed">{productDescription}</p>
                            </div>
                        </div>
                    </div>

                    {/* Product Details */}
                    <div className="lg:col-span-5 space-y-6">
                        {/* Main Product Info Card */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <div className="space-y-4">
                                <div>
                                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">
                                        {productName}
                                    </h1>
                                    <p className="text-gray-500 mt-2 text-sm leading-relaxed">
                                        {productDescription ? productDescription.slice(0, 120) + (productDescription.length > 120 ? '...' : '') : ''}
                                    </p>
                                </div>

                                {/* Rating */}
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-1 bg-blue-50 px-3 py-1 rounded-full">
                                        <HiStar className="w-4 h-4 text-yellow-400 fill-current" />
                                        <span className="text-sm font-medium text-gray-700">4.2/5</span>
                                    </div>
                                    <span className="text-sm text-gray-500">• 1.2k reviews</span>
                                </div>

                                {/* Price Section */}
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3">
                                        <span className="text-3xl font-bold text-gray-900">₹{discountedPrice.toLocaleString()}</span>
                                        {productDiscount > 0 && (
                                            <>
                                                <span className="text-lg text-gray-500 line-through">₹{productPrice.toLocaleString()}</span>
                                                <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-sm font-semibold">
                                                    {productDiscount}% OFF
                                                </span>
                                            </>
                                        )}
                                    </div>
                                    {productDiscount > 0 && (
                                        <p className="text-green-600 text-sm font-medium">
                                            You save ₹{savings.toLocaleString()}
                                        </p>
                                    )}
                                </div>

                                {/* Delivery Info */}
                                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                                    <HiTruck className="w-5 h-5 text-green-600" />
                                    <div>
                                        <p className="text-sm font-medium text-green-800">Free delivery</p>
                                        <p className="text-xs text-green-600">Delivery in 3-5 business days</p>
                                    </div>
                                </div>
                            </div>

                            {/* Size and Quantity Selectors */}
                            <div className="mt-6 space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {/* Size Selector */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Select Size
                                        </label>
                                        <select
                                            value={size}
                                            onChange={(e) => setSize(e.target.value)}
                                            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                        >
                                            <option value="">Choose size</option>
                                            {productSizes.map((s) => (
                                                <option key={s} value={s}>{s}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Quantity Selector */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Quantity
                                        </label>
                                        <select
                                            value={productQuantity}
                                            onChange={(e) => setProductQuantity(e.target.value)}
                                            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                        >
                                            {[1, 2, 3, 4, 5, 6].map(num => (
                                                <option key={num} value={num}>{num}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                                    <button
                                        onClick={handleAddToCart}
                                        className="flex-1 border-2 border-gray-300 text-gray-700 py-4 px-6 rounded-xl font-semibold hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 flex items-center justify-center gap-2">
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Features Card */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Features</h3>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                    <span className="text-sm text-gray-600">Premium quality materials</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                    <span className="text-sm text-gray-600">30-day return policy</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                    <span className="text-sm text-gray-600">1-year warranty included</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                    <span className="text-sm text-gray-600">Free shipping nationwide</span>
                                </div>
                            </div>
                        </div>

                        {/* Additional Info Card */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">Product Details</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                This product features premium craftsmanship with attention to detail. Each piece is carefully inspected to ensure the highest quality standards. Perfect for everyday use with durable construction and elegant design.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default IndividualProduct
