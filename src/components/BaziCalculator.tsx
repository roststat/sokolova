'use client'

import { useState, CSSProperties } from 'react'
import { calculateBazi, ELEMENT_COLORS } from '@/lib/bazi'
import type { BaziResult, Pillar, LuckCycle, YearlyCycle } from '@/lib/bazi'

// ── Styles ─────────────────────────────────────────────────────────────────

const s = {
  section: {
    padding: '8rem 5vw',
    background: 'var(--off)',
    borderBottom: '1px solid var(--line)',
  } as CSSProperties,

  inner: { maxWidth: '1100px', margin: '0 auto' } as CSSProperties,

  label: {
    fontSize: '.75rem', fontWeight: 500, letterSpacing: '.12em',
    textTransform: 'uppercase' as const, color: 'var(--gold)',
    display: 'flex', alignItems: 'center', gap: '.7rem', marginBottom: '1rem',
  } as CSSProperties,

  h2: {
    fontFamily: 'var(--serif)', fontSize: 'clamp(2rem,3.5vw,3rem)',
    fontWeight: 700, color: 'var(--ink)', lineHeight: 1.1,
    letterSpacing: '-.01em', marginBottom: '.8rem',
  } as CSSProperties,

  subtitle: {
    fontSize: '1rem', color: 'var(--muted)', lineHeight: 1.7,
    marginBottom: '3rem', maxWidth: '520px',
  } as CSSProperties,

  form: {
    display: 'flex', flexWrap: 'wrap' as const, gap: '1.2rem',
    alignItems: 'flex-end', marginBottom: '3.5rem',
    padding: '2rem 2.2rem', background: 'var(--white)',
    border: '1px solid var(--line)',
  } as CSSProperties,

  fieldGroup: {
    display: 'flex', flexDirection: 'column' as const, gap: '.4rem', flex: '1 1 160px',
  } as CSSProperties,

  fieldLabel: {
    fontSize: '.78rem', fontWeight: 500, letterSpacing: '.06em',
    textTransform: 'uppercase' as const, color: 'var(--muted)',
  } as CSSProperties,

  input: {
    fontFamily: 'var(--sans)', fontSize: '.95rem', color: 'var(--ink)',
    background: 'var(--off)', border: '1px solid var(--line)',
    padding: '.7rem 1rem', outline: 'none', width: '100%',
  } as CSSProperties,

  select: {
    fontFamily: 'var(--sans)', fontSize: '.95rem', color: 'var(--ink)',
    background: 'var(--off)', border: '1px solid var(--line)',
    padding: '.7rem 1rem', outline: 'none', width: '100%', cursor: 'pointer',
  } as CSSProperties,

  fieldNote: { fontSize: '.75rem', color: 'var(--muted)', marginTop: '.2rem' } as CSSProperties,

  submitBtn: {
    fontFamily: 'var(--sans)', fontSize: '.85rem', fontWeight: 500,
    letterSpacing: '.06em', textTransform: 'uppercase' as const,
    color: 'var(--white)', background: 'var(--ink)', border: 'none',
    padding: '1rem 2.2rem', cursor: 'pointer', transition: 'background .25s',
    alignSelf: 'flex-end', whiteSpace: 'nowrap' as const, flex: '0 0 auto',
  } as CSSProperties,

  // Section headers inside results
  sectionHeader: {
    display: 'flex', alignItems: 'center', gap: '1rem',
    marginBottom: '1.5rem', marginTop: '3rem',
  } as CSSProperties,

  sectionTitle: {
    fontFamily: 'var(--serif)', fontSize: '1.15rem', fontWeight: 700, color: 'var(--ink)',
  } as CSSProperties,

  sectionLine: { flex: 1, height: '1px', background: 'var(--line)' } as CSSProperties,

  // Day master banner
  dayMasterBanner: {
    padding: '1.8rem 2.2rem', background: 'var(--white)',
    border: '1px solid var(--line)', marginBottom: '2rem',
    display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' as const,
  } as CSSProperties,

  dayMasterChar: (element: string): CSSProperties => ({
    fontFamily: 'var(--serif)', fontSize: '3.5rem', fontWeight: 700, lineHeight: 1,
    color: ELEMENT_COLORS[element]?.text ?? '#333',
    background: ELEMENT_COLORS[element]?.bg ?? '#f5f5f5',
    padding: '.5rem 1rem', display: 'inline-block',
  }),

  dayMasterInfo: { display: 'flex', flexDirection: 'column' as const, gap: '.3rem' } as CSSProperties,

  dayMasterLabel: {
    fontSize: '.75rem', fontWeight: 500, letterSpacing: '.1em',
    textTransform: 'uppercase' as const, color: 'var(--muted)',
  } as CSSProperties,

  dayMasterTitle: {
    fontFamily: 'var(--serif)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--ink)',
  } as CSSProperties,

  dayMasterSub: { fontSize: '.9rem', color: 'var(--muted)' } as CSSProperties,

  // Pillars
  pillarsGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '1rem', marginBottom: '1rem',
  } as CSSProperties,

  pillarCard: (element: string): CSSProperties => ({
    border: `1px solid ${ELEMENT_COLORS[element]?.border ?? '#ddd'}`,
    background: 'var(--white)', padding: '1.4rem 1rem',
    textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '.5rem',
  }),

  pillarTitle: {
    fontSize: '.7rem', fontWeight: 500, letterSpacing: '.1em',
    textTransform: 'uppercase' as const, color: 'var(--muted)', marginBottom: '.2rem',
  } as CSSProperties,

  stemChar: (element: string): CSSProperties => ({
    fontFamily: 'var(--serif)', fontSize: '2.6rem', fontWeight: 700, lineHeight: 1,
    color: ELEMENT_COLORS[element]?.text ?? '#333',
    background: ELEMENT_COLORS[element]?.bg ?? '#f5f5f5',
    padding: '.3rem .7rem', display: 'inline-block', margin: '0 auto',
  }),

  charInfo: (element: string): CSSProperties => ({
    fontSize: '.72rem', color: ELEMENT_COLORS[element]?.text ?? '#555',
    fontWeight: 500, letterSpacing: '.04em',
  }),

  divider: {
    width: '24px', height: '1.5px', background: 'var(--line)', margin: '.15rem auto',
  } as CSSProperties,

  branchChar: (element: string): CSSProperties => ({
    fontFamily: 'var(--serif)', fontSize: '2.1rem', fontWeight: 700, lineHeight: 1,
    color: ELEMENT_COLORS[element]?.text ?? '#333',
    background: ELEMENT_COLORS[element]?.bg ?? '#f5f5f5',
    padding: '.3rem .65rem', display: 'inline-block', margin: '0 auto',
  }),

  hiddenLabel: {
    fontSize: '.65rem', letterSpacing: '.06em', textTransform: 'uppercase' as const,
    color: 'var(--faint)', marginTop: '.3rem',
  } as CSSProperties,

  hiddenRow: {
    display: 'flex', justifyContent: 'center', gap: '.3rem', flexWrap: 'wrap' as const,
  } as CSSProperties,

  hiddenChip: (element: string): CSSProperties => ({
    fontSize: '.75rem', fontWeight: 600,
    color: ELEMENT_COLORS[element]?.text ?? '#555',
    background: ELEMENT_COLORS[element]?.bg ?? '#f5f5f5',
    border: `1px solid ${ELEMENT_COLORS[element]?.border ?? '#ddd'}`,
    padding: '.1rem .4rem', borderRadius: '2px',
  }),

  // Element balance
  balanceBox: {
    padding: '2rem 2.2rem', background: 'var(--white)',
    border: '1px solid var(--line)', marginBottom: '1.5rem',
  } as CSSProperties,

  balanceTitle: {
    fontFamily: 'var(--serif)', fontSize: '1.05rem', fontWeight: 700,
    color: 'var(--ink)', marginBottom: '1.4rem',
  } as CSSProperties,

  balanceRow: { display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '.8rem' } as CSSProperties,

  balanceName: {
    fontSize: '.8rem', fontWeight: 500, letterSpacing: '.06em',
    textTransform: 'uppercase' as const, width: '70px', flexShrink: 0,
  } as CSSProperties,

  barTrack: {
    flex: 1, height: '8px', background: 'var(--light)', borderRadius: '2px', overflow: 'hidden',
  } as CSSProperties,

  barFill: (element: string, count: number, maxCount: number): CSSProperties => ({
    height: '100%', width: `${(count / maxCount) * 100}%`,
    background: ELEMENT_COLORS[element]?.text ?? '#999',
    borderRadius: '2px', transition: 'width .5s ease',
  }),

  barCount: {
    fontSize: '.85rem', fontWeight: 700, fontFamily: 'var(--serif)',
    width: '28px', flexShrink: 0, textAlign: 'right' as const,
  } as CSSProperties,

  // Luck cycles
  luckGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
    gap: '.75rem', marginBottom: '1rem',
  } as CSSProperties,

  luckCard: (isCurrent: boolean, element: string): CSSProperties => ({
    border: isCurrent
      ? `2px solid ${ELEMENT_COLORS[element]?.text ?? 'var(--gold)'}`
      : `1px solid ${ELEMENT_COLORS[element]?.border ?? '#ddd'}`,
    background: isCurrent ? (ELEMENT_COLORS[element]?.bg ?? '#f5f5f5') : 'var(--white)',
    padding: '.9rem .7rem', textAlign: 'center',
    display: 'flex', flexDirection: 'column', gap: '.35rem', position: 'relative',
  }),

  luckAge: (isCurrent: boolean): CSSProperties => ({
    fontSize: '.68rem', fontWeight: 600, letterSpacing: '.06em',
    textTransform: 'uppercase' as const,
    color: isCurrent ? 'var(--gold)' : 'var(--muted)',
  }),

  luckStem: (element: string): CSSProperties => ({
    fontFamily: 'var(--serif)', fontSize: '1.7rem', fontWeight: 700, lineHeight: 1,
    color: ELEMENT_COLORS[element]?.text ?? '#333',
  }),

  luckBranch: (element: string): CSSProperties => ({
    fontFamily: 'var(--serif)', fontSize: '1.4rem', fontWeight: 700, lineHeight: 1,
    color: ELEMENT_COLORS[element]?.text ?? '#555',
  }),

  luckYear: {
    fontSize: '.65rem', color: 'var(--faint)', lineHeight: 1.3,
  } as CSSProperties,

  currentBadge: {
    position: 'absolute', top: '-8px', left: '50%', transform: 'translateX(-50%)',
    background: 'var(--gold)', color: 'var(--white)',
    fontSize: '.55rem', fontWeight: 700, letterSpacing: '.08em',
    textTransform: 'uppercase' as const, padding: '.15rem .4rem',
    whiteSpace: 'nowrap' as const,
  } as CSSProperties,

  // Yearly cycles
  yearTable: {
    width: '100%', borderCollapse: 'collapse' as const,
    background: 'var(--white)', border: '1px solid var(--line)',
  } as CSSProperties,

  yearTh: {
    fontSize: '.72rem', fontWeight: 500, letterSpacing: '.08em',
    textTransform: 'uppercase' as const, color: 'var(--muted)',
    padding: '.8rem 1rem', borderBottom: '1px solid var(--line)',
    textAlign: 'left' as const, background: 'var(--off)',
  } as CSSProperties,

  yearTd: (isCurrent: boolean): CSSProperties => ({
    padding: '.75rem 1rem', borderBottom: '1px solid var(--line)',
    background: isCurrent ? 'rgba(158,123,40,.05)' : 'transparent',
    fontWeight: isCurrent ? 600 : 400,
  }),

  yearChar: (element: string): CSSProperties => ({
    fontFamily: 'var(--serif)', fontSize: '1.4rem', fontWeight: 700,
    color: ELEMENT_COLORS[element]?.text ?? '#333',
    display: 'inline-block', marginRight: '.3rem',
  }),

  yearEl: (element: string): CSSProperties => ({
    fontSize: '.78rem', fontWeight: 500,
    color: ELEMENT_COLORS[element]?.text ?? '#555',
    background: ELEMENT_COLORS[element]?.bg ?? '#f5f5f5',
    border: `1px solid ${ELEMENT_COLORS[element]?.border ?? '#ddd'}`,
    padding: '.1rem .5rem', borderRadius: '2px', marginRight: '.3rem',
  }),

  note: {
    fontSize: '.88rem', color: 'var(--muted)', lineHeight: 1.7,
    borderLeft: '2px solid var(--gold2)', paddingLeft: '1rem', opacity: 0.8,
    marginTop: '2rem',
  } as CSSProperties,
}

