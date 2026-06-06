import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HiOutlineX, HiOutlineChevronLeft, HiOutlineChevronRight, HiOutlineSparkles } from 'react-icons/hi'

const tourSteps = [
  {
    target: '[data-tour="dashboard-title"]',
    title: 'Welcome to Acharya AI! 🚀',
    content: 'Welcome to your premium teaching workspace. Let\'s do a walkthrough of our most powerful interactive feature: the Live Flight Deck!',
    placement: 'bottom'
  },
  {
    target: '[data-tour="nav-flight-deck"]',
    title: 'Live Flight Deck 📡',
    content: 'This is the command center of your live classroom. Let\'s switch to it to inspect how it works.',
    placement: 'right'
  },
  {
    target: '[data-tour="flight-deck-presentation"]',
    title: 'Lecture Slides & Whiteboard 🎨',
    content: 'Drag & drop lecture PDFs directly here to display slides, or switch to the Interactive Canvas to draw and write notes in real-time.',
    placement: 'right'
  },
  {
    target: '[data-tour="flight-deck-seating"]',
    title: 'Interactive Seating Grid 🪑',
    content: 'Monitor student screens and focus status live. desks show green for focused, amber for distracted, and flash red when a student has a doubt.',
    placement: 'left'
  },
  {
    target: '[data-tour="flight-deck-add-student"]',
    title: 'Classroom Enrollment 🧑‍🎓',
    content: 'Enrolling new students to your active live class is simple. Click this button to enter their name and email details.',
    placement: 'left'
  },
  {
    target: '[data-tour="nav-overview"]',
    title: 'Sleek Sidebar Navigation 🧭',
    content: 'Use this sidebar to jump back to the Dashboard, generate lesson plans, or check your daily credits.',
    placement: 'right'
  }
]

