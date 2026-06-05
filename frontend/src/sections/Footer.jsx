import React from 'react';

const BookIcon = () => (
  <svg
    className="w-5 h-5 text-[var(--color-emerald-400)] shrink-0 select-none pointer-events-none"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
    />
  </svg>
);

const PhoneIcon = () => (
  <svg className="w-4 h-4 text-[var(--color-emerald-400)] shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 0 1 2-2h3.28a1 1 0 0 1 .94.725l.548 2.2a1 1 0 0 1-.321.988l-1.305.98a10.582 10.582 0 0 0 4.872 4.872l.98-1.305a1 1 0 0 1 .988-.321l2.2.548a1 1 0 0 1 .725.94V19a2 2 0 0 1-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

const PinIcon = () => (
  <svg className="w-4 h-4 text-[var(--color-emerald-400)] shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 0 1-2.827 0l-4.244-4.243a8 8 0 1 1 11.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
  </svg>
);

const MailIcon = () => (
  <svg className="w-4 h-4 text-[var(--color-emerald-400)] shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 0 0 2.22 0L21 8M5 19h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z" />
  </svg>
);

export default function Footer() {
  const supportLinks = [
    { label: 'About Us', href: '#' },
    { label: 'Contact', href: '#' },
    { label: 'FAQ', href: '#' },
    { label: 'Partner with Us', href: '#' },
  ];

  const policyLinks = [
    { label: 'Terms of Service', href: '#' },
    { label: 'Privacy Policy', href: '#' },
  ];

  const discoverLinks = [
    { label: 'Features', href: '#features' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Careers', href: '#' },
  ];

  return (
    <footer className="bg-black text-white border-t border-white/[0.04] pt-20 pb-8 select-none">
      <div className="container-custom px-4 max-w-6xl mx-auto">
        {/* Main Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-10 md:gap-12 pb-14">
          
          {/* Column 1: Brand Info */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <BookIcon />
              <span className="text-lg font-bold tracking-tight text-white">
                Acharya AI
              </span>
            </div>
            <p className="text-gray-400 text-xs sm:text-sm leading-relaxed max-w-xs">
              Empowering Indian educators with the power of AI to transform classrooms across the nation.
            </p>
            {/* Social outlines - directly next to each other, no circles */}
            <div className="flex gap-4 mt-2">
              <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="Social Link 1">
                <svg className="w-5 h-5 fill-none stroke-current" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="Social Link 2">
                <svg className="w-5 h-5 fill-none stroke-current" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Support */}
          <div>
            <h4 className="font-semibold text-[11px] sm:text-xs tracking-wider uppercase text-gray-400 mb-5">Support</h4>
            <ul className="space-y-3">
              {supportLinks.map((link, idx) => (
                <li key={idx}>
                  <a href={link.href} className="text-gray-400 hover:text-white text-xs sm:text-sm transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Policy */}
          <div>
            <h4 className="font-semibold text-[11px] sm:text-xs tracking-wider uppercase text-gray-400 mb-5">Policy</h4>
            <ul className="space-y-3">
              {policyLinks.map((link, idx) => (
                <li key={idx}>
                  <a href={link.href} className="text-gray-400 hover:text-white text-xs sm:text-sm transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Discover */}
          <div>
            <h4 className="font-semibold text-[11px] sm:text-xs tracking-wider uppercase text-gray-400 mb-5">Discover</h4>
            <ul className="space-y-3">
              {discoverLinks.map((link, idx) => (
                <li key={idx}>
                  <a href={link.href} className="text-gray-400 hover:text-white text-xs sm:text-sm transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 5: Contact */}
          <div>
            <h4 className="font-semibold text-[11px] sm:text-xs tracking-wider uppercase text-gray-400 mb-5">Contact</h4>
            <ul className="space-y-3.5">
              <li className="flex items-start gap-2 text-xs sm:text-sm text-gray-400">
                <PhoneIcon />
                <a href="tel:+919719205268" className="hover:text-white transition-colors">
                  +91 9719205268
                </a>
              </li>
              <li className="flex items-start gap-2 text-xs sm:text-sm text-gray-400">
                <PinIcon />
                <span>Uttar Pradesh, India</span>
              </li>
              <li className="flex items-start gap-2 text-xs sm:text-sm text-gray-400">
                <MailIcon />
                <a href="mailto:info@acharya.ai" className="hover:text-white transition-colors break-all">
                  info@acharya.ai
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Faint Background Watermark Text */}
        <div className="border-t border-b border-white/[0.08] my-10 sm:my-14">
          <div className="text-center font-space text-[2.5rem] sm:text-[5rem] lg:text-[7rem] xl:text-[8.5rem] font-black tracking-[0.15em] text-white/[0.07] uppercase select-none pointer-events-none leading-none whitespace-nowrap w-full py-6 sm:py-8">
            ACHARYA AI
          </div>
        </div>

        {/* Copyright & Credits Bar */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-500 border-t border-white/[0.04]">
          <p>© 2026 Acharya AI. All rights reserved.</p>
          <p>
            Built by <span className="text-white font-semibold">ARNAY, RUSHALI</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
