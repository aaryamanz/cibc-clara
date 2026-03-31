import { Fragment, useEffect, useState } from 'react'
import CreditCardFace from './CreditCardFace.jsx'
import dividendClassicImg from '../assets/cards/dividend-visa-classic.png'
import dividendPlatinumImg from '../assets/cards/dividend-platinum-visa.png'
import dividendInfiniteImg from '../assets/cards/dividend-visa-infinite.png'
import costcoMastercardImg from '../assets/cards/costco-mastercard.png'

const CIBC_CARDS = [
  {
    id: 'classic',
    name: 'Dividend Visa Classic',
    shortName: 'Dividend Classic',
    fee: 0,
    rates: { groceries: 0.02, dining: 0.01, gas: 0.01, travel: 0.01, other: 0.005 },
    tag: 'No annual fee',
    income: null,
    desc: 'Best no-fee everyday card',
    gradient: 'linear-gradient(135deg, #1A1A2E 0%, #16213E 100%)',
    network: 'visa',
    image: dividendClassicImg,
    footnote: null,
  },
  {
    id: 'platinum',
    name: 'Dividend Platinum Visa',
    shortName: 'Dividend Platinum',
    fee: 99,
    rates: { groceries: 0.03, dining: 0.02, gas: 0.03, travel: 0.01, other: 0.01 },
    tag: '$99/yr',
    income: null,
    desc: 'Great for gas & groceries',
    gradient: 'linear-gradient(135deg, #2C2C2C 0%, #4A4A4A 100%)',
    network: 'visa',
    image: dividendPlatinumImg,
    footnote: null,
  },
  {
    id: 'infinite',
    name: 'Dividend Visa Infinite',
    shortName: 'Dividend Infinite',
    fee: 120,
    rates: { groceries: 0.04, dining: 0.02, gas: 0.04, travel: 0.02, other: 0.01 },
    tag: '$120/yr · $60K income',
    income: 60000,
    desc: 'Maximum rewards on daily essentials',
    gradient: 'linear-gradient(135deg, #C41230 0%, #8F0D22 100%)',
    network: 'visa',
    image: dividendInfiniteImg,
    footnote: '$60,000 personal annual income required',
  },
  {
    id: 'costco',
    name: 'CIBC Costco Mastercard',
    shortName: 'Costco Mastercard',
    fee: 0,
    rates: { groceries: 0.01, dining: 0.03, gas: 0.02, travel: 0.01, other: 0.01 },
    tag: 'No fee · Costco required',
    income: null,
    desc: 'Best for dining & Costco members',
    gradient: 'linear-gradient(135deg, #005DAA 0%, #003F7A 100%)',
    network: 'mastercard',
    image: costcoMastercardImg,
    footnote: 'Costco membership required',
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

function feePillLabel(card) {
  return card.fee === 0 ? 'No fee' : `$${card.fee}/yr`
}

export default function RewardOptimizer({ spending, result, setResult, onChatOpen }) {
  const [animating, setAnimating] = useState(false)
  const [hasAnalysed, setHasAnalysed] = useState(false)

  const cardShell = {
    background: '#FFFFFF',
    borderRadius: 8,
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    overflow: 'hidden',
    border: '1px solid #D8D8D8',
  }

  useEffect(() => {
    if (!hasAnalysed) return
    setAnimating(true)

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
    <div style={cardShell}>
      <div style={{
        padding: '22px 28px',
        borderBottom: '1px solid #D8D8D8',
        display: 'flex',
        alignItems: 'flex-start',
        gap: 20,
        flexWrap: 'wrap',
      }}>
        <div style={{ flex: '1 1 200px', borderLeft: '4px solid #C41230', paddingLeft: 18 }}>
          <p style={{
            fontSize: 11, fontWeight: 700, color: '#C41230',
            letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6,
          }}>02</p>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#002855', marginBottom: 6 }}>
            Reward Optimizer
          </h2>
          <p style={{ fontSize: 14, color: '#6B6B6B' }}>
            Clara compares every CIBC card against your real spending
          </p>
        </div>
        <button
          type="button"
          onClick={handleAnalyse}
          style={{
            marginLeft: 'auto',
            padding: '12px 24px',
            background: '#FFFFFF',
            border: '2px solid #C41230',
            borderRadius: 4,
            color: '#C41230', fontSize: 14, fontWeight: 700,
            cursor: 'pointer', transition: 'background 0.2s, color 0.2s',
            whiteSpace: 'nowrap', alignSelf: 'center',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = '#C41230'
            e.currentTarget.style.color = '#FFFFFF'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = '#FFFFFF'
            e.currentTarget.style.color = '#C41230'
          }}
        >
          {animating ? 'Analysing…' : 'Run Analysis →'}
        </button>
      </div>

      <div style={{ padding: '28px' }}>
        {animating && (
          <div style={{ textAlign: 'center', padding: '48px 0', animation: 'fadeIn 0.3s ease' }}>
            <div style={{
              width: 48, height: 48,
              background: '#F4F4F4',
              border: '2px solid #D8D8D8',
              borderRadius: 6,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px', fontSize: 20, color: '#C41230',
              animation: 'pulse 1.2s infinite',
            }}>✦</div>
            <p style={{ fontSize: 15, color: '#6B6B6B', fontWeight: 600 }}>
              Clara is analysing your spending patterns…
            </p>
            <p style={{ fontSize: 13, color: '#6B6B6B', marginTop: 6 }}>
              Comparing reward rates across all CIBC cards
            </p>
          </div>
        )}

        {!animating && !result && (
          <div style={{ textAlign: 'center', padding: '48px 0' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📊</div>
            <p style={{ fontSize: 15, color: '#6B6B6B' }}>
              Set your spending above and click <strong style={{ color: '#2C2C2C' }}>Run Analysis</strong> to see your reward gap
            </p>
          </div>
        )}

        {!animating && result && (
          <div style={{ animation: 'fadeUp 0.5s ease forwards' }}>

            {result.gap > 0 && (
              <div style={{
                background: '#FFFFFF',
                border: '2px solid #C41230',
                borderRadius: 6,
                padding: '20px 24px', marginBottom: 28,
                display: 'flex', alignItems: 'center', gap: 16,
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              }}>
                <div style={{ fontSize: 32 }}>⚠️</div>
                <div>
                  <p style={{ fontSize: 14, color: '#2C2C2C', fontWeight: 600 }}>
                    Based on your spending, you&apos;re currently leaving
                  </p>
                  <p style={{ fontSize: 28, fontWeight: 800, color: '#C41230', lineHeight: 1.15, marginTop: 4 }}>
                    {formatCAD(result.gap)}/year
                  </p>
                  <p style={{ fontSize: 13, color: '#6B6B6B', marginTop: 6 }}>
                    in unclaimed rewards — switch to the {result.best.shortName} to close the gap
                  </p>
                </div>
              </div>
            )}

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: 20,
              marginBottom: 28,
            }}>
              {result.results.map(card => {
                const isBest = card.id === result.best.id
                const isCurrent = card.id === 'classic'
                return (
                  <div key={card.id} style={{
                    borderRadius: 6,
                    border: isBest ? '2px solid #C41230' : '1px solid #D8D8D8',
                    background: '#FFFFFF',
                    padding: 16,
                    position: 'relative',
                    boxShadow: isBest ? '0 2px 8px rgba(196,18,48,0.12)' : '0 2px 8px rgba(0,0,0,0.08)',
                  }}>
                    {card.image ? (
                      <div style={{ width: '100%', aspectRatio: '1.586 / 1' }}>
                        <img
                          src={card.image}
                          alt={card.name}
                          style={{
                            width: '100%',
                            height: '100%',
                            display: 'block',
                            objectFit: 'cover',
                            borderRadius: 8,
                          }}
                        />
                      </div>
                    ) : (
                      <CreditCardFace
                        gradient={card.gradient}
                        cardName={card.name}
                        network={card.network}
                      />
                    )}

                    <h3 style={{
                      fontSize: 16, fontWeight: 700, color: '#002855',
                      marginTop: 14, marginBottom: 8, lineHeight: 1.25,
                    }}>{card.name}</h3>

                    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                      <span style={{
                        fontSize: 12, fontWeight: 700, color: '#2C2C2C',
                        background: '#F4F4F4',
                        border: '1px solid #D8D8D8',
                        padding: '4px 10px',
                        borderRadius: 4,
                      }}>{feePillLabel(card)}</span>
                    </div>

                    <p style={{
                      fontSize: 28, fontWeight: 800, color: '#C41230', lineHeight: 1,
                    }}>
                      {card.annual < 0 ? '-' : ''}{formatCAD(card.annual)}
                    </p>
                    <p style={{ fontSize: 12, color: '#6B6B6B', marginTop: 6 }}>Net annual rewards</p>

                    {(isBest || isCurrent) && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
                        {isBest && (
                          <span style={{
                            fontSize: 10, fontWeight: 800, color: '#C41230',
                            letterSpacing: '0.08em', textTransform: 'uppercase',
                            border: '1px solid #C41230',
                            padding: '4px 8px',
                            borderRadius: 4,
                            background: '#FFFFFF',
                          }}>Best for you</span>
                        )}
                        {isCurrent && (
                          <span style={{
                            fontSize: 10, fontWeight: 800, color: '#6B6B6B',
                            letterSpacing: '0.06em', textTransform: 'uppercase',
                            border: '1px solid #D8D8D8',
                            padding: '4px 8px',
                            borderRadius: 4,
                            background: '#F4F4F4',
                          }}>Current card</span>
                        )}
                      </div>
                    )}

                    {card.footnote && (
                      <p style={{ fontSize: 11, color: '#6B6B6B', marginTop: 8, lineHeight: 1.4 }}>{card.footnote}</p>
                    )}

                    <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid #D8D8D8' }}>
                      {['groceries', 'dining', 'gas'].map(cat => (
                        <div key={cat} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                          <span style={{ fontSize: 12, color: '#6B6B6B', textTransform: 'capitalize' }}>{cat}</span>
                          <span style={{ fontSize: 12, fontWeight: 700, color: '#2C2C2C' }}>
                            {(card.rates[cat] * 100).toFixed(0)}%
                          </span>
                        </div>
                      ))}
                    </div>

                    {isBest && (
                      <button
                        type="button"
                        style={{
                          width: '100%', marginTop: 14, padding: '12px 24px',
                          background: '#C41230', color: '#FFFFFF', border: 'none',
                          borderRadius: 4, fontSize: 13, fontWeight: 700,
                          cursor: 'pointer', transition: 'background 0.2s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#A00F28' }}
                        onMouseLeave={e => { e.currentTarget.style.background = '#C41230' }}
                      >Apply Now</button>
                    )}
                  </div>
                )
              })}
            </div>

            <div style={{
              background: '#F4F4F4', borderRadius: 6,
              padding: '20px', marginBottom: 20,
              border: '1px solid #D8D8D8',
            }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: '#002855', marginBottom: 14 }}>
                Your Annual Reward Breakdown — {result.best.shortName}
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '6px 20px' }}>
                <span style={{ fontSize: 12, color: '#6B6B6B', fontWeight: 700, borderBottom: '1px solid #D8D8D8', paddingBottom: 6 }}>Category</span>
                <span style={{ fontSize: 12, color: '#6B6B6B', fontWeight: 700, textAlign: 'right', borderBottom: '1px solid #D8D8D8', paddingBottom: 6 }}>Monthly Spend</span>
                <span style={{ fontSize: 12, color: '#6B6B6B', fontWeight: 700, textAlign: 'right', borderBottom: '1px solid #D8D8D8', paddingBottom: 6 }}>Annual Reward</span>
                {Object.entries(spending).map(([cat, amt]) => {
                  const reward = Math.round(amt * result.best.rates[cat] * 12)
                  return (
                    <Fragment key={cat}>
                      <span style={{ fontSize: 13, color: '#2C2C2C', textTransform: 'capitalize', padding: '4px 0' }}>{cat}</span>
                      <span style={{ fontSize: 13, color: '#6B6B6B', textAlign: 'right', padding: '4px 0' }}>${amt.toLocaleString()}/mo</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: '#002855', textAlign: 'right', padding: '4px 0' }}>+${reward}</span>
                    </Fragment>
                  )
                })}
                <span style={{ fontSize: 13, fontWeight: 700, color: '#2C2C2C', borderTop: '1px solid #D8D8D8', paddingTop: 8 }}>Annual Fee</span>
                <span style={{ fontSize: 13, color: '#6B6B6B', textAlign: 'right', borderTop: '1px solid #D8D8D8', paddingTop: 8 }}> </span>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#C41230', textAlign: 'right', borderTop: '1px solid #D8D8D8', paddingTop: 8 }}>-${result.best.fee}</span>
                <span style={{ fontSize: 14, fontWeight: 800, color: '#002855', borderTop: '2px solid #002855', paddingTop: 8 }}>Net Annual Rewards</span>
                <span style={{ borderTop: '2px solid #002855', paddingTop: 8 }}> </span>
                <span style={{ fontSize: 16, fontWeight: 800, color: '#C41230', textAlign: 'right', borderTop: '2px solid #002855', paddingTop: 8 }}>${result.best.annual}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={onChatOpen}
              style={{
                width: '100%', padding: '12px 24px',
                background: '#FFFFFF', color: '#C41230', border: '2px solid #C41230',
                borderRadius: 4, fontSize: 14, fontWeight: 700,
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                transition: 'background 0.2s, color 0.2s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = '#C41230'
                e.currentTarget.style.color = '#FFFFFF'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = '#FFFFFF'
                e.currentTarget.style.color = '#C41230'
              }}
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
