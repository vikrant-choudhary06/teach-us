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

          <h2 className="text-3xl font-black text-white tracking-tight font-space text-center">
            Sign in to Acharya AI
          </h2>
          <p className="mt-2 text-sm text-gray-500 text-center">
            Secure, passwordless access using your Google account
          </p>

          {/* Google button */}
          <div className="mt-10 flex w-full justify-center">
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

          {error && (
            <div className="mt-6 p-3.5 rounded-xl border border-red-500/20 bg-red-500/10 text-xs font-semibold text-red-400 leading-relaxed text-center">
              {error}
            </div>
          )}

          {/* Footer note */}
          <p className="mt-12 text-center text-[11px] text-gray-600 leading-relaxed">
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
