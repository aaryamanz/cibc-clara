export default function Header() {
  return (
    <header style={{
      background: '#FFFFFF',
      borderBottom: '3px solid #C41230',
      position: 'sticky', top: 0, zIndex: 100,
    }}>
      <div style={{
        maxWidth: 1200, margin: '0 auto',
        padding: '0 24px',
        height: 64,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{
              fontSize: 22, fontWeight: 800, color: '#C41230',
              letterSpacing: '-0.02em',
            }}>CIBC</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#C41230" aria-hidden>
              <path d="M12 2L22 12L12 22L2 12Z" />
            </svg>
          </div>
          <div style={{ width: 1, height: 26, background: '#D8D8D8' }} />
          <div>
            <span style={{
              fontSize: 17, fontWeight: 700, color: '#002855',
            }}>Clara</span>
            <span style={{
              fontSize: 11, color: '#6B6B6B', display: 'block',
              lineHeight: 1, marginTop: 2, fontWeight: 500,
            }}>Proactive Financial Intelligence</span>
          </div>
        </div>

        <nav style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {[
            { label: 'Spending', href: '#spending' },
            { label: 'Optimizer', href: '#optimizer' },
            { label: 'Ask Clara', href: '#chat' },
          ].map(link => (
            <a key={link.href} href={link.href} style={{
              fontSize: 14, fontWeight: 600, color: '#2C2C2C',
              textDecoration: 'none', padding: '8px 14px',
              borderRadius: 4,
              transition: 'color 0.2s ease',
            }}
            onMouseEnter={e => { e.target.style.color = '#C41230' }}
            onMouseLeave={e => { e.target.style.color = '#2C2C2C' }}
            >
              {link.label}
            </a>
          ))}
          <div style={{ width: 1, height: 20, background: '#D8D8D8', margin: '0 8px' }} />
          <span style={{
            fontSize: 11, fontWeight: 700, color: '#C41230',
            letterSpacing: '0.06em', textTransform: 'uppercase',
          }}>TGRP MVP</span>
        </nav>
      </div>
    </header>
  )
}
