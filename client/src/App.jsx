import { useEffect, useState } from 'react'
import './App.css'
import './index.css'
import StudentFormModal from './components/StudentFormModal'
import StudentList from './components/StudentList'
import LoadingPage from './components/LoadingPage'
import LoginPage from './components/LoginPage'
import RegisterPage from './components/RegisterPage'
import * as api from './api'

function App() {
  const [students, setStudents] = useState([])
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showLoading, setShowLoading] = useState(false)
  const [user, setUser] = useState(null)
  const [showFormModal, setShowFormModal] = useState(false)
  const [currentPage, setCurrentPage] = useState('login') // 'login' or 'register'

  async function load() {
    setLoading(true)
    try {
      const data = await api.getStudents()
      setStudents(data)
    } catch (err) {
      console.error(err)-
      alert('Failed to load students')
    } finally {
      setLoading(false)
    }
  }

  // Check for existing auth on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
      setIsAuthenticated(true)
      load()
    }
  }, [])

  const handleLoginSuccess = (loginUser) => {
    setShowLoading(true)
    setUser(loginUser)
    setIsAuthenticated(true)

    // Simulate loading time
    setTimeout(() => {
      load()
      setShowLoading(false)
    }, 3000)
  }

  const handleRegistrationSuccess = (newUser) => {
    setShowLoading(true)
    setUser(newUser)
    setIsAuthenticated(true)
    setCurrentPage('dashboard')

    // Simulate loading time
    setTimeout(() => {
      load()
      setShowLoading(false)
    }, 3000)
  }

  const handleNavigateToRegister = () => {
    setCurrentPage('register')
  }

  const handleNavigateToLogin = () => {
    setCurrentPage('login')
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('userType')
    setUser(null)
    setIsAuthenticated(false)
    setStudents([])
  }

  // Show login/register pages if not authenticated
  if (!isAuthenticated) {
    if (currentPage === 'register') {
      return <RegisterPage onRegistrationSuccess={handleRegistrationSuccess} onBackToLogin={handleNavigateToLogin} />
    }
    return <LoginPage onLoginSuccess={handleLoginSuccess} onNavigateToRegister={handleNavigateToRegister} />
  }

  // Show loading page
  if (showLoading) {
    return <LoadingPage onComplete={() => { }} />
  }

  async function handleDelete(id) {
    if (!confirm('Delete student?')) return
    try {
      await api.deleteStudent(id)
      await load()
    } catch (err) {
      console.error(err)
      alert('Delete failed')
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b top-0 z-40">
        <div className="mx-auto px-6 lg:px-8 py-2">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-blue-900 tracking-tight animate-slideInDown">
                Student Management
              </h1>
              <p className="text-black-100 mt-2 font-medium text-lg">Manage and track student records efficiently</p>
            </div>

            {/* User Info and Logout */}
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">Welcome,</p>
                <p className="font-semibold text-gray-900">{user?.name}</p>
                <p className="text-xs text-blue-600 capitalize font-medium">{user?.userType}</p>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 font-medium rounded-lg transition-all duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Modal for Edit/New Student */}
      <StudentFormModal
        isOpen={showFormModal}
        onClose={() => { setShowFormModal(false); setSelected(null); }}
        selected={selected}
        onSaved={() => { load(); setSelected(null); }}
      />

      {/* Main Content */}
      <main className="mx-auto px-4 lg:px-0 py-0">
        <div className="animate-slideInUp h-[calc(100vh-96px)] p-6 overflow-y-auto">
          {/* Student List - Full Width */}
          <StudentList
            students={students}
            onEdit={(s) => { setSelected(s); setShowFormModal(true); }}
            onDelete={handleDelete}
            onCreate={() => { setSelected(null); setShowFormModal(true); }}
            userType={user?.userType}
          />
        </div>
      </main>

      {/* Loading Indicator */}
      {loading && (
        <div className="fixed bottom-12 right-12 gradient-primary text-white px-8 py-5 rounded-xl shadow-elevated flex items-center gap-4 animate-pulse">
          <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
          <span className="font-semibold text-base">Loading...</span>
        </div>
      )}
    </div>
  )
}

export default App
