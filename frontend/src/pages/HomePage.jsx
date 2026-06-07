import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import HeroSection from '../sections/HeroSection'
import FeaturesSection from '../sections/FeaturesSection'
import PricingSection from '../sections/PricingSection'
import TestimonialsSection from '../sections/TestimonialsSection'
import NewsletterSection from '../sections/NewsletterSection'
import Footer from '../sections/Footer'

export default function HomePage() {
  const [colorTheme, setColorTheme] = useState('fresh')

  useEffect(() => {
    const savedTheme = localStorage.getItem('colorTheme')
    if (savedTheme) {
      setColorTheme(savedTheme)
    }
  }, [])

  return (
    <div className={`min-h-screen w-full overflow-x-hidden bg-black relative theme-${colorTheme}`}>
      <Navbar />

      {/* Viewport App Frame containing Hero Dashboard mockup */}
      <div className="px-2 py-4 sm:px-4 sm:py-6 bg-black">
        <div className="relative rounded-2xl border border-white/[0.08] bg-gradient-to-b from-[#09090a] via-[#09090a]/95 to-[var(--theme-dark-accent,#021c0e)] overflow-hidden shadow-2xl">
          <HeroSection />
        </div>
      </div>

      <FeaturesSection />
      <PricingSection />
      {/* <TestimonialsSection /> */}
      <NewsletterSection />
      <Footer />
    </div>
  )
}
