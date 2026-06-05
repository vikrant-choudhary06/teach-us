import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const SparklesIcon = () => (
  <svg
    className="inline-block w-7 h-7 ml-2 text-[#facc15] align-middle select-none pointer-events-none"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    {/* Big sparkle */}
    <path d="M12 2a 0.75 0.75 0 0 0 -0.75 0.75v1.5c0 3.3-2.7 6-6 6H3.75a 0.75 0.75 0 0 0 0 1.5H5.25c3.3 0 6 2.7 6 6v1.5a 0.75 0.75 0 0 0 1.5 0v-1.5c0-3.3 2.7-6 6-6h1.5c0.41 0 0.75-0.34 0.75-0.75s-0.34-0.75-0.75-0.75H18.75c-3.3 0-6-2.7-6-6V2.75A 0.75 0.75 0 0 0 12 2Z" />
    {/* Small sparkle */}
    <path
      d="M19 12a 0.5 0.5 0 0 0 -0.5 0.5v0.75c0 1.6-1.3 3-3 3h-0.75a 0.5 0.5 0 0 0 0 1h0.75c1.6 0 3 1.3 3 3v0.75a 0.5 0.5 0 0 0 1 0v-0.75c0-1.6 1.3-3 3-3h0.75a 0.5 0.5 0 0 0 0-1h-0.75c-1.6 0-3-1.3-3-3v-0.75A 0.5 0.5 0 0 0 19 12Z"
      opacity="0.8"
    />
  </svg>
);

