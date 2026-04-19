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
          bottom: '1.8rem',
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
          padding: '.7rem 2rem',
          whiteSpace: 'nowrap',
          boxShadow: '0 4px 20px rgba(158,123,40,.4)',
          borderRadius: '2px',
        }}
      >
        ✦ Калькулятор
      </Link>
    </>
  )
}
