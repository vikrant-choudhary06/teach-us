import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  HiArrowLeft,
  HiBookOpen,
} from 'react-icons/hi'
import { GoogleLogin } from '@react-oauth/google'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const stats = [
  { value: '50K+', label: 'Active Teachers' },
  { value: '2M+', label: 'Students Tracked' },
  { value: '99.9%', label: 'Uptime' },
]

const features = [
  { icon: '📋', text: 'Attendance & gradebook in one place' },
  { icon: '📚', text: 'AI-powered lesson planning' },
  { icon: '🎯', text: 'Real-time student analytics' },
]

export default function LoginPage() {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    e.currentTarget.style.setProperty('--x', `${x}px`)
    e.currentTarget.style.setProperty('--y', `${y}px`)
  }

  const handleGoogleSuccess = async (credential) => {
    setError('')
    setLoading(true)

    try {
      const res = await fetch(`${API_URL}/api/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: credential, role: 'Teacher' }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || 'Google Authentication failed')
      }

      localStorage.setItem('userEmail', data.email)
      localStorage.setItem('userInfo', JSON.stringify(data))
      navigate('/professor-dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div onMouseMove={handleMouseMove} className="min-h-screen w-full flex overflow-hidden bg-[#020604] text-[#f1f5f9] font-sans relative premium-glow-global">
      {/* Background Orbits */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
        <div className="absolute top-[-250px] left-[-250px] w-[800px] h-[800px] rounded-full bg-emerald-500/[0.04] blur-[150px]" />
        <div className="absolute bottom-[-150px] right-[-150px] w-[700px] h-[700px] rounded-full bg-green-500/[0.03] blur-[140px]" />
      </div>

      {/* ── LEFT PANEL ── */}
      <motion.aside
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="hidden lg:flex flex-col justify-between relative w-[46%] min-h-screen px-14 py-12 overflow-hidden shrink-0 border-r border-white/[0.06] bg-gradient-to-br from-[#040f07] via-[#061209] to-[#020705]"
      >
        {/* Animated glow orbs inside left panel */}
        <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
          <div className="absolute top-[-80px] left-[-80px] w-[450px] h-[450px] rounded-full bg-emerald-500/10 blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-60px] right-[-60px] w-[350px] h-[350px] rounded-full bg-green-400/8 blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        {/* Grid overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />

        {/* Top: Back + Logo */}
        <div className="relative z-10">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-gray-300 transition-all tracking-wider uppercase"
          >
            <HiArrowLeft size={14} />
            Back to home
          </Link>

          <div className="mt-16 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-400 flex items-center justify-center shadow-[0_4px_20px_rgba(16,185,129,0.35)] border border-emerald-400/30">
              <HiBookOpen className="text-black" size={20} />
            </div>
            <span className="text-xl font-black tracking-tight text-white font-space">
              Acharya <span className="text-emerald-400">AI</span>
            </span>
          </div>

          {/* Headline */}
          <div className="mt-20">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-4xl xl:text-5xl font-black leading-[1.15] text-white tracking-tight font-space"
            >
              Empower your<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-300">
                teaching desk.
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="mt-5 text-sm text-gray-400 leading-relaxed max-w-sm font-semibold"
            >
              Deploy worksheets, verify real-time class engagement metrics, and digitize exam sheets in seconds.
            </motion.p>
          </div>

          {/* Feature list */}
          <ul className="mt-12 space-y-5">
            {features.map((f, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="flex items-center gap-4 group"
              >
                <span className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-lg shrink-0 group-hover:border-emerald-500/30 group-hover:bg-emerald-500/5 transition-all">
                  {f.icon}
                </span>
                <span className="text-sm text-gray-300 font-bold group-hover:text-white transition-colors">{f.text}</span>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Bottom copyright & Stats row */}
        <div className="relative z-10 space-y-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex gap-10 border-t border-white/[0.06] pt-8"
          >
            {stats.map((s, i) => (
              <div key={i}>
                <p className="text-2xl font-black text-white font-space tracking-tight">{s.value}</p>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">{s.label}</p>
              </div>
            ))}
          </motion.div>
          <p className="text-xs text-gray-600 font-bold">
            © 2026 Acharya AI. Crafted for progressive educators.
          </p>
        </div>
      </motion.aside>

      {/* ── RIGHT PANEL (Form) ── */}
      <main className="flex flex-1 flex-col justify-center items-center px-6 py-12 sm:px-10 relative bg-[#020604] z-10">
        <div className="pointer-events-none absolute top-0 right-0 w-96 h-96 rounded-full bg-emerald-500/5 blur-[120px]" aria-hidden="true" />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="w-full max-w-md p-8 sm:p-12 rounded-3xl border border-white/[0.08] bg-[#070b09]/40 backdrop-blur-2xl shadow-[0_20_50_rgba(0,0,0,0.5)] flex flex-col items-center"
        >
          {/* Logo */}
          <div className="mb-10 flex justify-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 border border-emerald-400/20">
                <HiBookOpen className="text-black" size={20} />
              </div>
              <span className="text-xl font-black text-white font-space">Acharya <span className="text-emerald-400">AI</span></span>
            </div>
          </div>

          <div className="text-center space-y-3 mb-10">
            <h2 className="text-3xl font-black text-white tracking-tight font-space animate-pulse">
              Sign In to Acharya AI
            </h2>
            <p className="text-xs text-gray-400 font-semibold max-w-[280px] mx-auto leading-relaxed">
              Secure, single sign-on using your institutional Google account.
            </p>
          </div>

          {/* Interactive Google Sign In Button Container */}
          <div className="w-full flex flex-col items-center justify-center p-6 border border-white/[0.04] bg-[#0a0f0c]/60 rounded-2xl relative overflow-hidden group hover:border-emerald-500/20 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/[0.02] to-emerald-500/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            
            {loading ? (
              <div className="py-2.5 flex flex-col items-center gap-3">
                <svg className="animate-spin h-6 w-6 text-emerald-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-xs text-emerald-400 font-bold font-space uppercase tracking-widest animate-pulse">Authenticating...</span>
              </div>
            ) : (
              <GoogleLogin
                onSuccess={(credentialResponse) => {
                  handleGoogleSuccess(credentialResponse.credential)
                }}
                onError={() => {
                  setError('Google authentication failed. Please try again.')
                }}
                theme="dark"
                shape="pill"
                size="large"
                width="320px"
              />
            )}
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 w-full p-4 rounded-xl border border-red-500/20 bg-red-500/10 text-xs font-semibold text-red-400 leading-relaxed text-center"
            >
              {error}
            </motion.div>
          )}

          {/* Footer note */}
          <p className="mt-12 text-center text-[10px] font-bold text-gray-600 leading-relaxed">
            By signing in, you agree to our{' '}
            <a href="#" className="text-gray-500 hover:text-emerald-400 transition-colors">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="text-gray-500 hover:text-emerald-400 transition-colors">Privacy Policy</a>.
          </p>
        </motion.div>
      </main>
    </div>
  )
}
