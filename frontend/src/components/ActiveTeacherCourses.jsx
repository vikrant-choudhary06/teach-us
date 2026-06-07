import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiOutlineUser } from 'react-icons/hi';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function ActiveTeacherCourses() {
  const [feedCourses, setFeedCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const savedInfo = localStorage.getItem('userInfo');
        if (!savedInfo) {
          setLoading(false);
          return;
        }
        const token = JSON.parse(savedInfo).token;

        const res = await fetch(`${API_URL}/api/courses/feed`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setFeedCourses(data);
        }
      } catch (err) {
        console.error('Failed to fetch active courses feed', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeed();
  }, []);

  if (loading) {
    return (
      <div className="w-full py-8 px-6 bg-white rounded-3xl border border-gray-100 shadow-sm flex items-center justify-center min-h-[250px] mb-6">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (feedCourses.length === 0) return null;

  return (
    <div className="w-full py-8 mb-6 overflow-hidden bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 relative z-20">
      <div className="px-6 md:px-8 mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-gray-900 font-space tracking-tight">Trending Premium Cohorts</h2>
          <p className="text-sm text-gray-500 mt-1 font-semibold">Explore live masterclasses and exclusive guided journeys.</p>
        </div>
      </div>
      
      {/* Horizontal Sliding Container */}
      <div className="flex overflow-x-auto gap-6 px-6 md:px-8 pb-6 snap-x snap-mandatory" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {feedCourses.map((course, idx) => {
          const teacher = course.teacherId || {};
          const isLive = idx % 2 === 0;
          return (
            <motion.div
              key={course._id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="min-w-[320px] max-w-[340px] flex-shrink-0 snap-start bg-gray-50 rounded-2xl p-5 border border-gray-200 shadow-sm hover:shadow-xl hover:border-emerald-200 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                {/* Glowing Premium Tags */}
                <div className="mb-4">
                  {isLive ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 border border-emerald-200 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
                      ⚡ LIVE BATCH RUNNING
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700 border border-amber-200 shadow-[0_0_10px_rgba(245,158,11,0.2)]">
                      ⏳ Only 3 Seats Left!
                    </span>
                  )}
                </div>

                {/* Course Title Banner */}
                <h3 className="text-lg font-black text-gray-900 mb-2 leading-tight group-hover:text-emerald-600 transition-colors font-space">
                  {course.title}
                </h3>
                <p className="text-gray-500 text-xs font-semibold line-clamp-2 mb-6 leading-relaxed">
                  {course.description || 'Master the essential skills needed for modern engineering and design in this comprehensive cohort.'}
                </p>
              </div>

              <div>
                {/* Creator Profile */}
                <div className="flex items-center gap-3 mb-5 p-3 rounded-xl bg-white border border-gray-100 shadow-sm">
                  {teacher.picture ? (
                    <img src={teacher.picture} alt={teacher.name} className="w-10 h-10 rounded-full object-cover border border-gray-200 shadow-sm" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold shadow-sm">
                      {teacher.name ? teacher.name.charAt(0).toUpperCase() : <HiOutlineUser />}
                    </div>
                  )}
                  <div>
                    <p className="text-xs font-bold text-gray-900">{teacher.name || 'Expert Instructor'}</p>
                    <p className="text-[10px] text-gray-500 font-semibold flex items-center mt-0.5">
                      <span className="text-emerald-500 mr-1">✦</span> Top Rated Creator
                    </p>
                  </div>
                </div>

                {/* CTA Button */}
                <button className="w-full py-3 px-4 bg-gray-900 hover:bg-emerald-600 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors flex items-center justify-center gap-2">
                  Enroll Now / Explore Curriculum
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
      <style>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
