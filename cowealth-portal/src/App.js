import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import MemberDashboard from './pages/MemberDashboard'
import AdminDashboard from './pages/AdminDashboard'
import FinanceDashboard from './pages/FinanceDashboard'
import GovernanceDashboard from './pages/GovernanceDashboard'

const RoleRoute = ({ children }) => {
  const { user, profile, loading } = useAuth()

  if (loading) return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#0A2E24', color: '#D4AF37', fontSize: '1.1rem', fontFamily: 'Georgia, serif'
    }}>
      Loading Cowealth Portal...
    </div>
  )

  if (!user) return <Navigate to="/login" replace />
  return children
}

const DashboardRouter = () => {
  const { profile, loading } = useAuth()
  if (loading) return null
  if (!profile) return <Navigate to="/login" replace />

  const role = profile.role
  if (role === 'Admin') return <Navigate to="/admin" replace />
  if (role === 'Treasurer') return <Navigate to="/finance" replace />
  if (role === 'Secretary') return <Navigate to="/governance" replace />
  return <Navigate to="/member" replace />
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<RoleRoute><DashboardRouter /></RoleRoute>} />
          <Route path="/member" element={<RoleRoute><MemberDashboard /></RoleRoute>} />
          <Route path="/admin" element={<RoleRoute><AdminDashboard /></RoleRoute>} />
          <Route path="/finance" element={<RoleRoute><FinanceDashboard /></RoleRoute>} />
          <Route path="/governance" element={<RoleRoute><GovernanceDashboard /></RoleRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
