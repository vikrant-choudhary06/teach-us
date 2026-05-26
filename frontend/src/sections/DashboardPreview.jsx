import React from 'react';
import { motion } from 'framer-motion';
import { HiArrowRight } from 'react-icons/hi';

export default function DashboardPreview() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 },
    },
  };

  return (
    <section className="section-padding bg-gradient-to-b from-indigo-50 via-white to-white">
      <div className="container-custom">
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
            className="inline-block px-4 py-2 rounded-full bg-purple-100 text-purple-700 text-sm font-semibold mb-4"
          >
            Dashboard Preview
          </motion.span>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Intuitive Dashboard Built for Teachers
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Access all your teaching tools in one unified, beautifully designed interface
          </p>
        </motion.div>

        {/* Main Dashboard Preview */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="relative pb-8 lg:pb-0"
        >
          {/* Dashboard Container */}
          <motion.div
            variants={itemVariants}
            className="relative rounded-3xl border border-gray-200 bg-white shadow-2xl overflow-hidden"
          >
            {/* Top Bar */}
            <div className="bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 h-16 flex items-center px-8 gap-4">
              <div className="flex gap-2">
                <div className="w-4 h-4 rounded-full bg-red-400"></div>
                <div className="w-4 h-4 rounded-full bg-yellow-400"></div>
                <div className="w-4 h-4 rounded-full bg-green-400"></div>
              </div>
              <span className="text-white text-sm font-medium ml-auto">
                TeacherHub Dashboard
              </span>
            </div>

            {/* Dashboard Content */}
            <div className="grid grid-cols-12 gap-0 min-h-[600px]">
              {/* Sidebar */}
              <motion.div
                variants={itemVariants}
                className="col-span-12 md:col-span-3 bg-gradient-to-b from-gray-50 to-white border-r border-gray-200 p-6"
              >
                <div className="space-y-6">
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                      Menu
                    </p>
                    {['Dashboard', 'Attendance', 'Grades', 'Lessons', 'Students'].map(
                      (item, i) => (
                        <motion.div
                          key={i}
                          whileHover={{ x: 4 }}
                          className={`py-2 px-3 rounded-lg mb-2 cursor-pointer transition-colors ${
                            i === 0
                              ? 'bg-indigo-100 text-indigo-700 font-semibold'
                              : 'text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          {item}
                        </motion.div>
                      )
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Main Content */}
              <motion.div
                variants={itemVariants}
                className="col-span-12 md:col-span-9 p-8 space-y-6"
              >
                {/* Header */}
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Welcome, Mrs. Johnson</h3>
                  <p className="text-gray-600 text-sm mt-1">
                    Last updated 2 hours ago
                  </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: 'Active Classes', value: '5', icon: '📚' },
                    { label: 'Total Students', value: '142', icon: '👥' },
                    { label: 'Avg Attendance', value: '96%', icon: '✓' },
                    { label: 'Pending Grades', value: '23', icon: '📊' },
                  ].map((stat, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ y: -5 }}
                      className="rounded-xl bg-gradient-to-br from-gray-50 to-white p-4 border border-gray-200"
                    >
                      <div className="text-2xl mb-2">{stat.icon}</div>
                      <p className="text-sm text-gray-600">{stat.label}</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">
                        {stat.value}
                      </p>
                    </motion.div>
                  ))}
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Chart 1 */}
                  <div className="rounded-xl bg-gradient-to-br from-indigo-50 to-white p-6 border border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-4">
                      Attendance Rate
                    </h4>
                    <div className="flex items-end gap-1 h-32">
                      {[65, 72, 68, 85, 92, 88, 96].map((height, i) => (
                        <motion.div
                          key={i}
                          initial={{ height: 0 }}
                          whileInView={{ height: `${height}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, delay: i * 0.1 }}
                          className="flex-1 bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-t-lg"
                        ></motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Chart 2 */}
                  <div className="rounded-xl bg-gradient-to-br from-purple-50 to-white p-6 border border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-4">
                      Grade Distribution
                    </h4>
                    <div className="space-y-3">
                      {['A', 'B', 'C', 'D'].map((grade, i) => {
                        const widths = [45, 30, 20, 5];
                        return (
                          <div key={i}>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="font-semibold text-gray-900">
                                Grade {grade}
                              </span>
                              <span className="text-gray-600">{widths[i]}%</span>
                            </div>
                            <motion.div
                              initial={{ width: 0 }}
                              whileInView={{ width: `${widths[i]}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.8, delay: i * 0.1 }}
                              className="h-2 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full"
                            ></motion.div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="pt-4 border-t border-gray-200 flex flex-wrap gap-3">
                  <button className="button-primary text-sm py-2 px-4">
                    Record Attendance
                  </button>
                  <button className="button-secondary text-sm py-2 px-4">
                    Add Grades
                  </button>
                  <button className="button-secondary text-sm py-2 px-4">
                    Plan Lesson
                  </button>
                </div>
              </motion.div>
            </div>

            {/* Notifications card — inside dashboard bounds */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute bottom-4 right-4 z-10 hidden lg:block max-w-[16rem]"
            >
              <div className="glass-effect backdrop-blur-xl p-5 rounded-2xl shadow-2xl">
                <p className="text-sm font-semibold text-gray-900 mb-2">
                  Real-time Notifications
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <span className="text-lg">🔔</span>
                    <div>
                      <p className="font-medium text-gray-900">Class Ended</p>
                      <p className="text-xs text-gray-600">2 min ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 pt-2 border-t border-gray-200/80">
                    <span className="text-lg">📝</span>
                    <div>
                      <p className="font-medium text-gray-900">Assignment Due</p>
                      <p className="text-xs text-gray-600">Today at 5 PM</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Mobile / tablet: notifications below dashboard */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-6 lg:hidden"
          >
            <div className="glass-effect p-5 rounded-2xl shadow-lg max-w-md mx-auto">
              <p className="text-sm font-semibold text-gray-900 mb-2">
                Real-time Notifications
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <span className="text-lg">🔔</span>
                  <div>
                    <p className="font-medium text-gray-900">Class Ended</p>
                    <p className="text-xs text-gray-600">2 min ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 pt-2 border-t border-gray-200">
                  <span className="text-lg">📝</span>
                  <div>
                    <p className="font-medium text-gray-900">Assignment Due</p>
                    <p className="text-xs text-gray-600">Today at 5 PM</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-16 text-center"
        >
          <button className="button-primary inline-flex items-center gap-2 group">
            Explore Full Dashboard
            <HiArrowRight className="group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
