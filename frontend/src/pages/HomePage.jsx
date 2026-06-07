import React from 'react'
import Navbar from '../components/Navbar'
import HeroSection from '../sections/HeroSection'
import FeaturesSection from '../sections/FeaturesSection'
import PricingSection from '../sections/PricingSection'
import TestimonialsSection from '../sections/TestimonialsSection'
import NewsletterSection from '../sections/NewsletterSection'
import Footer from '../sections/Footer'

export default function HomePage() {
  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-brand-cream relative">
      <Navbar />

      {/* Viewport App Frame containing Hero Dashboard mockup */}
      <div className="px-2 py-4 sm:px-4 sm:py-6 bg-brand-cream">
        <div className="relative rounded-2xl border border-brand-forest/10 bg-gradient-to-b from-white via-white to-brand-sage/20 overflow-hidden shadow-xl">
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
