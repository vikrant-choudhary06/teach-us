import React from 'react';
import { motion } from 'framer-motion';

const HeartIcon = () => (
  <svg
    className="w-3.5 h-3.5 mr-1.5 text-brand-forest select-none pointer-events-none"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4.318 6.318a4.5 4.5 0 0 0 0 6.364L12 20.364l7.682-7.682a4.5 4.5 0 0 0-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 0 0-6.364 0z"
    />
  </svg>
);

const ClockIcon = () => (
  <svg
    className="w-5.5 h-5.5 text-brand-forest"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
  </svg>
);

const WatermarkClock = () => (
  <svg
    className="w-full h-full text-brand-forest/[0.03]"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
  </svg>
);

const StarRating = () => (
  <div className="flex gap-1 mb-3 text-amber-500">
    {Array.from({ length: 5 }).map((_, i) => (
      <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 0 0 .95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 0 0-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 0 0-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 0 0-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 0 0 .951-.69l1.07-3.292z" />
      </svg>
    ))}
  </div>
);

const TestimonialCard = ({ item }) => (
  <div className="w-[300px] sm:w-[360px] shrink-0 relative rounded-[2rem] border border-brand-forest/10 bg-white p-6 sm:p-7 flex flex-col gap-4 hover:border-brand-forest/20 shadow-sm hover:shadow-md transition-all duration-300 select-none">
    {/* 5-Star Rating */}
    <StarRating />

    {/* Quote */}
    <p className="text-brand-text-muted text-xs sm:text-sm leading-relaxed italic min-h-[64px]">
      {item.quote}
    </p>

    {/* Author Info */}
    <div className="flex items-center gap-3.5 mt-2">
      <img
        src={item.avatar}
        alt={item.name}
        className="w-10 h-10 rounded-full object-cover border border-brand-forest/10 shrink-0"
        loading="lazy"
      />
      <div>
        <h4 className="font-semibold text-brand-forest text-xs sm:text-sm leading-tight">
          {item.name}
        </h4>
        <p className="text-brand-text-muted/80 text-[10px] sm:text-xs mt-0.5">
          {item.role}
        </p>
      </div>
    </div>
  </div>
);

