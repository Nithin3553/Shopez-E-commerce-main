import React, { useEffect, useState, useRef } from 'react'
import Footer from '../components/Footer'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import CollectionPage from '../components/CollectionPage'

// Tailwind Home (two-column hero with real <img>, auto-scrolling)
const Home = () => {
  const navigate = useNavigate();
  const [bannerImg, setBannerImg] = useState();
  const [heroIndex, setHeroIndex] = useState(0);
  const heroTimerRef = useRef(null);

  // IMPORTANT: local uploaded path included (tooling will transform to URL when served)
  const heroImages = [
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1600&h=900&q=80",
  "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=1600&h=900&q=80",
  "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1600&h=900&q=80"
];

  useEffect(()=>{ fetchBanner(); }, [])

  useEffect(() => {
    // auto-rotate hero images
    heroTimerRef.current = setInterval(() => {
      setHeroIndex(i => (i + 1) % heroImages.length);
    }, 4000);
    return () => {
      clearInterval(heroTimerRef.current);
    };
  }, []);

  // If API returns a banner, use it; otherwise rotate heroImages
  const currentHeroSrc = bannerImg ? bannerImg : heroImages[heroIndex];

  const fetchBanner = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/banners");
      // response.data expected to be a url string or path
      setBannerImg(response.data);
    } catch (err) {
      // keep rotating local/unsplash images; log error
      console.error("Failed to fetch banner:", err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 font-serif mt-10">

      {/* HERO: left = text, right = image */}
      <section className="max-w-6xl mx-auto mt-6 overflow-hidden border border-gray-100 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 items-stretch">
          {/* LEFT: textual area */}
          <div className="bg-white/95 p-8 md:p-16 flex flex-col justify-center">
            <small className="text-sm text-gray-500 tracking-widest">OUR BESTSELLERS</small>
            <h1 className="text-4xl md:text-5xl font-medium mt-3">Latest Arrivals</h1>
            <p className="mt-4 text-sm text-gray-600 max-w-md">
              Discover our newest collection — curated picks and bestsellers updated frequently.
            </p>

            <div className="mt-6 flex items-center gap-4">
              <Link
                to='/product'
                className="inline-block border-b-2 border-gray-800 font-semibold py-1 px-3" >
                SHOP NOW
              </Link>

              {/* small hero indicators (click to jump) */}
              <div className="flex items-center gap-2 ml-4">
                {heroImages.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setHeroIndex(idx)}
                    aria-label={`show hero ${idx+1}`}
                    className={`w-3 h-3 rounded-full transition-all duration-200 ${heroIndex === idx ? 'scale-110 bg-gray-800' : 'bg-gray-300'}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: actual image element (fully responsive & covers column) */}
          <div className="w-full h-72 md:h-auto flex items-center justify-center bg-gray-50">
            <img
              src={currentHeroSrc}
              alt="Hero"
              className="w-full h-72 md:h-full md:object-cover object-center"
              // pause auto-scroll while hovering image
              onMouseEnter={() => clearInterval(heroTimerRef.current)}
              onMouseLeave={() => {
                heroTimerRef.current = setInterval(() => {
                  setHeroIndex(i => (i + 1) % heroImages.length);
                }, 4000);
              }}
            />
          </div>
        </div>
      </section>

      {/* LATEST COLLECTIONS */}
      <section className="max-w-6xl mx-auto px-4 md:px-0 mt-12">

        {/* Products grid - uses your existing Products component so newly added products will appear */}
        <div className="mt-8">
          {/* If your Products component supports props for filtering/limit, pass them here.
              I kept it simple so it will show whatever Products normally returns. */}
          <CollectionPage category={'all'} />
        </div>
      </section>

    </div>
  )
}

export default Home
