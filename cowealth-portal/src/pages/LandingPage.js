import React, { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ShieldCheck, TrendingUp, FileText, Bell, PieChart,
  Users, Lock, ChevronDown, Building2, Landmark, Sprout,
  BarChart3, Mail, Phone
} from 'lucide-react'

const COLORS = {
  green: '#0A2E24',
  gold: '#D4AF37',
  white: '#FDFCF9',
  navy: '#0F172A',
  goldLight: '#F0D070',
  greenLight: '#133D2F',
  greenMid: '#0E3D2F',
}

const styles = {
  nav: {
    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
    background: 'rgba(10,46,36,0.97)', backdropFilter: 'blur(8px)',
    borderBottom: `1px solid rgba(212,175,55,0.15)`,
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '0 5%', height: '68px',
  },
  logo: {
    fontFamily: 'Georgia, serif', fontWeight: 700, fontSize: '1.25rem',
    color: COLORS.gold, letterSpacing: '0.02em',
  },
  logoSub: { fontSize: '0.65rem', color: 'rgba(212,175,55,0.6)', display: 'block', letterSpacing: '0.12em' },
  btnPrimary: {
    background: COLORS.gold, color: COLORS.navy, border: 'none',
    padding: '0.6rem 1.4rem', borderRadius: '4px', fontWeight: 700,
    cursor: 'pointer', fontSize: '0.9rem', letterSpacing: '0.04em',
    transition: 'all 0.2s',
  },
  btnOutline: {
    background: 'transparent', color: COLORS.gold,
    border: `1.5px solid ${COLORS.gold}`,
    padding: '0.6rem 1.4rem', borderRadius: '4px', fontWeight: 600,
    cursor: 'pointer', fontSize: '0.9rem', letterSpacing: '0.04em',
    transition: 'all 0.2s',
  },
  section: { padding: '80px 5%' },
  sectionAlt: { padding: '80px 5%', background: COLORS.greenLight },
  h2: {
    fontFamily: 'Georgia, serif', fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
    color: COLORS.gold, marginBottom: '0.5rem', fontWeight: 700,
  },
  divider: { width: '48px', height: '3px', background: COLORS.gold, margin: '0 0 1.5rem 0', borderRadius: '2px' },
  p: { color: 'rgba(253,252,249,0.82)', lineHeight: 1.8, fontSize: '1rem', maxWidth: '680px' },
}

