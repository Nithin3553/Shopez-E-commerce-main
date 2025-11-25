import React, { useEffect, useState } from 'react'
import '../../styles/NewProducts.css'
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { HiPencil, HiPhotograph, HiTag, HiUsers, HiCurrencyDollar, HiCheck, HiRefresh } from 'react-icons/hi';

const UpdateProduct = () => {

  const { id } = useParams();

  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productMainImg, setProductMainImg] = useState('');
  const [productCarouselImg1, setProductCarouselImg1] = useState('');
  const [productCarouselImg2, setProductCarouselImg2] = useState('');
  const [productCarouselImg3, setProductCarouselImg3] = useState('');
  const [productSizes, setProductSizes] = useState([]);
  const [productGender, setProductGender] = useState('');
  const [productCategory, setProductCategory] = useState('');
  const [productNewCategory, setProductNewCategory] = useState('');
  const [productPrice, setProductPrice] = useState(0);
  const [productDiscount, setProductDiscount] = useState(0);

  const [AvailableCategories, setAvailableCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
    fetchProduct();
  }, [])

  const fetchProduct = async () => {
    await axios.get(`http://localhost:3000/api/products/fetch-product-details/${id}`).then(
      (response) => {
        setProductName(response.data.title);
        setProductDescription(response.data.description);
        setProductMainImg(response.data.mainImg);
        setProductCarouselImg1(response.data.carousel[0]);
        setProductCarouselImg2(response.data.carousel[1]);
        setProductCarouselImg3(response.data.carousel[2]);
        setProductSizes(response.data.sizes);
        setProductGender(response.data.gender);
        setProductCategory(response.data.category);
        setProductPrice(response.data.price);
        setProductDiscount(response.data.discount);
      }
    )
  }

  const fetchCategories = async () => {
    await axios.get('http://localhost:3000/api/products/fetch-categories').then(
      (response) => {
        setAvailableCategories(response.data);
      }
    )
  }

  const handleCheckBox = (e) => {
    const value = e.target.value;
    if (e.target.checked) {
      setProductSizes([...productSizes, value]);
    } else {
      setProductSizes(productSizes.filter(size => size !== value));
    }
  }

  const navigate = useNavigate();

  const handleUpdateProduct = async () => {
    await axios.put(`http://localhost:3000/api/products/update-product/${id}`, { productName, productDescription, productMainImg, productCarousel: [productCarouselImg1, productCarouselImg2, productCarouselImg3], productSizes, productGender, productCategory, productNewCategory, productPrice, productDiscount }).then(
      (response) => {
        alert("Product updated successfully!");
        navigate('/all-products');
      }
    )
  }

  const resetForm = () => {
    fetchProduct(); // Reset to original values
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 mb-2">
              <HiPencil className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Update Product</h1>
                <p className="text-gray-600">Edit product details and information</p>
              </div>
            </div>
            <button
              onClick={resetForm}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              <HiRefresh className="w-4 h-4" />
              Reset
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          {/* Basic Information */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <HiTag className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <label htmlFor="productName" className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  id="productName"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder="Enter product name"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="productDescription" className="block text-sm font-medium text-gray-700 mb-2">
                  Product Description *
                </label>
                <input
                  type="text"
                  id="productDescription"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder="Enter product description"
                  value={productDescription}
                  onChange={(e) => setProductDescription(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Images Section */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <HiPhotograph className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">Product Images</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="mainImg" className="block text-sm font-medium text-gray-700 mb-2">
                  Main Thumbnail Image URL *
                </label>
                <input
                  type="text"
                  id="mainImg"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder="https://example.com/image.jpg"
                  value={productMainImg}
                  onChange={(e) => setProductMainImg(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="carouselImg1" className="block text-sm font-medium text-gray-700 mb-2">
                    Carousel Image 1
                  </label>
                  <input
                    type="text"
                    id="carouselImg1"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    placeholder="Optional"
                    value={productCarouselImg1}
                    onChange={(e) => setProductCarouselImg1(e.target.value)}
                  />
                </div>

                <div>
                  <label htmlFor="carouselImg2" className="block text-sm font-medium text-gray-700 mb-2">
                    Carousel Image 2
                  </label>
                  <input
                    type="text"
                    id="carouselImg2"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    placeholder="Optional"
                    value={productCarouselImg2}
                    onChange={(e) => setProductCarouselImg2(e.target.value)}
                  />
                </div>

                <div>
                  <label htmlFor="carouselImg3" className="block text-sm font-medium text-gray-700 mb-2">
                    Carousel Image 3
                  </label>
                  <input
                    type="text"
                    id="carouselImg3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    placeholder="Optional"
                    value={productCarouselImg3}
                    onChange={(e) => setProductCarouselImg3(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Product Attributes */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Sizes */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Available Sizes</h4>
              <div className="grid grid-cols-2 gap-3">
                {['S', 'M', 'L', 'XL'].map((size) => (
                  <label key={size} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      value={size}
                      checked={productSizes.includes(size)}
                      onChange={handleCheckBox}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700 group-hover:text-gray-900 font-medium">
                      {size}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Gender */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Gender</h4>
              <div className="space-y-3">
                {['Men', 'Women', 'Unisex'].map((gender) => (
                  <label key={gender} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="radio"
                      name="productGender"
                      value={gender}
                      checked={productGender === gender}
                      onChange={(e) => setProductGender(e.target.value)}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="text-sm text-gray-700 group-hover:text-gray-900">
                      {gender}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Pricing */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Pricing</h4>
              <div className="space-y-4">
                <div>
                  <label htmlFor="productPrice" className="block text-sm font-medium text-gray-700 mb-2">
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    id="productPrice"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    value={productPrice}
                    onChange={(e) => setProductPrice(e.target.value)}
                    min="0"
                  />
                </div>

                <div>
                  <label htmlFor="productDiscount" className="block text-sm font-medium text-gray-700 mb-2">
                    Discount (%)
                  </label>
                  <input
                    type="number"
                    id="productDiscount"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    value={productDiscount}
                    onChange={(e) => setProductDiscount(e.target.value)}
                    min="0"
                    max="100"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Category Section */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <HiTag className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">Category</h3>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Existing Categories */}
              <div>
                <label htmlFor="productCategory" className="block text-sm font-medium text-gray-700 mb-2">
                  Select Category
                </label>
                <select
                  id="productCategory"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                  value={productCategory}
                  onChange={(e) => setProductCategory(e.target.value)}
                >
                  <option value="">Choose a category</option>
                  {AvailableCategories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                  <option value="new category">+ Create New Category</option>
                </select>
              </div>

              {/* New Category Input */}
              {productCategory === 'new category' && (
                <div>
                  <label htmlFor="newCategory" className="block text-sm font-medium text-gray-700 mb-2">
                    New Category Name
                  </label>
                  <input
                    type="text"
                    id="newCategory"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    placeholder="Enter new category name"
                    value={productNewCategory}
                    onChange={(e) => setProductNewCategory(e.target.value)}
                  />
                </div>
              )}
            </div>

            {/* Available Categories Display */}
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Available Categories:</p>
              <div className="flex flex-wrap gap-2">
                {AvailableCategories.map((category) => (
                  <span key={category} className={`bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm ${category === productCategory ? 'ring-2 ring-blue-500' : ''}`}>
                    {category}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-end pt-6 border-t border-gray-200">
            <button
              onClick={() => navigate('/all-products')}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdateProduct}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
            >
              <HiCheck className="w-5 h-5" />
              Update Product
            </button>
          </div>
        </div>

        {/* Preview Section */}
        <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Preview</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Product Details</h4>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Name:</span> {productName || 'Not set'}</p>
                <p><span className="font-medium">Category:</span> {productCategory || 'Not set'}</p>
                <p><span className="font-medium">Gender:</span> {productGender || 'Not set'}</p>
                <p><span className="font-medium">Sizes:</span> {productSizes.join(', ') || 'None selected'}</p>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Pricing</h4>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Price:</span> ₹{productPrice || '0'}</p>
                <p><span className="font-medium">Discount:</span> {productDiscount || '0'}%</p>
                <p><span className="font-medium">Final Price:</span> ₹{productPrice - (productPrice * productDiscount / 100) || '0'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UpdateProduct