export default function TestimonialsSection() {
  const row1Testimonials = [
    {
      quote: '"The Math Helper tool generates incredible word problems that relate to Indian contexts. My students are far more engaged than ever before."',
      name: 'Rahul Verma',
      role: 'Math Teacher, St. Xavier\'s',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120&h=120',
    },
    {
      quote: '"It evaluates open-ended answers with such precision. This is the first AI tool I\'ve seen that actually understands the CBSE grading rubric."',
      name: 'Sunita Kulkarni',
      role: 'History Teacher, Kendriya Vidyalaya',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120&h=120',
    },
    {
      quote: '"The ability to generate content in regional languages is what sets techUs apart. My students feel more connected to the material."',
      name: 'Amit Patel',
      role: 'Science Teacher, Delhi Public School',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120&h=120',
    },
  ];

  const row2Testimonials = [
    {
      quote: '"The Story Generator saves me hours of writing custom comprehension passages. The kids love the Indian mythology themes I can incorporate so easily."',
      name: 'Priya Sharma',
      role: 'English Teacher, DAV Public School',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=120&h=120',
    },
    {
      quote: '"Creating custom rubrics for our lab reports used to take all Sunday. With techUs, I get detailed grading templates in seconds."',
      name: 'Vikram Sengupta',
      role: 'Physics Teacher, Birla High School',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=120&h=120',
    },
    {
      quote: '"The quiz generator is a lifesaver. I can create multiple versions of formative tests for my classes in under two minutes!"',
      name: 'Deepa Nair',
      role: 'Primary Teacher, Chinmaya Vidyalaya',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120&h=120',
    },
  ];

  // Double the arrays for infinite marquee scrolling
  const doubleRow1 = [...row1Testimonials, ...row1Testimonials];
  const doubleRow2 = [...row2Testimonials, ...row2Testimonials];

  return (
    <section id="testimonials" className="py-24 sm:py-32 bg-brand-cream relative overflow-hidden border-t border-brand-forest/10">
      
      {/* CSS Animations for Horizontal Marquee scrolling */}
      <style>{`
        @keyframes scrollLeft {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes scrollRight {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .animate-scroll-left {
          display: flex;
          width: max-content;
          animation: scrollLeft 35s linear infinite;
        }
        .animate-scroll-right {
          display: flex;
          width: max-content;
          animation: scrollRight 35s linear infinite;
        }
        .animate-scroll-left:hover,
        .animate-scroll-right:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* Decorative Blur Glow background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute top-[25%] left-[-10%] w-[350px] h-[350px] bg-brand-sage/40 rounded-full blur-[110px]" />
        <div className="absolute bottom-[25%] right-[-10%] w-[350px] h-[350px] bg-brand-sage/20 rounded-full blur-[110px]" />
      </div>

      <div className="relative z-10 w-full">
        {/* Centered Header */}
        <div className="text-center mb-12 px-4 max-w-3xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center px-4 py-1.5 rounded-full border border-brand-forest/15 bg-brand-sage/60 text-brand-forest text-xs font-bold mb-5"
          >
            <HeartIcon /> User Stories
          </motion.div>

          {/* Headline */}
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-space text-4xl sm:text-5xl font-bold text-brand-forest leading-tight mb-4"
          >
            Real impact in <span className="text-emerald-700">classrooms.</span>
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-brand-text-muted text-sm sm:text-base leading-relaxed max-w-xl mx-auto"
          >
            See how techUs is helping teachers across India reclaim their weekends and spark joy in learning.
          </motion.p>
        </div>

        {/* Center Horizontal Metric Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="relative max-w-sm sm:max-w-md mx-auto rounded-2xl border border-brand-forest/10 bg-white px-5 py-4 flex items-center gap-4 overflow-hidden shadow-md mb-16 mx-4"
        >
          {/* Watermark Clock */}
          <div className="absolute -right-2 -bottom-2 w-20 h-20 pointer-events-none select-none">
            <WatermarkClock />
          </div>
          {/* Clock Icon container */}
          <div className="w-10 h-10 rounded-lg bg-brand-sage border border-brand-forest/15 flex items-center justify-center text-brand-forest shrink-0">
            <ClockIcon />
          </div>
          <div>
            <div className="font-space text-xl sm:text-2xl font-bold text-brand-forest leading-tight">
              10,000+ Hours Saved
            </div>
            <p className="text-brand-text-muted text-xs font-semibold">
              Monthly classroom time reclaimed by educators
            </p>
          </div>
        </motion.div>

        {/* Horizontal Marquee Container */}
        <div className="relative w-full overflow-hidden flex flex-col gap-6 py-4">
          
          {/* Left fading edge mask */}
          <div className="absolute top-0 bottom-0 left-0 w-16 sm:w-36 bg-gradient-to-r from-brand-cream to-transparent pointer-events-none z-20" />
          {/* Right fading edge mask */}
          <div className="absolute top-0 bottom-0 right-0 w-16 sm:w-36 bg-gradient-to-l from-brand-cream to-transparent pointer-events-none z-20" />

          {/* Row 1: Scrolling Left */}
          <div className="overflow-hidden flex w-full">
            <div className="animate-scroll-left gap-6 px-3">
              {doubleRow1.map((item, idx) => (
                <TestimonialCard key={`row1-${idx}`} item={item} />
              ))}
            </div>
          </div>

          {/* Row 2: Scrolling Right */}
          <div className="overflow-hidden flex w-full">
            <div className="animate-scroll-right gap-6 px-3">
              {doubleRow2.map((item, idx) => (
                <TestimonialCard key={`row2-${idx}`} item={item} />
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
