import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  HiArrowLeft,
  HiMail,
  HiLockClosed,
  HiEye,
  HiEyeOff,
  HiBookOpen,
  HiUser,
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
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [focusedField, setFocusedField] = useState(null)
  const [isSignUp, setIsSignUp] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showOTPVerification, setShowOTPVerification] = useState(false)
  const [verificationEmail, setVerificationEmail] = useState('')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [otpTimer, setOtpTimer] = useState(60)
  const [isResending, setIsResending] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    let interval;
    if (showOTPVerification && otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [showOTPVerification, otpTimer]);

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const name = e.target.name?.value
    const email = e.target.email.value
    const password = e.target.password.value
    const role = e.target.role?.value || 'Teacher'

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email || !emailRegex.test(email)) {
      setError('Please enter a valid email address (e.g. user@example.com)')
      setLoading(false)
      return
    }

    const endpoint = isSignUp ? '/api/auth/register' : '/api/auth/login'
    const payload = isSignUp ? { name, email, password, role } : { email, password }

    try {
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || 'Something went wrong')
      }

      if (isSignUp || data.status === 'UNVERIFIED') {
        setVerificationEmail(email)
        setShowOTPVerification(true)
        setOtpTimer(60)
        setOtp(['', '', '', '', '', ''])
      } else {
        localStorage.setItem('userEmail', data.email)
        localStorage.setItem('userInfo', JSON.stringify(data))
        navigate('/dashboard')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
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
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      setError('Please enter all 6 digits of the verification code.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: verificationEmail, otp: otpCode }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Verification failed');
      }

      localStorage.setItem('userEmail', data.email);
      localStorage.setItem('userInfo', JSON.stringify(data));
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setError('');
    setIsResending(true);

    try {
      const res = await fetch(`${API_URL}/api/auth/resend-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: verificationEmail }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to resend code');
      }

      setOtpTimer(60);
      setOtp(['', '', '', '', '', '']);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsResending(false);
    }
  };

  const handleOtpChange = (value, index) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Focus next box
    if (value !== '' && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      if (otp[index] === '' && index > 0) {
        const prevInput = document.getElementById(`otp-${index - 1}`);
        if (prevInput) {
          prevInput.focus();
          const newOtp = [...otp];
          newOtp[index - 1] = '';
          setOtp(newOtp);
        }
      }
    }
  };

  return (
    <div className="min-h-screen w-full flex overflow-hidden bg-[#020604]">

      {/* ── LEFT PANEL ── */}
      <motion.aside
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="hidden lg:flex flex-col justify-between relative w-[48%] min-h-screen px-14 py-12 overflow-hidden"
        style={{ background: 'linear-gradient(145deg, #040f07 0%, #061209 40%, #020705 100%)' }}
      >
        {/* Animated glow orbs */}
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute top-[-80px] left-[-80px] w-[500px] h-[500px] rounded-full bg-emerald-500/10 blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-60px] right-[-60px] w-[400px] h-[400px] rounded-full bg-green-400/8 blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-emerald-600/5 blur-[80px]" />
        </div>

        {/* Grid overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* Top: Back + Logo */}
        <div className="relative z-10">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-medium text-gray-500 hover:text-gray-300 transition-colors tracking-wide uppercase"
          >
            <HiArrowLeft size={14} />
            Back to home
          </Link>

          <div className="mt-12 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-400 flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <HiBookOpen className="text-white" size={20} />
            </div>
            <span className="text-xl font-bold tracking-tight text-white font-space">
              Acharya <span className="text-emerald-400">AI</span>
            </span>
          </div>

          {/* Headline */}
          <div className="mt-16">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-4xl xl:text-5xl font-black leading-[1.1] text-white tracking-tight font-space"
            >
              Welcome back,<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-300">
                educator.
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="mt-5 text-sm text-gray-400 leading-relaxed max-w-sm"
            >
              Sign in to manage your classes, track attendance, and keep every student on the path to success.
            </motion.p>
          </div>

          {/* Feature list */}
          <ul className="mt-10 space-y-4">
            {features.map((f, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="flex items-center gap-3.5"
              >
                <span className="w-9 h-9 rounded-lg bg-white/[0.04] border border-white/[0.07] flex items-center justify-center text-base shrink-0">
                  {f.icon}
                </span>
                <span className="text-sm text-gray-300">{f.text}</span>
              </motion.li>
            ))}
          </ul>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-14 flex gap-8"
          >
            {stats.map((s, i) => (
              <div key={i}>
                <p className="text-2xl font-black text-white tracking-tight">{s.value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Bottom copyright */}
        <p className="relative z-10 text-xs text-gray-600">
          © 2026 Acharya AI. Built for modern classrooms.
        </p>
      </motion.aside>

      {/* Divider line */}
      <div className="hidden lg:block w-px bg-white/[0.05] self-stretch" />

      {/* ── RIGHT PANEL (Form) ── */}
      <main className="flex flex-1 flex-col justify-center items-center px-6 py-12 sm:px-10 relative bg-[#020604]">

        {/* Subtle top-right glow */}
        <div className="pointer-events-none absolute top-0 right-0 w-80 h-80 rounded-full bg-emerald-500/5 blur-[100px]" aria-hidden="true" />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full max-w-sm"
        >
          {/* Mobile logo */}
          <div className="lg:hidden mb-10 flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-green-400 flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <HiBookOpen className="text-white" size={18} />
            </div>
            <span className="text-lg font-bold text-white">Acharya <span className="text-emerald-400">AI</span></span>
          </div>

          {showOTPVerification ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-3xl font-black text-white tracking-tight font-space">
                  Verify email
                </h2>
                <p className="mt-2.5 text-sm text-gray-400 leading-relaxed">
                  We sent a 6-digit verification code to <span className="text-emerald-400 font-semibold">{verificationEmail}</span>. Enter it below to verify your account.
                </p>
              </div>

              <form onSubmit={handleVerifyOTP} className="space-y-6">
                {error && (
                  <div className="p-3.5 rounded-xl border border-red-500/20 bg-red-500/10 text-xs font-semibold text-red-400 leading-relaxed">
                    {error}
                  </div>
                )}

                <div className="flex justify-between gap-2.5 my-8">
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      id={`otp-${idx}`}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength="1"
                      value={digit}
                      onChange={(e) => handleOtpChange(e.target.value, idx)}
                      onKeyDown={(e) => handleOtpKeyDown(e, idx)}
                      className="w-12 h-14 text-center text-xl font-extrabold text-white bg-white/[0.03] border border-white/[0.08] focus:border-emerald-500/60 focus:bg-emerald-500/[0.04] focus:outline-none focus:ring-2 focus:ring-emerald-500/15 rounded-xl transition-all duration-200"
                    />
                  ))}
                </div>

                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-green-400 text-black font-bold text-sm tracking-wide shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {loading ? 'Verifying...' : 'Verify Code'}
                </motion.button>
              </form>

              <div className="flex flex-col items-center gap-3 pt-2 text-xs">
                <span className="text-gray-500 font-medium">
                  {otpTimer > 0 ? (
                    `Resend code in ${otpTimer}s`
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendOTP}
                      disabled={isResending}
                      className="text-emerald-400 hover:text-emerald-300 font-bold transition-colors bg-transparent border-none cursor-pointer p-0 disabled:opacity-50"
                    >
                      {isResending ? 'Resending...' : 'Resend Code'}
                    </button>
                  )}
                </span>
                
                <button
                  type="button"
                  onClick={() => {
                    setShowOTPVerification(false);
                    setError('');
                  }}
                  className="text-gray-400 hover:text-white transition-colors bg-transparent border-none cursor-pointer p-0 font-semibold"
                >
                  ← Back to login / sign up
                </button>
              </div>
            </motion.div>
          ) : (
            <>
              {/* Heading */}
              <h2 className="text-3xl font-black text-white tracking-tight font-space">
                {isSignUp ? 'Create account' : 'Sign in'}
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                {isSignUp ? 'Already have an account? ' : 'No account? '}
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(!isSignUp)
                    setError('')
                  }}
                  className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors bg-transparent border-none p-0 cursor-pointer align-baseline"
                >
                  {isSignUp ? 'Sign in →' : 'Start free trial →'}
                </button>
              </p>

              {/* Google button */}
              <div className="mt-8 flex w-full justify-center">
                <GoogleLogin
                  onSuccess={(credentialResponse) => {
                    handleGoogleSuccess(credentialResponse.credential)
                  }}
                  onError={() => {
                    setError('Google authentication failed')
                  }}
                  theme="dark"
                  shape="pill"
                  size="large"
                  width="384px"
                />
              </div>

              {/* Divider */}
              <div className="relative my-7 flex items-center">
                <div className="flex-1 border-t border-white/[0.07]" />
                <span className="mx-4 text-[11px] font-medium text-gray-600 uppercase tracking-widest">or</span>
                <div className="flex-1 border-t border-white/[0.07]" />
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">

                {error && (
                  <div className="p-3.5 rounded-xl border border-red-500/20 bg-red-500/10 text-xs font-semibold text-red-400 leading-relaxed">
                    {error}
                  </div>
                )}

                {isSignUp && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-2"
                  >
                    <label htmlFor="name" className="block text-[11px] font-semibold uppercase tracking-widest text-gray-500">
                      Full Name
                    </label>
                    <div className={`relative flex items-center rounded-xl border transition-all duration-200 ${focusedField === 'name' ? 'border-emerald-500/60 bg-emerald-500/[0.04] shadow-[0_0_0_3px_rgba(52,211,153,0.08)]' : 'border-white/[0.08] bg-white/[0.02]'}`}>
                      <HiUser className="pointer-events-none absolute left-3.5 text-gray-600" size={17} />
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required={isSignUp}
                        placeholder="John Doe"
                        onFocus={() => setFocusedField('name')}
                        onBlur={() => setFocusedField(null)}
                        className="w-full bg-transparent py-3 pl-11 pr-4 text-sm text-white placeholder-gray-600 focus:outline-none"
                      />
                    </div>
                  </motion.div>
                )}

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-[11px] font-semibold uppercase tracking-widest text-gray-500 mb-2">
                    Email address
                  </label>
                  <div className={`relative flex items-center rounded-xl border transition-all duration-200 ${focusedField === 'email' ? 'border-emerald-500/60 bg-emerald-500/[0.04] shadow-[0_0_0_3px_rgba(52,211,153,0.08)]' : 'border-white/[0.08] bg-white/[0.02]'}`}>
                    <HiMail className="pointer-events-none absolute left-3.5 text-gray-600" size={17} />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      placeholder="you@school.edu"
                      pattern="[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}"
                      title="Please enter a valid email address (e.g. user@example.com)"
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                      className="w-full bg-transparent py-3 pl-11 pr-4 text-sm text-white placeholder-gray-600 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label htmlFor="password" className="block text-[11px] font-semibold uppercase tracking-widest text-gray-500">
                      Password
                    </label>
                    <a href="#" className="text-[11px] text-emerald-400 hover:text-emerald-300 transition-colors font-medium">
                      Forgot password?
                    </a>
                  </div>
                  <div className={`relative flex items-center rounded-xl border transition-all duration-200 ${focusedField === 'password' ? 'border-emerald-500/60 bg-emerald-500/[0.04] shadow-[0_0_0_3px_rgba(52,211,153,0.08)]' : 'border-white/[0.08] bg-white/[0.02]'}`}>
                    <HiLockClosed className="pointer-events-none absolute left-3.5 text-gray-600" size={17} />
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      required
                      placeholder="••••••••"
                      onFocus={() => setFocusedField('password')}
                      onBlur={() => setFocusedField(null)}
                      className="w-full bg-transparent py-3 pl-11 pr-11 text-sm text-white placeholder-gray-600 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 text-gray-600 hover:text-gray-300 transition-colors"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <HiEyeOff size={17} /> : <HiEye size={17} />}
                    </button>
                  </div>
                </div>

                {isSignUp && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-2"
                  >
                    <label htmlFor="role" className="block text-[11px] font-semibold uppercase tracking-widest text-gray-500">
                      Role
                    </label>
                    <div className="relative flex items-center rounded-xl border border-white/[0.08] bg-[#020604]">
                      <select
                        id="role"
                        name="role"
                        defaultValue="Teacher"
                        className="w-full bg-[#020604] py-3.5 px-4 rounded-xl text-sm text-white focus:outline-none border-none cursor-pointer"
                      >
                        <option value="Teacher">Teacher</option>
                        <option value="Student">Student</option>
                        <option value="Parent">Parent</option>
                      </select>
                    </div>
                  </motion.div>
                )}

                {/* Remember me */}
                <label className="flex cursor-pointer items-center gap-2.5 select-none pt-1">
                  <div
                    onClick={() => setRememberMe(!rememberMe)}
                    className={`w-4 h-4 rounded flex items-center justify-center border transition-all duration-200 shrink-0 cursor-pointer ${rememberMe ? 'bg-emerald-500 border-emerald-500' : 'bg-white/[0.03] border-white/10'}`}
                  >
                    {rememberMe && (
                      <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 12 12">
                        <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                  <span className="text-xs text-gray-500">Remember me for 30 days</span>
                </label>

                {/* Submit */}
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className={`mt-2 w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-green-400 text-black font-bold text-sm tracking-wide shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {loading ? 'Processing...' : isSignUp ? 'Sign up to Acharya AI' : 'Sign in to Acharya AI'}
                </motion.button>
              </form>

              {/* Footer note */}
              <p className="mt-8 text-center text-[11px] text-gray-600 leading-relaxed">
                By signing in, you agree to our{' '}
                <a href="#" className="text-gray-500 hover:text-emerald-400 transition-colors">Terms of Service</a>
                {' '}and{' '}
                <a href="#" className="text-gray-500 hover:text-emerald-400 transition-colors">Privacy Policy</a>.
              </p>
            </>
          )}
        </motion.div>
      </main>
    </div>
  )
}
