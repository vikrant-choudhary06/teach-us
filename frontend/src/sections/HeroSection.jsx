import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  HiBookOpen, 
  HiFolder, 
  HiAcademicCap, 
  HiDocumentText, 
  HiPhotograph, 
  HiCalculator, 
  HiGlobeAlt, 
  HiStar, 
  HiDatabase, 
  HiMail, 
  HiQuestionMarkCircle, 
  HiClipboardList, 
  HiChartBar, 
  HiArrowRight, 
  HiChevronRight 
} from 'react-icons/hi';
import { HiSquares2X2 } from 'react-icons/hi2';

export default function HeroSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const sidebarItems = [
    { label: 'Dashboard', icon: HiSquares2X2, active: true },
    { label: 'My Library', icon: HiFolder },
    { label: 'My Workspace', icon: HiAcademicCap },
    { label: 'Lesson Planner', icon: HiDocumentText },
    { label: 'Paper Explorer', icon: HiBookOpen },
    { label: 'Visual Aids', icon: HiPhotograph },
    { label: 'Math Helper', icon: HiCalculator },
    { label: 'Hyper-Local Content', icon: HiGlobeAlt },
    { label: 'Story Generator', icon: HiStar },
    { label: 'Knowledge Base', icon: HiDatabase },
    { label: 'Parent Mails', icon: HiMail },
    { label: 'Quiz Generator', icon: HiQuestionMarkCircle },
    { label: 'Rubric Generator', icon: HiClipboardList },
    { label: 'Dynamic Reports', icon: HiChartBar },
  ];

  const quickTools = [
    {
      title: 'Lesson Planner',
      desc: 'Create comprehensive lesson plans in seconds',
      icon: () => (
        <div className="font-serif font-extrabold text-gray-500 text-sm">A</div>
      ),
      action: "Let's go!"
    },
    {
      title: 'Visual Aids',
      desc: 'Create engaging diagrams and charts for your lessons',
      icon: () => (
        <svg className="w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      action: "Let's go!"
    },
    {
      title: 'Math Helper',
      desc: 'Solve any math problem with step-by-step explanations',
      icon: () => (
        <svg className="w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="4" y="2" width="16" height="20" rx="2" strokeLinecap="round" strokeLinejoin="round"/>
          <line x1="9" y1="22" x2="9" y2="16" strokeLinecap="round" strokeLinejoin="round"/>
          <line x1="8" y1="6" x2="16" y2="6" strokeLinecap="round" strokeLinejoin="round"/>
          <line x1="8" y1="10" x2="16" y2="10" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      action: "Let's go!"
    },
    {
      title: 'Hyper Local Content',
      desc: "Create content that resonates with your students' region",
      icon: () => (
        <svg className="w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="5" y="4" width="6" height="12" rx="2" strokeLinecap="round"/>
          <rect x="13" y="8" width="6" height="12" rx="2" strokeLinecap="round"/>
        </svg>
      ),
      action: "Let's go!"
    }
  ];

  return (
    <section className="relative pt-28 pb-0 px-4 overflow-hidden grid-bg bg-transparent flex flex-col items-center">
      {/* Glowing Light Leaks - shifted to bottom and toned down */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-emerald-600/5 rounded-full blur-[140px] opacity-70 animate-pulse-slow" />
        <div className="absolute bottom-[10%] left-[15%] w-[400px] h-[400px] bg-green-500/3 rounded-full blur-[120px] opacity-60" />
      </div>

      <div className="container-custom relative z-10 text-center flex flex-col items-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl flex flex-col items-center"
        >
          {/* Badge Pill */}
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 text-xs font-semibold tracking-wider uppercase mb-8 cursor-default shadow-[0_0_15px_rgba(16,185,129,0.1)]"
          >
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-ping" />
            AI for Indian Education
          </motion.div>

          {/* Heading */}
          <motion.h1
            variants={itemVariants}
            className="font-space text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 leading-[1.12]"
          >
            The Smart <span className="gradient-text">AI Assistant</span> for Modern Indian Schools.
          </motion.h1>

          {/* Description */}
          <motion.p
            variants={itemVariants}
            className="font-sans text-gray-400 text-base sm:text-lg lg:text-xl max-w-3xl leading-relaxed mb-10"
          >
            Empower your teaching with localized lesson planners, visual concept aids, and automatic grading templates. Built specifically to simplify classroom workflows and save educators over 10+ hours a week.
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center gap-4 mb-12"
          >
            <Link
              to="/login"
              className="bg-white hover:bg-gray-100 text-black font-semibold px-8 py-3.5 rounded-full transition-all duration-300 shadow-lg shadow-white/5 flex items-center gap-2 group text-sm md:text-base active:scale-95"
            >
              Get Started
              <HiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="#features"
              className="text-white hover:text-gray-300 font-semibold px-6 py-3.5 transition-all duration-300 text-sm md:text-base"
            >
              Learn More
            </a>
          </motion.div>

          {/* Social Proof */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col items-center gap-3 mb-16"
          >
            <div className="flex -space-x-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-r from-emerald-500 to-green-500 border-2 border-black flex items-center justify-center text-[10px] font-bold text-white shadow-md">
                S
              </div>
              <div className="w-9 h-9 rounded-full bg-gradient-to-r from-green-500 to-teal-500 border-2 border-black flex items-center justify-center text-[10px] font-bold text-white shadow-md">
                K
              </div>
              <div className="w-9 h-9 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 border-2 border-black flex items-center justify-center text-[10px] font-bold text-white shadow-md">
                P
              </div>
            </div>
            <div className="text-xs sm:text-sm text-gray-400">
              <span className="text-white font-medium">Trusted by over 30 educators</span> • Saving an average of 10+ hours per week.
            </div>
          </motion.div>

          {/* Dashboard Preview Mockup (Positioned directly under content, cropped at bottom) */}
          <motion.div
            variants={itemVariants}
            className="w-full max-w-5xl rounded-t-3xl border border-white/[0.08] bg-black/40 backdrop-blur-md p-2 shadow-2xl relative shadow-emerald-950/20"
          >
            
            {/* Outer window bar */}
            <div className="absolute top-0 left-0 right-0 h-10 bg-white/[0.02] border-b border-white/[0.05] rounded-t-3xl flex items-center px-6">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <span className="mx-auto text-[11px] text-gray-500 font-medium tracking-wide">
                acharya.ai/dashboard
              </span>
            </div>

            {/* Dashboard Container (Light mode theme wrapper inside dark portal) */}
            <div className="bg-white rounded-t-2xl overflow-hidden mt-8 shadow-inner flex flex-row text-gray-800 font-sans">
              
              {/* Sidebar */}
              <div className="w-1/4 min-w-[190px] border-r border-gray-100 p-4 bg-gray-50/30 flex flex-col gap-0.5 text-left">
                {/* Sidebar Logo */}
                <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-green-400 flex items-center justify-center shadow-md">
                    <HiBookOpen className="text-white" size={16} />
                  </div>
                  <span className="font-bold text-xs text-gray-900 tracking-tight flex items-center gap-1">
                    Acharya <span className="text-emerald-600">AI</span>
                  </span>
                </div>

                {sidebarItems.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={idx}
                      className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-[10px] font-semibold cursor-pointer transition-all duration-200 ${
                        item.active
                          ? 'bg-emerald-50 text-emerald-600 border-l-[3px] border-emerald-600 rounded-l-none'
                          : 'text-gray-500 hover:bg-gray-100/70 hover:text-gray-900'
                      }`}
                    >
                      <Icon size={13} className={item.active ? 'text-emerald-600' : 'text-gray-400'} />
                      {item.label}
                    </div>
                  );
                })}
              </div>

              {/* Main Content Area */}
              <div className="w-3/4 p-6 bg-white flex flex-col gap-5 text-left border-l border-gray-50">
                {/* Greeting Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-lg sm:text-xl font-extrabold text-gray-900 tracking-tight">
                      Good morning, Teachers
                    </h2>
                    <p className="text-[11px] text-gray-400 font-medium mt-0.5">
                      Ready to create something amazing? Your AI assistant is here to help.
                    </p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-xs font-bold text-emerald-700 shadow-sm">
                    S
                  </div>
                </div>

                {/* Weekly Summary Card */}
                <div className="border border-gray-100 rounded-xl p-4 flex flex-col gap-3 shadow-sm bg-white">
                  <div>
                    <h3 className="text-[10px] font-bold text-gray-800 tracking-wide uppercase">
                      Your Weekly Summary
                    </h3>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      Great progress! Keep up the good work.
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-3 pt-1">
                    {[
                      { label: 'TOTAL TOPICS', value: '0' },
                      { label: 'TOTAL ASSETS CREATED', value: '25' },
                      { label: 'ASSETS THIS WEEK', value: '0' },
                    ].map((stat, i) => (
                      <div key={i} className="border border-gray-100 rounded-lg p-3 flex flex-col gap-0.5 bg-gray-50/20">
                        <span className="text-[8px] font-bold text-gray-400 tracking-wider">
                          {stat.label}
                        </span>
                        <span className="text-xl font-extrabold text-gray-900">
                          {stat.value}
                        </span>
                        <div className="w-full h-1 bg-gray-100 rounded-full mt-1.5 overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 rounded-full"
                            style={{ width: stat.value === '25' ? '40%' : '0%' }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4-Card Quick Actions Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-1">
                  {quickTools.map((tool, index) => {
                    const ToolIcon = tool.icon;
                    return (
                      <div 
                        key={index}
                        className="border border-gray-100 hover:border-emerald-200 rounded-xl p-3.5 flex flex-col justify-between bg-white shadow-sm hover:shadow-md transition-all cursor-pointer group"
                      >
                        <div>
                          <div className="w-6 h-6 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-500 mb-2 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                            <ToolIcon />
                          </div>
                          <h4 className="text-[10px] font-extrabold text-gray-800 mb-1 group-hover:text-emerald-600 transition-colors">
                            {tool.title}
                          </h4>
                          <p className="text-[9px] text-gray-400 leading-snug font-medium">
                            {tool.desc}
                          </p>
                        </div>

                        <div className="flex items-center justify-between text-[8px] font-bold text-gray-400 mt-3 border-t border-gray-50 pt-1.5 group-hover:text-emerald-500 transition-colors">
                          <span>{tool.action}</span>
                          <HiChevronRight size={10} className="transform group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </div>
                    );
                  })}
                </div>

              </div>

            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
