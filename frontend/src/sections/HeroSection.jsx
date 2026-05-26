import React from 'react';
import { motion } from 'framer-motion';
import { HiArrowRight } from 'react-icons/hi';

export default function HeroSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  };

  const floatingVariants = {
    float: {
      y: [0, -20, 0],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  return (
    <section className="relative pt-32 pb-20 px-4 bg-gradient-to-b from-white via-indigo-50/30 to-white">
      {/* Background blobs — contained within section */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute top-20 right-0 w-72 h-72 sm:w-96 sm:h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute bottom-0 left-0 w-72 h-72 sm:w-96 sm:h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
      </div>

      <div className="container-custom relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
        >
          {/* Left Content */}
          <motion.div variants={itemVariants} className="space-y-8 text-left">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 text-sm font-semibold"
            >
              <span className="w-2 h-2 bg-indigo-600 rounded-full" />
              Trusted by 50,000+ Teachers
            </motion.div>

            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-4">
                Your Complete{' '}
                <span className="gradient-text">Digital Workspace</span> for Teaching
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">
                Manage attendance, grading, lesson planning, and student records from one unified dashboard. Designed for modern educators.
              </p>
            </div>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 pt-4"
            >
              <button className="button-primary flex items-center justify-center gap-2 group">
                Start Free Trial
                <HiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="button-secondary flex items-center justify-center gap-2">
                Watch Demo
              </button>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="pt-4 text-sm text-gray-600"
            >
              <p>✓ No credit card required • ✓ 7-day free trial • ✓ 1,000+ reviews (4.9★)</p>
            </motion.div>
          </motion.div>

          {/* Right Side — Dashboard + feature cards */}
          <motion.div variants={itemVariants} className="relative">
            <motion.div
              variants={floatingVariants}
              animate="float"
              className="w-full"
            >
              <div className="rounded-2xl bg-white shadow-2xl overflow-hidden border border-gray-100">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 h-12 flex items-center px-6">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                </div>

                <div className="p-6 bg-gray-50">
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { label: 'Students', value: '42' },
                        { label: 'Attendance', value: '98%' },
                        { label: 'Avg Grade', value: 'A' },
                      ].map((stat, i) => (
                        <div
                          key={i}
                          className="bg-white p-3 rounded-lg border border-gray-200"
                        >
                          <p className="text-xs text-gray-500">{stat.label}</p>
                          <p className="text-lg font-bold text-gray-900">
                            {stat.value}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="bg-white p-3 rounded-lg border border-gray-200">
                      <div className="text-xs font-semibold text-gray-600 uppercase mb-2">
                        Recent Activity
                      </div>
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between py-1.5 border-b border-gray-100 last:border-0"
                        >
                          <span className="text-xs text-gray-600">
                            Class Attendance Recorded
                          </span>
                          <span className="text-xs font-semibold text-green-600">
                            ✓
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Feature cards — in-flow on mobile, overlaid inside bounds on desktop */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 lg:mt-0 lg:absolute lg:inset-x-0 lg:-bottom-4 lg:grid-cols-2 lg:gap-0 lg:pointer-events-none">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="lg:absolute lg:left-0 lg:bottom-8 lg:w-44 xl:w-48 lg:pointer-events-auto"
              >
                <div className="glass-effect p-4 text-left">
                  <div className="text-2xl mb-2">📊</div>
                  <p className="text-sm font-semibold text-gray-900">
                    Attendance Tracking
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    Real-time class records
                  </p>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity }}
                className="lg:absolute lg:right-0 lg:top-24 lg:w-44 xl:w-48 lg:pointer-events-auto"
              >
                <div className="glass-effect p-4 text-left">
                  <div className="text-2xl mb-2">📋</div>
                  <p className="text-sm font-semibold text-gray-900">
                    Grade Management
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    Organize & analyze grades
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Spacer for absolutely positioned cards on large screens */}
            <div className="hidden lg:block h-16" aria-hidden="true" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
