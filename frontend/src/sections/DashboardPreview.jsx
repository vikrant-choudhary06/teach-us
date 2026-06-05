import React from 'react';
import { motion } from 'framer-motion';
import { 
  HiBookOpen, 
  HiFolder, 
  HiAcademicCap, 
  HiDocumentText, 
  HiPhotograph,
  HiCalculator,
  HiChevronRight
} from 'react-icons/hi';
import { HiSquares2X2 } from 'react-icons/hi2';

export default function DashboardPreview() {
  const containerVariants = {
    hidden: { opacity: 0, y: 40 },
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
    { label: 'Paper Explorer', icon: HiDocumentText },
    { label: 'Visual Aids', icon: HiPhotograph },
    { label: 'Math Solver', icon: HiCalculator },
  ];

  const quickTools = [
    {
      title: 'Lesson Planner',
      desc: 'Create engaging lesson plans tailored to your curriculum.',
      icon: HiDocumentText,
      action: 'Launch'
    },
    {
      title: 'Visual Aids',
      desc: 'Generate custom visual aids to explain complex topics.',
      icon: HiPhotograph,
      action: 'Launch'
    },
    {
      title: 'Math Solver',
      desc: 'Solve complex math problems step-by-step.',
      icon: HiCalculator,
      action: 'Launch'
    },
    {
      title: 'Paper Explorer',
      desc: 'Generate test papers, worksheets, and exams instantly.',
      icon: HiBookOpen,
      action: 'Launch'
    }
  ];

  return (
    <section className="relative pb-24 px-4 overflow-hidden bg-[#030712] flex flex-col items-center">
      {/* Glow effects */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute bottom-[10%] left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-emerald-600/10 rounded-full blur-[120px] opacity-50" />
      </div>

      <div className="container-custom relative z-10 w-full max-w-5xl">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="w-full"
        >
          {/* Main Dashboard Box */}
          <div className="rounded-3xl border border-white/[0.08] bg-[#0b101d]/40 backdrop-blur-md p-2 shadow-2xl relative shadow-emerald-950/20">
            
            {/* Outer window bar */}
            <div className="absolute top-0 left-0 right-0 h-10 bg-white/[0.02] border-b border-white/[0.05] rounded-t-3xl flex items-center px-6">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <span className="mx-auto text-[11px] text-gray-500 font-medium tracking-wide">
                acharya.ai/professor-dashboard
              </span>
            </div>

            {/* Dashboard Container (Light mode theme wrapper inside dark portal) */}
            <div className="bg-white rounded-2xl overflow-hidden mt-8 shadow-inner flex flex-col text-gray-800 font-sans">
              
              {/* Grid content */}
              <div className="grid grid-cols-12 min-h-[580px]">
                
                {/* Sidebar */}
                <div className="col-span-12 md:col-span-3 border-r border-gray-100 p-5 bg-gray-50/50 flex flex-col gap-1">
                  {/* Sidebar Logo */}
                  <div className="flex items-center gap-2 mb-6 pb-2 border-b border-gray-100">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[var(--color-emerald-500)] to-[var(--color-green-400)] flex items-center justify-center shadow-md">
                      <HiBookOpen className="text-white" size={16} />
                    </div>
                    <span className="font-bold text-sm text-gray-900 tracking-tight flex items-center gap-1">
                      Acharya <span className="text-[var(--color-emerald-600)]">AI</span>
                    </span>
                  </div>

                  {sidebarItems.map((item, idx) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={idx}
                        className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-semibold cursor-pointer transition-all duration-200 ${
                          item.active
                            ? 'bg-[var(--color-emerald-500)]/10 text-[var(--color-emerald-600)] border-l-[3px] border-[var(--color-emerald-600)] rounded-l-none'
                            : 'text-gray-500 hover:bg-gray-100/70 hover:text-gray-900'
                        }`}
                      >
                        <Icon size={16} className={item.active ? 'text-[var(--color-emerald-600)]' : 'text-gray-400'} />
                        {item.label}
                      </div>
                    );
                  })}
                </div>

                {/* Main panel */}
                <div className="col-span-12 md:col-span-9 p-6 sm:p-8 bg-white flex flex-col gap-6 text-left">
                  
                  {/* Greeting */}
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
                        Good morning, Teachers
                      </h2>
                      <p className="text-xs sm:text-sm text-gray-400 font-medium mt-1">
                        Ready to create something amazing? Your AI assistant is here to help.
                      </p>
                    </div>
                    
                    <div className="w-8 h-8 rounded-full bg-[var(--color-emerald-500)]/20 flex items-center justify-center text-xs font-bold text-[var(--color-emerald-600)] shadow-sm">
                      S
                    </div>
                  </div>

                  {/* Summary Card */}
                  <div className="border border-gray-100 rounded-xl p-5 flex flex-col gap-4 shadow-sm bg-white">
                    <div>
                      <h3 className="text-xs font-bold text-gray-800 tracking-wide uppercase">
                        Your Weekly Summary
                      </h3>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Great progress! Keep up the good work.
                      </p>
                    </div>

                    <div className="grid grid-cols-3 gap-4 pt-2">
                      {[
                        { label: 'TOTAL TOPICS', value: '0' },
                        { label: 'TOTAL ASSETS CREATED', value: '25' },
                        { label: 'ASSETS THIS WEEK', value: '0' },
                      ].map((stat, i) => (
                        <div key={i} className="border border-gray-100 rounded-lg p-4 flex flex-col gap-1 bg-gray-50/30">
                          <span className="text-[9px] font-bold text-gray-400 tracking-wider">
                            {stat.label}
                          </span>
                          <span className="text-2xl font-extrabold text-gray-900">
                            {stat.value}
                          </span>
                          <div className="w-full h-1 bg-gray-100 rounded-full mt-2 overflow-hidden">
                            <div
                              className="h-full bg-[var(--color-emerald-500)] rounded-full"
                              style={{ width: stat.value === '25' ? '40%' : '0%' }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Quick Action Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
                    {quickTools.map((tool, index) => {
                      const ToolIcon = tool.icon;
                      return (
                        <div 
                          key={index}
                          className="border border-gray-100 hover:border-[var(--color-emerald-300)]/50 rounded-xl p-4 flex flex-col justify-between bg-white shadow-sm hover:shadow-md transition-all cursor-pointer group"
                        >
                          <div>
                            <div className="w-7 h-7 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-500 mb-3 group-hover:bg-[var(--color-emerald-500)]/10 group-hover:text-[var(--color-emerald-600)] transition-colors">
                              <ToolIcon size={14} />
                            </div>
                            <h4 className="text-xs font-bold text-gray-800 mb-1 group-hover:text-[var(--color-emerald-600)] transition-colors">
                              {tool.title}
                            </h4>
                            <p className="text-[10px] text-gray-400 leading-normal font-medium">
                              {tool.desc}
                            </p>
                          </div>

                          <div className="flex items-center justify-between text-[9px] font-bold text-gray-400 mt-4 border-t border-gray-50 pt-2 group-hover:text-[var(--color-emerald-500)] transition-colors">
                            <span>{tool.action}</span>
                            <HiChevronRight size={10} className="transform group-hover:translate-x-0.5 transition-transform" />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                </div>
              </div>

            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
