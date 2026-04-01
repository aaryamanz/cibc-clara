import { useState } from 'react'

const CATEGORIES = [
  { key: 'groceries', label: 'Groceries', emoji: '🛒', max: 2000 },
  { key: 'dining',    label: 'Dining Out', emoji: '🍽️', max: 1000 },
  { key: 'gas',       label: 'Gas',        emoji: '⛽', max: 800 },
  { key: 'travel',    label: 'Travel',     emoji: '✈️',  max: 1500 },
  { key: 'other',     label: 'Other',      emoji: '💳', max: 2000 },
]

function formatCAD(n) {
  return `$${Math.round(n).toLocaleString()}`
}

export default function SpendingInput({ spending, setSpending, onAnalyse }) {
  const [hovered, setHovered] = useState(null)
  const total = Object.values(spending).reduce((a, b) => a + b, 0)

  const cardStyle = {
    background: '#FFFFFF',
    borderRadius: 8,
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    overflow: 'hidden',
    border: '1px solid #D8D8D8',
  }

  return (
    <div style={cardStyle}>
      <div style={{
        padding: '16px 20px',
        borderBottom: '1px solid #D8D8D8',
        display: 'flex',
        alignItems: 'flex-start',
        gap: 20,
        flexWrap: 'wrap',
      }}>
        <div style={{ flex: '1 1 240px', borderLeft: '4px solid #C41230', paddingLeft: 18 }}>
          <p style={{
            fontSize: 11, fontWeight: 700, color: '#C41230',
            letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6,
          }}>01</p>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#002855', marginBottom: 6 }}>
            Your Monthly Spending
          </h2>
          <p style={{ fontSize: 14, color: '#6B6B6B' }}>
            Drag the sliders or type your amounts — Clara uses real CIBC card rates
          </p>
        </div>
        <div style={{ marginLeft: 'auto', textAlign: 'right', minWidth: 120 }}>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#002855' }}>
            {formatCAD(total)}
          </div>
          <div style={{ fontSize: 11, color: '#6B6B6B', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 4 }}>
            Monthly Total
          </div>
        </div>
      </div>

      <div style={{ padding: '20px' }}>
        {CATEGORIES.map(cat => {
          const pct = (spending[cat.key] / cat.max) * 100
          return (
            <div key={cat.key} style={{
              marginBottom: 14,
              padding: '12px 14px',
              borderRadius: 6,
              background: hovered === cat.key ? '#F4F4F4' : 'transparent',
              border: `1px solid ${hovered === cat.key ? '#D8D8D8' : 'transparent'}`,
              transition: 'background 0.2s ease, border-color 0.2s ease',
            }}
            onMouseEnter={() => setHovered(cat.key)}
            onMouseLeave={() => setHovered(null)}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 20 }}>{cat.emoji}</span>
                  <span style={{ fontSize: 15, fontWeight: 600, color: '#2C2C2C' }}>{cat.label}</span>
                  {total > 0 && (
                    <span style={{
                      fontSize: 11, fontWeight: 700,
                      color: '#6B6B6B',
                      background: '#F4F4F4',
                      border: '1px solid #D8D8D8',
                      borderRadius: 4,
                      padding: '2px 6px',
                    }}>
                      {Math.round((spending[cat.key] / total) * 100)}%
                    </span>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 13, color: '#6B6B6B' }}>/mo</span>
                  <input
                    type="number"
                    value={spending[cat.key]}
                    onChange={e => setSpending(prev => ({ ...prev, [cat.key]: Math.max(0, Math.min(cat.max, Number(e.target.value))) }))}
                    style={{
                      width: 88, padding: '8px 10px',
                      border: '1px solid #D8D8D8',
                      borderRadius: 4, fontSize: 15, fontWeight: 700,
                      color: '#2C2C2C', textAlign: 'right',
                      outline: 'none', transition: 'border-color 0.2s',
                    }}
                    onFocus={e => { e.target.style.borderColor = '#C41230' }}
                    onBlur={e => { e.target.style.borderColor = '#D8D8D8' }}
                  />
                </div>
              </div>

              <input
                type="range"
                min={0}
                max={cat.max}
                step={10}
                value={spending[cat.key]}
                onChange={e => setSpending(prev => ({ ...prev, [cat.key]: Number(e.target.value) }))}
                style={{
                  width: '100%',
                  height: 22,
                  ['--slider-pct']: `${pct}%`,
                }}
              />

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                <span style={{ fontSize: 11, color: '#6B6B6B' }}>$0</span>
                <span style={{ fontSize: 11, color: '#6B6B6B' }}>{formatCAD(cat.max)}</span>
              </div>
            </div>
          )
        })}

        <button
          onClick={onAnalyse}
          style={{
            width: '100%', padding: '12px 24px',
            background: '#C41230',
            color: '#FFFFFF', border: 'none',
            borderRadius: 4,
            fontSize: 16, fontWeight: 700,
            marginTop: 8, transition: 'background 0.2s ease',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#A00F28' }}
          onMouseLeave={e => { e.currentTarget.style.background = '#C41230' }}
        >
          <span>Analyse My Spending</span>
          <span style={{ fontSize: 18 }}>→</span>
        </button>
      </div>
    </div>
  )
}
