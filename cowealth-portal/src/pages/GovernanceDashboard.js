import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { supabase } from '../lib/supabase'
import { FileText, Plus, Users, Calendar } from 'lucide-react'

const COLORS = { gold: '#D4AF37', white: '#FDFCF9' }

export default function GovernanceDashboard() {
  const [minutes, setMinutes] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ title: '', date: '', summary: '', attendees: '' })
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => { fetchMinutes() }, [])

  const fetchMinutes = async () => {
    setLoading(true)
    const { data } = await supabase.from('meeting_minutes').select('*').order('meeting_date', { ascending: false })
    setMinutes(data || [])
    setLoading(false)
  }

  const handleSave = async () => {
    if (!form.title || !form.date) { setMsg('Title and date are required.'); return }
    setSaving(true)
    const { error } = await supabase.from('meeting_minutes').insert({
      title: form.title, meeting_date: form.date,
      summary: form.summary, attendees: form.attendees,
    })
    setSaving(false)
    if (error) { setMsg('Error saving. Try again.'); return }
    setMsg('Meeting minutes saved successfully.')
    setForm({ title: '', date: '', summary: '', attendees: '' })
    fetchMinutes()
  }

  const inputStyle = {
    width: '100%', background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(212,175,55,0.2)', borderRadius: '5px',
    padding: '0.65rem 0.85rem', color: COLORS.white, fontSize: '0.88rem',
    outline: 'none', boxSizing: 'border-box',
  }

  return (
    <Layout title="Governance Dashboard">
      <div style={{ maxWidth: '1100px', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
        <div>
          <h2 style={{ color: COLORS.white, fontFamily: 'Georgia, serif', fontSize: '1.3rem', margin: 0 }}>
            Secretary <span style={{ color: COLORS.gold }}>Dashboard</span>
          </h2>
          <p style={{ color: 'rgba(253,252,249,0.45)', fontSize: '0.85rem', marginTop: '0.3rem' }}>
            Record meeting minutes and manage governance documents.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '1.25rem' }}>
          {/* Add minutes form */}
          <div style={{
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(212,175,55,0.15)',
            borderRadius: '10px', padding: '1.5rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
              <Plus size={18} color={COLORS.gold} />
              <span style={{ color: COLORS.white, fontWeight: 600 }}>Record Meeting Minutes</span>
            </div>

            {msg && (
              <div style={{
                background: msg.includes('Error') ? 'rgba(220,38,38,0.1)' : 'rgba(16,185,129,0.1)',
                border: `1px solid ${msg.includes('Error') ? 'rgba(220,38,38,0.3)' : 'rgba(16,185,129,0.3)'}`,
                borderRadius: '6px', padding: '0.65rem 0.9rem', marginBottom: '1rem',
                color: msg.includes('Error') ? '#FCA5A5' : '#6EE7B7', fontSize: '0.85rem',
              }}>{msg}</div>
            )}

            {[
              { label: 'Meeting Title', key: 'title', type: 'text', placeholder: 'e.g. Q1 General Meeting 2026' },
              { label: 'Meeting Date', key: 'date', type: 'date', placeholder: '' },
              { label: 'Attendees', key: 'attendees', type: 'text', placeholder: 'e.g. Lucky, Ella, Franca, Nathan' },
            ].map(({ label, key, type, placeholder }) => (
              <div key={key} style={{ marginBottom: '0.85rem' }}>
                <label style={{ color: 'rgba(253,252,249,0.55)', fontSize: '0.78rem', display: 'block', marginBottom: '0.3rem' }}>{label}</label>
                <input type={type} value={form[key]} placeholder={placeholder}
                  onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                  style={inputStyle}
                />
              </div>
            ))}

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ color: 'rgba(253,252,249,0.55)', fontSize: '0.78rem', display: 'block', marginBottom: '0.3rem' }}>Summary / Key Decisions</label>
              <textarea rows={5} value={form.summary} placeholder="Record key decisions, resolutions, and action items..."
                onChange={e => setForm(f => ({ ...f, summary: e.target.value }))}
                style={{ ...inputStyle, resize: 'vertical' }}
              />
            </div>

            <button onClick={handleSave} disabled={saving} style={{
              width: '100%', background: COLORS.gold, color: '#0F172A',
              border: 'none', borderRadius: '6px', padding: '0.75rem',
              fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', fontSize: '0.9rem',
              opacity: saving ? 0.7 : 1,
            }}>
              {saving ? 'Saving...' : 'Save Minutes'}
            </button>
          </div>

          {/* Minutes history */}
          <div style={{
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(212,175,55,0.15)',
            borderRadius: '10px', padding: '1.5rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
              <FileText size={18} color={COLORS.gold} />
              <span style={{ color: COLORS.white, fontWeight: 600 }}>Meeting Records</span>
            </div>

            {loading ? (
              <div style={{ color: 'rgba(253,252,249,0.4)', textAlign: 'center', padding: '2rem' }}>Loading...</div>
            ) : minutes.length === 0 ? (
              <div style={{ color: 'rgba(253,252,249,0.35)', textAlign: 'center', padding: '2rem', fontSize: '0.88rem' }}>
                No meeting minutes recorded yet.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {minutes.map(m => (
                  <div key={m.id} style={{
                    background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '8px', padding: '1rem 1.25rem',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.6rem' }}>
                      <span style={{ color: COLORS.white, fontWeight: 600, fontSize: '0.95rem' }}>{m.title}</span>
                      <span style={{
                        background: 'rgba(212,175,55,0.1)', color: COLORS.gold,
                        borderRadius: '100px', padding: '0.15rem 0.65rem', fontSize: '0.75rem',
                        display: 'flex', alignItems: 'center', gap: '0.35rem',
                      }}>
                        <Calendar size={11} />
                        {m.meeting_date ? new Date(m.meeting_date).toLocaleDateString('en-NG') : '—'}
                      </span>
                    </div>
                    {m.attendees && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
                        <Users size={12} color="rgba(253,252,249,0.4)" />
                        <span style={{ color: 'rgba(253,252,249,0.45)', fontSize: '0.78rem' }}>{m.attendees}</span>
                      </div>
                    )}
                    {m.summary && (
                      <p style={{ color: 'rgba(253,252,249,0.65)', fontSize: '0.83rem', lineHeight: 1.6, margin: 0 }}>
                        {m.summary.length > 200 ? m.summary.slice(0, 200) + '...' : m.summary}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}
