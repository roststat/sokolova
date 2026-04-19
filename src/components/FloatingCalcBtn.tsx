'use client'

import Link from 'next/link'

export default function FloatingCalcBtn() {
  return (
    <>
      <style>{`
        @media (min-width: 768px) {
          .floating-calc-btn { display: none !important; }
        }
      `}</style>
      <Link
        href="/bazi"
        className="floating-calc-btn"
        style={{
          position: 'fixed',
          top: '1rem',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 300,
          background: 'var(--gold)',
          color: '#fff',
          fontFamily: 'var(--sans)',
          fontSize: '.75rem',
          fontWeight: 700,
          letterSpacing: '.12em',
          textTransform: 'uppercase',
          textDecoration: 'none',
          padding: '.55rem 1.4rem',
          whiteSpace: 'nowrap',
          boxShadow: '0 2px 12px rgba(158,123,40,.35)',
        }}
      >
        Калькулятор
      </Link>
    </>
  )
}
