import { useState, useRef, useEffect } from 'react'

const SUGGESTED_QUESTIONS = [
  "Why is this card better for my spending?",
  "What if I spend more on travel next year?",
  "How much would I save in 5 years?",
  "Am I spending more than average on dining?",
  "Which category gives me the best return?",
]

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

  const shell = {
    background: '#FFFFFF',
    borderRadius: 8,
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    overflow: 'hidden',
    border: '1px solid #D8D8D8',
  }

  return (
    <div style={shell}>
      <div style={{
        padding: '22px 28px',
        borderBottom: '1px solid #D8D8D8',
        display: 'flex',
        alignItems: 'flex-start',
        gap: 16,
        flexWrap: 'wrap',
      }}>
        <div style={{ flex: '1 1 200px', borderLeft: '4px solid #C41230', paddingLeft: 18 }}>
          <p style={{
            fontSize: 11, fontWeight: 700, color: '#C41230',
            letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6,
          }}>03</p>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#002855' }}>
            Ask Clara
          </h2>
          <p style={{ fontSize: 14, color: '#6B6B6B', marginTop: 6 }}>
            Conversational AI — powered by Claude · Analyses your real spending data
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 'auto', alignSelf: 'center' }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#C41230', animation: 'pulse 2s infinite' }} />
          <span style={{ fontSize: 12, color: '#2C2C2C', fontWeight: 700 }}>Live AI</span>
        </div>
      </div>

      <div style={{
        padding: '16px 24px', background: '#F4F4F4',
        borderBottom: '1px solid #D8D8D8',
        display: 'flex', gap: 8, flexWrap: 'wrap',
        alignItems: 'center',
      }}>
        <span style={{ fontSize: 12, color: '#6B6B6B', fontWeight: 700, whiteSpace: 'nowrap' }}>Try asking:</span>
        {SUGGESTED_QUESTIONS.map(q => (
          <button key={q} type="button"
            onClick={() => sendMessage(q)}
            disabled={loading}
            style={{
              fontSize: 12, padding: '6px 12px',
              background: '#FFFFFF', border: '1px solid #D8D8D8',
              borderRadius: 4, cursor: loading ? 'default' : 'pointer', color: '#2C2C2C',
              transition: 'border-color 0.2s ease, color 0.2s ease', whiteSpace: 'nowrap', fontWeight: 600,
              opacity: loading ? 0.5 : 1,
            }}
            onMouseEnter={e => {
              if (!loading) {
                e.currentTarget.style.borderColor = '#C41230'
                e.currentTarget.style.color = '#C41230'
              }
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = '#D8D8D8'
              e.currentTarget.style.color = '#2C2C2C'
            }}
          >
            {q}
          </button>
        ))}
      </div>

      <div style={{
        height: 420, overflowY: 'auto', padding: '24px',
        display: 'flex', flexDirection: 'column', gap: 16,
        background: '#F4F4F4',
      }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            display: 'flex',
            justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
            animation: 'slideIn 0.3s ease forwards',
          }}>
            {msg.role === 'assistant' && (
              <div style={{
                width: 32, height: 32, borderRadius: 4, flexShrink: 0,
                background: '#C41230',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 14, color: '#FFFFFF', fontWeight: 700,
                marginRight: 10, alignSelf: 'flex-end',
              }}>✦</div>
            )}
            <div style={{
              maxWidth: '72%',
              padding: '12px 16px',
              borderRadius: 6,
              background: msg.role === 'user' ? '#C41230' : '#FFFFFF',
              color: msg.role === 'user' ? '#FFFFFF' : '#2C2C2C',
              fontSize: 14, lineHeight: 1.6,
              border: msg.role === 'assistant' ? '1px solid #D8D8D8' : 'none',
              boxShadow: msg.role === 'assistant' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
              whiteSpace: 'pre-wrap',
            }}>
              {msg.content}
            </div>
            {msg.role === 'user' && (
              <div style={{
                width: 32, height: 32, borderRadius: 4, flexShrink: 0,
                background: '#D8D8D8',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 14, marginLeft: 10, alignSelf: 'flex-end',
              }}>👤</div>
            )}
          </div>
        ))}

        {loading && (
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 4,
              background: '#C41230',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14, color: '#FFFFFF', animation: 'pulse 1s infinite',
            }}>✦</div>
            <div style={{
              padding: '12px 16px', borderRadius: 6,
              background: '#FFFFFF', border: '1px solid #D8D8D8',
              display: 'flex', gap: 5, alignItems: 'center',
            }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{
                  width: 7, height: 7, borderRadius: '50%',
                  background: '#C41230',
                  animation: `pulse 1.2s ease ${i * 0.2}s infinite`,
                }} />
              ))}
            </div>
          </div>
        )}

        {error && (
          <div style={{
            padding: '12px 16px', borderRadius: 6,
            background: '#FFFFFF', border: '1px solid #C41230',
            fontSize: 13, color: '#C41230', fontWeight: 600,
          }}>
            ⚠ {error}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <div style={{
        padding: '16px 24px', borderTop: '1px solid #D8D8D8',
        background: '#FFFFFF',
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
            border: '1px solid #D8D8D8',
            borderRadius: 4,
            fontSize: 14, resize: 'none',
            outline: 'none', lineHeight: 1.5,
            transition: 'border-color 0.2s ease',
            color: '#2C2C2C',
          }}
          onFocus={e => { e.target.style.borderColor = '#C41230' }}
          onBlur={e => { e.target.style.borderColor = '#D8D8D8' }}
          onInput={e => {
            e.target.style.height = 'auto'
            e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'
          }}
        />
        <button
          type="button"
          onClick={() => sendMessage()}
          disabled={!input.trim() || loading}
          style={{
            width: 44, height: 44, borderRadius: '50%', border: 'none',
            background: input.trim() && !loading ? '#C41230' : '#D8D8D8',
            color: '#FFFFFF', fontSize: 18, cursor: input.trim() && !loading ? 'pointer' : 'default',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'background 0.2s ease', flexShrink: 0,
          }}
          onMouseEnter={e => {
            if (input.trim() && !loading) e.currentTarget.style.background = '#A00F28'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = input.trim() && !loading ? '#C41230' : '#D8D8D8'
          }}
        >
          {loading ? '⋯' : '↑'}
        </button>
      </div>

      <div style={{
        padding: '12px 24px', background: '#F4F4F4',
        borderTop: '1px solid #D8D8D8',
      }}>
        <p style={{ fontSize: 11, color: '#6B6B6B', textAlign: 'center', lineHeight: 1.5 }}>
          Clara is an AI prototype. Reward rates sourced from CIBC&apos;s published card terms.
          Always verify with a CIBC advisor before applying. · Powered by Claude AI
        </p>
      </div>
    </div>
  )
}
