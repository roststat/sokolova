'use client'

import { useState, CSSProperties } from 'react'
import { calculateBazi, ELEMENT_COLORS } from '@/lib/bazi'
import type { BaziResult, Pillar } from '@/lib/bazi'

// ── Inline style helpers ───────────────────────────────────────────────────

const s = {
  section: {
    padding: '8rem 5vw',
    background: 'var(--off)',
    borderBottom: '1px solid var(--line)',
  } as CSSProperties,

  inner: {
    maxWidth: '1200px',
    margin: '0 auto',
  } as CSSProperties,

  label: {
    fontSize: '.75rem',
    fontWeight: 500,
    letterSpacing: '.12em',
    textTransform: 'uppercase' as const,
    color: 'var(--gold)',
    display: 'flex',
    alignItems: 'center',
    gap: '.7rem',
    marginBottom: '1rem',
  } as CSSProperties,

  h2: {
    fontFamily: 'var(--serif)',
    fontSize: 'clamp(2rem, 3.5vw, 3rem)',
    fontWeight: 700,
    color: 'var(--ink)',
    lineHeight: 1.1,
    letterSpacing: '-.01em',
    marginBottom: '.8rem',
  } as CSSProperties,

  subtitle: {
    fontSize: '1rem',
    color: 'var(--muted)',
    lineHeight: 1.7,
    marginBottom: '3rem',
    maxWidth: '520px',
  } as CSSProperties,

  form: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '1.2rem',
    alignItems: 'flex-end',
    marginBottom: '3.5rem',
    padding: '2rem 2.2rem',
    background: 'var(--white)',
    border: '1px solid var(--line)',
  } as CSSProperties,

  fieldGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '.4rem',
    flex: '1 1 180px',
  } as CSSProperties,

  fieldLabel: {
    fontSize: '.78rem',
    fontWeight: 500,
    letterSpacing: '.06em',
    textTransform: 'uppercase' as const,
    color: 'var(--muted)',
  } as CSSProperties,

  input: {
    fontFamily: 'var(--sans)',
    fontSize: '.95rem',
    color: 'var(--ink)',
    background: 'var(--off)',
    border: '1px solid var(--line)',
    padding: '.7rem 1rem',
    outline: 'none',
    width: '100%',
    cursor: 'pointer',
  } as CSSProperties,

  fieldNote: {
    fontSize: '.75rem',
    color: 'var(--muted)',
    marginTop: '.2rem',
  } as CSSProperties,

  submitBtn: {
    fontFamily: 'var(--sans)',
    fontSize: '.85rem',
    fontWeight: 500,
    letterSpacing: '.06em',
    textTransform: 'uppercase' as const,
    color: 'var(--white)',
    background: 'var(--ink)',
    border: 'none',
    padding: '1rem 2.2rem',
    cursor: 'pointer',
    transition: 'background .25s',
    alignSelf: 'flex-end',
    whiteSpace: 'nowrap' as const,
    flex: '0 0 auto',
  } as CSSProperties,

  pillarsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '1rem',
    marginBottom: '2.5rem',
  } as CSSProperties,

  pillarsGridMobile: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '1rem',
    marginBottom: '2.5rem',
  } as CSSProperties,

  pillarCard: (element: string): CSSProperties => ({
    border: `1px solid ${ELEMENT_COLORS[element]?.border ?? '#ddd'}`,
    background: 'var(--white)',
    padding: '1.5rem 1.2rem',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    gap: '.6rem',
  }),

  pillarTitle: {
    fontSize: '.72rem',
    fontWeight: 500,
    letterSpacing: '.1em',
    textTransform: 'uppercase' as const,
    color: 'var(--muted)',
    marginBottom: '.3rem',
  } as CSSProperties,

  stemChar: (element: string): CSSProperties => ({
    fontFamily: 'var(--serif)',
    fontSize: '3rem',
    fontWeight: 700,
    lineHeight: 1,
    color: ELEMENT_COLORS[element]?.text ?? '#333',
    background: ELEMENT_COLORS[element]?.bg ?? '#f5f5f5',
    padding: '.4rem .8rem',
    display: 'inline-block',
    margin: '0 auto',
  }),

  charInfo: (element: string): CSSProperties => ({
    fontSize: '.78rem',
    color: ELEMENT_COLORS[element]?.text ?? '#555',
    fontWeight: 500,
    letterSpacing: '.04em',
  }),

  divider: {
    width: '24px',
    height: '1.5px',
    background: 'var(--line)',
    margin: '.2rem auto',
  } as CSSProperties,

  branchChar: (element: string): CSSProperties => ({
    fontFamily: 'var(--serif)',
    fontSize: '2.4rem',
    fontWeight: 700,
    lineHeight: 1,
    color: ELEMENT_COLORS[element]?.text ?? '#333',
    background: ELEMENT_COLORS[element]?.bg ?? '#f5f5f5',
    padding: '.35rem .7rem',
    display: 'inline-block',
    margin: '0 auto',
  }),

  // Element balance
  balanceBox: {
    padding: '2rem 2.2rem',
    background: 'var(--white)',
    border: '1px solid var(--line)',
    marginBottom: '1.5rem',
  } as CSSProperties,

  balanceTitle: {
    fontFamily: 'var(--serif)',
    fontSize: '1.05rem',
    fontWeight: 700,
    color: 'var(--ink)',
    marginBottom: '1.4rem',
  } as CSSProperties,

  balanceRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '.8rem',
  } as CSSProperties,

  balanceName: {
    fontSize: '.8rem',
    fontWeight: 500,
    letterSpacing: '.06em',
    textTransform: 'uppercase' as const,
    width: '70px',
    flexShrink: 0,
  } as CSSProperties,

  barTrack: {
    flex: 1,
    height: '8px',
    background: 'var(--light)',
    borderRadius: '2px',
    overflow: 'hidden',
  } as CSSProperties,

  barFill: (element: string, count: number, maxCount: number): CSSProperties => ({
    height: '100%',
    width: `${(count / maxCount) * 100}%`,
    background: ELEMENT_COLORS[element]?.text ?? '#999',
    borderRadius: '2px',
    transition: 'width .5s ease',
  }),

  barCount: {
    fontSize: '.85rem',
    fontWeight: 700,
    fontFamily: 'var(--serif)',
    width: '20px',
    flexShrink: 0,
    textAlign: 'right' as const,
  } as CSSProperties,

  note: {
    fontSize: '.88rem',
    color: 'var(--muted)',
    lineHeight: 1.7,
    borderLeft: '2px solid var(--gold2)',
    paddingLeft: '1rem',
    opacity: 0.8,
  } as CSSProperties,
}

