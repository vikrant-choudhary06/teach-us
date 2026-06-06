import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { HiMenu, HiX, HiPhone } from "react-icons/hi";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuItems = [
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "About Us", href: "#about-us" },
  ];

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

          {/* Desktop CTA (Phone number style from image) */}
          <div className="hidden md:flex items-center gap-6">
            <a
              href="tel:+919719205268"
              className="bg-[#E7EFE9] hover:bg-[#DCE6DF] text-brand-forest font-semibold text-xs px-5 py-2.5 rounded-full transition-all duration-300 shadow-sm hover:shadow flex items-center gap-2 active:scale-95"
            >
              <HiPhone className="text-brand-forest shrink-0" size={14} />
              <span>+91 9719205268</span>
            </a>
          </div>

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

              <div className="flex flex-col gap-3">
                <a
                  href="tel:+919719205268"
                  className="w-full bg-brand-forest hover:bg-brand-forest-hover text-white font-semibold text-center py-3 rounded-full transition-all duration-300 text-sm shadow-md flex items-center justify-center gap-2"
                  onClick={() => setIsOpen(false)}
                >
                  <HiPhone size={16} />
                  <span>Call Us: +91 9719205268</span>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
