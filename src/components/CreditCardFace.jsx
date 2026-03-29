/**
 * Credit-card visual (~1.586:1) with CIBC wordmark, chip, name, network mark.
 */
export default function CreditCardFace({ gradient, cardName, network }) {
  const networkLabel = network === 'mastercard' ? 'Mastercard' : 'VISA'

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: '1.586 / 1',
        borderRadius: 8,
        overflow: 'hidden',
        background: gradient,
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.12)',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.14,
          backgroundImage:
            'repeating-linear-gradient(-32deg, transparent, transparent 5px, rgba(255,255,255,0.12) 5px, rgba(255,255,255,0.12) 6px)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(125deg, rgba(255,255,255,0.08) 0%, transparent 45%, rgba(0,0,0,0.12) 100%)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          position: 'absolute',
          top: '10%',
          left: '6%',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
        }}
      >
        <span
          style={{
            fontSize: 'clamp(11px, 2.8vw, 15px)',
            fontWeight: 800,
            color: 'white',
            letterSpacing: '-0.02em',
          }}
        >
          CIBC
        </span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="white" aria-hidden>
          <path d="M12 2L22 12L12 22L2 12Z" />
        </svg>
      </div>

      <div
        style={{
          position: 'absolute',
          left: '6%',
          top: '50%',
          transform: 'translateY(-50%)',
          width: 'clamp(36px, 11vw, 48px)',
          height: 'clamp(28px, 8vw, 36px)',
          borderRadius: 4,
          background: 'linear-gradient(145deg, #E8C87A 0%, #C9A227 35%, #A67C00 100%)',
          boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.45), 0 2px 4px rgba(0,0,0,0.25)',
        }}
      />

      <div
        style={{
          position: 'absolute',
          bottom: '10%',
          left: '6%',
          right: network === 'mastercard' ? '32%' : '26%',
        }}
      >
        <p
          style={{
            fontSize: 'clamp(10px, 2.4vw, 13px)',
            fontWeight: 700,
            color: 'rgba(255,255,255,0.95)',
            lineHeight: 1.25,
            textShadow: '0 1px 2px rgba(0,0,0,0.2)',
          }}
        >
          {cardName}
        </p>
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: '8%',
          right: '6%',
          fontSize: 'clamp(9px, 2vw, 12px)',
          fontWeight: 800,
          color: 'white',
          letterSpacing: network === 'mastercard' ? '0.02em' : '0.2em',
          textShadow: '0 1px 2px rgba(0,0,0,0.25)',
        }}
      >
        {networkLabel}
      </div>
    </div>
  )
}
