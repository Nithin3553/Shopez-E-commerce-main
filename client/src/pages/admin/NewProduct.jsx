import React, { useEffect, useState } from 'react'
import '../../styles/NewProducts.css'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { HiPlus, HiPhotograph, HiTag, HiUsers, HiCurrencyDollar, HiCheck } from 'react-icons/hi';

const NewProduct = () => {

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
  }, [])
  
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

  const handleNewProduct = async () => {
    await axios.post('http://localhost:3000/api/products/add-new-product', { productName, productDescription, productMainImg, productCarousel: [productCarouselImg1, productCarouselImg2, productCarouselImg3], productSizes, productGender, productCategory, productNewCategory, productPrice, productDiscount }).then(
      (response) => {
        alert("Product added successfully!");
        setProductName('');
        setProductDescription('');
        setProductMainImg('');
        setProductCarouselImg1('');
        setProductCarouselImg2('');
        setProductCarouselImg3('');
        setProductSizes([]);
        setProductGender('');
        setProductCategory('');
        setProductNewCategory('');
        setProductPrice(0);
        setProductDiscount(0);

        navigate('/all-products');
      }
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <HiPlus className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
          </div>
          <p className="text-gray-600">Create a new product listing for your store</p>
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
                  <span key={category} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                    {category}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              onClick={handleNewProduct}
              className="bg-gray-950 text-white py-3 px-8 rounded-lg font-semibold hover:bg-gray-900 transition-colors duration-200 flex items-center gap-2"
            >
              <HiCheck className="w-5 h-5" />
              Add Product
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NewProduct