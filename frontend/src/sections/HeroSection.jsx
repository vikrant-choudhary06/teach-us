import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
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
  HiChevronRight,
  HiSparkles,
} from "react-icons/hi";
import { HiSquares2X2 } from "react-icons/hi2";

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
    { label: "Control Center", icon: HiSquares2X2, active: true },
    { label: "My Library", icon: HiFolder },
    { label: "My Workspace", icon: HiAcademicCap },
    { label: "AI Syllabus Architect", icon: HiDocumentText },
    { label: "Resource Hub", icon: HiBookOpen },
    { label: "Interactive Lab", icon: HiSparkles },
    { label: "Hyper-Local Content", icon: HiGlobeAlt },
    { label: "Story Generator", icon: HiStar },
    { label: "Knowledge Base", icon: HiDatabase },
    { label: "Parent Mails", icon: HiMail },
    { label: "Quiz Generator", icon: HiQuestionMarkCircle },
    { label: "Rubric Generator", icon: HiClipboardList },
    { label: "Dynamic Reports", icon: HiChartBar },
  ];

  const quickTools = [
    {
      title: "AI Syllabus Architect",
      desc: "Design structured course curriculum and schedules in seconds",
      icon: () => (
        <div className="font-serif font-extrabold text-gray-500 text-sm">A</div>
      ),
      action: "Let's go!",
    },
    {
      title: "Interactive Lab",
      desc: "Access visual diagrams and step-by-step solvers",
      icon: () => (
        <svg
          className="w-4 h-4 text-gray-500"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      action: "Let's go!",
    },
    {
      title: "Resource Hub",
      desc: "Digitize and host syllabus documents, PDFs, and assets",
      icon: () => (
        <svg
          className="w-4 h-4 text-gray-500"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <rect
            x="4"
            y="2"
            width="16"
            height="20"
            rx="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <line
            x1="9"
            y1="22"
            x2="9"
            y2="16"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <line
            x1="8"
            y1="6"
            x2="16"
            y2="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <line
            x1="8"
            y1="10"
            x2="16"
            y2="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      action: "Let's go!",
    },
    {
      title: "Hyper Local Content",
      desc: "Create content that resonates with your students' region",
      icon: () => (
        <svg
          className="w-4 h-4 text-gray-500"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <rect
            x="5"
            y="4"
            width="6"
            height="12"
            rx="2"
            strokeLinecap="round"
          />
          <rect
            x="13"
            y="8"
            width="6"
            height="12"
            rx="2"
            strokeLinecap="round"
          />
        </svg>
      ),
      action: "Let's go!",
    },
  ];

  return (
    <section className="relative pt-20 pb-8 px-4 sm:px-6 lg:px-8 overflow-hidden grid-bg bg-transparent flex flex-col items-center">
      {/* Glowing Light Leaks - shifted to bottom and toned down */}
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-brand-sage/40 rounded-full blur-[140px] opacity-70 animate-pulse-slow" />
        <div className="absolute bottom-[10%] left-[15%] w-[400px] h-[400px] bg-brand-sage/20 rounded-full blur-[120px] opacity-60" />
      </div>

      <div className="container-custom relative z-10 w-full max-w-7xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center"
        >
          {/* Left Column: Text & CTA */}
          <div className="lg:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-left">
            {/* Badge Pill */}
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brand-forest/15 bg-brand-sage/60 text-brand-forest text-[11px] font-semibold tracking-wider uppercase mb-4 cursor-default shadow-sm"
            >
              <span className="w-1.5 h-1.5 bg-brand-forest rounded-full animate-pulse" />
              AI for Indian Education
            </motion.div>

            {/* Heading */}
            <motion.h1
              variants={itemVariants}
              className="font-space text-3xl sm:text-4xl lg:text-4xl xl:text-5xl font-extrabold tracking-tight text-brand-forest mb-4 leading-[1.15]"
            >
              The Smart{" "}
              <span className="text-emerald-700 font-extrabold">
                AI Assistant
              </span>{" "}
              for Modern Indian Schools.
            </motion.h1>

            {/* Description */}
            <motion.p
              variants={itemVariants}
              className="font-sans text-brand-text-muted text-sm sm:text-base max-w-xl leading-relaxed mb-5"
            >
              Empower your teaching with localized lesson planners, visual concept
              aids, and automatic grading templates. Built specifically to
              simplify classroom workflows and save educators over 10+ hours a
              week.
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto"
            >
              <Link
                to="/login"
                className="bg-brand-forest hover:bg-brand-forest-hover text-white font-semibold px-6 py-2.5 rounded-full transition-all duration-300 shadow-md shadow-brand-forest/15 flex items-center justify-center gap-2 group text-xs md:text-sm active:scale-95 w-full sm:w-auto"
              >
                Get Started
                <HiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="#features"
                className="text-brand-forest hover:text-brand-forest-hover hover:bg-brand-sage/40 border border-brand-forest/20 font-semibold px-5 py-2.5 rounded-full transition-all duration-300 text-xs md:text-sm text-center w-full sm:w-auto"
              >
                Learn More
              </a>
            </motion.div>

            {/* Social Proof */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col items-center gap-3"
            ></motion.div>
          </div>

          {/* Right Column: Dashboard Mockup */}
          <div className="lg:col-span-7 w-full flex justify-center lg:justify-end">
            <motion.div
              variants={itemVariants}
              className="w-full max-w-2xl rounded-2xl border border-brand-forest/15 bg-white p-1.5 shadow-xl relative overflow-hidden"
            >
              {/* Outer window bar */}
              <div className="absolute top-0 left-0 right-0 h-8 bg-brand-cream border-b border-brand-forest/10 rounded-t-2xl flex items-center px-4">
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-red-400" />
                  <div className="w-2 h-2 rounded-full bg-yellow-400" />
                  <div className="w-2 h-2 rounded-full bg-green-400" />
                </div>
                <span className="mx-auto text-[9px] text-brand-text-muted font-medium tracking-wide">
                  techus.in/dashboard
                </span>
              </div>

              {/* Dashboard Container (Light mode theme wrapper inside dark portal) */}
              <div className="bg-white rounded-xl overflow-hidden mt-6 border border-brand-forest/10 flex flex-row text-gray-800 font-sans">
                {/* Sidebar */}
                <div className="w-[145px] shrink-0 border-r border-gray-100 p-2.5 bg-gray-50/30 flex flex-col gap-0.5 text-left">
                  {/* Sidebar Logo */}
                  <div className="flex items-center gap-1.5 mb-2.5 pb-1.5 border-b border-gray-100">
                    <div className="w-5 h-5 rounded bg-gradient-to-br from-emerald-500 to-green-400 flex items-center justify-center shadow-sm">
                      <HiBookOpen className="text-white" size={11} />
                    </div>
                    <span className="font-bold text-[10px] text-gray-900 tracking-tight flex items-center gap-0.5">
                      techUs
                    </span>
                  </div>

                  {sidebarItems.map((item, idx) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={idx}
                        className={`flex items-center gap-2 px-2 py-1 rounded text-[8px] font-semibold cursor-pointer transition-all duration-200 ${
                          item.active
                            ? "bg-emerald-50 text-emerald-600 border-l-2 border-emerald-600 rounded-l-none"
                            : "text-gray-500 hover:bg-gray-100/70 hover:text-gray-900"
                        }`}
                      >
                        <Icon
                          size={10}
                          className={
                            item.active ? "text-emerald-600" : "text-gray-400"
                          }
                        />
                        {item.label}
                      </div>
                    );
                  })}
                </div>

                {/* Main Content Area */}
                <div className="flex-1 p-4 bg-white flex flex-col gap-3.5 text-left border-l border-gray-50">
                  {/* Greeting Header */}
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-sm sm:text-base font-extrabold text-gray-900 tracking-tight">
                        Good morning, Teachers
                      </h2>
                      <p className="text-[9px] text-gray-400 font-medium mt-0.5">
                        Ready to create something amazing? Your AI assistant is
                        here to help.
                      </p>
                    </div>
                    <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-[9px] font-bold text-emerald-700 shadow-sm">
                      S
                    </div>
                  </div>

                  {/* Weekly Summary Card */}
                  <div className="border border-gray-100 rounded-lg p-3 flex flex-col gap-2 shadow-sm bg-white">
                    <div>
                      <h3 className="text-[8px] font-bold text-gray-800 tracking-wide uppercase">
                        Your Weekly Summary
                      </h3>
                      <p className="text-[8px] text-gray-400 mt-0.5">
                        Great progress! Keep up the good work.
                      </p>
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-0.5">
                      {[
                        { label: "TOTAL TOPICS", value: "0" },
                        { label: "TOTAL ASSETS CREATED", value: "25" },
                        { label: "ASSETS THIS WEEK", value: "0" },
                      ].map((stat, i) => (
                        <div
                          key={i}
                          className="border border-gray-100 rounded p-1.5 sm:p-2 flex flex-col gap-0.5 bg-gray-50/20"
                        >
                          <span className="text-[6.5px] font-bold text-gray-400 tracking-wider leading-none">
                            {stat.label}
                          </span>
                          <span className="text-xs sm:text-sm font-extrabold text-gray-900 mt-0.5">
                            {stat.value}
                          </span>
                          <div className="w-full h-0.5 bg-gray-100 rounded-full mt-1 overflow-hidden">
                            <div
                              className="h-full bg-emerald-500 rounded-full"
                              style={{
                                width: stat.value === "25" ? "40%" : "0%",
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 4-Card Quick Actions Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-0.5">
                    {quickTools.map((tool, index) => {
                      const ToolIcon = tool.icon;
                      return (
                        <div
                          key={index}
                          className="border border-gray-100 hover:border-emerald-200 rounded-lg p-2.5 flex flex-col justify-between bg-white shadow-sm hover:shadow-md transition-all cursor-pointer group"
                        >
                          <div>
                            <div className="w-5 h-5 rounded bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-500 mb-1.5 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                              <ToolIcon />
                            </div>
                            <h4 className="text-[8.5px] font-extrabold text-gray-800 mb-0.5 group-hover:text-emerald-600 transition-colors">
                              {tool.title}
                            </h4>
                            <p className="text-[7.5px] text-gray-400 leading-snug font-medium">
                              {tool.desc}
                            </p>
                          </div>

                          <div className="flex items-center justify-between text-[7px] font-bold text-gray-400 mt-2 border-t border-gray-50 pt-1 group-hover:text-emerald-500 transition-colors">
                            <span>{tool.action}</span>
                            <HiChevronRight
                              size={8}
                              className="transform group-hover:translate-x-0.5 transition-transform"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