const BenefitCard = ({ icon: Icon, title, desc }) => (
  <div style={{
    background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.18)',
    borderRadius: '8px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem',
  }}>
    <div style={{
      width: '42px', height: '42px', borderRadius: '8px',
      background: 'rgba(212,175,55,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <Icon size={20} color={COLORS.gold} />
    </div>
    <div style={{ fontFamily: 'Georgia, serif', color: COLORS.white, fontWeight: 600, fontSize: '1rem' }}>{title}</div>
    <div style={{ color: 'rgba(253,252,249,0.65)', fontSize: '0.88rem', lineHeight: 1.7 }}>{desc}</div>
  </div>
)

const Step = ({ n, title, desc }) => (
  <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
    <div style={{
      minWidth: '40px', height: '40px', borderRadius: '50%',
      background: COLORS.gold, color: COLORS.navy,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontWeight: 800, fontSize: '1rem', fontFamily: 'Georgia, serif',
    }}>{n}</div>
    <div>
      <div style={{ color: COLORS.white, fontWeight: 600, marginBottom: '0.3rem' }}>{title}</div>
      <div style={{ color: 'rgba(253,252,249,0.65)', fontSize: '0.9rem', lineHeight: 1.6 }}>{desc}</div>
    </div>
  </div>
)

const FAQ = ({ q, a }) => {
  const [open, setOpen] = React.useState(false)
  return (
    <div style={{
      border: '1px solid rgba(212,175,55,0.2)', borderRadius: '6px',
      overflow: 'hidden', marginBottom: '0.75rem',
    }}>
      <button onClick={() => setOpen(!open)} style={{
        width: '100%', background: 'rgba(212,175,55,0.05)', border: 'none',
        padding: '1rem 1.25rem', display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', cursor: 'pointer', color: COLORS.white,
        fontWeight: 600, fontSize: '0.95rem', textAlign: 'left',
      }}>
        {q}
        <ChevronDown size={18} color={COLORS.gold} style={{ transform: open ? 'rotate(180deg)' : 'none', transition: '0.2s' }} />
      </button>
      {open && (
        <div style={{ padding: '1rem 1.25rem', color: 'rgba(253,252,249,0.75)', fontSize: '0.9rem', lineHeight: 1.7, borderTop: '1px solid rgba(212,175,55,0.1)' }}>
          {a}
        </div>
      )}
    </div>
  )
}

export default function LandingPage() {
  const navigate = useNavigate()
  const aboutRef = useRef(null)

  const scrollToAbout = () => aboutRef.current?.scrollIntoView({ behavior: 'smooth' })

  return (
    <div style={{ background: COLORS.green, color: COLORS.white, minHeight: '100vh', fontFamily: "'Segoe UI', system-ui, sans-serif" }}>

      {/* NAV */}
      <nav style={styles.nav}>
        <div>
          <span style={styles.logo}>COWEALTH</span>
          <span style={styles.logoSub}>PROPERTY LIMITED</span>
        </div>
        <button style={styles.btnPrimary} onClick={() => navigate('/login')}>Login to Portal</button>
      </nav>

      {/* HERO */}
      <section style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', textAlign: 'center',
        padding: '120px 5% 80px',
        background: `radial-gradient(ellipse at 60% 40%, rgba(212,175,55,0.08) 0%, transparent 70%), ${COLORS.green}`,
      }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
          background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.25)',
          borderRadius: '100px', padding: '0.35rem 1rem', marginBottom: '2rem',
          color: COLORS.gold, fontSize: '0.8rem', letterSpacing: '0.1em', fontWeight: 600,
        }}>
          <ShieldCheck size={14} /> SECURE SHAREHOLDER PORTAL
        </div>

        <h1 style={{
          fontFamily: 'Georgia, serif', fontSize: 'clamp(2rem, 5vw, 3.8rem)',
          fontWeight: 700, color: COLORS.white, maxWidth: '820px', lineHeight: 1.2,
          marginBottom: '1.25rem',
        }}>
          Cowealth Property Ltd<br />
          <span style={{ color: COLORS.gold }}>Shareholder Portal</span>
        </h1>

        <p style={{ ...styles.p, textAlign: 'center', margin: '0 auto 2.5rem', fontSize: '1.1rem' }}>
          A secure digital platform for tracking shareholder contributions, ownership, investments, documents, and company financial records.
        </p>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button style={{ ...styles.btnPrimary, padding: '0.85rem 2rem', fontSize: '1rem' }} onClick={() => navigate('/login')}>
            Login to Portal
          </button>
          <button style={{ ...styles.btnOutline, padding: '0.85rem 2rem', fontSize: '1rem' }} onClick={scrollToAbout}>
            Learn More
          </button>
        </div>

        <div style={{ marginTop: '4rem', display: 'flex', gap: '2.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          {[['9', 'Shareholders'], ['₦50,000', 'Monthly Contribution'], ['10', 'Year Investment Horizon']].map(([val, label]) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'Georgia, serif', fontSize: '1.8rem', color: COLORS.gold, fontWeight: 700 }}>{val}</div>
              <div style={{ fontSize: '0.78rem', color: 'rgba(253,252,249,0.5)', letterSpacing: '0.08em' }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT */}
      <section ref={aboutRef} style={styles.sectionAlt}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <h2 style={styles.h2}>About Cowealth Property Ltd</h2>
          <div style={styles.divider} />
          <p style={styles.p}>
            Cowealth Property Ltd is a registered private shareholder investment company created to pool member contributions, invest collectively, and build long-term wealth through transparent ownership and disciplined financial management.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginTop: '2.5rem' }}>
            {[
              [Building2, 'Property Investment'],
              [Landmark, 'Land Banking'],
              [TrendingUp, 'Income-Generating Assets'],
              [PieChart, 'Shareholder Contributions'],
              [Sprout, 'Long-Term Wealth Creation'],
            ].map(([Icon, label]) => (
              <div key={label} style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                background: 'rgba(212,175,55,0.07)', borderRadius: '6px',
                padding: '0.85rem 1rem', border: '1px solid rgba(212,175,55,0.12)',
              }}>
                <Icon size={18} color={COLORS.gold} />
                <span style={{ fontSize: '0.88rem', color: COLORS.white, fontWeight: 500 }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={styles.section}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <h2 style={styles.h2}>How It Works</h2>
          <div style={styles.divider} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', maxWidth: '640px' }}>
            <Step n="1" title="Members contribute monthly" desc="Each shareholder contributes ₦50,000 monthly into the company bank account." />
            <Step n="2" title="Contributions are verified and approved" desc="The Treasurer or Admin reviews submitted payment receipts and approves verified contributions." />
            <Step n="3" title="Approved contributions convert to shares" desc="Every ₦50,000 approved equals one (1) share in the company." />
            <Step n="4" title="Shares determine ownership percentage" desc="Your ownership percentage is calculated as your total shares divided by total issued shares." />
            <Step n="5" title="Shareholders benefit from portfolio growth" desc="Company funds are deployed into approved investments. Returns are distributed proportional to shares held." />
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section style={styles.sectionAlt}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <h2 style={styles.h2}>Platform Benefits</h2>
          <div style={styles.divider} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginTop: '1rem' }}>
            <BenefitCard icon={BarChart3} title="Contribution Tracking" desc="Every payment is recorded, verified, and permanently linked to your account." />
            <BenefitCard icon={PieChart} title="Share Allocation" desc="Shares are automatically calculated and issued upon contribution approval." />
            <BenefitCard icon={TrendingUp} title="Ownership Percentage" desc="See your real-time ownership stake in the company at any time." />
            <BenefitCard icon={Landmark} title="Investment Portfolio" desc="Track where company funds are deployed and how they are performing." />
            <BenefitCard icon={ShieldCheck} title="Financial Transparency" desc="Access company dashboards, expense records, and financial summaries." />
            <BenefitCard icon={FileText} title="Document Vault" desc="Shareholder agreements, CAC documents, and meeting minutes — all in one place." />
            <BenefitCard icon={Bell} title="Member Notifications" desc="Get notified when payments are approved, documents are shared, or decisions are made." />
            <BenefitCard icon={Users} title="Governance Records" desc="Meeting minutes, resolutions, and shareholder decisions are permanently recorded." />
          </div>
        </div>
      </section>

      {/* TRANSPARENCY */}
      <section style={styles.section}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
          <div>
            <h2 style={styles.h2}>Transparency & Governance</h2>
            <div style={styles.divider} />
            <p style={styles.p}>
              The portal maintains transparent records of contributions, expenses, investments, ownership, documents, and all shareholder activity. Every naira in and out is logged and auditable.
            </p>
            <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {['Verified payment records', 'Approved contribution history', 'Investment summaries', 'Financial dashboards', 'Company documents', 'Governance records'].map(item => (
                <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'rgba(253,252,249,0.8)', fontSize: '0.92rem' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: COLORS.gold, flexShrink: 0 }} />
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div style={{
            background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.18)',
            borderRadius: '12px', padding: '2rem',
          }}>
            <h2 style={styles.h2}>Investment Strategy</h2>
            <div style={styles.divider} />
            <p style={{ ...styles.p, marginBottom: '1.25rem' }}>
              Cowealth invests pooled capital into lawful, approved opportunities designed to preserve capital, generate returns, and build long-term shareholder value.
            </p>
            {['Land Banking & Real Estate', 'Nigerian Exchange Listed Stocks', 'Treasury Bills & Fixed Deposits', 'Mutual Funds & Collective Schemes', 'Business Investments'].map(item => (
              <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'rgba(253,252,249,0.75)', fontSize: '0.88rem', marginBottom: '0.5rem' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: COLORS.gold, flexShrink: 0 }} />
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SHAREHOLDER ACCESS */}
      <section style={{ ...styles.sectionAlt, textAlign: 'center' }}>
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          <Lock size={36} color={COLORS.gold} style={{ marginBottom: '1rem' }} />
          <h2 style={styles.h2}>Shareholder Access</h2>
          <div style={{ ...styles.divider, margin: '0 auto 1.5rem' }} />
          <p style={{ ...styles.p, textAlign: 'center', margin: '0 auto 2rem' }}>
            Registered shareholders log in to view their personal contribution history, shares owned, ownership percentage, payment status, documents, notifications, and company investment summaries.
          </p>
          <button style={{ ...styles.btnPrimary, padding: '0.9rem 2.5rem', fontSize: '1rem' }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' }) || window.location.assign('/login')}>
            Login to Portal
          </button>
        </div>
      </section>

      {/* FAQ */}
      <section style={styles.section}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <h2 style={styles.h2}>Frequently Asked Questions</h2>
          <div style={styles.divider} />
          <FAQ q="How are shares allocated?" a="Approved member contributions are converted into shares at a rate of ₦50,000 per share. Every contribution must be verified by the Treasurer or Admin before shares are issued." />
          <FAQ q="How are profits shared?" a="Profits are shared based on each shareholder's ownership percentage, which is calculated as their total shares divided by total issued shares of the company." />
          <FAQ q="Can members see company investments?" a="Yes. Members can view approved investment summaries, portfolio allocation, and company financial reports through the member dashboard." />
          <FAQ q="What happens when a new member joins?" a="New members are admitted based on the current share valuation, ensuring existing shareholders are protected from dilution. They purchase shares at the prevailing market value, not the original ₦50,000." />
          <FAQ q="What are the late payment penalties?" a="Payments after the 5th day of the month incur a ₦1,000 penalty. Payments after the 10th day incur a ₦2,000 penalty. Penalties do not convert to shares." />
        </div>
      </section>

      {/* CONTACT */}
      <section style={{ ...styles.sectionAlt }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'start' }}>
          <div>
            <h2 style={styles.h2}>Contact & Support</h2>
            <div style={styles.divider} />
            <p style={{ ...styles.p, marginBottom: '1.5rem' }}>
              For access issues, payment verification, or shareholder record enquiries, please contact the Cowealth administrator.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'rgba(253,252,249,0.8)' }}>
                <Mail size={18} color={COLORS.gold} />
                <span>chatroom.i@gmail.com</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'rgba(253,252,249,0.8)' }}>
                <Phone size={18} color={COLORS.gold} />
                <span>+234 08161566561</span>
              </div>
            </div>
          </div>
          <div style={{
            background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.18)',
            borderRadius: '8px', padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1rem'
          }}>
            <div style={{ color: COLORS.gold, fontWeight: 700, fontFamily: 'Georgia, serif', fontSize: '1.1rem' }}>Send a Message</div>
            {['Your Name', 'Your Email'].map(ph => (
              <input key={ph} placeholder={ph} style={{
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(212,175,55,0.2)',
                borderRadius: '4px', padding: '0.7rem 1rem', color: COLORS.white,
                fontSize: '0.9rem', outline: 'none', width: '100%', boxSizing: 'border-box',
              }} />
            ))}
            <textarea placeholder="Your message" rows={4} style={{
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(212,175,55,0.2)',
              borderRadius: '4px', padding: '0.7rem 1rem', color: COLORS.white,
              fontSize: '0.9rem', outline: 'none', width: '100%', boxSizing: 'border-box', resize: 'vertical',
            }} />
            <button style={styles.btnPrimary}>Send Message</button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{
        background: COLORS.navy, padding: '2rem 5%', textAlign: 'center',
        borderTop: `1px solid rgba(212,175,55,0.1)`,
      }}>
        <div style={{ color: COLORS.gold, fontFamily: 'Georgia, serif', fontWeight: 700, marginBottom: '0.5rem' }}>
          COWEALTH PROPERTY LIMITED
        </div>
        <div style={{ color: 'rgba(253,252,249,0.35)', fontSize: '0.8rem' }}>
          Incorporated under CAMA 2020 · Private Shareholder Investment Company · Nigeria
        </div>
      </footer>
    </div>
  )
}