export default function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(true); // Default to annual as in image
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [hoveredCardIndex, setHoveredCardIndex] = useState(null);

  const handleMouseMove = (e, index) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setCoords({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setHoveredCardIndex(index);
  };

  return (
    <section id="pricing" className="py-24 sm:py-32 bg-black relative overflow-hidden border-t border-white/[0.04]">
      {/* Background glow effects */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute top-[20%] left-[-10%] w-[400px] h-[400px] bg-emerald-600/3 rounded-full blur-[120px]" />
        <div className="absolute bottom-[20%] right-[-10%] w-[450px] h-[450px] bg-green-500/3 rounded-full blur-[130px]" />
      </div>

      <div className="container-custom relative z-10 px-4">
        {/* Badge */}
        <div className="flex justify-center mb-6">
          <span className="inline-flex items-center px-4 py-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/5 text-emerald-400 text-[10px] font-bold tracking-widest uppercase">
            Pricing
          </span>
        </div>

        {/* Title */}
        <h2 className="font-space text-3xl sm:text-4xl lg:text-5xl font-bold text-center text-white mb-4">
          Choose the perfect plan for you <SparklesIcon />
        </h2>

        {/* Subtitle */}
        <p className="text-gray-400 text-center text-xs sm:text-sm lg:text-base max-w-2xl mx-auto mb-12 leading-relaxed">
          Start for free and upgrade anytime to unlock powerful new AI capabilities for your classroom. Pay in various ways. Cancel anytime.
        </p>

        {/* Toggle */}
        <div className="flex items-center justify-center gap-3.5 mb-16">
          <span
            onClick={() => setIsAnnual(false)}
            className={`text-xs sm:text-sm font-semibold transition-colors cursor-pointer select-none ${
              !isAnnual ? 'text-white' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            Monthly
          </span>

          <button
            onClick={() => setIsAnnual(!isAnnual)}
            className="relative w-12 h-6 rounded-full p-1 bg-white/[0.08] hover:bg-white/[0.12] transition-colors focus:outline-none"
            aria-label="Toggle annual billing"
          >
            <motion.div
              layout
              className="w-4 h-4 rounded-full bg-emerald-400 shadow-sm"
              animate={{ x: isAnnual ? 24 : 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          </button>

          <div className="flex items-center gap-2">
            <span
              onClick={() => setIsAnnual(true)}
              className={`text-xs sm:text-sm font-semibold transition-colors cursor-pointer select-none ${
                isAnnual ? 'text-white' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              Annually
            </span>
            <span className="bg-[var(--color-emerald-500)]/15 text-[var(--color-emerald-500)] border border-[var(--color-emerald-500)]/25 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              20% OFF
            </span>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto items-stretch">
          
          {/* Card 1: Basic */}
          <div
            onMouseMove={(e) => handleMouseMove(e, 0)}
            onMouseEnter={() => setHoveredCardIndex(0)}
            onMouseLeave={() => setHoveredCardIndex(null)}
            className="relative rounded-[2rem] border border-white/[0.06] bg-[#0d1015]/90 p-8 flex flex-col h-full transition-all duration-300 hover:border-white/20 overflow-hidden"
          >
            {/* Spotlight */}
            <div
              className="pointer-events-none absolute -inset-px transition-opacity duration-300"
              style={{
                opacity: hoveredCardIndex === 0 ? 1 : 0,
                background: `radial-gradient(400px circle at ${coords.x}px ${coords.y}px, rgba(var(--theme-spotlight-color, 16, 185, 129), 0.05), transparent 80%)`,
              }}
            />

            <div className="mb-6 relative z-10">
              <h3 className="font-space text-xl font-bold text-white mb-2">Basic</h3>
              <p className="text-gray-400 text-xs sm:text-sm leading-relaxed min-h-[44px]">
                For individuals exploring the power of AI in education.
              </p>
            </div>

            <div className="mb-6 relative z-10">
              <div className="font-space text-5xl font-extrabold text-white">Free</div>
              <span className="text-emerald-500/70 text-[10px] font-extrabold tracking-widest uppercase mt-2.5 block">
                FOREVER
              </span>
            </div>

            <div className="border-t border-dashed border-white/[0.08] my-6 relative z-10" />

            <div className="mb-8 relative z-10">
              <Link
                to="/login"
                className="w-full inline-flex items-center justify-center py-3 px-6 rounded-full border border-white/10 hover:border-white/20 text-white font-semibold text-xs sm:text-sm transition-all hover:bg-white/[0.02]"
              >
                Try it for free
              </Link>
            </div>

            <ul className="space-y-4 flex-1 relative z-10">
              <li className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-300">
                <span className="text-emerald-400 font-bold select-none shrink-0">✓</span>
                <span className="leading-tight">5 uses/month of basic AI tools</span>
              </li>
              <li className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-300">
                <span className="text-emerald-400 font-bold select-none shrink-0">✓</span>
                <span className="leading-tight">Workspace & Library access</span>
              </li>
              <li className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-300">
                <span className="text-emerald-400 font-bold select-none shrink-0">✓</span>
                <span className="leading-tight">Community Support</span>
              </li>
              <li className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-300">
                <span className="text-emerald-400 font-bold select-none shrink-0">✓</span>
                <span className="leading-tight">Cancel anytime</span>
              </li>
            </ul>
          </div>

          {/* Card 2: Pro */}
          <div
            onMouseMove={(e) => handleMouseMove(e, 1)}
            onMouseEnter={() => setHoveredCardIndex(1)}
            onMouseLeave={() => setHoveredCardIndex(null)}
            className="relative rounded-[2rem] border border-emerald-500/50 bg-[#0d1015]/95 p-8 flex flex-col h-full transition-all duration-300 overflow-hidden theme-glow-shadow"
          >
            {/* Top green line glow highlight */}
            <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-transparent via-[var(--color-emerald-400)] to-transparent" style={{ boxShadow: '0 0 15px var(--color-emerald-400)' }} />

            {/* Spotlight */}
            <div
              className="pointer-events-none absolute -inset-px transition-opacity duration-300"
              style={{
                opacity: hoveredCardIndex === 1 ? 1 : 0,
                background: `radial-gradient(400px circle at ${coords.x}px ${coords.y}px, rgba(var(--theme-spotlight-color, 16, 185, 129), 0.07), transparent 80%)`,
              }}
            />

            <div className="mb-6 relative z-10">
              <h3 className="font-space text-xl font-bold text-white mb-2">Pro</h3>
              <p className="text-gray-400 text-xs sm:text-sm leading-relaxed min-h-[44px]">
                For individual teachers wanting to unlock the full potential of AI.
              </p>
            </div>

            <div className="mb-6 relative z-10">
              <div className="flex items-baseline gap-1">
                <span className="font-space text-5xl font-extrabold text-white">
                  {isAnnual ? '₹499' : '₹599'}
                </span>
                <span className="text-gray-400 text-sm">/month</span>
              </div>
              <span className="text-gray-500 text-[11px] font-medium mt-2 block">
                {isAnnual ? 'billed ₹5,988 annually (Save 20%)' : 'billed monthly'}
              </span>
            </div>

            <div className="border-t border-dashed border-white/[0.08] my-6 relative z-10" />

            <div className="mb-8 relative z-10">
              <Link
                to="/login"
                className="w-full inline-flex items-center justify-center py-3 px-6 rounded-full bg-[var(--color-emerald-500)] hover:bg-[var(--color-emerald-600)] text-[var(--theme-btn-text,#000000)] font-bold text-xs sm:text-sm transition-all"
                style={{ boxShadow: '0 4px 25px rgba(var(--theme-spotlight-color, 16, 185, 129), 0.18)' }}
              >
                Get Pro Membership
              </Link>
            </div>

            <ul className="space-y-4 flex-1 relative z-10">
              <li className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-300">
                <span className="text-emerald-400 font-bold select-none shrink-0">✓</span>
                <span className="leading-tight">Unlimited Lesson Plans & Quizzes</span>
              </li>
              <li className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-300">
                <span className="text-emerald-400 font-bold select-none shrink-0">✓</span>
                <span className="leading-tight">100 Credits/month for premium</span>
              </li>
              <li className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-300">
                <span className="text-emerald-400 font-bold select-none shrink-0">✓</span>
                <span className="leading-tight">AI-powered evaluation tools</span>
              </li>
              <li className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-300">
                <span className="text-emerald-400 font-bold select-none shrink-0">✓</span>
                <span className="leading-tight">Cancel anytime</span>
              </li>
            </ul>
          </div>

          {/* Card 3: Institute */}
          <div
            onMouseMove={(e) => handleMouseMove(e, 2)}
            onMouseEnter={() => setHoveredCardIndex(2)}
            onMouseLeave={() => setHoveredCardIndex(null)}
            className="relative rounded-[2rem] border border-white/[0.06] bg-[#0d1015]/90 p-8 flex flex-col h-full transition-all duration-300 hover:border-white/20 overflow-hidden"
          >
            {/* Spotlight */}
            <div
              className="pointer-events-none absolute -inset-px transition-opacity duration-300"
              style={{
                opacity: hoveredCardIndex === 2 ? 1 : 0,
                background: `radial-gradient(400px circle at ${coords.x}px ${coords.y}px, rgba(var(--theme-spotlight-color, 16, 185, 129), 0.05), transparent 80%)`,
              }}
            />

            <div className="mb-6 relative z-10">
              <h3 className="font-space text-xl font-bold text-white mb-2">Institute</h3>
              <p className="text-gray-400 text-xs sm:text-sm leading-relaxed min-h-[44px]">
                For schools and educational institutions needing scale.
              </p>
            </div>

            <div className="mb-6 relative z-10">
              <div className="font-space text-5xl font-extrabold text-white">Custom</div>
              <span className="text-gray-500 text-[11px] font-medium mt-2.5 block">
                tailored to your organization
              </span>
            </div>

            <div className="border-t border-dashed border-white/[0.08] my-6 relative z-10" />

            <div className="mb-8 relative z-10">
              <a
                href="mailto:sales@acharya.ai?subject=School%20License%20Inquiry"
                className="w-full inline-flex items-center justify-center py-3 px-6 rounded-full border border-white/10 hover:border-white/20 text-white font-semibold text-xs sm:text-sm transition-all hover:bg-white/[0.02]"
              >
                Contact Sales
              </a>
            </div>

            <ul className="space-y-4 flex-1 relative z-10">
              <li className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-300">
                <span className="text-emerald-400 font-bold select-none shrink-0">✓</span>
                <span className="leading-tight">All Pro features for every user</span>
              </li>
              <li className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-300">
                <span className="text-emerald-400 font-bold select-none shrink-0">✓</span>
                <span className="leading-tight">Unlimited credits globally</span>
              </li>
              <li className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-300">
                <span className="text-emerald-400 font-bold select-none shrink-0">✓</span>
                <span className="leading-tight">Admin dashboard & analytics</span>
              </li>
              <li className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-300">
                <span className="text-emerald-400 font-bold select-none shrink-0">✓</span>
                <span className="leading-tight">Cancel anytime</span>
              </li>
            </ul>
          </div>

        </div>
      </div>
    </section>
  );
}
