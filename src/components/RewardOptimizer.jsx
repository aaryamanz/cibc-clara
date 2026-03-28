import { useEffect, useState } from 'react'

// Real CIBC card rates sourced from cibc.com
const CIBC_CARDS = [
  {
    id: 'classic',
    name: 'Dividend Visa Classic',
    shortName: 'Dividend Classic',
    fee: 0,
    rates: { groceries: 0.02, dining: 0.01, gas: 0.01, travel: 0.01, other: 0.005 },
    color: '#4A90D9',
    tag: 'No annual fee',
    income: null,
    desc: 'Best no-fee everyday card',
  },
  {
    id: 'platinum',
    name: 'Dividend Platinum Visa',
    shortName: 'Dividend Platinum',
    fee: 99,
    rates: { groceries: 0.03, dining: 0.02, gas: 0.03, travel: 0.01, other: 0.01 },
    color: '#7B6EE8',
    tag: '$99/yr',
    income: null,
    desc: 'Great for gas & groceries',
  },
  {
    id: 'infinite',
    name: 'Dividend Visa Infinite',
    shortName: 'Dividend Infinite',
    fee: 120,
    rates: { groceries: 0.04, dining: 0.02, gas: 0.04, travel: 0.02, other: 0.01 },
    color: '#C41230',
    tag: '$120/yr · $60K income',
    income: 60000,
    desc: 'Maximum rewards on daily essentials',
  },
  {
    id: 'costco',
    name: 'CIBC Costco Mastercard',
    shortName: 'Costco Mastercard',
    fee: 0,
    rates: { groceries: 0.01, dining: 0.03, gas: 0.02, travel: 0.01, other: 0.01 },
    color: '#0A7A4F',
    tag: 'No fee · Costco required',
    income: null,
    desc: 'Best for dining & Costco members',
  },
]

function calcAnnual(card, spending) {
  const monthly = Object.entries(spending).reduce((sum, [cat, amt]) => {
    return sum + amt * (card.rates[cat] || 0.005)
  }, 0)
  return Math.round(monthly * 12 - card.fee)
}

function formatCAD(n) {
  return `$${Math.abs(Math.round(n)).toLocaleString()}`
}

