import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { HiMenu, HiX, HiPhone } from "react-icons/hi";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [userEmail, setUserEmail] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const email = localStorage.getItem('userEmail');
    const info = localStorage.getItem('userInfo');
    if (email) {
      setUserEmail(email);
    }
    if (info) {
      try {
        setUserInfo(JSON.parse(info));
      } catch (e) {
        console.error('Error parsing userInfo in Navbar:', e);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userInfo');
    setUserEmail(null);
    setUserInfo(null);
    window.location.reload();
  };

  const menuItems = [
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "About Us", href: "#about-us" },
  ];

  const dashboardPath = userInfo?.role === 'Student' ? '/student-dashboard' : '/professor-dashboard';

  return (
    <nav className=" top-0 left-0 right-0 z-50 transition-all duration-300 w-full">
      {/* Top Accent Line */}
      {/* <div className="h-1 bg-emerald-400 w-full" /> */}

      {/* Main Header Container */}
      <div className="w-full h-20 bg-white flex items-stretch shadow-md">
        {/* Left Side: Logo & Name (White background) */}
        <div className="bg-white flex items-center pl-6 sm:pl-12 shrink-0">
          <Link to="/" className="flex items-center gap-3">
            <img
              src="/brain.jpg"
              alt="techUs Logo"
              className="h-10 w-20 rounded-xl object-cover "
            />
            <span className="text-2xl font-bold tracking-tight text-brand-forest">
              techUs
            </span>
          </Link>
        </div>

        {/* Transition S-Curve SVG */}
        <div className="relative w-18 -mr-px shrink-0 bg-white select-none pointer-events-none">
          <svg
            className="absolute inset-0 h-full w-full fill-brand-forest"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <path d="M 102,0 C 80,0 50,20 50,50 C 50,80 20,100 0,100 L 102,100 Z" />
          </svg>
        </div>

        {/* Right Side: Menu & CTAs (Green background) */}
        <div className="flex-1 bg-brand-forest flex items-center justify-between px-6 sm:px-12 text-white">
          {/* Desktop Menu Links */}
          <div className="hidden md:flex items-center gap-3">
            {menuItems.map((item, idx) => (
              <a
                key={item.label}
                href={item.href}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all ${
                  idx === 0
                    ? "bg-white text-brand-forest shadow-sm"
                    : "border border-white/10 hover:border-white/30 text-white/90 hover:text-white"
                }`}
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* CTA Buttons */}
          {userEmail ? (
            <div className="hidden md:flex items-center gap-5 relative">
              <a
                href="tel:+919719205268"
                className="bg-[#E7EFE9] hover:bg-[#DCE6DF] text-brand-forest font-semibold text-xs px-5 py-2.5 rounded-full transition-all duration-300 shadow-sm hover:shadow flex items-center gap-2 active:scale-95 mr-2"
              >
                <HiPhone className="text-brand-forest shrink-0" size={14} />
                <span>+91 9719205268</span>
              </a>
              
              <Link
                to={dashboardPath}
                className="bg-white hover:bg-gray-100 text-black font-extrabold text-xs px-5 py-2.5 rounded-full transition-all duration-300 shadow-md active:scale-95 font-space uppercase tracking-wider"
              >
                Dashboard
              </Link>
              
              <div className="relative">
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  onBlur={() => setTimeout(() => setIsProfileDropdownOpen(false), 200)}
                  className="w-9 h-9 rounded-full overflow-hidden border border-emerald-500/30 flex items-center justify-center bg-emerald-500/10 hover:border-emerald-500/60 transition-all select-none cursor-pointer"
                  title="Account Details"
                >
                  {userInfo?.picture ? (
                    <img src={userInfo.picture} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <span className="font-extrabold text-emerald-400 text-xs uppercase">
                      {(userInfo?.name || userEmail).substring(0, 2).toUpperCase()}
                    </span>
                  )}
                </button>

                <AnimatePresence>
                  {isProfileDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-3 w-56 bg-brand-forest border border-white/[0.08] rounded-xl shadow-2xl z-50 p-1 flex flex-col divide-y divide-white/[0.04] text-left select-none"
                    >
                      <div className="p-3">
                        <p className="text-xs font-bold text-white truncate">{userInfo?.name || 'User'}</p>
                        <p className="text-[10px] text-gray-300 truncate mt-0.5">{userEmail}</p>
                      </div>
                      <div className="py-1">
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-3 py-2 text-xs font-bold text-red-300 hover:bg-white/[0.04] transition-colors rounded-lg cursor-pointer"
                        >
                          Log Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-6">
              <a
                href="tel:+919719205268"
                className="bg-[#E7EFE9] hover:bg-[#DCE6DF] text-brand-forest font-semibold text-xs px-5 py-2.5 rounded-full transition-all duration-300 shadow-sm hover:shadow flex items-center gap-2 active:scale-95"
              >
                <HiPhone className="text-brand-forest shrink-0" size={14} />
                <span>+91 9719205268</span>
              </a>
              <Link
                to="/login"
                className="text-gray-300 hover:text-white font-medium text-sm transition-colors tracking-wide"
              >
                Login
              </Link>
              <Link 
                to="/login" 
                className="bg-white hover:bg-gray-100 text-black font-semibold text-sm px-5 py-2 rounded-full transition-all duration-300 shadow-md hover:shadow-white/5 active:scale-95"
              >
                Get Started
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center ml-auto">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-brand-sage p-1 focus:outline-none transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <HiX size={24} /> : <HiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 right-0 top-21 p-6 bg-white border-b border-brand-forest/15 shadow-2xl md:hidden z-40"
          >
            <div className="flex flex-col gap-4">
              {menuItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-brand-text-muted hover:text-brand-forest transition-colors font-semibold text-base py-1"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </a>
              ))}

              <div className="h-px bg-brand-forest/10 my-2" />

              {userEmail ? (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3 bg-brand-sage/40 p-3 rounded-2xl border border-brand-forest/10">
                    <div className="w-9 h-9 rounded-full overflow-hidden border border-emerald-500/20 bg-emerald-500/10 flex items-center justify-center">
                      {userInfo?.picture ? (
                        <img src={userInfo.picture} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <span className="font-bold text-brand-forest text-xs uppercase">
                          {(userInfo?.name || userEmail).substring(0, 2).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-brand-forest truncate">{userInfo?.name || 'User'}</p>
                      <p className="text-[10px] text-brand-text-muted truncate">{userEmail}</p>
                    </div>
                  </div>
                  <Link
                    to={dashboardPath}
                    className="w-full bg-brand-forest hover:bg-brand-forest-hover text-white font-semibold text-center py-3 rounded-full transition-all duration-300 text-sm shadow-md"
                    onClick={() => setIsOpen(false)}
                  >
                    Go to Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      handleLogout();
                    }}
                    className="w-full border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 text-red-600 font-bold text-center py-3 rounded-full transition-all duration-300 text-sm cursor-pointer"
                  >
                    Log Out
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <Link
                    to="/login"
                    className="text-brand-text-muted hover:text-brand-forest font-medium text-base text-center py-2"
                    onClick={() => setIsOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/login"
                    className="w-full bg-brand-forest hover:bg-brand-forest-hover text-white font-semibold text-center py-3 rounded-full transition-all duration-300 text-sm shadow-md"
                    onClick={() => setIsOpen(false)}
                  >
                    Get Started
                  </Link>
                  <a
                    href="tel:+919719205268"
                    className="w-full bg-white hover:bg-gray-50 text-brand-forest border border-brand-forest/20 font-semibold text-center py-3 rounded-full transition-all duration-300 text-sm shadow-sm flex items-center justify-center gap-2"
                    onClick={() => setIsOpen(false)}
                  >
                    <HiPhone size={16} />
                    <span>Call Us: +91 9719205268</span>
                  </a>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
