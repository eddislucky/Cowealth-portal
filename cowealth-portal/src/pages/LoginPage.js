import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Lock, Mail, Eye, EyeOff } from 'lucide-react'

const COLORS = {
  green: '#0A2E24', gold: '#D4AF37', white: '#FDFCF9',
  navy: '#0F172A', greenLight: '#133D2F',
}

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth()
  const navigate = useNavigate()

  const handleLogin = async () => {
    if (!email || !password) { setError('Please enter your email and password.'); return }
    setLoading(true); setError('')
    const { error: err } = await signIn(email, password)
    setLoading(false)
    if (err) { setError('Invalid email or password. Please try again.'); return }
    navigate('/dashboard')
  }

  const inputStyle = {
    width: '100%', background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(212,175,55,0.25)', borderRadius: '6px',
    padding: '0.85rem 1rem', color: COLORS.white, fontSize: '0.95rem',
    outline: 'none', boxSizing: 'border-box',
  }

  return (
    <div style={{
      minHeight: '100vh', background: COLORS.green,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Segoe UI', system-ui, sans-serif", padding: '2rem',
    }}>
      <div style={{
        background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(212,175,55,0.2)',
        borderRadius: '12px', padding: '2.5rem', width: '100%', maxWidth: '420px',
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '52px', height: '52px', borderRadius: '12px',
            background: 'rgba(212,175,55,0.15)', display: 'flex',
            alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem',
          }}>
            <Lock size={24} color={COLORS.gold} />
          </div>
          <div style={{ fontFamily: 'Georgia, serif', color: COLORS.gold, fontSize: '1.3rem', fontWeight: 700 }}>
            COWEALTH PORTAL
          </div>
          <div style={{ color: 'rgba(253,252,249,0.45)', fontSize: '0.8rem', marginTop: '0.3rem' }}>
            Shareholder Login
          </div>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.3)',
            borderRadius: '6px', padding: '0.75rem 1rem', marginBottom: '1.25rem',
            color: '#FCA5A5', fontSize: '0.88rem',
          }}>{error}</div>
        )}

        {/* Email */}
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ color: 'rgba(253,252,249,0.6)', fontSize: '0.82rem', display: 'block', marginBottom: '0.4rem' }}>
            Email Address
          </label>
          <div style={{ position: 'relative' }}>
            <Mail size={16} color="rgba(212,175,55,0.5)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              style={{ ...inputStyle, paddingLeft: '2.5rem' }}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
            />
          </div>
        </div>

        {/* Password */}
        <div style={{ marginBottom: '1.75rem' }}>
          <label style={{ color: 'rgba(253,252,249,0.6)', fontSize: '0.82rem', display: 'block', marginBottom: '0.4rem' }}>
            Password
          </label>
          <div style={{ position: 'relative' }}>
            <Lock size={16} color="rgba(212,175,55,0.5)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type={showPass ? 'text' : 'password'} value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{ ...inputStyle, paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
            />
            <button onClick={() => setShowPass(!showPass)} style={{
              position: 'absolute', right: '0.85rem', top: '50%', transform: 'translateY(-50%)',
              background: 'none', border: 'none', cursor: 'pointer', padding: 0,
            }}>
              {showPass ? <EyeOff size={16} color="rgba(212,175,55,0.5)" /> : <Eye size={16} color="rgba(212,175,55,0.5)" />}
            </button>
          </div>
        </div>

        {/* Button */}
        <button onClick={handleLogin} disabled={loading} style={{
          width: '100%', background: loading ? 'rgba(212,175,55,0.5)' : COLORS.gold,
          color: COLORS.navy, border: 'none', borderRadius: '6px',
          padding: '0.9rem', fontWeight: 700, fontSize: '1rem',
          cursor: loading ? 'not-allowed' : 'pointer', letterSpacing: '0.04em',
        }}>
          {loading ? 'Signing in...' : 'Login to Portal'}
        </button>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', color: 'rgba(253,252,249,0.35)', fontSize: '0.8rem' }}>
          Access is restricted to registered shareholders only.<br />
          Contact your Administrator for access issues.
        </div>

        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <button onClick={() => navigate('/')} style={{
            background: 'none', border: 'none', color: COLORS.gold,
            cursor: 'pointer', fontSize: '0.85rem', textDecoration: 'underline',
          }}>← Back to Home</button>
        </div>
      </div>
    </div>
  )
}
