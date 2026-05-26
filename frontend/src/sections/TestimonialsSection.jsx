import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiChevronLeft, HiChevronRight, HiStar } from 'react-icons/hi';

const TestimonialCard = ({ name, role, content, image, isActive }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{
      opacity: isActive ? 1 : 0.5,
      scale: isActive ? 1 : 0.95,
    }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.4 }}
    className={`rounded-2xl border ${
      isActive
        ? 'border-indigo-300 bg-gradient-to-br from-indigo-50 to-white shadow-xl'
        : 'border-gray-200 bg-white'
    } p-8 transition-all`}
  >
    {/* Rating */}
    <div className="flex gap-1 mb-4">
      {[...Array(5)].map((_, i) => (
        <HiStar
          key={i}
          size={20}
          className="text-yellow-400"
          fill="currentColor"
        />
      ))}
    </div>

    {/* Testimonial Content */}
    <p className="text-lg text-gray-900 font-medium leading-relaxed mb-6">
      "{content}"
    </p>

    {/* Author */}
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
        {image}
      </div>
      <div>
        <p className="font-bold text-gray-900">{name}</p>
        <p className="text-sm text-gray-600">{role}</p>
      </div>
    </div>
  </motion.div>
);

export default function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  const testimonials = [
    {
      name: 'Sarah Mitchell',
      role: 'High School Biology Teacher',
      content:
        'TeacherHub has completely transformed how I manage my classroom. Attendance tracking is seamless, and my students love how organized everything is. I save at least 5 hours per week!',
      image: 'S',
    },
    {
      name: 'James Rodriguez',
      role: 'Middle School Math Teacher',
      content:
        'The grading system is intuitive and the analytics help me identify struggling students immediately. I can now spend more time teaching instead of managing paperwork.',
      image: 'J',
    },
    {
      name: 'Emily Chen',
      role: 'Elementary School Principal',
      content:
        'As a principal, having visibility into all classroom activities through TeacherHub is invaluable. It\'s improved teacher efficiency and student outcomes across the board.',
      image: 'E',
    },
    {
      name: 'Michael Adams',
      role: 'Special Education Coordinator',
      content:
        'The student records feature is incredibly detailed and easy to navigate. It\'s perfect for IEP meetings and parent conferences. Highly recommended!',
      image: 'M',
    },
    {
      name: 'Lisa Thompson',
      role: 'Distance Learning Instructor',
      content:
        'Perfect for virtual and hybrid learning. My students submit assignments online, I grade them, and everyone can see progress in real-time. A game changer!',
      image: 'L',
    },
  ];

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setActiveIndex((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
  };

  return (
    <section
      id="testimonials"
      className="section-padding bg-gradient-to-b from-white to-indigo-50"
    >
      <div className="container-custom">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-2 rounded-full bg-yellow-100 text-yellow-700 text-sm font-semibold mb-4"
          >
            Trusted by Teachers
          </motion.span>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Loved by Educators Everywhere
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join thousands of teachers who are saving time and improving student outcomes
          </p>
        </motion.div>

        {/* Testimonials Carousel */}
        <div className="max-w-4xl mx-auto mb-12">
          <AnimatePresence mode="wait">
            <div key={activeIndex} className="mb-8">
              <TestimonialCard
                {...testimonials[activeIndex]}
                isActive={true}
              />
            </div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            {/* Dots */}
            <div className="flex gap-2 flex-1">
              {testimonials.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.95 }}
                  className={`h-2 rounded-full transition-colors ${
                    index === activeIndex ? 'bg-indigo-600 w-8' : 'bg-gray-300 w-2'
                  }`}
                />
              ))}
            </div>

            {/* Arrow Buttons */}
            <div className="flex gap-4 ml-6">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={prevSlide}
                className="p-3 rounded-full bg-gray-100 hover:bg-indigo-100 text-gray-700 hover:text-indigo-600 transition-colors"
              >
                <HiChevronLeft size={24} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={nextSlide}
                className="p-3 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
              >
                <HiChevronRight size={24} />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="border-t border-gray-200 pt-12 grid grid-cols-3 gap-8 text-center"
        >
          {[
            { label: '4.9★', desc: 'Average Rating' },
            { label: '1,000+', desc: 'Reviews' },
            { label: '98%', desc: 'Satisfaction' },
          ].map((stat, i) => (
            <div key={i}>
              <p className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {stat.label}
              </p>
              <p className="text-gray-600 text-sm mt-1">{stat.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
