import { useState } from 'react'
import { Mail, Lock, Eye, EyeOff, BookOpen, Users, GraduationCap, ArrowLeft } from 'lucide-react'
import { register } from '../api.js'

export default function RegisterPage({ onRegistrationSuccess, onBackToLogin }) {
  const [userType, setUserType] = useState('student')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      setLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    try {
      const result = await register(email, password, confirmPassword, userType, name)
      setSuccess('Registration successful! Redirecting to login...')
      localStorage.setItem('authToken', result.token)
      localStorage.setItem('user', JSON.stringify(result.user))
      localStorage.setItem('userType', result.user.userType)

      setTimeout(() => {
        onRegistrationSuccess(result.user)
      }, 1500)
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-3 sm:px-4 md:px-6 py-4 md:py-0">
      <div className="hidden md:block absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 w-full max-w-sm md:max-w-md max-h-[90vh] overflow-y-auto">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl">
          <div className="bg-linear-to-r from-blue-600 to-blue-800 px-4 sm:px-6 py-6 sm:py-8 text-center">
            <div className="inline-flex items-center justify-center w-12 sm:w-16 h-12 sm:h-16 bg-white/20 rounded-xl mb-3 sm:mb-4">
              <BookOpen className="w-6 sm:w-8 h-6 sm:h-8 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">Create Account</h1>
            <p className="text-blue-100 text-xs sm:text-sm">Join Trellysis Portal</p>
          </div>

          <div className="p-4 sm:p-6 md:p-8">
            <div className="mb-6 sm:mb-8">
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-3 sm:mb-4">I am a</label>
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <button
                  onClick={() => setUserType('student')}
                  className={`py-2 sm:py-3 px-3 sm:px-4 rounded-lg sm:rounded-xl font-medium text-xs sm:text-sm transition-all duration-300 flex items-center justify-center gap-1 sm:gap-2 ${userType === 'student'
                      ? 'bg-blue-100 text-blue-700 border-2 border-blue-500 shadow-md'
                      : 'bg-gray-100 text-gray-600 border-2 border-gray-200 hover:border-blue-300'
                    }`}
                >
                  <GraduationCap className="w-3 sm:w-4 h-3 sm:h-4" />
                  Student
                </button>

                <button
                  onClick={() => setUserType('faculty')}
                  className={`py-2 sm:py-3 px-3 sm:px-4 rounded-lg sm:rounded-xl font-medium text-xs sm:text-sm transition-all duration-300 flex items-center justify-center gap-1 sm:gap-2 ${userType === 'faculty'
                      ? 'bg-purple-100 text-purple-700 border-2 border-purple-500 shadow-md'
                      : 'bg-gray-100 text-gray-600 border-2 border-gray-200 hover:border-purple-300'
                    }`}
                >
                  <Users className="w-3 sm:w-4 h-3 sm:h-4" />
                  Faculty
                </button>
              </div>
            </div>

            <form onSubmit={handleRegister} className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">Full Name</label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 sm:w-5 h-4 sm:h-5 text-gray-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 text-sm border border-gray-200 rounded-lg sm:rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all bg-gray-50 hover:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 sm:w-5 h-4 sm:h-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@example.com"
                    className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 text-sm border border-gray-200 rounded-lg sm:rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all bg-gray-50 hover:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 sm:w-5 h-4 sm:h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 sm:pl-10 pr-10 sm:pr-12 py-2 sm:py-3 text-sm border border-gray-200 rounded-lg sm:rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all bg-gray-50 hover:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 sm:w-5 h-4 sm:h-5" /> : <Eye className="w-4 sm:w-5 h-4 sm:h-5" />}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 sm:w-5 h-4 sm:h-5 text-gray-400" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 sm:pl-10 pr-10 sm:pr-12 py-2 sm:py-3 text-sm border border-gray-200 rounded-lg sm:rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all bg-gray-50 hover:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 sm:w-5 h-4 sm:h-5" /> : <Eye className="w-4 sm:w-5 h-4 sm:h-5" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg sm:rounded-xl text-red-700 text-xs sm:text-sm font-medium flex items-start gap-2 sm:gap-3">
                  <div className="w-4 sm:w-5 h-4 sm:h-5 rounded-full bg-red-200 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-red-700">!</span>
                  </div>
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="p-3 sm:p-4 bg-green-50 border border-green-200 rounded-lg sm:rounded-xl text-green-700 text-xs sm:text-sm font-medium flex items-start gap-2 sm:gap-3">
                  <div className="w-4 sm:w-5 h-4 sm:h-5 rounded-full bg-green-200 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-green-700">✓</span>
                  </div>
                  <span>{success}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 sm:py-3 px-3 sm:px-4 bg-linear-to-r from-blue-600 to-blue-700 text-white font-semibold text-sm sm:text-base rounded-lg sm:rounded-xl hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-3 sm:w-4 h-3 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Creating account...</span>
                  </>
                ) : (
                  <span>Register</span>
                )}
              </button>

              <button
                type="button"
                onClick={onBackToLogin}
                className="w-full py-2 sm:py-3 px-3 sm:px-4 bg-gray-100 text-gray-700 font-semibold text-sm sm:text-base rounded-lg sm:rounded-xl hover:bg-gray-200 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 sm:w-5 h-4 sm:h-5" />
                Back to Login
              </button>
            </form>
          </div>

          <div className="px-4 sm:px-6 md:px-8 py-3 sm:py-4 bg-gray-50 border-t border-gray-100 text-center text-xs text-gray-600">
            <p>Your information is secure and encrypted</p>
          </div>
        </div>
      </div>
    </div>
  )
}
