import React from 'react';
import { motion } from 'framer-motion';
import { HiArrowRight } from 'react-icons/hi';

const StepCard = ({ step, title, description, icon, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-50px' }}
    transition={{ duration: 0.6, delay: index * 0.1 }}
    className="h-full"
  >
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.01] p-8 hover:border-emerald-500/30 hover:bg-white/[0.02] transition-all h-full">
      <div className="flex items-center gap-4 mb-4">
        <motion.div
          whileHover={{ scale: 1.1 }}
          className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-emerald-600 to-green-500 flex items-center justify-center text-white font-bold text-lg shadow-lg"
        >
          {step}
        </motion.div>
        <div className="text-3xl">{icon}</div>
      </div>
      <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
    </div>
  </motion.div>
);

export default function HowItWorksSection() {
  const steps = [
    {
      step: 1,
      title: 'Create Your Classes',
      description:
        'Set up your classes in minutes. Add students, customize class settings, and organize your teaching workspace.',
      icon: '📚',
    },
    {
      step: 2,
      title: 'Manage Students',
      description:
        'Import or manually add students. Maintain detailed profiles, contact information, and academic records.',
      icon: '👥',
    },
    {
      step: 3,
      title: 'Track Attendance',
      description:
        'Record attendance quickly with our intuitive interface. Get automated reports and insights.',
      icon: '✓',
    },
    {
      step: 4,
      title: 'Plan & Execute',
      description:
        'Organize lessons, assignments, and resources. Share with students and track completion.',
      icon: '📋',
    },
    {
      step: 5,
      title: 'Grade & Analyze',
      description:
        'Input grades, generate reports, and analyze student performance with visual analytics.',
      icon: '📊',
    },
    {
      step: 6,
      title: 'Collaborate & Improve',
      description:
        'Share insights with parents, colleagues, and administrators. Continuously improve your teaching.',
      icon: '🎯',
    },
  ];

  return (
    <section
      id="how-it-works"
      className="section-padding bg-black relative overflow-hidden"
    >
      {/* Background Glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute top-[20%] right-[-10%] w-[400px] h-[400px] bg-emerald-600/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-[20%] left-[-10%] w-[400px] h-[400px] bg-green-600/5 rounded-full blur-[100px]" />
      </div>

      <div className="container-custom relative z-10">
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
            className="inline-block px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-4"
          >
            Simple Process
          </motion.span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            How techUs Works
          </h2>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto">
            Get started in minutes and start transforming your classroom today
          </p>
        </motion.div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-2">
          {steps.map((step, index) => (
            <StepCard key={index} index={index} {...step} />
          ))}
        </div>

        {/* Timeline Visualization */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-24 pt-12 border-t border-white/[0.08]"
        >
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-12 text-center">
              Your Success Timeline
            </h3>

            <div className="space-y-8">
              {[
                {
                  time: 'Day 1',
                  event: 'Setup & First Login',
                  desc: 'Create account and configure your first class',
                },
                {
                  time: 'Day 1-3',
                  event: 'Student Enrollment',
                  desc: 'Add students and set up class groups',
                },
                {
                  time: 'Week 1',
                  event: 'Daily Operations',
                  desc: 'Track attendance and manage grades',
                },
                {
                  time: 'Week 2+',
                  event: 'Full Optimization',
                  desc: 'Leverage advanced features and analytics',
                },
              ].map((milestone, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="flex gap-6 items-start"
                >
                  <div className="flex-shrink-0">
                    <motion.div
                      whileHover={{ scale: 1.2 }}
                      className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-600 to-green-500 flex items-center justify-center text-white font-bold"
                    >
                      {i + 1}
                    </motion.div>
                  </div>
                  <div className="flex-grow">
                    <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wide mb-1">
                      {milestone.time}
                    </h4>
                    <p className="text-lg font-semibold text-white">
                      {milestone.event}
                    </p>
                    <p className="text-gray-400 text-sm mt-1">{milestone.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
