import { useState, useRef, useEffect } from 'react'

const SUGGESTED_QUESTIONS = [
  "Why is this card better for my spending?",
  "What if I spend more on travel next year?",
  "How much would I save in 5 years?",
  "Am I spending more than average on dining?",
  "Which category gives me the best return?",
]

function formatCAD(n) {
  return `$${Math.abs(Math.round(n)).toLocaleString()}`
}

export default function ClaraChat({ spending, optimizerResult }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hi! I'm Clara — your CIBC Financial Intelligence Co-Pilot. ✦\n\nI can see your spending profile and reward analysis. Ask me anything — why the recommended card is best for you, how to maximise your rewards, or what happens if your spending changes. What would you like to know?`,
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const spendingContext = {
    monthlySpending: spending,
    totalMonthly: Object.values(spending).reduce((a, b) => a + b, 0),
    optimizerResult: optimizerResult ? {
      bestCard: optimizerResult.best?.name,
      bestCardAnnualReward: optimizerResult.best?.annual,
      currentCardAnnualReward: optimizerResult.current?.annual,
      annualGap: optimizerResult.gap,
    } : null,
  }

  async function sendMessage(text) {
    const userText = text || input.trim()
    if (!userText || loading) return

    setInput('')
    setError(null)
    const newMessages = [...messages, { role: 'user', content: userText }]
    setMessages(newMessages)
    setLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
          spendingContext,
        }),
      })

      if (!response.ok) throw new Error('Failed to reach Clara')

      const data = await response.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.content }])
    } catch (err) {
      setError('Clara is temporarily unavailable. Please check your API key in Vercel environment variables.')
      setMessages(prev => prev.slice(0, -1))
    } finally {
      setLoading(false)
    }
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div style={{
      background: 'white', borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-md)', overflow: 'hidden',
      border: '1px solid var(--cibc-silver)',
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, var(--cibc-navy) 0%, #1A3A5C 100%)',
        padding: '20px 28px',
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: '50%',
          background: 'rgba(196,18,48,0.3)', border: '2px solid var(--cibc-red)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 13, fontWeight: 700, color: 'white',
        }}>03</div>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: 'white', fontFamily: 'DM Serif Display, serif' }}>
            Ask Clara
          </h2>
          <p style={{ fontSize: 13, color: '#64748B', marginTop: 2 }}>
            Conversational AI — powered by Claude · Analyses your real spending data
          </p>
        </div>
        {/* Live indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#10B981', animation: 'pulse 2s infinite' }} />
          <span style={{ fontSize: 12, color: '#10B981', fontWeight: 600 }}>Live AI</span>
        </div>
      </div>

      {/* Suggested questions */}
      <div style={{
        padding: '16px 24px', background: 'var(--cibc-off-white)',
        borderBottom: '1px solid var(--cibc-silver)',
        display: 'flex', gap: 8, flexWrap: 'wrap',
        alignItems: 'center',
      }}>
        <span style={{ fontSize: 12, color: 'var(--cibc-muted)', fontWeight: 600, whiteSpace: 'nowrap' }}>Try asking:</span>
        {SUGGESTED_QUESTIONS.map(q => (
          <button key={q}
            onClick={() => sendMessage(q)}
            disabled={loading}
            style={{
              fontSize: 12, padding: '5px 12px',
              background: 'white', border: '1px solid var(--cibc-silver)',
              borderRadius: 100, cursor: 'pointer', color: 'var(--cibc-navy)',
              transition: 'all 0.2s ease', whiteSpace: 'nowrap', fontWeight: 500,
              opacity: loading ? 0.5 : 1,
            }}
            onMouseEnter={e => { if (!loading) { e.currentTarget.style.borderColor = 'var(--cibc-red)'; e.currentTarget.style.color = 'var(--cibc-red)'; e.currentTarget.style.background = 'var(--cibc-red-light)'; }}}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--cibc-silver)'; e.currentTarget.style.color = 'var(--cibc-navy)'; e.currentTarget.style.background = 'white'; }}
          >
            {q}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div style={{
        height: 420, overflowY: 'auto', padding: '24px',
        display: 'flex', flexDirection: 'column', gap: 16,
      }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            display: 'flex',
            justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
            animation: 'slideIn 0.3s ease forwards',
          }}>
            {msg.role === 'assistant' && (
              <div style={{
                width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                background: 'linear-gradient(135deg, var(--cibc-red) 0%, var(--cibc-red-dark) 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 14, color: 'white', fontWeight: 700,
                marginRight: 10, alignSelf: 'flex-end',
              }}>✦</div>
            )}
            <div style={{
              maxWidth: '72%',
              padding: '13px 18px',
              borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
              background: msg.role === 'user'
                ? 'linear-gradient(135deg, var(--cibc-red) 0%, var(--cibc-red-dark) 100%)'
                : 'var(--cibc-off-white)',
              color: msg.role === 'user' ? 'white' : 'var(--cibc-navy)',
              fontSize: 14, lineHeight: 1.6,
              border: msg.role === 'assistant' ? '1px solid var(--cibc-silver)' : 'none',
              boxShadow: 'var(--shadow-sm)',
              whiteSpace: 'pre-wrap',
            }}>
              {msg.content}
            </div>
            {msg.role === 'user' && (
              <div style={{
                width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                background: 'var(--cibc-silver)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 14, marginLeft: 10, alignSelf: 'flex-end',
              }}>👤</div>
            )}
          </div>
        ))}

        {/* Loading indicator */}
        {loading && (
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--cibc-red) 0%, var(--cibc-red-dark) 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14, color: 'white', animation: 'pulse 1s infinite',
            }}>✦</div>
            <div style={{
              padding: '13px 18px', borderRadius: '18px 18px 18px 4px',
              background: 'var(--cibc-off-white)', border: '1px solid var(--cibc-silver)',
              display: 'flex', gap: 5, alignItems: 'center',
            }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{
                  width: 7, height: 7, borderRadius: '50%',
                  background: 'var(--cibc-red)',
                  animation: `pulse 1.2s ease ${i * 0.2}s infinite`,
                }} />
              ))}
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{
            padding: '12px 16px', borderRadius: 'var(--radius-sm)',
            background: '#FFF1F2', border: '1px solid #FCA5A5',
            fontSize: 13, color: '#DC2626',
          }}>
            ⚠ {error}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div style={{
        padding: '16px 24px', borderTop: '1px solid var(--cibc-silver)',
        background: 'white',
        display: 'flex', gap: 10, alignItems: 'flex-end',
      }}>
        <textarea
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Ask Clara about your spending, rewards, or financial goals..."
          rows={1}
          style={{
            flex: 1, padding: '12px 16px',
            border: '1.5px solid var(--cibc-silver)',
            borderRadius: 'var(--radius)',
            fontSize: 14, resize: 'none',
            outline: 'none', lineHeight: 1.5,
            transition: 'border-color 0.2s ease',
            fontFamily: 'DM Sans, sans-serif',
            color: 'var(--cibc-navy)',
          }}
          onFocus={e => e.target.style.borderColor = 'var(--cibc-red)'}
          onBlur={e => e.target.style.borderColor = 'var(--cibc-silver)'}
          onInput={e => {
            e.target.style.height = 'auto'
            e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'
          }}
        />
        <button
          onClick={() => sendMessage()}
          disabled={!input.trim() || loading}
          style={{
            width: 44, height: 44, borderRadius: '50%', border: 'none',
            background: input.trim() && !loading ? 'var(--cibc-red)' : 'var(--cibc-silver)',
            color: 'white', fontSize: 18, cursor: input.trim() && !loading ? 'pointer' : 'default',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.2s ease', flexShrink: 0,
          }}
          onMouseEnter={e => { if (input.trim() && !loading) { e.currentTarget.style.background = 'var(--cibc-red-dark)'; e.currentTarget.style.transform = 'scale(1.05)'; }}}
          onMouseLeave={e => { e.currentTarget.style.background = input.trim() && !loading ? 'var(--cibc-red)' : 'var(--cibc-silver)'; e.currentTarget.style.transform = 'none'; }}
        >
          {loading ? '⋯' : '↑'}
        </button>
      </div>

      {/* Disclaimer */}
      <div style={{
        padding: '10px 24px', background: 'var(--cibc-off-white)',
        borderTop: '1px solid var(--cibc-silver)',
      }}>
        <p style={{ fontSize: 11, color: '#94A3B8', textAlign: 'center' }}>
          Clara is an AI prototype. Reward rates sourced from CIBC's published card terms.
          Always verify with a CIBC advisor before applying. · Powered by Claude AI
        </p>
      </div>
    </div>
  )
}
