import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { supabase } from '../lib/supabase'
import { CreditCard, TrendingUp, CheckCircle, XCircle, DollarSign, FileText } from 'lucide-react'

const COLORS = { gold: '#D4AF37', white: '#FDFCF9' }
const fmt = (n) => `₦${Number(n).toLocaleString('en-NG')}`

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

export default function FinanceDashboard() {
  const [pending, setPending] = useState([])
  const [approved, setApproved] = useState([])
  const [stats, setStats] = useState({ totalApproved: 0, totalShares: 0, thisMonth: 0 })
  const [loading, setLoading] = useState(true)
  const [msg, setMsg] = useState('')

  useEffect(() => { fetchAll() }, [])

  const fetchAll = async () => {
    setLoading(true)
    const [{ data: subs }, { data: contribs }] = await Promise.all([
      supabase.from('payment_submissions').select('*, members(full_name, email)').order('created_at', { ascending: false }),
      supabase.from('contributions').select('*').eq('status', 'approved'),
    ])

    const pendingList = (subs || []).filter(s => s.status === 'pending')
    const approvedList = (subs || []).filter(s => s.status === 'approved').slice(0, 10)
    const totalApproved = (contribs || []).reduce((s, c) => s + (c.amount || 0), 0)
    const totalShares = (contribs || []).reduce((s, c) => s + (c.shares_issued || 0), 0)
    const thisMonth = (contribs || []).filter(c => c.contribution_month === new Date().toISOString().slice(0, 7)).reduce((s, c) => s + c.amount, 0)

    setPending(pendingList)
    setApproved(approvedList)
    setStats({ totalApproved, totalShares, thisMonth })
    setLoading(false)
  }

  const handleApprove = async (sub) => {
    const shares = Math.floor(sub.amount / 50000)
    await supabase.from('contributions').insert({
      member_id: sub.member_id, amount: sub.amount,
      contribution_month: sub.contribution_month,
      payment_reference: sub.payment_reference,
      shares_issued: shares, status: 'approved',
      approved_at: new Date().toISOString(),
    })
    await supabase.from('payment_submissions').update({ status: 'approved' }).eq('id', sub.id)
    setMsg(`✓ ${sub.members?.full_name} — ${shares} share(s) issued for ${fmt(sub.amount)}`)
    fetchAll()
  }

  const handleReject = async (id) => {
    await supabase.from('payment_submissions').update({ status: 'rejected' }).eq('id', id)
    setMsg('Payment submission rejected.')
    fetchAll()
  }

  return (
    <Layout title="Finance Dashboard">
      <div style={{ maxWidth: '1100px', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
        <div>
          <h2 style={{ color: COLORS.white, fontFamily: 'Georgia, serif', fontSize: '1.3rem', margin: 0 }}>
            Treasurer <span style={{ color: COLORS.gold }}>Dashboard</span>
          </h2>
          <p style={{ color: 'rgba(253,252,249,0.45)', fontSize: '0.85rem', marginTop: '0.3rem' }}>
            Verify payment submissions and manage contribution records.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '1rem' }}>
          <StatCard icon={DollarSign} label="Total Approved Contributions" value={fmt(stats.totalApproved)} />
          <StatCard icon={CreditCard} label="Total Shares Issued" value={stats.totalShares} color="#10B981" />
          <StatCard icon={TrendingUp} label="This Month's Collections" value={fmt(stats.thisMonth)} color="#8B5CF6" />
          <StatCard icon={FileText} label="Pending Verifications" value={pending.length} color="#F59E0B" />
        </div>

        {msg && (
          <div style={{
            background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)',
            borderRadius: '6px', padding: '0.75rem 1rem', color: '#6EE7B7', fontSize: '0.88rem',
          }}>{msg}</div>
        )}

        {/* Pending verification */}
        <div style={{
          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(212,175,55,0.15)',
          borderRadius: '10px', padding: '1.5rem',
        }}>
          <div style={{ color: COLORS.white, fontWeight: 600, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <CheckCircle size={18} color={COLORS.gold} />
            Payment Verification Queue
            {pending.length > 0 && (
              <span style={{ background: '#F59E0B20', color: '#F59E0B', borderRadius: '100px', padding: '0.15rem 0.6rem', fontSize: '0.75rem', fontWeight: 700 }}>
                {pending.length} pending
              </span>
            )}
          </div>

          {loading ? (
            <div style={{ color: 'rgba(253,252,249,0.4)', textAlign: 'center', padding: '2rem' }}>Loading...</div>
          ) : pending.length === 0 ? (
            <div style={{ color: 'rgba(253,252,249,0.35)', textAlign: 'center', padding: '2rem', fontSize: '0.88rem' }}>
              All submissions have been processed.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {pending.map(sub => (
                <div key={sub.id} style={{
                  background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '8px', padding: '1rem 1.25rem',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem',
                }}>
                  <div>
                    <div style={{ color: COLORS.white, fontWeight: 600 }}>{sub.members?.full_name}</div>
                    <div style={{ color: 'rgba(253,252,249,0.45)', fontSize: '0.78rem', marginTop: '0.15rem' }}>
                      {sub.contribution_month} · Ref: {sub.payment_reference || 'None'} · {sub.notes || ''}
                    </div>
                  </div>
                  <div style={{ color: COLORS.gold, fontWeight: 700, fontSize: '1.05rem' }}>{fmt(sub.amount)}</div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => handleApprove(sub)} style={{
                      display: 'flex', alignItems: 'center', gap: '0.4rem',
                      background: 'rgba(16,185,129,0.15)', color: '#10B981',
                      border: '1px solid rgba(16,185,129,0.3)', borderRadius: '6px',
                      padding: '0.5rem 0.9rem', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600,
                    }}>
                      <CheckCircle size={14} /> Approve & Issue Shares
                    </button>
                    <button onClick={() => handleReject(sub.id)} style={{
                      display: 'flex', alignItems: 'center', gap: '0.4rem',
                      background: 'rgba(239,68,68,0.12)', color: '#EF4444',
                      border: '1px solid rgba(239,68,68,0.3)', borderRadius: '6px',
                      padding: '0.5rem 0.9rem', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600,
                    }}>
                      <XCircle size={14} /> Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent approvals */}
        <div style={{
          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(212,175,55,0.15)',
          borderRadius: '10px', padding: '1.5rem',
        }}>
          <div style={{ color: COLORS.white, fontWeight: 600, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <FileText size={18} color={COLORS.gold} />
            Recent Approvals
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr>
                  {['Member', 'Month', 'Amount', 'Reference', 'Date'].map(h => (
                    <th key={h} style={{
                      textAlign: 'left', color: 'rgba(253,252,249,0.4)', fontWeight: 500,
                      padding: '0.5rem 0.75rem', borderBottom: '1px solid rgba(212,175,55,0.1)', fontSize: '0.78rem',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {approved.map(s => (
                  <tr key={s.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ padding: '0.65rem 0.75rem', color: COLORS.white }}>{s.members?.full_name || '—'}</td>
                    <td style={{ padding: '0.65rem 0.75rem', color: 'rgba(253,252,249,0.7)' }}>{s.contribution_month || '—'}</td>
                    <td style={{ padding: '0.65rem 0.75rem', color: COLORS.gold, fontWeight: 600 }}>{fmt(s.amount)}</td>
                    <td style={{ padding: '0.65rem 0.75rem', color: 'rgba(253,252,249,0.5)', fontSize: '0.8rem' }}>{s.payment_reference || '—'}</td>
                    <td style={{ padding: '0.65rem 0.75rem', color: 'rgba(253,252,249,0.4)', fontSize: '0.78rem' }}>
                      {s.created_at ? new Date(s.created_at).toLocaleDateString('en-NG') : '—'}
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
