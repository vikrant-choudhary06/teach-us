import React from 'react';
import { motion } from 'framer-motion';
import { HiArrowRight } from 'react-icons/hi';
import { Link } from 'react-router-dom';

export default function CTABanner() {
  return (
    <section className="section-padding bg-black">
      <div className="container-custom relative">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="rounded-3xl bg-gradient-to-br from-[#0c1c13] via-[#05140c] to-[#0c1c13] px-8 py-16 md:px-16 md:py-24 border border-white/[0.08] relative overflow-hidden shadow-2xl"
        >
          {/* Animated Background Elements */}
          <motion.div
            animate={{ opacity: [0.15, 0.3, 0.15] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full -mr-48 -mt-48 blur-3xl"
          ></motion.div>
          <motion.div
            animate={{ opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 5, repeat: Infinity }}
            className="absolute bottom-0 left-0 w-80 h-80 bg-green-500/10 rounded-full -ml-40 -mb-40 blur-3xl"
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
              className="inline-block px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold mb-6 border border-emerald-500/20"
            >
              🚀 Limited Time Offer
            </motion.span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-6 leading-tight">
              Start Managing Your Classroom Smarter Today
            </h2>

            <p className="text-base sm:text-lg text-gray-300 mb-10 leading-relaxed">
              Join thousands of educators who've transformed their classrooms with techUs. Get started free, no credit card required.
            </p>

            {/* Features List */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-10 flex flex-col sm:flex-row justify-center gap-6 text-sm text-gray-300 font-medium"
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
              <Link
                to="/login"
                className="px-8 py-3.5 rounded-full bg-white hover:bg-gray-100 text-black font-semibold transition-colors shadow-lg flex items-center justify-center gap-2 group text-base"
              >
                Get Started Free
                <HiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <button
                type="button"
                className="px-8 py-3.5 rounded-full border border-white/20 text-white font-semibold hover:bg-white/10 transition-colors backdrop-blur-sm text-base"
              >
                Schedule Demo
              </button>
            </motion.div>

            {/* Bottom Text */}
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-8 text-xs text-gray-400"
            >
              ⭐ Trusted by 50,000+ teachers • 4.9 star rating on all platforms
            </motion.p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
