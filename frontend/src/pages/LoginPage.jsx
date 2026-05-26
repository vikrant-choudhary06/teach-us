import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  HiArrowLeft,
  HiMail,
  HiLockClosed,
  HiEye,
  HiEyeOff,
  HiCheckCircle,
} from 'react-icons/hi'
import { FaGoogle } from 'react-icons/fa'

const highlights = [
  'Attendance & gradebook in one place',
  'Lesson plans and student records',
  'Trusted by 50,000+ educators',
]

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
  }

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row overflow-x-hidden">
      {/* Brand panel */}
      <motion.aside
        initial={{ opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="relative flex flex-col justify-between bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 px-8 py-10 lg:w-[44%] lg:min-h-screen lg:px-12 lg:py-12"
      >
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-80 w-80 rounded-full bg-purple-400/20 blur-3xl" />
        </div>

        <div className="relative z-10">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-white/90 hover:text-white transition-colors"
          >
            <HiArrowLeft size={18} />
            Back to home
          </Link>

          <Link to="/" className="mt-10 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
              <span className="text-lg font-bold text-white">TH</span>
            </div>
            <span className="text-2xl font-bold text-white">TeacherHub</span>
          </Link>

          <h1 className="mt-10 text-3xl font-bold leading-tight text-white sm:text-4xl">
            Welcome back,
            <br />
            educator.
          </h1>
          <p className="mt-4 max-w-md text-base text-indigo-100 leading-relaxed">
            Sign in to manage your classes, track attendance, and keep every student on the path to success.
          </p>

          <ul className="mt-10 space-y-4">
            {highlights.map((item, i) => (
              <motion.li
                key={item}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="flex items-center gap-3 text-sm text-white/95"
              >
                <HiCheckCircle className="flex-shrink-0 text-emerald-300" size={22} />
                {item}
              </motion.li>
            ))}
          </ul>
        </div>

        <p className="relative z-10 mt-12 text-sm text-indigo-200/90 hidden lg:block">
          © 2026 TeacherHub. Built for modern classrooms.
        </p>
      </motion.aside>

      {/* Form panel */}
      <main className="flex flex-1 flex-col justify-center bg-gray-50 px-6 py-12 sm:px-10 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mx-auto w-full max-w-md"
        >
          <div className="lg:hidden mb-8">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600">
                <span className="font-bold text-white">TH</span>
              </div>
              <span className="text-xl font-bold text-gray-900">TeacherHub</span>
            </Link>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">Sign in</h2>
          <p className="mt-2 text-gray-600">
            Don&apos;t have an account?{' '}
            <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-700">
              Start free trial
            </a>
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="relative">
                <HiMail
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="you@school.edu"
                  className="input-field pl-10"
                />
              </div>
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </label>
                <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <HiLockClosed
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  placeholder="••••••••"
                  className="input-field pl-10 pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <HiEyeOff size={20} /> : <HiEye size={20} />}
                </button>
              </div>
            </div>

            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm text-gray-600">Remember me for 30 days</span>
            </label>

            <button type="submit" className="button-primary w-full py-3.5">
              Sign in
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-gray-50 px-4 text-gray-500">Or continue with</span>
            </div>
          </div>

          <button
            type="button"
            className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
          >
            <FaGoogle className="text-red-500" size={20} />
            Sign in with Google
          </button>

          <p className="mt-8 text-center text-xs text-gray-500 leading-relaxed">
            By signing in, you agree to our{' '}
            <a href="#" className="text-indigo-600 hover:underline">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="text-indigo-600 hover:underline">
              Privacy Policy
            </a>
            .
          </p>
        </motion.div>
      </main>
    </div>
  )
}
