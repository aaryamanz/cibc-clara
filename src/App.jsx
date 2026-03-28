import { useState } from 'react'
import Header from './components/Header.jsx'
import SpendingInput from './components/SpendingInput.jsx'
import RewardOptimizer from './components/RewardOptimizer.jsx'
import ClaraChat from './components/ClaraChat.jsx'

export default function App() {
  const [spending, setSpending] = useState({
    groceries: 800,
    dining: 350,
    travel: 250,
    gas: 180,
    other: 200,
  })
  const [optimizerResult, setOptimizerResult] = useState(null)
  const [activeSection, setActiveSection] = useState('spending')

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cibc-off-white)' }}>
      <Header />

      {/* Hero */}
      <section style={{
        background: 'linear-gradient(135deg, var(--cibc-navy) 0%, #1A2F4A 60%, #0D2040 100%)',
        padding: '64px 24px 80px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Background pattern */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.04,
          backgroundImage: 'radial-gradient(circle at 25% 25%, #C41230 0%, transparent 50%), radial-gradient(circle at 75% 75%, #C41230 0%, transparent 50%)',
        }} />

        <div style={{ position: 'relative', maxWidth: 720, margin: '0 auto', animation: 'fadeUp 0.6s ease forwards' }}>
          {/* TGRP Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(196,18,48,0.15)', border: '1px solid rgba(196,18,48,0.4)',
            borderRadius: 100, padding: '6px 16px', marginBottom: 28,
          }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--cibc-red)', animation: 'pulse 2s infinite' }} />
            <span style={{ fontSize: 12, fontWeight: 600, color: '#F5A0AC', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              TGRP Case Study · Live MVP
            </span>
          </div>

          <h1 style={{ fontSize: 'clamp(36px, 6vw, 64px)', color: 'white', marginBottom: 16 }}>
            CIBC <span style={{ color: 'var(--cibc-red)', fontStyle: 'italic' }}>Clara</span>
          </h1>
          <p style={{ fontSize: 18, color: '#94A3B8', maxWidth: 520, margin: '0 auto 12px', fontWeight: 400 }}>
            Client-Led Agentic Recommendations & Advisor
          </p>
          <p style={{ fontSize: 15, color: '#64748B', maxWidth: 560, margin: '0 auto 40px' }}>
            Enter your monthly spending below. Clara analyses your patterns against every CIBC card,
            quantifies your reward gap, and tells you exactly how to close it.
          </p>

          {/* Step indicators */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, flexWrap: 'wrap' }}>
            {[
              { num: '01', label: 'Your Spending', key: 'spending' },
              { num: '02', label: 'Reward Analysis', key: 'optimizer' },
              { num: '03', label: 'Ask Clara', key: 'chat' },
            ].map(step => (
              <div key={step.key} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: activeSection === step.key ? 'rgba(196,18,48,0.2)' : 'rgba(255,255,255,0.05)',
                border: `1px solid ${activeSection === step.key ? 'rgba(196,18,48,0.5)' : 'rgba(255,255,255,0.1)'}`,
                borderRadius: 100, padding: '8px 16px',
                transition: 'all 0.3s ease',
              }}>
                <span style={{
                  fontSize: 11, fontWeight: 700, color: activeSection === step.key ? 'var(--cibc-red)' : '#64748B',
                  letterSpacing: '0.05em'
                }}>{step.num}</span>
                <span style={{ fontSize: 13, color: activeSection === step.key ? 'white' : '#64748B', fontWeight: 500 }}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main content */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '48px 24px 80px' }}>

        {/* Section 1: Spending Input */}
        <div id="spending" style={{ marginBottom: 48 }}>
          <SpendingInput
            spending={spending}
            setSpending={setSpending}
            onAnalyse={() => {
              setOptimizerResult(null)
              setActiveSection('optimizer')
              setTimeout(() => {
                document.getElementById('optimizer')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }, 100)
            }}
          />
        </div>

        {/* Section 2: Reward Optimizer */}
        <div id="optimizer" style={{ marginBottom: 48 }}>
          <RewardOptimizer
            spending={spending}
            result={optimizerResult}
            setResult={setOptimizerResult}
            onChatOpen={() => {
              setActiveSection('chat')
              setTimeout(() => {
                document.getElementById('chat')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }, 100)
            }}
          />
        </div>

        {/* Section 3: Clara Chat */}
        <div id="chat">
          <ClaraChat spending={spending} optimizerResult={optimizerResult} />
        </div>
      </div>

      {/* Footer */}
      <footer style={{
        background: 'var(--cibc-navy)',
        borderTop: '3px solid var(--cibc-red)',
        padding: '24px',
        textAlign: 'center',
      }}>
        <p style={{ fontSize: 13, color: '#475569' }}>
          CIBC Clara · TGRP Case Study 2026 · Built by <strong style={{ color: '#64748B' }}>Aaryaman Singh</strong> ·
          <span style={{ color: '#334155' }}> Mechanical Engineering, University of Toronto · CIBC E2E Optimization Co-op · CFA Level II Candidate</span>
        </p>
        <p style={{ fontSize: 11, color: '#334155', marginTop: 6 }}>
          MVP Demo — Reward rates sourced from CIBC's published card terms. This is a prototype for TGRP interview purposes only.
        </p>
      </footer>
    </div>
  )
}
