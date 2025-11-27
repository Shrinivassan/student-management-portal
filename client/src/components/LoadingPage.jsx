import { useEffect } from 'react'
import { BookOpen, Loader } from 'lucide-react'

export default function LoadingPage({ onComplete }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete()
    }, 3000)

    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Main Loading Content */}
      <div className="relative z-10 text-center px-6">
        {/* Logo and Title */}
        <div className="mb-12 animate-slideInDown">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-linear-to-br from-blue-500 to-blue-700 rounded-2xl mb-6 shadow-2xl">
            <BookOpen className="w-12 h-12 text-white animate-pulse" />
          </div>
          <h1 className="text-5xl font-bold text-blue-900 mb-3 tracking-tight">Trellysis</h1>
          <p className="text-lg text-gray-600 font-medium">Student & Faculty Management Portal</p>
        </div>

        {/* Loading Spinner */}
        <div className="mb-12 flex justify-center">
          <div className="relative w-20 h-20">
            {/* Outer rotating ring */}
            <div className="absolute inset-0 rounded-full border-4 border-blue-100"></div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 border-r-blue-400 animate-spin"></div>

            {/* Inner pulsing dot */}
            <div className="absolute inset-4 rounded-full bg-linear-to-r from-blue-500 to-purple-500 animate-pulse shadow-lg"></div>
          </div>
        </div>

        {/* Status Text */}
        <div className="space-y-2">
          <p className="text-gray-600 text-lg font-medium">Initializing Dashboard</p>
          <p className="text-sm text-gray-500 animate-pulse">Loading your data...</p>
        </div>

        {/* Progress Bar */}
        <div className="mt-8 w-64 mx-auto">
          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-linear-to-r from-blue-500 via-purple-500 to-blue-500 rounded-full animate-progress"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
