import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { CreditCard, PieChart, TrendingUp, Clock, CheckCircle, AlertCircle, Upload } from 'lucide-react'

const COLORS = { green: '#0A2E24', gold: '#D4AF37', white: '#FDFCF9', greenLight: '#133D2F' }

const StatCard = ({ icon: Icon, label, value, sub, color = COLORS.gold }) => (
  <div style={{
    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(212,175,55,0.15)',
    borderRadius: '10px', padding: '1.25rem 1.5rem',
    display: 'flex', flexDirection: 'column', gap: '0.5rem',
  }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <span style={{ color: 'rgba(253,252,249,0.5)', fontSize: '0.82rem' }}>{label}</span>
      <div style={{
        width: '34px', height: '34px', borderRadius: '8px',
        background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        <Icon size={16} color={color} />
      </div>
    </div>
    <div style={{ color: COLORS.white, fontSize: '1.6rem', fontWeight: 700, fontFamily: 'Georgia, serif' }}>{value}</div>
    {sub && <div style={{ color: 'rgba(253,252,249,0.4)', fontSize: '0.78rem' }}>{sub}</div>}
  </div>
)

const statusBadge = (status) => {
  const cfg = {
    approved: { bg: '#10B98120', color: '#10B981', label: 'Approved' },
    pending: { bg: '#F59E0B20', color: '#F59E0B', label: 'Pending' },
    rejected: { bg: '#EF444420', color: '#EF4444', label: 'Rejected' },
  }[status] || { bg: '#6B728020', color: '#6B7280', label: status }
  return (
    <span style={{
      background: cfg.bg, color: cfg.color, fontSize: '0.75rem',
      fontWeight: 600, borderRadius: '100px', padding: '0.2rem 0.65rem',
      border: `1px solid ${cfg.color}30`,
    }}>{cfg.label}</span>
  )
}

export default function MemberDashboard() {
  const { profile } = useAuth()
  const [stats, setStats] = useState({ totalContributed: 0, totalShares: 0, ownershipPct: 0, pendingCount: 0 })
  const [recentContributions, setRecentContributions] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [submitForm, setSubmitForm] = useState({ amount: '', month: '', reference: '', notes: '' })
  const [submitMsg, setSubmitMsg] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (profile) fetchData()
  }, [profile])

  const fetchData = async () => {
    setLoading(true)
    const [{ data: contribs }, { data: allShares }] = await Promise.all([
      supabase.from('contributions').select('*').eq('member_id', profile.id).order('created_at', { ascending: false }),
      supabase.from('contributions').select('shares_issued').eq('status', 'approved'),
    ])

    const approved = (contribs || []).filter(c => c.status === 'approved')
    const myShares = approved.reduce((sum, c) => sum + (c.shares_issued || 0), 0)
    const totalShares = (allShares || []).reduce((sum, c) => sum + (c.shares_issued || 0), 0)
    const ownershipPct = totalShares > 0 ? ((myShares / totalShares) * 100).toFixed(2) : '0.00'
    const pending = (contribs || []).filter(c => c.status === 'pending').length

    setStats({
      totalContributed: approved.reduce((sum, c) => sum + (c.amount || 0), 0),
      totalShares: myShares,
      ownershipPct,
      pendingCount: pending,
    })
    setRecentContributions((contribs || []).slice(0, 8))
    setLoading(false)
  }

  const handleSubmitPayment = async () => {
    if (!submitForm.amount || !submitForm.month) { setSubmitMsg('Please fill in amount and month.'); return }
    setSubmitting(true)
    const { error } = await supabase.from('payment_submissions').insert({
      member_id: profile.id,
      amount: parseFloat(submitForm.amount),
      contribution_month: submitForm.month,
      payment_reference: submitForm.reference,
      notes: submitForm.notes,
      status: 'pending',
    })
    setSubmitting(false)
    if (error) { setSubmitMsg('Error submitting. Please try again.'); return }
    setSubmitMsg('Payment submitted successfully! Awaiting approval.')
    setSubmitForm({ amount: '', month: '', reference: '', notes: '' })
    fetchData()
  }

  const fmt = (n) => `₦${Number(n).toLocaleString('en-NG')}`

  return (
    <Layout title="Member Dashboard">
      <div style={{ maxWidth: '1100px', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>

        {/* Welcome */}
        <div>
          <h2 style={{ color: COLORS.white, fontFamily: 'Georgia, serif', fontSize: '1.3rem', margin: 0 }}>
            Welcome back, <span style={{ color: COLORS.gold }}>{profile?.full_name?.split(' ')[0]}</span>
          </h2>
          <p style={{ color: 'rgba(253,252,249,0.45)', fontSize: '0.85rem', marginTop: '0.3rem' }}>
            Here's your shareholder summary for Cowealth Property Ltd.
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <StatCard icon={CreditCard} label="Total Contributed" value={loading ? '...' : fmt(stats.totalContributed)} sub="Approved contributions only" />
          <StatCard icon={PieChart} label="Shares Owned" value={loading ? '...' : stats.totalShares} sub="1 share = ₦50,000 contribution" color="#10B981" />
          <StatCard icon={TrendingUp} label="Ownership Stake" value={loading ? '...' : `${stats.ownershipPct}%`} sub="Of total issued shares" color="#8B5CF6" />
          <StatCard icon={Clock} label="Pending Payments" value={loading ? '...' : stats.pendingCount} sub="Awaiting verification" color="#F59E0B" />
        </div>

        {/* Two column: submit + history */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: '1.25rem' }}>

          {/* Submit payment */}
          <div style={{
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(212,175,55,0.15)',
            borderRadius: '10px', padding: '1.5rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
              <Upload size={18} color={COLORS.gold} />
              <span style={{ color: COLORS.white, fontWeight: 600 }}>Submit Payment</span>
            </div>

            {submitMsg && (
              <div style={{
                background: submitMsg.includes('Error') ? 'rgba(220,38,38,0.1)' : 'rgba(16,185,129,0.1)',
                border: `1px solid ${submitMsg.includes('Error') ? 'rgba(220,38,38,0.3)' : 'rgba(16,185,129,0.3)'}`,
                borderRadius: '6px', padding: '0.65rem 0.9rem', marginBottom: '1rem',
                color: submitMsg.includes('Error') ? '#FCA5A5' : '#6EE7B7', fontSize: '0.85rem',
              }}>{submitMsg}</div>
            )}

            {[
              { label: 'Amount (₦)', key: 'amount', type: 'number', placeholder: '50000' },
              { label: 'Contribution Month', key: 'month', type: 'month', placeholder: '' },
              { label: 'Payment Reference', key: 'reference', type: 'text', placeholder: 'Bank teller / transfer ref' },
              { label: 'Notes (optional)', key: 'notes', type: 'text', placeholder: 'Any additional info' },
            ].map(({ label, key, type, placeholder }) => (
              <div key={key} style={{ marginBottom: '0.85rem' }}>
                <label style={{ color: 'rgba(253,252,249,0.55)', fontSize: '0.78rem', display: 'block', marginBottom: '0.3rem' }}>{label}</label>
                <input
                  type={type} value={submitForm[key]} placeholder={placeholder}
                  onChange={e => setSubmitForm(f => ({ ...f, [key]: e.target.value }))}
                  style={{
                    width: '100%', background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(212,175,55,0.2)', borderRadius: '5px',
                    padding: '0.65rem 0.85rem', color: COLORS.white, fontSize: '0.88rem',
                    outline: 'none', boxSizing: 'border-box',
                  }}
                />
              </div>
            ))}

            <button onClick={handleSubmitPayment} disabled={submitting} style={{
              width: '100%', background: COLORS.gold, color: '#0F172A',
              border: 'none', borderRadius: '6px', padding: '0.75rem',
              fontWeight: 700, cursor: submitting ? 'not-allowed' : 'pointer',
              fontSize: '0.9rem', marginTop: '0.5rem',
              opacity: submitting ? 0.7 : 1,
            }}>
              {submitting ? 'Submitting...' : 'Submit Payment'}
            </button>
          </div>

          {/* Contribution history */}
          <div style={{
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(212,175,55,0.15)',
            borderRadius: '10px', padding: '1.5rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
              <CheckCircle size={18} color={COLORS.gold} />
              <span style={{ color: COLORS.white, fontWeight: 600 }}>Contribution History</span>
            </div>

            {loading ? (
              <div style={{ color: 'rgba(253,252,249,0.4)', textAlign: 'center', padding: '2rem' }}>Loading...</div>
            ) : recentContributions.length === 0 ? (
              <div style={{ color: 'rgba(253,252,249,0.35)', textAlign: 'center', padding: '2rem', fontSize: '0.88rem' }}>
                No contributions yet. Submit your first payment to get started.
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                  <thead>
                    <tr>
                      {['Month', 'Amount', 'Shares', 'Status'].map(h => (
                        <th key={h} style={{
                          textAlign: 'left', color: 'rgba(253,252,249,0.4)',
                          fontWeight: 500, padding: '0.5rem 0.75rem',
                          borderBottom: '1px solid rgba(212,175,55,0.1)', fontSize: '0.78rem',
                        }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {recentContributions.map(c => (
                      <tr key={c.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <td style={{ padding: '0.65rem 0.75rem', color: 'rgba(253,252,249,0.75)' }}>
                          {c.contribution_month || '—'}
                        </td>
                        <td style={{ padding: '0.65rem 0.75rem', color: COLORS.white, fontWeight: 500 }}>
                          {fmt(c.amount)}
                        </td>
                        <td style={{ padding: '0.65rem 0.75rem', color: COLORS.gold }}>
                          {c.shares_issued || 0}
                        </td>
                        <td style={{ padding: '0.65rem 0.75rem' }}>
                          {statusBadge(c.status)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Ownership note */}
        <div style={{
          background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.15)',
          borderRadius: '8px', padding: '1rem 1.25rem',
          display: 'flex', alignItems: 'flex-start', gap: '0.75rem',
        }}>
          <AlertCircle size={16} color={COLORS.gold} style={{ marginTop: '2px', flexShrink: 0 }} />
          <p style={{ color: 'rgba(253,252,249,0.6)', fontSize: '0.83rem', lineHeight: 1.6, margin: 0 }}>
            Shares are only issued upon Treasurer approval of submitted payments. Ownership percentage updates automatically when new shares are issued to any member.
            Monthly contributions are due by the <strong style={{ color: COLORS.white }}>5th of each month</strong>. Late payments attract penalties of ₦1,000 (after 5th) or ₦2,000 (after 10th).
          </p>
        </div>
      </div>
    </Layout>
  )
}
