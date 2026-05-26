import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiMenu, HiX } from 'react-icons/hi';
import { HiBookOpen as BookIcon } from 'react-icons/hi';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { label: 'Features', href: '#features' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'About Us', href: '#about-us' },
  ];

  return (
    <nav className="fixed top-4 left-0 right-0 z-50 px-4 transition-all duration-300">
      <div className={`max-w-5xl mx-auto transition-all duration-300 ${
        isScrolled ? 'translate-y-0' : 'translate-y-2'
      }`}>
        <div className="backdrop-blur-md bg-[#121214]/80 border border-white/[0.08] rounded-full px-6 py-3 shadow-2xl flex items-center justify-between relative">
          
          {/* Logo */}
          <Link to="/">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-green-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <span className="text-white font-extrabold text-[11px] tracking-wide">AI</span>
              </div>
              <span className="text-lg font-bold tracking-tight text-white flex items-center gap-1">
                Acharya <span className="text-emerald-400">AI</span>
              </span>
            </motion.div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {menuItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-gray-300 hover:text-white transition-colors font-medium text-sm tracking-wide relative py-1"
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-6">
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

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gray-300 hover:text-white p-1 focus:outline-none transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <HiX size={22} /> : <HiMenu size={22} />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute left-4 right-4 mt-3 p-6 rounded-3xl border border-white/[0.08] bg-[#121214]/95 backdrop-blur-xl shadow-2xl md:hidden z-40"
            >
              <div className="flex flex-col gap-4">
                {menuItems.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="text-gray-300 hover:text-white transition-colors font-medium text-base py-1"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </a>
                ))}
                
                <div className="h-px bg-white/[0.08] my-2" />
                
                <div className="flex flex-col gap-3">
                  <Link
                    to="/login"
                    className="text-gray-300 hover:text-white font-medium text-base text-center py-2"
                    onClick={() => setIsOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/login"
                    className="w-full bg-white hover:bg-gray-100 text-black font-semibold text-center py-3 rounded-full transition-all duration-300 text-sm shadow-md"
                    onClick={() => setIsOpen(false)}
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
