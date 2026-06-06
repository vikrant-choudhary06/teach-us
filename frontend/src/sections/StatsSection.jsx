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
      <div className="text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent mb-2">
        <CountUp end={end} duration={2.5} suffix={suffix} />
      </div>
    </motion.div>
    <p className="text-gray-400 text-base font-medium">{label}</p>
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
    <section className="section-padding bg-black relative overflow-hidden">
      {/* Glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute top-[20%] right-[-10%] w-[350px] h-[350px] bg-emerald-600/5 rounded-full blur-[100px]" />
      </div>

      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Trusted by Educators Worldwide
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            techUs is helping thousands of educators transform their classrooms
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
          className="mt-20 pt-12 border-t border-white/[0.08]"
        >
          <p className="text-center text-gray-400 text-sm font-medium mb-6">
            Trusted by leading educational institutions
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
            {[
              'University Partner',
              'Certified Secure',
              'SOC 2 Compliant',
              'GDPR Ready',
            ].map((badge, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                className="px-4 py-2 rounded-xl bg-white/[0.02] border border-white/[0.08] text-sm text-gray-300 font-medium hover:border-emerald-500/30 hover:bg-white/[0.04] transition-all cursor-default"
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

  return `${count.toLocaleString()}${suffix}`;
}
