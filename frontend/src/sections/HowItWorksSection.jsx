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
    <div className="rounded-2xl border border-gray-200 bg-white p-8 hover:border-indigo-300 transition-colors h-full">
      <div className="flex items-center gap-4 mb-4">
        <motion.div
          whileHover={{ scale: 1.1 }}
          className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg"
        >
          {step}
        </motion.div>
        <div className="text-3xl">{icon}</div>
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
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
      className="section-padding bg-gradient-to-b from-white via-purple-50 to-white"
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
            className="inline-block px-4 py-2 rounded-full bg-purple-100 text-purple-700 text-sm font-semibold mb-4"
          >
            Simple Process
          </motion.span>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            How TeacherHub Works
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
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
          className="mt-20 pt-12 border-t border-gray-200"
        >
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-12 text-center">
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
                      className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold"
                    >
                      {i + 1}
                    </motion.div>
                  </div>
                  <div className="flex-grow">
                    <h4 className="text-sm font-bold text-indigo-600 uppercase tracking-wide mb-1">
                      {milestone.time}
                    </h4>
                    <p className="text-lg font-semibold text-gray-900">
                      {milestone.event}
                    </p>
                    <p className="text-gray-600 mt-1">{milestone.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-16 text-center"
        >
          <button className="button-primary inline-flex items-center gap-2 group">
            Start Your Free Trial
            <HiArrowRight className="group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
