import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Products = (props) => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [visibleProducts, setVisibleProducts] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(12);

  const [sortFilter, setSortFilter] = useState('popularity');
  const [categoryFilter, setCategoryFilter] = useState([]);
  const [genderFilter, setGenderFilter] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 10000]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [productsResponse, categoriesResponse] = await Promise.all([
        axios.get('http://localhost:3000/api/products/fetch-products'),
        axios.get('http://localhost:3000/api/products/fetch-categories')
      ]);

      let filteredProducts = productsResponse.data;
      if (props.category && props.category !== 'all') {
        filteredProducts = filteredProducts.filter(product => product.category === props.category);
      }

      setProducts(filteredProducts);
      setVisibleProducts(filteredProducts);
      setCategories(categoriesResponse.data);

      // Set max price for range slider
      const maxPrice = filteredProducts.length > 0 ? Math.max(...filteredProducts.map(p => p.price)) : 10000;
      setPriceRange([0, maxPrice]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryCheckBox = (e) => {
    const value = e.target.value;
    if (e.target.checked) {
      setCategoryFilter([...categoryFilter, value]);
    } else {
      setCategoryFilter(categoryFilter.filter(item => item !== value));
    }
  };

  const handleGenderCheckBox = (e) => {
    const value = e.target.value;
    if (e.target.checked) {
      setGenderFilter([...genderFilter, value]);
    } else {
      setGenderFilter(genderFilter.filter(item => item !== value));
    }
  };

  const handleSortFilterChange = (e) => {
    const value = e.target.value;
    setSortFilter(value);

    let sortedProducts = [...visibleProducts];

    switch (value) {
      case 'low-price':
        sortedProducts.sort((a, b) => a.price - b.price);
        break;
      case 'high-price':
        sortedProducts.sort((a, b) => b.price - a.price);
        break;
      case 'discount':
        sortedProducts.sort((a, b) => (b.discount || 0) - (a.discount || 0));
        break;
      case 'rating':
        sortedProducts.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      default:
        // popularity - keep original order
        break;
    }

    setVisibleProducts(sortedProducts);
    setCurrentPage(1);
  };

  const handlePriceRangeChange = (e) => {
    const max = parseInt(e.target.value);
    setPriceRange([priceRange[0], max]);
  };

  const clearAllFilters = () => {
    setCategoryFilter([]);
    setGenderFilter([]);
    setSortFilter('popularity');
    const maxPrice = products.length > 0 ? Math.max(...products.map(p => p.price)) : 10000;
    setPriceRange([0, maxPrice]);
    setCurrentPage(1);
  };

  useEffect(() => {
    let filtered = [...products];

    // Category filter
    if (categoryFilter.length > 0) {
      filtered = filtered.filter(product => categoryFilter.includes(product.category));
    }

    // Gender filter
    if (genderFilter.length > 0) {
      filtered = filtered.filter(product => genderFilter.includes(product.gender));
    }

    // Price range filter
    filtered = filtered.filter(product =>
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Apply sorting
    let sorted = [...filtered];
    switch (sortFilter) {
      case 'low-price':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'high-price':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'discount':
        sorted.sort((a, b) => (b.discount || 0) - (a.discount || 0));
        break;
      case 'rating':
        sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      default:
        // popularity - keep original order
        break;
    }

    setVisibleProducts(sorted);
    setCurrentPage(1);
  }, [categoryFilter, genderFilter, priceRange, products, sortFilter]);

  // Pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = visibleProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(visibleProducts.length / productsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Image error handler
  const handleImageError = (e) => {
    e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
    e.target.alt = 'Image not available';
  };

  // Helper to resolve image URL robustly
  const getImageSrc = (product) => {
    if (!product) return 'https://via.placeholder.com/300x300?text=No+Image';

    // Try common possible fields in order
    const candidates = [];

    if (product.mainImg) candidates.push(product.mainImg);
    if (product.mainImage) candidates.push(product.mainImage);
    if (product.main_image) candidates.push(product.main_image);
    if (product.image) candidates.push(product.image);
    if (product.img) candidates.push(product.img);
    if (product.imageUrl) candidates.push(product.imageUrl);
    if (product.url) candidates.push(product.url);

    // If images is an array, take first element
    if (product.images && Array.isArray(product.images) && product.images.length > 0) {
      candidates.push(product.images[0]);
    } else if (product.images && typeof product.images === 'string') {
      candidates.push(product.images);
    }

    // If carousel exists (some APIs)
    if (product.carousel && Array.isArray(product.carousel) && product.carousel.length > 0) {
      candidates.push(product.carousel[0]);
    }

    // pick first non-empty candidate
    const src = candidates.find(c => !!c) || null;
    if (!src) return 'https://via.placeholder.com/300x300?text=No+Image';

    // if absolute URL or data URL, return as-is
    if (/^(https?:\/\/|data:)/i.test(src)) return src;

    // If it starts with '/', prefix backend origin (adjust if your backend host/port differs)
    if (src.startsWith('/')) {
      return `http://localhost:3000${src}`;
    }

    // otherwise return as-is (some relative urls may work)
    return src;
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Filter Skeleton */}
            <div className="hidden lg:block w-64 space-y-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-white rounded-lg border border-gray-200 p-4 animate-pulse">
                  <div className="h-5 bg-gray-200 rounded w-1/2 mb-3"></div>
                  {[1, 2, 3].map(j => (
                    <div key={j} className="flex items-center gap-3 mb-2">
                      <div className="h-4 w-4 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* Products Skeleton */}
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                <div className="h-6 bg-gray-200 rounded w-48 mb-2 sm:mb-0"></div>
                <div className="h-10 bg-gray-200 rounded w-40"></div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                  <div key={i} className="bg-white rounded-lg border border-gray-200 overflow-hidden animate-pulse">
                    <div className="h-48 bg-gray-200"></div>
                    <div className="p-3 space-y-2">
                      <div className="h-4 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                      <div className="h-5 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile Filter Button and Results */}
        <div className="lg:hidden flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              {(!props.category || props.category === 'all') ? 'All Products' : props.category}
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              {visibleProducts.length} results
            </p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={sortFilter}
              onChange={handleSortFilterChange}
              className="text-sm border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="popularity">Sort by: Featured</option>
              <option value="low-price">Price: Low to High</option>
              <option value="high-price">Price: High to Low</option>
              <option value="discount">Best Discount</option>
              <option value="rating">Customer Reviews</option>
            </select>
            <button
              onClick={() => setIsFilterOpen(true)}
              className="flex items-center gap-2 bg-white px-3 py-2 rounded-md border border-gray-300 hover:bg-gray-50 transition-colors text-sm font-medium"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
              </svg>
              Filters
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filter Sidebar */}
          <div className={`
            fixed lg:static inset-0 z-50 bg-white lg:bg-transparent transform transition-transform duration-300 ease-in-out
            ${isFilterOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            w-80 lg:w-64 h-full lg:h-auto overflow-y-auto lg:overflow-visible border-r border-gray-200 lg:border-r-0
          `}>
            <div className="p-4 lg:p-0 space-y-5">
              {/* Mobile Header */}
              <div className="flex items-center justify-between lg:hidden border-b border-gray-200 pb-4 mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Filter Products</h2>
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Header with Clear */}
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                <button
                  onClick={clearAllFilters}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
                >
                  Clear all
                </button>
              </div>

              {/* Price Range */}
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h4 className="font-medium text-gray-900 mb-3">Price Range</h4>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>₹{priceRange[0].toLocaleString()}</span>
                    <span>₹{priceRange[1].toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={Math.max(...products.map(p => p.price))}
                    value={priceRange[1]}
                    onChange={handlePriceRangeChange}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>

              {/* Categories - Only show if props.category is 'all' or not specified */}
              {(!props.category || props.category === 'all') && (
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Categories</h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {categories.map((category) => (
                      <label key={category} className="flex items-center gap-3 cursor-pointer group py-1">
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
              )}

              {/* Gender */}
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h4 className="font-medium text-gray-900 mb-3">Gender</h4>
                <div className="space-y-2">
                  {['Men', 'Women', 'Unisex'].map((gender) => (
                    <label key={gender} className="flex items-center gap-3 cursor-pointer group py-1">
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
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Active Filters</h4>
                  <div className="flex flex-wrap gap-2">
                    {categoryFilter.map(cat => (
                      <span key={cat} className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded border border-blue-200">
                        {cat}
                        <button
                          onClick={() => setCategoryFilter(categoryFilter.filter(c => c !== cat))}
                          className="hover:text-blue-900 ml-1"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                    {genderFilter.map(gen => (
                      <span key={gen} className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-xs px-2 py-1 rounded border border-green-200">
                        {gen}
                        <button
                          onClick={() => setGenderFilter(genderFilter.filter(g => g !== gen))}
                          className="hover:text-green-900 ml-1"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Products Section */}
          <div className="flex-1">
            {/* Desktop Header */}
            <div className="hidden lg:flex items-center justify-between mb-6 bg-white p-4 rounded-lg border border-gray-200">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {(!props.category || props.category === 'all') ? 'All Products' : props.category}
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  {visibleProducts.length} results
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">Sort by:</span>
                <select
                  value={sortFilter}
                  onChange={handleSortFilterChange}
                  className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                >
                  <option value="popularity">Featured</option>
                  <option value="low-price">Price: Low to High</option>
                  <option value="high-price">Price: High to Low</option>
                  <option value="discount">Best Discount</option>
                  <option value="rating">Customer Reviews</option>
                </select>
              </div>
            </div>

            {/* Products Grid */}
            {currentProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {currentProducts.map((product) => {
                    const discountedPrice = product.discount > 0
                      ? parseInt(product.price - (product.price * product.discount) / 100)
                      : product.price;
                    const savings = product.price - discountedPrice;

                    return (
                      <div
                        key={product._id}
                        className="bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 overflow-hidden group cursor-pointer flex flex-col h-full"
                        onClick={() => navigate(`/product/${product._id}`)}
                      >
                        <div className="relative overflow-hidden bg-white p-4 flex items-center justify-center h-64">
                          <img
                            src={getImageSrc(product)}
                            alt={product.title || 'product'}
                            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-200"
                            onError={handleImageError}
                          />
                          {product.discount > 0 && (
                            <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
                              {product.discount}% off
                            </div>
                          )}
                          {(product.rating || product.rating === 0) && (
                            <div className="absolute top-3 right-3 bg-white bg-opacity-90 px-1.5 py-0.5 rounded flex items-center gap-1 text-xs font-medium">
                              <span className="text-yellow-400">★</span>
                              <span>{product.rating}</span>
                            </div>
                          )}
                        </div>

                        <div className="p-4 flex-1 flex flex-col">
                          <h3 className="font-medium text-gray-900 text-sm mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors leading-tight min-h-40px">
                            {product.title}
                          </h3>

                          <div className="mt-auto">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-lg font-bold text-gray-900">
                                ₹{discountedPrice.toLocaleString()}
                              </span>
                              {product.discount > 0 && (
                                <span className="text-sm text-gray-500 line-through">
                                  ₹{product.price.toLocaleString()}
                                </span>
                              )}
                            </div>

                            {product.discount > 0 && (
                              <div className="text-xs text-green-600 font-medium mb-2">
                                Save ₹{savings.toLocaleString()}
                              </div>
                            )}

                            <div className="text-xs text-gray-600 line-clamp-2 mb-2 min-h-32px">
                              {product.description}
                            </div>

                            <div className="text-xs text-green-600 font-medium">
                              ✓ Free delivery
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center space-x-2 mt-8">
                    <button
                      onClick={() => paginate(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>

                    {[...Array(totalPages)].map((_, i) => {
                      const pageNumber = i + 1;
                      // Show only relevant page numbers for better UX
                      if (
                        pageNumber === 1 ||
                        pageNumber === totalPages ||
                        (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                      ) {
                        return (
                          <button
                            key={pageNumber}
                            onClick={() => paginate(pageNumber)}
                            className={`px-3 py-2 text-sm font-medium rounded-lg ${currentPage === pageNumber
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                              }`}
                          >
                            {pageNumber}
                          </button>
                        );
                      } else if (
                        pageNumber === currentPage - 2 ||
                        pageNumber === currentPage + 2
                      ) {
                        return <span key={pageNumber} className="px-2 text-gray-500">...</span>;
                      }
                      return null;
                    })}

                    <button
                      onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <div className="text-gray-400 mb-4">
                  <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600 mb-4 max-w-md mx-auto">
                  We couldn't find any products matching your filters. Try adjusting your search criteria.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Overlay */}
      {isFilterOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsFilterOpen(false)}
        />
      )}
    </div>
  );
}

export default Products;
