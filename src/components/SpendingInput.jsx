import { useState } from 'react'

const CATEGORIES = [
  { key: 'groceries', label: 'Groceries', emoji: '🛒', max: 2000, color: '#C41230' },
  { key: 'dining',    label: 'Dining Out', emoji: '🍽️', max: 1000, color: '#E84C6B' },
  { key: 'gas',       label: 'Gas',        emoji: '⛽', max: 800,  color: '#F4703C' },
  { key: 'travel',    label: 'Travel',     emoji: '✈️',  max: 1500, color: '#9B4DCA' },
  { key: 'other',     label: 'Other',      emoji: '💳', max: 2000, color: '#4A90D9' },
]

function formatCAD(n) {
  return `$${Math.round(n).toLocaleString()}`
}

export default function SpendingInput({ spending, setSpending, onAnalyse }) {
  const [hovered, setHovered] = useState(null)
  const total = Object.values(spending).reduce((a, b) => a + b, 0)

  return (
    <div style={{
      background: 'white', borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-md)', overflow: 'hidden',
      border: '1px solid var(--cibc-silver)',
    }}>
      {/* Section header */}
      <div style={{
        background: 'var(--cibc-navy)', padding: '20px 28px',
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: '50%',
          background: 'var(--cibc-red)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 13, fontWeight: 700, color: 'white',
        }}>01</div>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: 'white', fontFamily: 'DM Serif Display, serif' }}>
            Your Monthly Spending
          </h2>
          <p style={{ fontSize: 13, color: '#64748B', marginTop: 2 }}>
            Drag the sliders or type your amounts — Clara uses real CIBC card rates
          </p>
        </div>
        <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: 'white', fontFamily: 'DM Serif Display, serif' }}>
            {formatCAD(total)}
          </div>
          <div style={{ fontSize: 11, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Monthly Total
          </div>
        </div>
      </div>

      <div style={{ padding: '28px' }}>
        {CATEGORIES.map(cat => (
          <div key={cat.key} style={{
            marginBottom: 20,
            padding: '16px 20px',
            borderRadius: 'var(--radius)',
            background: hovered === cat.key ? '#FAFBFC' : 'transparent',
            border: `1px solid ${hovered === cat.key ? 'var(--cibc-silver)' : 'transparent'}`,
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={() => setHovered(cat.key)}
          onMouseLeave={() => setHovered(null)}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 20 }}>{cat.emoji}</span>
                <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--cibc-navy)' }}>{cat.label}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 13, color: 'var(--cibc-muted)' }}>/mo</span>
                <input
                  type="number"
                  value={spending[cat.key]}
                  onChange={e => setSpending(prev => ({ ...prev, [cat.key]: Math.max(0, Math.min(cat.max, Number(e.target.value))) }))}
                  style={{
                    width: 88, padding: '6px 10px',
                    border: '1.5px solid var(--cibc-silver)',
                    borderRadius: 'var(--radius-sm)', fontSize: 15, fontWeight: 700,
                    color: 'var(--cibc-navy)', textAlign: 'right',
                    outline: 'none', transition: 'border-color 0.2s',
                  }}
                  onFocus={e => e.target.style.borderColor = cat.color}
                  onBlur={e => e.target.style.borderColor = 'var(--cibc-silver)'}
                />
              </div>
            </div>

            {/* Slider */}
            <div style={{ position: 'relative', height: 6 }}>
              <div style={{
                position: 'absolute', inset: 0,
                background: 'var(--cibc-silver)', borderRadius: 3,
              }} />
              <div style={{
                position: 'absolute', left: 0, top: 0, height: '100%',
                width: `${(spending[cat.key] / cat.max) * 100}%`,
                background: cat.color, borderRadius: 3,
                transition: 'width 0.1s ease',
              }} />
              <input
                type="range"
                min={0}
                max={cat.max}
                step={10}
                value={spending[cat.key]}
                onChange={e => setSpending(prev => ({ ...prev, [cat.key]: Number(e.target.value) }))}
                style={{
                  position: 'absolute', inset: 0, width: '100%', height: '100%',
                  opacity: 0, cursor: 'pointer',
                }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 5 }}>
              <span style={{ fontSize: 11, color: '#CBD5E1' }}>$0</span>
              <span style={{ fontSize: 11, color: '#CBD5E1' }}>{formatCAD(cat.max)}</span>
            </div>
          </div>
        ))}

        {/* Analyse button */}
        <button
          onClick={onAnalyse}
          style={{
            width: '100%', padding: '16px',
            background: 'var(--cibc-red)',
            color: 'white', border: 'none',
            borderRadius: 'var(--radius)',
            fontSize: 16, fontWeight: 700,
            marginTop: 8, transition: 'all 0.2s ease',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            letterSpacing: '0.01em',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--cibc-red-dark)'; e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(196,18,48,0.3)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'var(--cibc-red)'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
        >
          <span>Analyse My Spending</span>
          <span style={{ fontSize: 18 }}>→</span>
        </button>
      </div>
    </div>
  )
}
