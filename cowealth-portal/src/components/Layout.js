import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  LayoutDashboard, CreditCard, PieChart, TrendingUp,
  FileText, Bell, Settings, LogOut, Menu, X, Building2
} from 'lucide-react'

const COLORS = {
  green: '#0A2E24', gold: '#D4AF37', white: '#FDFCF9',
  greenLight: '#133D2F', greenMid: '#0E3D2F',
}

const memberNav = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/member' },
  { icon: CreditCard, label: 'Contributions', path: '/member/contributions' },
  { icon: PieChart, label: 'Shares & Ownership', path: '/member/shares' },
  { icon: TrendingUp, label: 'Investments', path: '/member/investments' },
  { icon: FileText, label: 'Documents', path: '/member/documents' },
  { icon: Bell, label: 'Notifications', path: '/member/notifications' },
]

const adminNav = [
  { icon: LayoutDashboard, label: 'Admin Dashboard', path: '/admin' },
  { icon: CreditCard, label: 'Contribution Approvals', path: '/admin/approvals' },
  { icon: PieChart, label: 'Share Management', path: '/admin/shares' },
  { icon: TrendingUp, label: 'Investments', path: '/admin/investments' },
  { icon: FileText, label: 'Documents', path: '/admin/documents' },
  { icon: Settings, label: 'Member Management', path: '/admin/members' },
]

const financeNav = [
  { icon: LayoutDashboard, label: 'Finance Dashboard', path: '/finance' },
  { icon: CreditCard, label: 'Payment Verification', path: '/finance/verify' },
  { icon: TrendingUp, label: 'Financial Reports', path: '/finance/reports' },
  { icon: PieChart, label: 'Investments', path: '/finance/investments' },
  { icon: FileText, label: 'Expense Records', path: '/finance/expenses' },
]

const govNav = [
  { icon: LayoutDashboard, label: 'Governance Dashboard', path: '/governance' },
  { icon: FileText, label: 'Meeting Minutes', path: '/governance/minutes' },
  { icon: Settings, label: 'Resolutions', path: '/governance/resolutions' },
  { icon: Bell, label: 'Communications', path: '/governance/comms' },
]

const navByRole = { Member: memberNav, Admin: adminNav, Treasurer: financeNav, Secretary: govNav }
const roleColors = { Member: '#3B82F6', Admin: '#EF4444', Treasurer: '#10B981', Secretary: '#8B5CF6' }

export default function Layout({ children, title }) {
  const { profile, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const role = profile?.role || 'Member'
  const navItems = navByRole[role] || memberNav

  const handleLogout = async () => { await signOut(); navigate('/') }

  const Sidebar = () => (
    <div style={{
      width: '240px', minHeight: '100vh', background: COLORS.greenLight,
      borderRight: '1px solid rgba(212,175,55,0.12)', display: 'flex',
      flexDirection: 'column', flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{
        padding: '1.5rem 1.25rem', borderBottom: '1px solid rgba(212,175,55,0.1)',
        display: 'flex', alignItems: 'center', gap: '0.75rem',
      }}>
        <Building2 size={22} color={COLORS.gold} />
        <div>
          <div style={{ fontFamily: 'Georgia, serif', color: COLORS.gold, fontWeight: 700, fontSize: '0.95rem' }}>COWEALTH</div>
          <div style={{ color: 'rgba(212,175,55,0.5)', fontSize: '0.65rem', letterSpacing: '0.1em' }}>PROPERTY LTD</div>
        </div>
      </div>

      {/* Role badge */}
      <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid rgba(212,175,55,0.08)' }}>
        <div style={{ fontSize: '0.75rem', color: 'rgba(253,252,249,0.4)', marginBottom: '0.35rem' }}>Logged in as</div>
        <div style={{ color: COLORS.white, fontWeight: 600, fontSize: '0.9rem' }}>{profile?.full_name || 'Member'}</div>
        <div style={{
          display: 'inline-block', marginTop: '0.4rem',
          background: `${roleColors[role]}20`, color: roleColors[role],
          border: `1px solid ${roleColors[role]}40`,
          borderRadius: '100px', padding: '0.15rem 0.65rem', fontSize: '0.72rem', fontWeight: 600,
        }}>{role}</div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '1rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        {navItems.map(({ icon: Icon, label, path }) => {
          const active = location.pathname === path
          return (
            <button key={path} onClick={() => navigate(path)} style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              padding: '0.65rem 0.85rem', borderRadius: '6px', border: 'none',
              background: active ? 'rgba(212,175,55,0.12)' : 'transparent',
              color: active ? COLORS.gold : 'rgba(253,252,249,0.65)',
              cursor: 'pointer', fontSize: '0.88rem', fontWeight: active ? 600 : 400,
              textAlign: 'left', width: '100%', transition: 'all 0.15s',
              borderLeft: active ? `3px solid ${COLORS.gold}` : '3px solid transparent',
            }}>
              <Icon size={16} />
              {label}
            </button>
          )
        })}
      </nav>

      {/* Logout */}
      <div style={{ padding: '1rem 0.75rem', borderTop: '1px solid rgba(212,175,55,0.1)' }}>
        <button onClick={handleLogout} style={{
          display: 'flex', alignItems: 'center', gap: '0.75rem',
          padding: '0.65rem 0.85rem', borderRadius: '6px', border: 'none',
          background: 'transparent', color: 'rgba(253,252,249,0.5)',
          cursor: 'pointer', fontSize: '0.88rem', width: '100%',
          transition: 'all 0.15s',
        }}>
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </div>
  )

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: COLORS.green, fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      {/* Desktop Sidebar */}
      <div style={{ display: 'flex' }}>
        <Sidebar />
      </div>

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top bar */}
        <div style={{
          height: '60px', background: 'rgba(10,46,36,0.8)', backdropFilter: 'blur(8px)',
          borderBottom: '1px solid rgba(212,175,55,0.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 1.5rem', position: 'sticky', top: 0, zIndex: 10,
        }}>
          <h1 style={{ color: COLORS.white, fontSize: '1rem', fontWeight: 600, margin: 0 }}>{title}</h1>
          <div style={{ color: 'rgba(253,252,249,0.4)', fontSize: '0.8rem' }}>
            {new Date().toLocaleDateString('en-NG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, padding: '1.75rem', overflowY: 'auto' }}>
          {children}
        </div>
      </div>
    </div>
  )
}
