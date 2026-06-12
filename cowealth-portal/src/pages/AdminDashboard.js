import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { supabase } from '../lib/supabase'
import { Users, CreditCard, PieChart, TrendingUp, CheckCircle, XCircle, Clock } from 'lucide-react'

const COLORS = { green: '#0A2E24', gold: '#D4AF37', white: '#FDFCF9', greenLight: '#133D2F' }

const StatCard = ({ icon: Icon, label, value, color = COLORS.gold }) => (
  <div style={{
    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(212,175,55,0.15)',
    borderRadius: '10px', padding: '1.25rem 1.5rem',
  }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
      <span style={{ color: 'rgba(253,252,249,0.5)', fontSize: '0.82rem' }}>{label}</span>
      <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon size={16} color={color} />
      </div>
    </div>
    <div style={{ color: COLORS.white, fontSize: '1.6rem', fontWeight: 700, fontFamily: 'Georgia, serif' }}>{value}</div>
  </div>
)

export default function AdminDashboard() {
  const [stats, setStats] = useState({ members: 0, totalShares: 0, totalContributed: 0, pendingApprovals: 0 })
  const [pending, setPending] = useState([])
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionMsg, setActionMsg] = useState('')

  useEffect(() => { fetchAll() }, [])

  const fetchAll = async () => {
    setLoading(true)
    const [{ data: mems }, { data: contribs }, { data: submissions }] = await Promise.all([
      supabase.from('members').select('*').order('full_name'),
      supabase.from('contributions').select('*').eq('status', 'approved'),
      supabase.from('payment_submissions').select('*, members(full_name, email)').eq('status', 'pending').order('created_at'),
    ])

    const totalShares = (contribs || []).reduce((s, c) => s + (c.shares_issued || 0), 0)
    const totalContributed = (contribs || []).reduce((s, c) => s + (c.amount || 0), 0)

    setStats({
      members: (mems || []).length,
      totalShares,
      totalContributed,
      pendingApprovals: (submissions || []).length,
    })
    setPending(submissions || [])
    setMembers(mems || [])
    setLoading(false)
  }

  const handleApprove = async (sub) => {
    const shares = Math.floor(sub.amount / 50000)
    const { error: contribErr } = await supabase.from('contributions').insert({
      member_id: sub.member_id,
      amount: sub.amount,
      contribution_month: sub.contribution_month,
      payment_reference: sub.payment_reference,
      shares_issued: shares,
      status: 'approved',
      approved_at: new Date().toISOString(),
    })
    if (contribErr) { setActionMsg('Error approving. Try again.'); return }
    await supabase.from('payment_submissions').update({ status: 'approved' }).eq('id', sub.id)
    setActionMsg(`Approved! ${shares} share(s) issued.`)
    fetchAll()
  }

  const handleReject = async (id) => {
    await supabase.from('payment_submissions').update({ status: 'rejected' }).eq('id', id)
    setActionMsg('Payment submission rejected.')
    fetchAll()
  }

  const fmt = (n) => `₦${Number(n).toLocaleString('en-NG')}`

  // Compute per-member ownership
  const memberOwnership = members.map(m => {
    const myShares = 0 // will recalc below
    return { ...m, shares: 0 }
  })

  return (
    <Layout title="Admin Dashboard">
      <div style={{ maxWidth: '1100px', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>

        <div>
          <h2 style={{ color: COLORS.white, fontFamily: 'Georgia, serif', fontSize: '1.3rem', margin: 0 }}>
            Admin <span style={{ color: COLORS.gold }}>Overview</span>
          </h2>
          <p style={{ color: 'rgba(253,252,249,0.45)', fontSize: '0.85rem', marginTop: '0.3rem' }}>
            Full company view — contributions, shares, and pending approvals.
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '1rem' }}>
          <StatCard icon={Users} label="Total Members" value={stats.members} />
          <StatCard icon={PieChart} label="Total Shares Issued" value={stats.totalShares} color="#10B981" />
          <StatCard icon={CreditCard} label="Total Contributed" value={fmt(stats.totalContributed)} color="#8B5CF6" />
          <StatCard icon={Clock} label="Pending Approvals" value={stats.pendingApprovals} color="#F59E0B" />
        </div>

        {/* Action message */}
        {actionMsg && (
          <div style={{
            background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)',
            borderRadius: '6px', padding: '0.75rem 1rem', color: '#6EE7B7', fontSize: '0.88rem',
          }}>{actionMsg}</div>
        )}

        {/* Pending Approvals */}
        <div style={{
          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(212,175,55,0.15)',
          borderRadius: '10px', padding: '1.5rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
            <Clock size={18} color={COLORS.gold} />
            <span style={{ color: COLORS.white, fontWeight: 600 }}>Pending Payment Approvals</span>
            {pending.length > 0 && (
              <span style={{ background: '#F59E0B20', color: '#F59E0B', borderRadius: '100px', padding: '0.15rem 0.6rem', fontSize: '0.75rem', fontWeight: 700 }}>
                {pending.length}
              </span>
            )}
          </div>

          {loading ? (
            <div style={{ color: 'rgba(253,252,249,0.4)', textAlign: 'center', padding: '2rem' }}>Loading...</div>
          ) : pending.length === 0 ? (
            <div style={{ color: 'rgba(253,252,249,0.35)', textAlign: 'center', padding: '2rem', fontSize: '0.88rem' }}>
              No pending approvals at this time.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {pending.map(sub => (
                <div key={sub.id} style={{
                  background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '8px', padding: '1rem 1.25rem',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem',
                }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                    <span style={{ color: COLORS.white, fontWeight: 600 }}>{sub.members?.full_name || 'Unknown'}</span>
                    <span style={{ color: 'rgba(253,252,249,0.45)', fontSize: '0.8rem' }}>{sub.members?.email}</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', alignItems: 'flex-end' }}>
                    <span style={{ color: COLORS.gold, fontWeight: 700 }}>{fmt(sub.amount)}</span>
                    <span style={{ color: 'rgba(253,252,249,0.45)', fontSize: '0.78rem' }}>{sub.contribution_month} · {sub.payment_reference || 'No ref'}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => handleApprove(sub)} style={{
                      display: 'flex', alignItems: 'center', gap: '0.4rem',
                      background: 'rgba(16,185,129,0.15)', color: '#10B981',
                      border: '1px solid rgba(16,185,129,0.3)', borderRadius: '6px',
                      padding: '0.5rem 1rem', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600,
                    }}>
                      <CheckCircle size={14} /> Approve
                    </button>
                    <button onClick={() => handleReject(sub.id)} style={{
                      display: 'flex', alignItems: 'center', gap: '0.4rem',
                      background: 'rgba(239,68,68,0.12)', color: '#EF4444',
                      border: '1px solid rgba(239,68,68,0.3)', borderRadius: '6px',
                      padding: '0.5rem 1rem', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600,
                    }}>
                      <XCircle size={14} /> Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Members table */}
        <div style={{
          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(212,175,55,0.15)',
          borderRadius: '10px', padding: '1.5rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
            <Users size={18} color={COLORS.gold} />
            <span style={{ color: COLORS.white, fontWeight: 600 }}>Shareholder Register</span>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr>
                  {['Name', 'Email', 'Role', 'Member Since'].map(h => (
                    <th key={h} style={{
                      textAlign: 'left', color: 'rgba(253,252,249,0.4)', fontWeight: 500,
                      padding: '0.5rem 0.75rem', borderBottom: '1px solid rgba(212,175,55,0.1)', fontSize: '0.78rem',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {members.map(m => (
                  <tr key={m.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ padding: '0.65rem 0.75rem', color: COLORS.white, fontWeight: 500 }}>{m.full_name}</td>
                    <td style={{ padding: '0.65rem 0.75rem', color: 'rgba(253,252,249,0.6)' }}>{m.email}</td>
                    <td style={{ padding: '0.65rem 0.75rem' }}>
                      <span style={{
                        background: 'rgba(212,175,55,0.12)', color: COLORS.gold,
                        borderRadius: '100px', padding: '0.15rem 0.65rem', fontSize: '0.75rem', fontWeight: 600,
                      }}>{m.role}</span>
                    </td>
                    <td style={{ padding: '0.65rem 0.75rem', color: 'rgba(253,252,249,0.5)', fontSize: '0.8rem' }}>
                      {m.created_at ? new Date(m.created_at).toLocaleDateString('en-NG') : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  )
}
