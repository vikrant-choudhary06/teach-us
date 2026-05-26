import React from 'react';
import { motion } from 'framer-motion';

const StatItem = ({ end, label, suffix = '' }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-100px' }}
    transition={{ duration: 0.8 }}
    className="text-center"
  >
    <motion.div
      initial={{ scale: 0 }}
      whileInView={{ scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      viewport={{ once: true }}
    >
      <div className="text-5xl lg:text-6xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
        <CountUp end={end} duration={2.5} suffix={suffix} />
      </div>
    </motion.div>
    <p className="text-gray-600 text-lg font-medium">{label}</p>
  </motion.div>
);

export default function StatsSection() {
  const stats = [
    { end: 50000, label: 'Active Teachers', suffix: '+' },
    { end: 500000, label: 'Classes Managed', suffix: '+' },
    { end: 5000000, label: 'Assignments Graded', suffix: '+' },
    { end: 10000000, label: 'Attendance Records', suffix: '+' },
  ];

  return (
    <section className="section-padding bg-gradient-to-b from-white to-indigo-50">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Trusted by Educators Worldwide
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            TeacherHub is helping thousands of educators transform their classrooms
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {stats.map((stat, index) => (
            <StatItem key={index} {...stat} />
          ))}
        </div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-16 pt-12 border-t border-gray-200"
        >
          <p className="text-center text-gray-600 text-sm font-medium mb-6">
            Trusted by leading educational institutions
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
            {[
              'University Partner',
              'Certified Secure',
              'SOC 2 Compliant',
              'GDPR Ready',
            ].map((badge, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-sm text-gray-600 font-medium hover:border-indigo-300 transition-colors cursor-default"
              >
                ✓ {badge}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function CountUp({ end, duration, suffix }) {
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    let start = 0;
    const increment = end / (duration * 1000 / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start > end) start = end;
      setCount(Math.floor(start));
      if (start >= end) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [end, duration]);

  return `${count}${suffix}`;
}