export default function TourGuide({ startTrigger, onComplete, onStepChange }) {
  const [currentStep, setCurrentStep] = useState(-1)
  const [targetRect, setTargetRect] = useState(null)
  const [isFallback, setIsFallback] = useState(false)
  const tooltipRef = useRef(null)

  // Notify parent component on step change
  useEffect(() => {
    if (currentStep >= 0 && onStepChange) {
      onStepChange(currentStep)
    }
  }, [currentStep, onStepChange])

  // Start the tour
  useEffect(() => {
    if (startTrigger > 0) {
      setCurrentStep(0)
    } else {
      const hasSeen = localStorage.getItem('hasSeenTour')
      if (!hasSeen) {
        // Delay slightly for initial page animations
        const timer = setTimeout(() => {
          setCurrentStep(0)
        }, 1200)
        return () => clearTimeout(timer)
      }
    }
  }, [startTrigger])

  // Recalculate spotlight highlight and tooltip placement
  const updatePosition = () => {
    if (currentStep < 0 || currentStep >= tourSteps.length) {
      setTargetRect(null)
      return
    }

    const step = tourSteps[currentStep]
    const el = document.querySelector(step.target)

    if (el) {
      const rect = el.getBoundingClientRect()
      // Check if element is visible on screen
      if (rect.width > 0 && rect.height > 0) {
        setTargetRect(rect)
        setIsFallback(false)
        return
      }
    }
    
    // Target not found or hidden: fallback to centered modal mode
    setTargetRect(null)
    setIsFallback(true)
  }

  useEffect(() => {
    updatePosition()
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [currentStep])

  if (currentStep < 0 || currentStep >= tourSteps.length) return null

  const step = tourSteps[currentStep]

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(prev => prev + 1)
    } else {
      handleEnd()
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleEnd = () => {
    setCurrentStep(-1)
    localStorage.setItem('hasSeenTour', 'true')
    if (onComplete) onComplete()
  }

  // Spotlight layout overlay panels (top, bottom, left, right)
  const renderOverlayMask = () => {
    if (!targetRect || isFallback) {
      return (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-[2px] z-[9998] transition-opacity duration-300"
          onClick={handleEnd}
        />
      )
    }

    const padding = 6
    const top = targetRect.top - padding
    const left = targetRect.left - padding
    const width = targetRect.width + padding * 2
    const height = targetRect.height + padding * 2
    const bottom = top + height
    const right = left + width

    return (
      <div className="fixed inset-0 pointer-events-none z-[9998]">
        {/* Top mask */}
        <div className="absolute top-0 left-0 right-0 bg-black/75 pointer-events-auto" style={{ height: `${Math.max(0, top)}px` }} />
        {/* Bottom mask */}
        <div className="absolute left-0 right-0 bottom-0 bg-black/75 pointer-events-auto" style={{ top: `${bottom}px` }} />
        {/* Left mask */}
        <div className="absolute left-0 bg-black/75 pointer-events-auto" style={{ top: `${top}px`, height: `${height}px`, width: `${Math.max(0, left)}px` }} />
        {/* Right mask */}
        <div className="absolute right-0 bg-black/75 pointer-events-auto" style={{ top: `${top}px`, height: `${height}px`, left: `${right}px` }} />
        
        {/* Glowing highlight ring */}
        <div 
          className="absolute border-2 border-emerald-400 rounded-xl pointer-events-auto"
          style={{
            top: `${top}px`,
            left: `${left}px`,
            width: `${width}px`,
            height: `${height}px`,
            boxShadow: '0 0 15px rgba(52, 211, 153, 0.4), inset 0 0 8px rgba(52, 211, 153, 0.2)',
            transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        />
      </div>
    )
  }

  // Calculate tooltip popover positioning
  const getTooltipStyle = () => {
    if (!targetRect || isFallback) {
      return {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '320px'
      }
    }

    const padding = 6
    const spacing = 12
    const top = targetRect.top - padding
    const left = targetRect.left - padding
    const width = targetRect.width + padding * 2
    const height = targetRect.height + padding * 2

    let style = {
      position: 'absolute',
      width: '300px'
    }

    if (step.placement === 'right') {
      style.left = `${left + width + spacing}px`
      style.top = `${top + height / 2 - 100}px` // centered vertically with step card offset
    } else if (step.placement === 'top') {
      style.left = `${left + width / 2 - 150}px`
      style.top = `${top - 200}px` // positioned above
    } else if (step.placement === 'bottom') {
      style.left = `${left + width / 2 - 150}px`
      style.top = `${top + height + spacing}px`
    }

    // Keep it on the screen horizontally
    const tooltipWidth = 300
    if (parseFloat(style.left) < 10) {
      style.left = '10px'
    } else if (parseFloat(style.left) + tooltipWidth > window.innerWidth - 10) {
      style.left = `${window.innerWidth - tooltipWidth - 10}px`
    }

    // Keep it on the screen vertically
    if (parseFloat(style.top) < 10) {
      style.top = '10px'
    }

    return style
  }

  return (
    <>
      {/* Dimmed spotlight masks */}
      {renderOverlayMask()}

      {/* Floating step tooltip */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          ref={tooltipRef}
          initial={{ opacity: 0, scale: 0.92, y: isFallback ? -20 : 0 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92 }}
          transition={{ type: 'spring', stiffness: 350, damping: 26 }}
          style={getTooltipStyle()}
          className="bg-[#0b120e]/80 border border-emerald-500/30 backdrop-blur-xl rounded-2xl p-5 z-[9999] shadow-[0_15px_45px_rgba(0,0,0,0.9),_0_0_20px_rgba(16,185,129,0.1)] text-left flex flex-col font-sans"
        >
          {/* Header */}
          <div className="flex justify-between items-start gap-4 mb-3">
            <span className="text-xs font-black tracking-widest text-emerald-400 font-space uppercase flex items-center gap-1.5">
              <HiOutlineSparkles className="animate-pulse" />
              <span>Workspace Tour</span>
            </span>
            <button 
              onClick={handleEnd}
              className="text-gray-400 hover:text-white transition-colors"
              title="Close Tour"
            >
              <HiOutlineX size={16} />
            </button>
          </div>

          {/* Title & Body */}
          <h4 className="text-base font-extrabold text-white font-space mb-2">
            {step.title}
          </h4>
          <p className="text-xs sm:text-sm text-gray-300 font-medium leading-relaxed mb-6">
            {step.content}
          </p>

          {/* Controls Footer */}
          <div className="flex items-center justify-between mt-auto">
            {/* Step indicators */}
            <div className="text-[10px] font-bold text-gray-500 font-space tracking-wider">
              {currentStep + 1} / {tourSteps.length}
            </div>

            {/* Navigation buttons */}
            <div className="flex gap-2.5">
              {currentStep > 0 && (
                <button
                  onClick={handleBack}
                  className="px-2.5 py-1.5 rounded-lg border border-white/10 hover:bg-white/5 text-gray-300 hover:text-white transition-all text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <HiOutlineChevronLeft size={14} />
                  <span>Back</span>
                </button>
              )}
              <button
                onClick={handleNext}
                className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 text-black font-extrabold text-xs flex items-center gap-1 shadow-lg shadow-emerald-500/25 transition-all cursor-pointer"
              >
                <span>{currentStep === tourSteps.length - 1 ? 'Finish' : 'Next'}</span>
                <HiOutlineChevronRight size={14} />
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </>
  )
}