// ── Sub-components ─────────────────────────────────────────────────────────

function SectionHeader({ title }: { title: string }) {
  return (
    <div style={s.sectionHeader}>
      <span style={s.sectionTitle}>{title}</span>
      <span style={s.sectionLine} />
    </div>
  )
}

function PillarCard({ title, pillar }: { title: string; pillar: Pillar }) {
  return (
    <div style={s.pillarCard(pillar.stemElement)}>
      <div style={s.pillarTitle}>{title}</div>

      <div style={s.stemChar(pillar.stemElement)}>{pillar.stem}</div>
      <div style={s.charInfo(pillar.stemElement)}>
        {pillar.stemNameRu} · {pillar.stemElement} · {pillar.stemPolarity}
      </div>

      <div style={s.divider} />

      <div style={s.branchChar(pillar.branchElement)}>{pillar.branch}</div>
      <div style={s.charInfo(pillar.branchElement)}>
        {pillar.branchNameRu} · {pillar.animal}
      </div>

      {pillar.hiddenStems.length > 0 && (
        <>
          <div style={s.hiddenLabel}>Скрытые стволы</div>
          <div style={s.hiddenRow}>
            {pillar.hiddenStems.map((hs, i) => (
              <span key={i} style={s.hiddenChip(hs.element)} title={`${hs.nameRu} · ${hs.element}`}>
                {hs.char}
              </span>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

const ELEMENT_ORDER = ['Дерево', 'Огонь', 'Земля', 'Металл', 'Вода']

function ElementBalance({ counts }: { counts: Record<string, number> }) {
  const maxCount = Math.max(...Object.values(counts), 1)
  return (
    <div style={s.balanceBox}>
      <div style={s.balanceTitle}>Баланс стихий</div>
      {ELEMENT_ORDER.map((el) => {
        const count = counts[el] ?? 0
        return (
          <div key={el} style={s.balanceRow}>
            <div style={{ ...s.balanceName, color: ELEMENT_COLORS[el]?.text ?? 'var(--body)' }}>
              {el}
            </div>
            <div style={s.barTrack}>
              <div style={s.barFill(el, count, maxCount)} />
            </div>
            <div style={{ ...s.barCount, color: ELEMENT_COLORS[el]?.text ?? 'var(--body)' }}>
              {count % 1 === 0 ? count : count.toFixed(1)}
            </div>
          </div>
        )
      })}
      <p style={{ fontSize: '.78rem', color: 'var(--faint)', marginTop: '1rem' }}>
        * Скрытые стволы учитываются с весом 0.5
      </p>
    </div>
  )
}

function LuckCycles({ cycles }: { cycles: LuckCycle[] }) {
  return (
    <>
      <div style={s.luckGrid}>
        {cycles.map((c, i) => (
          <div key={i} style={s.luckCard(c.isCurrent, c.pillar.stemElement)}>
            {c.isCurrent && <span style={s.currentBadge}>сейчас</span>}
            <div style={s.luckAge(c.isCurrent)}>{c.startAge}–{c.endAge} л.</div>
            <div style={s.luckStem(c.pillar.stemElement)}>{c.pillar.stem}</div>
            <div style={s.luckBranch(c.pillar.branchElement)}>{c.pillar.branch}</div>
            <div style={s.luckYear}>{c.startYear}–{c.endYear}</div>
            <div style={{ fontSize: '.65rem', color: ELEMENT_COLORS[c.pillar.stemElement]?.text }}>
              {c.pillar.stemElement}
            </div>
            <div style={{ fontSize: '.65rem', color: ELEMENT_COLORS[c.pillar.branchElement]?.text }}>
              {c.pillar.animal}
            </div>
          </div>
        ))}
      </div>
      <p style={{ fontSize: '.8rem', color: 'var(--faint)', marginBottom: '1rem' }}>
        Каждый столп действует 10 лет. Текущий период выделен цветом.
      </p>
    </>
  )
}

function YearlyCycles({ cycles }: { cycles: YearlyCycle[] }) {
  return (
    <table style={s.yearTable}>
      <thead>
        <tr>
          <th style={s.yearTh}>Год</th>
          <th style={s.yearTh}>Небесный ствол</th>
          <th style={s.yearTh}>Земная ветвь</th>
          <th style={s.yearTh}>Стихия года</th>
          <th style={s.yearTh}>Животное</th>
        </tr>
      </thead>
      <tbody>
        {cycles.map((c) => (
          <tr key={c.year}>
            <td style={s.yearTd(c.isCurrent)}>
              {c.isCurrent ? <strong>{c.year}</strong> : c.year}
            </td>
            <td style={s.yearTd(c.isCurrent)}>
              <span style={s.yearChar(c.pillar.stemElement)}>{c.pillar.stem}</span>
              <span style={{ fontSize: '.8rem', color: 'var(--muted)' }}>{c.pillar.stemNameRu}</span>
            </td>
            <td style={s.yearTd(c.isCurrent)}>
              <span style={s.yearChar(c.pillar.branchElement)}>{c.pillar.branch}</span>
              <span style={{ fontSize: '.8rem', color: 'var(--muted)' }}>{c.pillar.branchNameRu}</span>
            </td>
            <td style={s.yearTd(c.isCurrent)}>
              <span style={s.yearEl(c.pillar.stemElement)}>{c.pillar.stemElement}</span>
            </td>
            <td style={s.yearTd(c.isCurrent)}>
              <span style={{ fontSize: '.9rem' }}>{c.pillar.animal}</span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

// ── Main component ─────────────────────────────────────────────────────────

export default function BaziCalculator() {
  const [dateVal, setDateVal]   = useState('1990-01-01')
  const [timeVal, setTimeVal]   = useState('12:00')
  const [gender, setGender]     = useState<'male' | 'female'>('female')
  const [result, setResult]     = useState<BaziResult | null>(null)

  const handleCalculate = () => {
    if (!dateVal) return
    const [yearStr, monthStr, dayStr] = dateVal.split('-')
    const [hourStr, minuteStr] = timeVal.split(':')
    const year   = parseInt(yearStr, 10)
    const month  = parseInt(monthStr, 10)
    const day    = parseInt(dayStr, 10)
    const hour   = parseInt(hourStr, 10)
    const minute = parseInt(minuteStr, 10)
    if (isNaN(year) || isNaN(month) || isNaN(day)) return
    setResult(calculateBazi(year, month, day, hour || 12, minute || 0, gender))
  }

  return (
    <section id="bazi" style={s.section}>
      <style>{`
        @media (max-width: 599px) {
          #bazi-pillars { grid-template-columns: repeat(2,1fr) !important; }
          #bazi-luck    { grid-template-columns: repeat(3,1fr) !important; }
          #bazi-ytable  { font-size: .8rem; }
        }
        @media (max-width: 420px) {
          #bazi-luck    { grid-template-columns: repeat(2,1fr) !important; }
        }
      `}</style>

      <div style={s.inner}>
        {/* Header */}
        <div style={s.label}>
          <span style={{ width: 20, height: 1.5, background: 'var(--gold)', display: 'inline-block' }} />
          Астрология Бацзы
        </div>
        <h2 style={s.h2}>Калькулятор четырёх столпов судьбы</h2>
        <p style={s.subtitle}>
          Введите дату, время рождения и пол — калькулятор построит полную карту Бацзы:
          четыре столпа со скрытыми стволами, 10-летние циклы удачи и годовые циклы.
        </p>

        {/* Form */}
        <div style={s.form}>
          <div style={s.fieldGroup}>
            <label style={s.fieldLabel} htmlFor="bazi-date">Дата рождения</label>
            <input
              id="bazi-date" type="date" value={dateVal}
              onChange={(e) => setDateVal(e.target.value)} style={s.input}
            />
          </div>

          <div style={s.fieldGroup}>
            <label style={s.fieldLabel} htmlFor="bazi-time">Время рождения</label>
            <input
              id="bazi-time" type="time" value={timeVal}
              onChange={(e) => setTimeVal(e.target.value)} style={s.input}
            />
            <span style={s.fieldNote}>если не знаете — оставьте 12:00</span>
          </div>

          <div style={s.fieldGroup}>
            <label style={s.fieldLabel} htmlFor="bazi-gender">Пол</label>
            <select
              id="bazi-gender"
              value={gender}
              onChange={(e) => setGender(e.target.value as 'male' | 'female')}
              style={s.select}
            >
              <option value="female">Женский</option>
              <option value="male">Мужской</option>
            </select>
            <span style={s.fieldNote}>влияет на направление циклов удачи</span>
          </div>

          <button
            type="button" onClick={handleCalculate} style={s.submitBtn}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--gold)' }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--ink)' }}
          >
            Рассчитать карту
          </button>
        </div>

        {/* ── Results ── */}
        {result && (
          <>
            {/* Day Master */}
            <SectionHeader title="Хозяин дня (日主)" />
            <div style={s.dayMasterBanner}>
              <div style={s.dayMasterChar(result.dayMaster.element)}>
                {result.dayMaster.char}
              </div>
              <div style={s.dayMasterInfo}>
                <span style={s.dayMasterLabel}>Хозяин дня</span>
                <span style={s.dayMasterTitle}>
                  {result.day.stemNameRu} — {result.dayMaster.element}
                </span>
                <span style={s.dayMasterSub}>
                  {result.dayMaster.polarity} · {result.dayMaster.element}
                </span>
              </div>
              <div style={{ flex: 1, fontSize: '.9rem', color: 'var(--muted)', lineHeight: 1.7 }}>
                Хозяин дня — ваш личный небесный ствол. Он определяет характер,
                сильные стороны и то, какие стихии будут вам ресурсом, а какие — вызовом.
              </div>
            </div>

            {/* 4 Pillars */}
            <SectionHeader title="Четыре столпа (四柱)" />
            <div
              id="bazi-pillars"
              style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem', marginBottom: '2rem' }}
            >
              <PillarCard title="Год (年)" pillar={result.year} />
              <PillarCard title="Месяц (月)" pillar={result.month} />
              <PillarCard title="День (日)" pillar={result.day} />
              <PillarCard title="Час (時)" pillar={result.hour} />
            </div>

            {/* Element balance */}
            <SectionHeader title="Баланс стихий" />
            <ElementBalance counts={result.elementCounts} />

            {/* Luck Cycles */}
            <SectionHeader title="Большие циклы удачи (大運)" />
            <div id="bazi-luck" style={s.luckGrid}>
              {result.luckCycles.map((c, i) => (
                <div key={i} style={s.luckCard(c.isCurrent, c.pillar.stemElement)}>
                  {c.isCurrent && <span style={s.currentBadge}>сейчас</span>}
                  <div style={s.luckAge(c.isCurrent)}>{c.startAge}–{c.endAge} л.</div>
                  <div style={s.luckStem(c.pillar.stemElement)}>{c.pillar.stem}</div>
                  <div style={s.luckBranch(c.pillar.branchElement)}>{c.pillar.branch}</div>
                  <div style={s.luckYear}>{c.startYear}–{c.endYear}</div>
                  <div style={{ fontSize: '.65rem', color: ELEMENT_COLORS[c.pillar.stemElement]?.text }}>
                    {c.pillar.stemElement}
                  </div>
                  <div style={{ fontSize: '.65rem', color: ELEMENT_COLORS[c.pillar.branchElement]?.text }}>
                    {c.pillar.animal}
                  </div>
                  {c.pillar.hiddenStems.length > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '.2rem', flexWrap: 'wrap' }}>
                      {c.pillar.hiddenStems.map((hs, j) => (
                        <span key={j} style={{ ...s.hiddenChip(hs.element), fontSize: '.6rem' }}>
                          {hs.char}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <p style={{ fontSize: '.8rem', color: 'var(--faint)', marginBottom: '2rem' }}>
              Каждый столп действует 10 лет. Текущий период выделен цветом.
            </p>

            {/* Yearly Cycles */}
            <SectionHeader title="Годовые циклы (流年)" />
            <div style={{ overflowX: 'auto' }}>
              <table id="bazi-ytable" style={s.yearTable}>
                <thead>
                  <tr>
                    <th style={s.yearTh}>Год</th>
                    <th style={s.yearTh}>Небесный ствол</th>
                    <th style={s.yearTh}>Земная ветвь</th>
                    <th style={s.yearTh}>Стихия</th>
                    <th style={s.yearTh}>Животное</th>
                  </tr>
                </thead>
                <tbody>
                  {result.yearlyCycles.map((c) => (
                    <tr key={c.year}>
                      <td style={s.yearTd(c.isCurrent)}>
                        {c.isCurrent ? <strong>{c.year} ◀</strong> : c.year}
                      </td>
                      <td style={s.yearTd(c.isCurrent)}>
                        <span style={s.yearChar(c.pillar.stemElement)}>{c.pillar.stem}</span>
                        <span style={{ fontSize: '.8rem', color: 'var(--muted)' }}>{c.pillar.stemNameRu}</span>
                      </td>
                      <td style={s.yearTd(c.isCurrent)}>
                        <span style={s.yearChar(c.pillar.branchElement)}>{c.pillar.branch}</span>
                        <span style={{ fontSize: '.8rem', color: 'var(--muted)' }}>{c.pillar.branchNameRu}</span>
                      </td>
                      <td style={s.yearTd(c.isCurrent)}>
                        <span style={s.yearEl(c.pillar.stemElement)}>{c.pillar.stemElement}</span>
                      </td>
                      <td style={s.yearTd(c.isCurrent)}>
                        {c.pillar.animal}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p style={s.note}>
              Время рождения влияет на столп часа. Для точного расчёта циклов удачи важна точность
              до дня — уточните дату рождения по свидетельству о рождении.
            </p>
          </>
        )}
      </div>
    </section>
  )
}
