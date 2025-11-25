import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-100 text-gray-600 pt-12 pb-8 mt-16 border-t border-gray-200">
      {/* Top Accent Line */}
      <div className="h-1 w-full bg-[#4F46E5] to-[#FBBF24]" />

      <div className="max-w-7xl mx-auto px-6 md:px-10">
        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 py-10">

          {/* Brand */}
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-wide">
              Shopez
            </h2>
            <p className="mt-3 text-sm text-gray-500 leading-relaxed">
              Your trusted marketplace for quality products at the best prices.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link className="hover:text-[#4F46E5] transition">Home</Link></li>
              <li><Link className="hover:text-[#4F46E5] transition">Products</Link></li>
              <li><Link className="hover:text-[#4F46E5] transition">Categories</Link></li>
              <li><Link className="hover:text-[#4F46E5] transition">Cart</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li><Link className="hover:text-[#4F46E5] transition">Help Center</Link></li>
              <li><Link className="hover:text-[#4F46E5] transition">Contact Us</Link></li>
              <li><Link className="hover:text-[#4F46E5] transition">FAQs</Link></li>
              <li><Link className="hover:text-[#4F46E5] transition">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Follow Us</h3>

            <div className="flex gap-4 items-center">
              <a href="#" className="hover:scale-110 transition">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/733/733547.png"
                  alt="Facebook"
                  className="w-7 h-7 opacity-80 hover:opacity-100"
                />
              </a>

              <a href="#" className="hover:scale-110 transition">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/733/733558.png"
                  alt="Instagram"
                  className="w-7 h-7 opacity-80 hover:opacity-100"
                />
              </a>

              <a href="#" className="hover:scale-110 transition">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/733/733579.png"
                  alt="Twitter"
                  className="w-7 h-7 opacity-80 hover:opacity-100"
                />
              </a>

              <a href="#" className="hover:scale-110 transition">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/733/733590.png"
                  alt="YouTube"
                  className="w-7 h-7 opacity-80 hover:opacity-100"
                />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Copy */}
        <div className="border-t border-gray-300 mt-8 pt-5 text-center">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} Shopez — Built by{" "}
            <span className="text-[#4F46E5] font-semibold">Shopez</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
