import { useEffect, useState } from 'react'
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
  const [spendingSubmitted, setSpendingSubmitted] = useState(false)

  useEffect(() => {
    // On first load, always start at the top (fixes unwanted deep-linking / restored scroll).
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    if (window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search)
    }
  }, [])

  useEffect(() => {
    function handleScroll() {
      const sections = ['spending', 'optimizer', 'chat']
      for (const id of [...sections].reverse()) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top <= 120) {
          setActiveSection(id)
          return
        }
      }
      setActiveSection('spending')
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: '#F4F4F4' }}>
      <Header />

      <section style={{
        background: '#FFFFFF',
        borderBottom: '1px solid #D8D8D8',
        padding: '22px 24px 24px',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: 720, margin: '0 auto', animation: 'fadeUp 0.6s ease forwards' }}>
          <p style={{
            fontSize: 11, fontWeight: 700, color: '#C41230',
            letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8,
          }}>
            TGRP Case Study · Live MVP
          </p>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 16,
            flexWrap: 'wrap',
            marginBottom: 8,
          }}>
            <img
              src="/cibc-logo.svg"
              alt="CIBC"
              style={{ height: 48, width: 'auto', display: 'block' }}
            />
            <h1 style={{
              fontSize: 'clamp(32px, 4.6vw, 52px)',
              fontWeight: 800,
              color: '#C41230',
              marginBottom: 0,
              lineHeight: 1,
              letterSpacing: '-0.01em',
            }}>
              Clara
            </h1>
          </div>
          <p style={{ fontSize: 16, color: '#6B6B6B', maxWidth: 520, margin: '0 auto 8px', fontWeight: 600 }}>
            Client-Led Agentic Recommendations & Advisor
          </p>
          <p style={{ fontSize: 14, color: '#6B6B6B', maxWidth: 560, margin: '0 auto 14px', fontWeight: 400 }}>
            Enter your monthly spending below. Clara analyses your patterns against every CIBC card,
            quantifies your reward gap, and tells you exactly how to close it.
          </p>

          <div style={{
            display: 'inline-flex',
            justifyContent: 'center',
            gap: 10,
            flexWrap: 'wrap',
            padding: 6,
            border: '1px solid #D8D8D8',
            borderRadius: 8,
            background: '#F4F4F4',
          }}>
            {[
              { num: '01', label: 'Your Spending', key: 'spending', done: spendingSubmitted },
              { num: '02', label: 'Reward Analysis', key: 'optimizer', done: !!optimizerResult },
              { num: '03', label: 'Ask Clara', key: 'chat', done: false },
            ].map(step => {
              const isActive = activeSection === step.key
              const isDone = step.done && !isActive
              return (
                <button
                  key={step.key}
                  onClick={() => document.getElementById(step.key)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    background: isDone ? '#002855' : '#FFFFFF',
                    border: `1px solid ${isActive ? '#C41230' : isDone ? '#002855' : '#D8D8D8'}`,
                    borderRadius: 6,
                    padding: '8px 14px',
                    transition: 'border-color 0.2s ease, background 0.2s ease',
                    cursor: 'pointer',
                  }}
                >
                  <span style={{
                    fontSize: 11, fontWeight: 800,
                    color: isActive ? '#C41230' : isDone ? '#FFFFFF' : '#6B6B6B',
                    letterSpacing: '0.04em',
                  }}>{isDone ? '✓' : step.num}</span>
                  <span style={{
                    fontSize: 14,
                    color: isActive ? '#2C2C2C' : isDone ? '#FFFFFF' : '#6B6B6B',
                    fontWeight: 600,
                  }}>
                    {step.label}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '18px 24px 40px' }}>
        <div style={{
          background: '#FFFFFF',
          border: '1px solid #D8D8D8',
          borderRadius: 8,
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          padding: 14,
        }}>

        <div id="spending" style={{ marginBottom: 18 }}>
          <SpendingInput
            spending={spending}
            setSpending={setSpending}
            onAnalyse={() => {
              setSpendingSubmitted(true)
              setOptimizerResult(null)
              setActiveSection('optimizer')
              setTimeout(() => {
                document.getElementById('optimizer')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }, 100)
            }}
          />
        </div>

        <div id="optimizer" style={{ marginBottom: 18 }}>
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

        <div id="chat">
          <ClaraChat spending={spending} optimizerResult={optimizerResult} />
        </div>
        </div>
      </div>

      <footer style={{
        background: '#000000',
        borderTop: '3px solid #C41230',
        padding: '28px 24px',
        textAlign: 'center',
      }}>
        <p style={{ fontSize: 14, color: '#FFFFFF', fontWeight: 600 }}>
          CIBC Clara · TGRP Case Study 2026 · Built by <strong style={{ fontWeight: 700 }}>Aaryaman Singh</strong>
        </p>
        <p style={{ fontSize: 13, color: '#FFFFFF', marginTop: 6, opacity: 0.88 }}>
          Mechanical Engineering, University of Toronto · CIBC E2E Optimization Co-op · CFA Level II Candidate
        </p>
        <p style={{ fontSize: 12, color: '#BDBDBD', marginTop: 14, maxWidth: 720, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.6 }}>
          MVP Demo — Reward rates sourced from CIBC&apos;s published card terms. This is a prototype for TGRP interview purposes only.
        </p>
      </footer>
    </div>
  )
}
