import Navbar from '../components/Navbar'
import HeroSection from '../sections/HeroSection'
import StatsSection from '../sections/StatsSection'
import FeaturesSection from '../sections/FeaturesSection'
import DashboardPreview from '../sections/DashboardPreview'
import HowItWorksSection from '../sections/HowItWorksSection'
import TestimonialsSection from '../sections/TestimonialsSection'
import CTABanner from '../sections/CTABanner'
import Footer from '../sections/Footer'

export default function HomePage() {
  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <DashboardPreview />
      <HowItWorksSection />
      <TestimonialsSection />
      <CTABanner />
      <Footer />
    </div>
  )
}
