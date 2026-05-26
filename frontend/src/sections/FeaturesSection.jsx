import React from 'react';
import { motion } from 'framer-motion';
import {
  HiCheckCircle,
  HiChartBar,
  HiBookOpen,
  HiUserGroup,
  HiCalendar,
  HiSparkles,
} from 'react-icons/hi';

const FeatureCard = ({ icon: Icon, title, description, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-50px' }}
    transition={{ duration: 0.6, delay: index * 0.1 }}
    whileHover={{ y: -10, transition: { duration: 0.3 } }}
    className="group"
  >
    <div className="h-full rounded-2xl border border-gray-200 bg-white p-8 transition-all duration-300 hover:border-indigo-300 hover:shadow-xl hover:bg-gradient-to-br hover:from-indigo-50 hover:to-white">
      {/* Icon Container */}
      <motion.div
        whileHover={{ scale: 1.1, rotate: 10 }}
        transition={{ duration: 0.3 }}
        className="mb-6 inline-flex p-4 rounded-xl bg-indigo-100 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors"
      >
        <Icon size={32} />
      </motion.div>

      {/* Content */}
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>

      {/* Bottom Border Animation */}
      <motion.div
        className="mt-6 h-1 w-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full"
        initial={{ width: 0 }}
        whileInView={{ width: 48 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: index * 0.1 + 0.3 }}
      ></motion.div>
    </div>
  </motion.div>
);

export default function FeaturesSection() {
  const features = [
    {
      icon: HiCheckCircle,
      title: 'Attendance Tracking',
      description:
        'Record and manage student attendance in real-time. Get instant insights and automatic reports.',
    },
    {
      icon: HiChartBar,
      title: 'Gradebook Management',
      description:
        'Organize grades, track progress, and create comprehensive performance reports effortlessly.',
    },
    {
      icon: HiBookOpen,
      title: 'Lesson Planning',
      description:
        'Plan lessons efficiently with built-in templates, resources, and collaboration tools.',
    },
    {
      icon: HiUserGroup,
      title: 'Student Records',
      description:
        'Maintain detailed student profiles, contact information, and academic history in one place.',
    },
    {
      icon: HiCalendar,
      title: 'Class Scheduling',
      description:
        'Manage complex schedules, assignments, and deadlines with visual calendar integration.',
    },
    {
      icon: HiSparkles,
      title: 'Analytics Dashboard',
      description:
        'Get actionable insights with powerful analytics and customizable performance metrics.',
    },
  ];

  return (
    <section id="features" className="section-padding bg-white">
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
            className="inline-block px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 text-sm font-semibold mb-4"
          >
            Powerful Features
          </motion.span>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Everything You Need to Manage Your Classroom
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive tools designed to simplify your teaching workflow and help students succeed
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} index={index} {...feature} />
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <p className="text-lg text-gray-600 mb-6">
            Ready to transform your classroom?
          </p>
          <button className="button-primary inline-flex items-center gap-2">
            Explore All Features →
          </button>
        </motion.div>
      </div>
    </section>
  );
}
