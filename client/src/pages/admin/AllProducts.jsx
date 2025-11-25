import React, { useEffect, useState } from 'react'
import '../../styles/AllProducts.css'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { HiFilter, HiSortAscending, HiTag, HiUsers, HiPencil, HiCurrencyRupee, HiTrash } from 'react-icons/hi';

const AllProducts = () => {
    const navigate = useNavigate();

    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [visibleProducts, setVisibleProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchData();
    }, [])

    const fetchData = async () => {
        setLoading(true);
        try {
            await axios.get('http://localhost:3000/api/products/fetch-products').then(
                (response) => {
                    setProducts(response.data);
                    setVisibleProducts(response.data);
                }
            )
            await axios.get('http://localhost:3000/api/products/fetch-categories').then(
                (response) => {
                    setCategories(response.data);
                }
            )
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    }

    const [sortFilter, setSortFilter] = useState('popularity');
    const [categoryFilter, setCategoryFilter] = useState([]);
    const [genderFilter, setGenderFilter] = useState([]);

    const handleCategoryCheckBox = (e) => {
        const value = e.target.value;
        if (e.target.checked) {
            setCategoryFilter([...categoryFilter, value]);
        } else {
            setCategoryFilter(categoryFilter.filter(size => size !== value));
        }
    }

    const handleGenderCheckBox = (e) => {
        const value = e.target.value;
        if (e.target.checked) {
            setGenderFilter([...genderFilter, value]);
        } else {
            setGenderFilter(genderFilter.filter(size => size !== value));
        }
    }

    const handleSortFilterChange = (e) => {
        const value = e.target.value;
        setSortFilter(value);
        if (value === 'low-price') {
            setVisibleProducts([...visibleProducts].sort((a, b) => a.price - b.price))
        } else if (value === 'high-price') {
            setVisibleProducts([...visibleProducts].sort((a, b) => b.price - a.price))
        } else if (value === 'discount') {
            setVisibleProducts([...visibleProducts].sort((a, b) => b.discount - a.discount))
        }
    }

    useEffect(() => {
        if (categoryFilter.length > 0 && genderFilter.length > 0) {
            setVisibleProducts(products.filter(product => categoryFilter.includes(product.category) && genderFilter.includes(product.gender)));
        } else if (categoryFilter.length === 0 && genderFilter.length > 0) {
            setVisibleProducts(products.filter(product => genderFilter.includes(product.gender)));
        } else if (categoryFilter.length > 0 && genderFilter.length === 0) {
            setVisibleProducts(products.filter(product => categoryFilter.includes(product.category)));
        } else {
            setVisibleProducts(products);
        }
    }, [categoryFilter, genderFilter])

    const clearAllFilters = () => {
        setCategoryFilter([]);
        setGenderFilter([]);
        setSortFilter('popularity');
    }

    // Delete Product Function
    const deleteProduct = async (productId, productName) => {
        if (window.confirm(`Are you sure you want to delete "${productName}"? This action cannot be undone.`)) {
            try {
                setLoading(true);
                await axios.delete(`http://localhost:3000/api/products/delete-product/${productId}`);
                alert('Product deleted successfully!');
                // Refresh the products list
                fetchData();
            } catch (error) {
                console.error('Error deleting product:', error);
                alert('Failed to delete product. Please try again.');
            } finally {
                setLoading(false);
            }
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <HiTag className="w-8 h-8 text-blue-600" />
                        <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
                    </div>
                    <p className="text-gray-600">Manage and update your product catalog</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Filters Sidebar */}
                    <div className="lg:w-80">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-8">
                            {/* Header */}
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-2">
                                    <HiFilter className="w-5 h-5 text-gray-600" />
                                    <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                                </div>
                                {(categoryFilter.length > 0 || genderFilter.length > 0) && (
                                    <button
                                        onClick={clearAllFilters}
                                        className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                                    >
                                        Clear all
                                    </button>
                                )}
                            </div>

                            {/* Sort By */}
                            <div className="mb-6">
                                <div className="flex items-center gap-2 mb-3">
                                    <HiSortAscending className="w-4 h-4 text-gray-500" />
                                    <h4 className="font-medium text-gray-900">Sort By</h4>
                                </div>
                                <div className="space-y-2">
                                    {[
                                        { value: 'popularity', label: 'Popularity' },
                                        { value: 'low-price', label: 'Price: Low to High' },
                                        { value: 'high-price', label: 'Price: High to Low' },
                                        { value: 'discount', label: 'Best Discount' }
                                    ].map((option) => (
                                        <label key={option.value} className="flex items-center gap-3 cursor-pointer group">
                                            <input
                                                type="radio"
                                                name="sortFilter"
                                                value={option.value}
                                                checked={sortFilter === option.value}
                                                onChange={handleSortFilterChange}
                                                className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                            />
                                            <span className="text-sm text-gray-700 group-hover:text-gray-900">
                                                {option.label}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Categories */}
                            <div className="mb-6">
                                <div className="flex items-center gap-2 mb-3">
                                    <HiTag className="w-4 h-4 text-gray-500" />
                                    <h4 className="font-medium text-gray-900">Categories</h4>
                                </div>
                                <div className="space-y-2 max-h-48 overflow-y-auto">
                                    {categories.map((category) => (
                                        <label key={category} className="flex items-center gap-3 cursor-pointer group">
                                            <input
                                                type="checkbox"
                                                value={category}
                                                checked={categoryFilter.includes(category)}
                                                onChange={handleCategoryCheckBox}
                                                className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                            />
                                            <span className="text-sm text-gray-700 group-hover:text-gray-900 capitalize">
                                                {category}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Gender */}
                            <div className="mb-6">
                                <div className="flex items-center gap-2 mb-3">
                                    <HiUsers className="w-4 h-4 text-gray-500" />
                                    <h4 className="font-medium text-gray-900">Gender</h4>
                                </div>
                                <div className="space-y-2">
                                    {['Men', 'Women', 'Unisex'].map((gender) => (
                                        <label key={gender} className="flex items-center gap-3 cursor-pointer group">
                                            <input
                                                type="checkbox"
                                                value={gender}
                                                checked={genderFilter.includes(gender)}
                                                onChange={handleGenderCheckBox}
                                                className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                            />
                                            <span className="text-sm text-gray-700 group-hover:text-gray-900">
                                                {gender}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Active Filters */}
                            {(categoryFilter.length > 0 || genderFilter.length > 0) && (
                                <div className="border-t border-gray-200 pt-4">
                                    <h4 className="font-medium text-gray-900 mb-3">Active Filters</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {categoryFilter.map(cat => (
                                            <span key={cat} className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded border border-blue-200">
                                                {cat}
                                            </span>
                                        ))}
                                        {genderFilter.map(gen => (
                                            <span key={gen} className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-xs px-2 py-1 rounded border border-green-200">
                                                {gen}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Products Grid */}
                    <div className="flex-1">
                        {/* Products Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900">All Products</h2>
                                <p className="text-sm text-gray-600 mt-1">
                                    {visibleProducts.length} of {products.length} products
                                </p>
                            </div>
                        </div>

                        {/* Loading State */}
                        {loading && (
                            <div className="text-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                                <p className="text-gray-600 mt-2">Loading...</p>
                            </div>
                        )}

                        {/* Products Grid */}
                        {!loading && visibleProducts.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                                {visibleProducts.map((product) => {
                                    const discountedPrice = parseInt(product.price - (product.price * product.discount) / 100);

                                    return (
                                        <div key={product._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200">
                                            {/* Product Image */}
                                            <div className="h-48 bg-gray-50 flex items-center justify-center p-4 relative">
                                                <img
                                                    src={product.mainImg}
                                                    alt={product.title}
                                                    className="h-full w-full object-contain"
                                                    onError={(e) => {
                                                        e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
                                                    }}
                                                />
                                                {/* Discount Badge */}
                                                {product.discount > 0 && (
                                                    <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                                                        {product.discount}% OFF
                                                    </div>
                                                )}
                                            </div>

                                            {/* Product Info */}
                                            <div className="p-4">
                                                <h3 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-1">
                                                    {product.title}
                                                </h3>
                                                <p className="text-gray-600 text-xs mb-3 line-clamp-2">
                                                    {product.description}
                                                </p>

                                                {/* Price */}
                                                <div className="flex items-center gap-2 mb-4">
                                                    <div className="flex items-center gap-1">
                                                        <HiCurrencyRupee className="w-4 h-4 text-gray-900" />
                                                        <span className="text-lg font-bold text-gray-900">
                                                            {discountedPrice.toLocaleString()}
                                                        </span>
                                                    </div>
                                                    {product.discount > 0 && (
                                                        <span className="text-sm text-gray-500 line-through">
                                                            ₹{product.price.toLocaleString()}
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Meta Info */}
                                                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                                                    <span className="capitalize bg-gray-100 px-2 py-1 rounded">
                                                        {product.category}
                                                    </span>
                                                    <span className="bg-gray-100 px-2 py-1 rounded">
                                                        {product.gender}
                                                    </span>
                                                </div>

                                                {/* Action Buttons */}
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => navigate(`/update-product/${product._id}`)}
                                                        className="flex-1 bg-gray-950 text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-900 transition-colors duration-200 flex items-center justify-center gap-2"
                                                    >
                                                        <HiPencil className="w-4 h-4" />
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => deleteProduct(product._id, product.title)}
                                                        className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors duration-200 flex items-center justify-center gap-2"
                                                    >
                                                        <HiTrash className="w-4 h-4" />
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        ) : (
                            !loading && (
                                <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-100">
                                    <HiTag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No Products Found</h3>
                                    <p className="text-gray-600 mb-4">Try adjusting your filters to find what you're looking for.</p>
                                    <button
                                        onClick={clearAllFilters}
                                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                                    >
                                        Clear all filters
                                    </button>
                                </div>
                            )
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AllProducts