// ── Pillar card ────────────────────────────────────────────────────────────

interface PillarCardProps {
  title: string
  pillar: Pillar
}

function PillarCard({ title, pillar }: PillarCardProps) {
  return (
    <div style={s.pillarCard(pillar.stemElement)}>
      <div style={s.pillarTitle}>{title}</div>

      {/* Heavenly Stem */}
      <div style={s.stemChar(pillar.stemElement)}>{pillar.stem}</div>
      <div style={s.charInfo(pillar.stemElement)}>
        {pillar.stemElement} · {pillar.stemPolarity}
      </div>

      <div style={s.divider} />

      {/* Earthly Branch */}
      <div style={s.branchChar(pillar.branchElement)}>{pillar.branch}</div>
      <div style={s.charInfo(pillar.branchElement)}>
        {pillar.branchElement} · {pillar.animal}
      </div>
    </div>
  )
}

// ── Element balance ────────────────────────────────────────────────────────

const ELEMENT_ORDER = ['Дерево', 'Огонь', 'Земля', 'Металл', 'Вода']

interface ElementBalanceProps {
  counts: Record<string, number>
}

function ElementBalance({ counts }: ElementBalanceProps) {
  const maxCount = Math.max(...Object.values(counts), 1)

  return (
    <div style={s.balanceBox}>
      <div style={s.balanceTitle}>Баланс стихий</div>
      {ELEMENT_ORDER.map((el) => {
        const count = counts[el] ?? 0
        return (
          <div key={el} style={s.balanceRow}>
            <div
              style={{
                ...s.balanceName,
                color: ELEMENT_COLORS[el]?.text ?? 'var(--body)',
              }}
            >
              {el}
            </div>
            <div style={s.barTrack}>
              <div style={s.barFill(el, count, maxCount)} />
            </div>
            <div
              style={{
                ...s.barCount,
                color: ELEMENT_COLORS[el]?.text ?? 'var(--body)',
              }}
            >
              {count}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ── Main component ─────────────────────────────────────────────────────────

export default function BaziCalculator() {
  const [dateVal, setDateVal] = useState('1990-01-01')
  const [timeVal, setTimeVal] = useState('12:00')
  const [result, setResult] = useState<BaziResult | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  // Detect mobile via resize observer on mount
  // We use a simple inline approach: check window width
  const handleCalculate = () => {
    if (!dateVal) return

    const [yearStr, monthStr, dayStr] = dateVal.split('-')
    const [hourStr, minuteStr] = timeVal.split(':')

    const year = parseInt(yearStr, 10)
    const month = parseInt(monthStr, 10)
    const day = parseInt(dayStr, 10)
    const hour = parseInt(hourStr, 10)
    const minute = parseInt(minuteStr, 10)

    if (isNaN(year) || isNaN(month) || isNaN(day)) return

    const bazi = calculateBazi(year, month, day, hour || 12, minute || 0)
    setResult(bazi)

    // Check mobile
    if (typeof window !== 'undefined') {
      setIsMobile(window.innerWidth < 600)
    }
  }

  const gridStyle =
    isMobile ? s.pillarsGridMobile : s.pillarsGrid

  return (
    <section id="bazi" style={s.section}>
      {/* Responsive grid style injected via a real style tag */}
      <style>{`
        @media (max-width: 599px) {
          #bazi-pillars-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>

      <div style={s.inner}>
        {/* Header */}
        <div style={s.label}>
          <span style={{ width: 20, height: 1.5, background: 'var(--gold)', display: 'inline-block' }} />
          Астрология
        </div>
        <h2 style={s.h2}>Калькулятор Бацзы</h2>
        <p style={s.subtitle}>
          Узнайте свою карту четырёх столпов судьбы — древний китайский метод
          анализа личности и жизненного пути через дату и время рождения.
        </p>

        {/* Form */}
        <div style={s.form}>
          <div style={s.fieldGroup}>
            <label style={s.fieldLabel} htmlFor="bazi-date">
              Дата рождения
            </label>
            <input
              id="bazi-date"
              type="date"
              value={dateVal}
              onChange={(e) => setDateVal(e.target.value)}
              style={s.input}
            />
          </div>

          <div style={s.fieldGroup}>
            <label style={s.fieldLabel} htmlFor="bazi-time">
              Время рождения
            </label>
            <input
              id="bazi-time"
              type="time"
              value={timeVal}
              onChange={(e) => setTimeVal(e.target.value)}
              style={s.input}
            />
            <span style={s.fieldNote}>
              если не знаете — оставьте 12:00
            </span>
          </div>

          <button
            type="button"
            onClick={handleCalculate}
            style={s.submitBtn}
            onMouseEnter={(e) => {
              ;(e.currentTarget as HTMLButtonElement).style.background = 'var(--gold)'
            }}
            onMouseLeave={(e) => {
              ;(e.currentTarget as HTMLButtonElement).style.background = 'var(--ink)'
            }}
          >
            Рассчитать карту
          </button>
        </div>

        {/* Result */}
        {result && (
          <>
            {/* 4 Pillars */}
            <div
              id="bazi-pillars-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '1rem',
                marginBottom: '2.5rem',
              }}
            >
              <PillarCard title="Год" pillar={result.year} />
              <PillarCard title="Месяц" pillar={result.month} />
              <PillarCard title="День" pillar={result.day} />
              <PillarCard title="Час" pillar={result.hour} />
            </div>

            {/* Element balance */}
            <ElementBalance counts={result.elementCounts} />

            {/* Note */}
            <p style={s.note}>
              Время рождения влияет на столп часа. Для точного анализа уточните
              время у родителей.
            </p>
          </>
        )}
      </div>
    </section>
  )
}
