'use client'

import Link from 'next/link'

export default function FloatingCalcBtn() {
  return (
    <div className="bottom-bar">
      <Link href="/bazi" className="bottom-bar-cta">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>
        </svg>
        Калькулятор Бацзы
      </Link>
      <a href="/#contact" className="bottom-bar-contact">
        Записаться
      </a>
    </div>
  )
}
