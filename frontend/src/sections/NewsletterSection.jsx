import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiMail, HiCheckCircle } from 'react-icons/hi';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle' | 'submitting' | 'success'

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    setStatus('submitting');
    setTimeout(() => {
      setStatus('success');
      setEmail('');
    }, 1000);
  };

  return (
    <section className="py-24 bg-brand-cream relative overflow-hidden border-t border-brand-forest/10">
      {/* Decorative Glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[350px] h-[350px] bg-brand-sage/20 rounded-full blur-[100px]" />
      </div>

      <div className="container-custom relative z-10 px-4 text-center">
        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="font-space text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-forest mb-4"
        >
          Join our newsletter to stay updated.
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-brand-text-muted text-sm sm:text-base lg:text-lg max-w-xl mx-auto leading-relaxed"
        >
          Get the latest news, feature updates, and educational insights delivered straight to your inbox.
        </motion.p>

        {/* Input Capsule Box */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-md sm:max-w-lg mx-auto mt-10"
        >
          <AnimatePresence mode="wait">
            {status !== 'success' ? (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center bg-white border border-brand-forest/15 hover:border-brand-forest/30 focus-within:border-brand-forest focus-within:ring-1 focus-within:ring-brand-forest/20 rounded-full p-1.5 transition-all duration-300 shadow-sm"
              >
                {/* Mail Icon */}
                <span className="pl-4 text-brand-text-muted/70 shrink-0">
                  <HiMail size={20} />
                </span>

                {/* Email Input */}
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  pattern="[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}"
                  title="Please enter a valid email address (e.g. user@example.com)"
                  className="flex-1 bg-transparent border-0 outline-none text-brand-forest placeholder-brand-text-muted/60 text-sm py-2.5 px-3 focus:ring-0 focus:outline-none w-full"
                  disabled={status === 'submitting'}
                />

                {/* Subscribe Button */}
                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="bg-brand-forest hover:bg-brand-forest-hover text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-full transition-all shrink-0 shadow-md shadow-brand-forest/10 disabled:opacity-50 select-none cursor-pointer"
                >
                  {status === 'submitting' ? 'Subscribing...' : 'Subscribe'}
                </button>
              </motion.form>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-2 px-6 py-4 rounded-full border border-brand-forest/20 bg-brand-sage text-brand-forest text-sm font-semibold shadow-sm"
              >
                <HiCheckCircle size={20} className="animate-bounce text-brand-forest" />
                <span>Subscribed! Check your inbox for confirmation.</span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
