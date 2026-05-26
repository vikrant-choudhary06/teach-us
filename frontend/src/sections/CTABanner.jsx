import React from 'react';
import { motion } from 'framer-motion';
import { HiArrowRight } from 'react-icons/hi';

export default function CTABanner() {
  return (
    <section className="section-padding">
      <div className="container-custom relative">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-600 px-8 py-16 md:px-16 md:py-24 relative overflow-hidden"
        >
          {/* Animated Background Elements */}
          <motion.div
            animate={{ opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-48 -mt-48 blur-3xl"
          ></motion.div>
          <motion.div
            animate={{ opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 5, repeat: Infinity }}
            className="absolute bottom-0 left-0 w-80 h-80 bg-white/10 rounded-full -ml-40 -mb-40 blur-3xl"
          ></motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative z-10 text-center max-w-3xl mx-auto"
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-block px-4 py-2 rounded-full bg-white/20 text-white text-sm font-semibold mb-6 backdrop-blur-sm border border-white/30"
            >
              🚀 Limited Time Offer
            </motion.span>

            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              Start Managing Your Classroom Smarter Today
            </h2>

            <p className="text-xl text-white/90 mb-12 leading-relaxed">
              Join thousands of educators who've transformed their classrooms with TeacherHub. Get started free for 7 days, no credit card required.
            </p>

            {/* Features List */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-12 flex flex-col sm:flex-row justify-center gap-6 text-sm text-white font-medium"
            >
              {[
                '✓ 7-day free trial',
                '✓ No credit card needed',
                '✓ Cancel anytime',
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  whileHover={{ x: 5 }}
                  className="inline-flex items-center gap-2"
                >
                  <span>{feature}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 rounded-lg bg-white text-indigo-600 font-bold hover:bg-gray-50 transition-colors shadow-lg flex items-center justify-center gap-2 group text-lg"
              >
                Get Started Free
                <HiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 rounded-lg bg-white/20 text-white font-bold hover:bg-white/30 transition-colors border border-white/30 backdrop-blur-sm text-lg"
              >
                Schedule Demo
              </motion.button>
            </motion.div>

            {/* Bottom Text */}
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-8 text-sm text-white/70"
            >
              ⭐ Trusted by 50,000+ teachers • 4.9 star rating on all platforms
            </motion.p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
