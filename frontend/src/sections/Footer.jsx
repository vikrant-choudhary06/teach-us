import React from 'react';
import { motion } from 'framer-motion';
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
} from 'react-icons/fa';

export default function Footer() {
  const footerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  const footerSections = [
    {
      title: 'Product',
      links: ['Features', 'Pricing', 'Security', 'Roadmap', 'Status'],
    },
    {
      title: 'Company',
      links: ['About', 'Blog', 'Careers', 'Press', 'Contact'],
    },
    {
      title: 'Resources',
      links: ['Documentation', 'Help Center', 'Community', 'Guides', 'API Docs'],
    },
    {
      title: 'Legal',
      links: ['Privacy', 'Terms', 'Cookies', 'Compliance', 'GDPR'],
    },
  ];

  const socialLinks = [
    { icon: FaFacebookF, href: '#', label: 'Facebook' },
    { icon: FaTwitter, href: '#', label: 'Twitter' },
    { icon: FaLinkedinIn, href: '#', label: 'LinkedIn' },
    { icon: FaInstagram, href: '#', label: 'Instagram' },
  ];

  return (
    <footer className="relative bg-gray-900 text-white overflow-hidden">
      {/* Main Footer */}
      <div className="container-custom section-padding">
        <motion.div
          variants={footerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {/* Top Section */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-12 pb-12 border-b border-gray-800">
            {/* Brand */}
            <motion.div variants={itemVariants} className="md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">TH</span>
                </div>
                <span className="text-xl font-bold">TeacherHub</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                Empowering educators with modern tools to transform their classrooms.
              </p>

              {/* Newsletter */}
              <div>
                <p className="text-sm font-semibold mb-3">Stay Updated</p>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="flex-1 px-3 py-2 rounded-lg bg-gray-800 text-white placeholder-gray-500 text-sm border border-gray-700 focus:outline-none focus:border-indigo-600 transition-colors"
                  />
                  <button className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 transition-colors font-medium text-sm">
                    Subscribe
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Footer Links */}
            {footerSections.map((section, sectionIdx) => (
              <motion.div key={sectionIdx} variants={itemVariants}>
                <h4 className="font-semibold text-white mb-4">{section.title}</h4>
                <ul className="space-y-2">
                  {section.links.map((link, linkIdx) => (
                    <li key={linkIdx}>
                      <a
                        href="#"
                        className="text-gray-400 hover:text-white transition-colors text-sm"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* Bottom Section */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col md:flex-row justify-between items-center"
          >
            {/* Copyright */}
            <p className="text-gray-400 text-sm mb-6 md:mb-0">
              © 2026 TeacherHub. All rights reserved. Made with ❤️ by educators.
            </p>

            {/* Social Links */}
            <div className="flex gap-4">
              {socialLinks.map((social, idx) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={idx}
                    href={social.href}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-10 h-10 rounded-full bg-gray-800 hover:bg-indigo-600 flex items-center justify-center transition-colors"
                    aria-label={social.label}
                  >
                    <Icon size={20} />
                  </motion.a>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Decorative Elements */}
      <motion.div
        animate={{ opacity: [0.1, 0.3, 0.1] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute top-0 right-0 w-96 h-96 bg-indigo-600 rounded-full -mr-48 -mt-48 blur-3xl opacity-10"
      ></motion.div>
    </footer>
  );
}
