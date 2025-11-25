import React, { useContext, useEffect, useState } from 'react'
import { BsCart3, BsPersonCircle } from 'react-icons/bs'
import { FcSearch } from 'react-icons/fc'
import { ImCancelCircle } from 'react-icons/im'
import { Link, useNavigate } from 'react-router-dom'
import { GeneralContext } from '../context/GeneralContext'
import axios from 'axios'

const Navbar = () => {
  const navigate = useNavigate();

  const usertype = localStorage.getItem('userType');
  const username = localStorage.getItem('username');

  const { cartCount, logout } = useContext(GeneralContext);

  const [productSearch, setProductSearch] = useState('');
  const [noResult, setNoResult] = useState(false);
  const [categories, setCategories] = useState([]);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => { fetchData(); }, [])

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/products/fetch-categories');
      setCategories(response.data);
    } catch (err) {
      console.error(err);
    }
  }

  const handleSearch = () => {
    if (!productSearch.trim()) return;
    if (categories.includes(productSearch)) {
      navigate(`/category/${productSearch}`);
      setNoResult(false);
      setMobileOpen(false);
    } else {
      setNoResult(true);
    }
  }

  return (
    <header className="w-full border-b border-gray-200 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* LEFT: logo */}
          <Link
            to="/"
            className="flex items-center gap-3 hover:scale-105 transition-transform" >
            <div className="w-10 h-10 rounded-full bg-white shadow flex items-center justify-center">
              <span className="font-extrabold text-xl text-[#111827]">S</span>
            </div>
            <span className="text-4xl font-Outfit font-medium text-[#111827]">
              Shopez
            </span>
          </Link>

          {/* CENTER: nav links (hidden on small screens) */}
          <nav className="hidden md:flex md:space-x-8 md:items-center">
            <Link to="/" className="text-sm uppercase tracking-wider text-gray-700 hover:text-gray-900 border-b-2 border-transparent hover:border-gray-900">Home</Link>
            <Link to="/product" className="text-sm uppercase tracking-wider text-gray-700 hover:text-gray-900 border-b-2 border-transparent hover:border-gray-900">Collection</Link>
            <Link to="/" className="text-sm uppercase tracking-wider text-gray-700 hover:text-gray-900 border-b-2 border-transparent hover:border-gray-900">About</Link>
            <Link to="/" className="text-sm uppercase tracking-wider text-gray-700 hover:text-gray-900 border-b-2 border-transparent hover:border-gray-900">Contact</Link>
          </nav>

          {/* RIGHT: search + icons */}
          <div className="flex items-center gap-4">
            {/* search field (desktop) */}
            {/* <div className="hidden md:flex items-center relative">
              <input
                type="text"
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search Electronics, Fashion, mobiles..."
                className="w-64 px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-300"
              />
              <button onClick={handleSearch} className="ml-2 p-1">
                <FcSearch className="text-xl" />
              </button>

              {noResult && (
                <div className="absolute top-12 left-0 z-20 w-80 bg-white border border-gray-200 rounded p-3 text-xs shadow">
                  No items found... try Electronics, mobiles, Groceries.
                  <ImCancelCircle className="inline ml-2 cursor-pointer text-base" onClick={() => setNoResult(false)} />
                </div>
              )}
            </div> */}

            {/* icons (desktop) */}
            {!usertype ? (
              <button onClick={() => navigate('/auth')} className="hidden md:inline-block px-3 py-2 border rounded text-sm bg-gray-50 hover:bg-gray-100">Login</button>
            ) : (
              usertype === 'customer' ? (
                <div className="hidden md:flex items-center gap-10">
                  <button onClick={() => navigate('/profile')} className="flex items-center gap-2 text-gray-700 hover:text-gray-900">
                    <BsPersonCircle className="text-2xl" />
                    <span className=" hidden lg:inline text-sm uppercase">{username}</span>
                  </button>

                  <button onClick={() => navigate('/cart')} className="relative">
                    <BsCart3 className="text-2xl text-gray-700 hover:text-gray-900" />
                    <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] font-semibold rounded-full w-5 h-5 flex items-center justify-center">{cartCount || 0}</span>
                  </button>
                </div>
              ) : (
                // admin links (desktop)
                <div className="hidden md:flex items-center gap-6">
                  <button onClick={() => navigate('/admin')} className="text-sm text-gray-700 hover:text-gray-900">Admin</button>
                  <button onClick={logout} className="text-sm text-red-600 hover:text-red-700">Logout</button>
                </div>
              )
            )}

            {/* MOBILE: search icon + hamburger */}
            <div className="flex md:hidden items-center gap-2">
              <button
                onClick={() => {
                  // toggle a small mobile search prompt
                  const q = prompt('Search category (e.g., Electronics, Fashion, mobiles)');
                  if (q) {
                    setProductSearch(q);
                    if (categories.includes(q)) { navigate(`/category/${q}`); setNoResult(false); }
                    else setNoResult(true);
                  }
                }}
                aria-label="mobile search"
                className="p-1"
              >
                <FcSearch className="text-xl" />
              </button>

              <button
                onClick={() => setMobileOpen(s => !s)}
                aria-label="toggle menu"
                className="p-2 border rounded-md"
              >
                {/* simple hamburger */}
                <div className="w-5 h-5 flex flex-col justify-between">
                  <span className="block h-2px bg-gray-700"></span>
                  <span className="block h-2px bg-gray-700"></span>
                  <span className="block h-2px bg-gray-700"></span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* MOBILE MENU */}
        {mobileOpen && (
          <div className="md:hidden mt-3 pb-4 border-t border-gray-100">
            <div className="flex flex-col space-y-3 px-1">
              <button onClick={() => { navigate('/'); setMobileOpen(false); }} className="text-left px-3 py-2 rounded hover:bg-gray-50">Home</button>
              <button onClick={() => { navigate('/collections'); setMobileOpen(false); }} className="text-left px-3 py-2 rounded hover:bg-gray-50">Collection</button>
              <button onClick={() => { navigate('/about'); setMobileOpen(false); }} className="text-left px-3 py-2 rounded hover:bg-gray-50">About</button>
              <button onClick={() => { navigate('/contact'); setMobileOpen(false); }} className="text-left px-3 py-2 rounded hover:bg-gray-50">Contact</button>

              {/* mobile search inline */}
              <div className="flex items-center gap-2 px-3">
                <input
                  type="text"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  placeholder="Search category..."
                  className="flex-1 px-3 py-2 border rounded text-sm"
                />
                <button onClick={handleSearch} className="px-3 py-2 border rounded">Go</button>
              </div>

              {noResult && <div className="px-3 text-xs text-red-600">No results — try Electronics, mobiles, Groceries.</div>}

              {/* mobile icons */}
              {!usertype ? (
                <button onClick={() => { navigate('/auth'); setMobileOpen(false); }} className="mx-3 px-3 py-2 border rounded text-sm">Login</button>
              ) : usertype === 'customer' ? (
                <div className="flex items-center justify-between px-3">
                  <button onClick={() => { navigate('/profile'); setMobileOpen(false); }} className="flex items-center gap-2">
                    <BsPersonCircle className="text-2xl" /> <span>{username}</span>
                  </button>
                  <button onClick={() => { navigate('/cart'); setMobileOpen(false); }} className="relative">
                    <BsCart3 className="text-2xl" />
                    <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] font-semibold rounded-full w-5 h-5 flex items-center justify-center">{cartCount || 0}</span>
                  </button>
                </div>
              ) : (
                <div className="flex flex-col px-3 space-y-2">
                  <button onClick={() => { navigate('/admin'); setMobileOpen(false); }} className="text-left">Admin Home</button>
                  <button onClick={() => { navigate('/all-products'); setMobileOpen(false); }} className="text-left">Products</button>
                  <button onClick={() => { logout(); setMobileOpen(false); }} className="text-left text-red-600">Logout</button>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </header>
  )
}

export default Navbar
