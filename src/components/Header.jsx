export default function Header() {
  return (
    <header style={{
      background: 'white',
      borderBottom: '1px solid var(--cibc-silver)',
      position: 'sticky', top: 0, zIndex: 100,
      boxShadow: 'var(--shadow-sm)',
    }}>
      <div style={{
        maxWidth: 900, margin: '0 auto',
        padding: '0 24px',
        height: 60,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        {/* CIBC Logo + Clara */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {/* CIBC wordmark */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{
              fontSize: 22, fontWeight: 900, color: 'var(--cibc-red)',
              fontFamily: 'DM Sans, sans-serif', letterSpacing: '-0.02em'
            }}>CIBC</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="var(--cibc-red)">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          <div style={{ width: 1, height: 24, background: 'var(--cibc-silver)' }} />
          <div>
            <span style={{
              fontSize: 16, fontWeight: 700, color: 'var(--cibc-navy)',
              fontFamily: 'DM Serif Display, serif',
            }}>Clara</span>
            <span style={{
              fontSize: 11, color: 'var(--cibc-muted)', display: 'block',
              lineHeight: 1, marginTop: 1, fontWeight: 500
            }}>Proactive Financial Intelligence</span>
          </div>
        </div>

        {/* Nav links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {[
            { label: 'Spending', href: '#spending' },
            { label: 'Optimizer', href: '#optimizer' },
            { label: 'Ask Clara', href: '#chat' },
          ].map(link => (
            <a key={link.href} href={link.href} style={{
              fontSize: 13, fontWeight: 500, color: 'var(--cibc-muted)',
              textDecoration: 'none', padding: '6px 12px', borderRadius: 6,
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => { e.target.style.color = 'var(--cibc-red)'; e.target.style.background = 'var(--cibc-red-light)'; }}
            onMouseLeave={e => { e.target.style.color = 'var(--cibc-muted)'; e.target.style.background = 'transparent'; }}
            >
              {link.label}
            </a>
          ))}
          <div style={{ width: 1, height: 20, background: 'var(--cibc-silver)', margin: '0 4px' }} />
          <div style={{
            fontSize: 11, fontWeight: 600, color: 'var(--cibc-red)',
            background: 'var(--cibc-red-light)', padding: '4px 10px',
            borderRadius: 100, letterSpacing: '0.04em',
          }}>TGRP MVP</div>
        </nav>
      </div>
    </header>
  )
}