export default function RewardOptimizer({ spending, result, setResult, onChatOpen }) {
  const [animating, setAnimating] = useState(false)
  const [hasAnalysed, setHasAnalysed] = useState(false)

  useEffect(() => {
    if (!hasAnalysed) return
    setAnimating(true)

    // Calculate all cards
    const results = CIBC_CARDS.map(card => ({
      ...card,
      annual: calcAnnual(card, spending),
    })).sort((a, b) => b.annual - a.annual)

    const best = results[0]
    const current = results.find(c => c.id === 'classic') || results[results.length - 1]
    const gap = best.annual - current.annual

    setTimeout(() => {
      setResult({ results, best, current, gap })
      setAnimating(false)
    }, 800)
  }, [spending, hasAnalysed])

  function handleAnalyse() {
    setHasAnalysed(true)
    setResult(null)
    setAnimating(true)

    const results = CIBC_CARDS.map(card => ({
      ...card,
      annual: calcAnnual(card, spending),
    })).sort((a, b) => b.annual - a.annual)

    const best = results[0]
    const current = results.find(c => c.id === 'classic')
    const gap = best.annual - current.annual

    setTimeout(() => {
      setResult({ results, best, current, gap })
      setAnimating(false)
    }, 900)
  }

  return (
    <div style={{
      background: 'white', borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-md)', overflow: 'hidden',
      border: '1px solid var(--cibc-silver)',
    }}>
      {/* Section header */}
      <div style={{
        background: 'linear-gradient(135deg, var(--cibc-red) 0%, var(--cibc-red-dark) 100%)',
        padding: '20px 28px',
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: '50%',
          background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 13, fontWeight: 700, color: 'white',
        }}>02</div>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: 'white', fontFamily: 'DM Serif Display, serif' }}>
            Reward Optimizer
          </h2>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 2 }}>
            Clara compares every CIBC card against your real spending
          </p>
        </div>
        <button
          onClick={handleAnalyse}
          style={{
            marginLeft: 'auto',
            padding: '9px 20px',
            background: 'rgba(255,255,255,0.15)',
            border: '1.5px solid rgba(255,255,255,0.4)',
            borderRadius: 'var(--radius-sm)',
            color: 'white', fontSize: 13, fontWeight: 600,
            cursor: 'pointer', transition: 'all 0.2s',
            whiteSpace: 'nowrap',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
        >
          {animating ? 'Analysing...' : 'Run Analysis →'}
        </button>
      </div>

      <div style={{ padding: '28px' }}>
        {/* Loading state */}
        {animating && (
          <div style={{ textAlign: 'center', padding: '48px 0', animation: 'fadeIn 0.3s ease' }}>
            <div style={{
              width: 56, height: 56, borderRadius: '50%',
              background: 'var(--cibc-red-light)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px', fontSize: 24,
              animation: 'pulse 1.2s infinite',
            }}>✦</div>
            <p style={{ fontSize: 15, color: 'var(--cibc-muted)', fontWeight: 500 }}>
              Clara is analysing your spending patterns...
            </p>
            <p style={{ fontSize: 13, color: '#CBD5E1', marginTop: 4 }}>
              Comparing reward rates across all CIBC cards
            </p>
          </div>
        )}

        {/* Empty state */}
        {!animating && !result && (
          <div style={{ textAlign: 'center', padding: '48px 0' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📊</div>
            <p style={{ fontSize: 15, color: 'var(--cibc-muted)' }}>
              Set your spending above and click <strong>"Run Analysis"</strong> to see your reward gap
            </p>
          </div>
        )}

        {/* Results */}
        {!animating && result && (
          <div style={{ animation: 'fadeUp 0.5s ease forwards' }}>

            {/* Loss alert banner */}
            {result.gap > 0 && (
              <div style={{
                background: 'linear-gradient(135deg, #FFF1F3 0%, #FFE4E9 100%)',
                border: '2px solid var(--cibc-red)',
                borderRadius: 'var(--radius)',
                padding: '20px 24px', marginBottom: 28,
                display: 'flex', alignItems: 'center', gap: 16,
              }}>
                <div style={{ fontSize: 32 }}>⚠️</div>
                <div>
                  <p style={{ fontSize: 14, color: 'var(--cibc-red-dark)', fontWeight: 500 }}>
                    Based on your spending, you're currently leaving
                  </p>
                  <p style={{ fontSize: 28, fontWeight: 700, color: 'var(--cibc-red)', fontFamily: 'DM Serif Display, serif', lineHeight: 1.1 }}>
                    {formatCAD(result.gap)}/year
                  </p>
                  <p style={{ fontSize: 13, color: 'var(--cibc-red-dark)', marginTop: 2 }}>
                    in unclaimed rewards — switch to the {result.best.shortName} to close the gap
                  </p>
                </div>
              </div>
            )}

            {/* Card comparison grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 14, marginBottom: 28 }}>
              {result.results.map((card, i) => {
                const isBest = card.id === result.best.id
                const isCurrent = card.id === 'classic'
                return (
                  <div key={card.id} style={{
                    borderRadius: 'var(--radius)',
                    border: isBest ? `2px solid ${card.color}` : '1.5px solid var(--cibc-silver)',
                    background: isBest ? `linear-gradient(135deg, ${card.color}08 0%, ${card.color}14 100%)` : 'white',
                    padding: '18px',
                    position: 'relative',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    cursor: 'default',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
                  >
                    {isBest && (
                      <div style={{
                        position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)',
                        background: card.color, color: 'white',
                        fontSize: 10, fontWeight: 700, padding: '3px 10px',
                        borderRadius: 100, letterSpacing: '0.06em', whiteSpace: 'nowrap',
                      }}>★ BEST FOR YOU</div>
                    )}
                    {isCurrent && (
                      <div style={{
                        position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)',
                        background: '#64748B', color: 'white',
                        fontSize: 10, fontWeight: 700, padding: '3px 10px',
                        borderRadius: 100, letterSpacing: '0.06em', whiteSpace: 'nowrap',
                      }}>CURRENT CARD</div>
                    )}

                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: card.color, marginBottom: 10 }} />
                    <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--cibc-navy)', lineHeight: 1.2, marginBottom: 4 }}>
                      {card.shortName}
                    </p>
                    <p style={{ fontSize: 11, color: 'var(--cibc-muted)', marginBottom: 14 }}>{card.tag}</p>

                    <p style={{
                      fontSize: 26, fontWeight: 700,
                      color: isBest ? card.color : (card.annual < 0 ? '#DC2626' : 'var(--cibc-navy)'),
                      fontFamily: 'DM Serif Display, serif', lineHeight: 1,
                    }}>
                      {card.annual < 0 ? '-' : ''}{formatCAD(card.annual)}
                    </p>
                    <p style={{ fontSize: 11, color: 'var(--cibc-muted)', marginTop: 3 }}>net annual rewards</p>

                    {/* Per-category breakdown */}
                    <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--cibc-silver)' }}>
                      {['groceries','dining','gas'].map(cat => (
                        <div key={cat} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                          <span style={{ fontSize: 11, color: '#94A3B8', textTransform: 'capitalize' }}>{cat}</span>
                          <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--cibc-navy)' }}>
                            {(card.rates[cat] * 100).toFixed(0)}%
                          </span>
                        </div>
                      ))}
                    </div>

                    {isBest && (
                      <button style={{
                        width: '100%', marginTop: 14, padding: '9px',
                        background: card.color, color: 'white', border: 'none',
                        borderRadius: 'var(--radius-sm)', fontSize: 12, fontWeight: 700,
                        cursor: 'pointer', transition: 'opacity 0.2s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                      onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                      >Apply Now →</button>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Reward breakdown table */}
            <div style={{
              background: 'var(--cibc-off-white)', borderRadius: 'var(--radius)',
              padding: '20px', marginBottom: 20,
              border: '1px solid var(--cibc-silver)',
            }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--cibc-navy)', marginBottom: 14 }}>
                Your Annual Reward Breakdown — {result.best.shortName}
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '6px 20px' }}>
                <span style={{ fontSize: 12, color: 'var(--cibc-muted)', fontWeight: 600, borderBottom: '1px solid var(--cibc-silver)', paddingBottom: 6 }}>Category</span>
                <span style={{ fontSize: 12, color: 'var(--cibc-muted)', fontWeight: 600, textAlign: 'right', borderBottom: '1px solid var(--cibc-silver)', paddingBottom: 6 }}>Monthly Spend</span>
                <span style={{ fontSize: 12, color: 'var(--cibc-muted)', fontWeight: 600, textAlign: 'right', borderBottom: '1px solid var(--cibc-silver)', paddingBottom: 6 }}>Annual Reward</span>
                {Object.entries(spending).map(([cat, amt]) => {
                  const reward = Math.round(amt * result.best.rates[cat] * 12)
                  return (
                    <>
                      <span key={`${cat}-name`} style={{ fontSize: 13, color: 'var(--cibc-navy)', textTransform: 'capitalize', padding: '4px 0' }}>{cat}</span>
                      <span key={`${cat}-spend`} style={{ fontSize: 13, color: 'var(--cibc-muted)', textAlign: 'right', padding: '4px 0' }}>${amt.toLocaleString()}/mo</span>
                      <span key={`${cat}-reward`} style={{ fontSize: 13, fontWeight: 600, color: 'var(--cibc-green)', textAlign: 'right', padding: '4px 0' }}>+${reward}</span>
                    </>
                  )
                })}
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--cibc-navy)', borderTop: '1px solid var(--cibc-silver)', paddingTop: 8 }}>Annual Fee</span>
                <span style={{ fontSize: 13, color: 'var(--cibc-muted)', textAlign: 'right', borderTop: '1px solid var(--cibc-silver)', paddingTop: 8 }}> </span>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#DC2626', textAlign: 'right', borderTop: '1px solid var(--cibc-silver)', paddingTop: 8 }}>-${result.best.fee}</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--cibc-navy)', borderTop: '2px solid var(--cibc-navy)', paddingTop: 8 }}>Net Annual Rewards</span>
                <span style={{ borderTop: '2px solid var(--cibc-navy)', paddingTop: 8 }}> </span>
                <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--cibc-red)', textAlign: 'right', borderTop: '2px solid var(--cibc-navy)', paddingTop: 8 }}>${result.best.annual}</span>
              </div>
            </div>

            {/* CTA to Clara chat */}
            <button
              onClick={onChatOpen}
              style={{
                width: '100%', padding: '14px',
                background: 'var(--cibc-navy)', color: 'white', border: 'none',
                borderRadius: 'var(--radius)', fontSize: 14, fontWeight: 600,
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#1A2F4A'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'var(--cibc-navy)'; e.currentTarget.style.transform = 'none'; }}
            >
              <span>✦</span>
              <span>Ask Clara anything about your results →</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
