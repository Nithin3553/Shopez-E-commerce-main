// CollectionSections.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Beginner-friendly Collection Sections component (image fixes only)
export default function CollectionSections() {
  // state for products and loading indicator
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // If your backend uses a different origin, change this
  const BACKEND_ORIGIN = 'http://localhost:3000';

  // local uploaded image (used as a friendly fallback during local testing)
  // path available in your project environment: /mnt/data/Screenshot 2025-11-21 122758.png
  const LOCAL_FALLBACK_IMAGE = '/mnt/data/Screenshot 2025-11-21 122758.png';

  // fetch products when component mounts
  useEffect(() => {
    // simple function to load products
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${BACKEND_ORIGIN}/api/products/fetch-products`);
        // assume API returns an array
        const data = Array.isArray(res.data) ? res.data : (res.data.products || []);
        // debug: log a sample product so you can inspect keys in console if needed
        if (data && data.length > 0) {
          console.log('Sample product for image keys inspection:', data[0]);
        }
        setProducts(data);
      } catch (err) {
        console.error('Error fetching products:', err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []); // empty deps -> run once

  // robust helper to get image src for a product (tries many shapes)
  const getImageSrc = (product) => {
    if (!product) return LOCAL_FALLBACK_IMAGE || 'https://via.placeholder.com/300x300?text=No+Image';

    const candidates = [];

    // common string fields
    if (product.mainImg && typeof product.mainImg === 'string') candidates.push(product.mainImg);
    if (product.mainImage && typeof product.mainImage === 'string') candidates.push(product.mainImage);
    if (product.main_image && typeof product.main_image === 'string') candidates.push(product.main_image);
    if (product.image && typeof product.image === 'string') candidates.push(product.image);
    if (product.img && typeof product.img === 'string') candidates.push(product.img);
    if (product.imageUrl && typeof product.imageUrl === 'string') candidates.push(product.imageUrl);
    if (product.url && typeof product.url === 'string') candidates.push(product.url);

    // images array
    if (product.images && Array.isArray(product.images) && product.images.length > 0) {
      // prefer string first item, or nested object with url
      const first = product.images[0];
      if (typeof first === 'string') candidates.push(first);
      else if (first && typeof first === 'object') {
        if (first.url) candidates.push(first.url);
        if (first.path) candidates.push(first.path);
      }
    }

    // carousel array
    if (product.carousel && Array.isArray(product.carousel) && product.carousel.length > 0) {
      const first = product.carousel[0];
      if (typeof first === 'string') candidates.push(first);
      else if (first && typeof first === 'object') {
        if (first.url) candidates.push(first.url);
        if (first.path) candidates.push(first.path);
      }
    }

    // nested image object like image: { url: '...' } or image: { path: '...' }
    if (product.image && typeof product.image === 'object') {
      if (product.image.url) candidates.push(product.image.url);
      if (product.image.path) candidates.push(product.image.path);
    }

    // some APIs return attachments or assets
    if (product.asset && typeof product.asset === 'string') candidates.push(product.asset);
    if (product.asset && typeof product.asset === 'object' && product.asset.url) candidates.push(product.asset.url);

    // find first non-empty candidate (string)
    const src = candidates.find(c => typeof c === 'string' && c.trim() !== '') || null;

    if (!src) {
      // no image fields found -> use local fallback if available, else generic placeholder
      return LOCAL_FALLBACK_IMAGE || 'https://via.placeholder.com/300x300?text=No+Image';
    }

    // if src already absolute (http/https/data) return as-is
    if (/^(https?:\/\/|data:)/i.test(src)) return src;

    // if src starts with '/', it's a server path -> prefix backend origin
    if (src.startsWith('/')) {
      return `${BACKEND_ORIGIN}${src}`;
    }

    // otherwise return as-is (may be relative but working)
    return src;
  };

  // Best sellers are products with discount > 0
  const bestSellers = products.filter(p => p && p.discount > 0);

  // Simple price calculator (with discount)
  const finalPrice = (p) => {
    if (!p) return 0;
    if (p.discount && p.discount > 0) {
      return Math.round(p.price - (p.price * p.discount) / 100);
    }
    return p.price || 0;
  };

  // Image fallback handler
  const handleImageError = (e) => {
    // if remote fetch fails, try local fallback, else generic placeholder
    e.target.src = LOCAL_FALLBACK_IMAGE || 'https://via.placeholder.com/300x300?text=No+Image';
  };

  // Loading state
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 text-center text-gray-600">
        Loading products...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* LATEST COLLECTIONS */}
      <section className="mb-12">
        <div className="text-center mb-6">
          <h2 className="text-sm text-gray-500">LATEST <span className="font-semibold text-gray-900">COLLECTIONS</span></h2>
          <p className="text-sm text-gray-500 mt-2">These products are loaded from your API.</p>
        </div>

        {/* grid: 2 cols mobile, 3 small, 4 medium, 6 large */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {products.map((p) => (
            <div
              key={p._id || p.id}
              className="bg-white border rounded-md overflow-hidden shadow-sm cursor-pointer"
              onClick={() => window.location.href = `/product/${p._id || p.id}`}
            >
              <div className="h-32 flex items-center justify-center bg-gray-50">
                <img
                  src={getImageSrc(p)}
                  alt={p.title || p.name || 'product'}
                  className="max-h-full object-contain"
                  onError={handleImageError}
                />
              </div>
              <div className="p-2 text-center">
                <div className="text-xs text-gray-700 mb-1 truncate">{p.title || p.name || 'Untitled'}</div>
                <div className="text-sm text-gray-900 font-semibold">₹{finalPrice(p).toLocaleString()}</div>
                {p.discount > 0 && (
                  <div className="text-xs text-green-600 mt-1">Save {p.discount}%</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* BEST SELLER */}
      <section className="mb-8">
        <div className="text-center mb-6">
          <h2 className="text-sm text-gray-500">BEST <span className="font-semibold text-gray-900">SELLER</span></h2>
          <p className="text-sm text-gray-500 mt-2">Products with discounts (higher discount first).</p>
        </div>

        {bestSellers.length === 0 ? (
          <div className="text-center text-gray-500">No discounted products available.</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {bestSellers
              .sort((a, b) => (b.discount || 0) - (a.discount || 0))
              .map((p) => (
                <div
                  key={p._id || p.id}
                  className="bg-white border rounded-md overflow-hidden shadow-sm text-center p-3 cursor-pointer"
                  onClick={() => window.location.href = `/product/${p._id || p.id}`}
                >
                  <div className="h-28 flex items-center justify-center bg-gray-50 mb-2">
                    <img
                      src={getImageSrc(p)}
                      alt={p.title || p.name}
                      className="max-h-full object-contain"
                      onError={handleImageError}
                    />
                  </div>
                  <div className="text-sm text-gray-700 mb-1 truncate">{p.title || p.name}</div>
                  <div className="text-sm text-gray-900 font-semibold">₹{finalPrice(p).toLocaleString()}</div>
                  <div className="text-xs text-gray-500 line-through">{p.price ? `₹${p.price.toLocaleString()}` : ''}</div>
                  <div className="text-xs text-green-600 mt-1">Save {p.discount}%</div>
                </div>
              ))}
          </div>
        )}
      </section>
    </div>
  );
}
