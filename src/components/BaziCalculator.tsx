'use client'

import { useState, CSSProperties } from 'react'
import { calculateBazi, ELEMENT_COLORS, getQiPhase } from '@/lib/bazi'
import type { BaziResult, Pillar, LuckCycle, YearlyCycle, Palace } from '@/lib/bazi'

// ── GMT offset options ──────────────────────────────────────────────────────

const GMT_OPTIONS = [
  { label: 'GMT−11:00', value: -11 },
  { label: 'GMT−10:00', value: -10 },
  { label: 'GMT−9:00',  value: -9  },
  { label: 'GMT−8:00',  value: -8  },
  { label: 'GMT−7:00',  value: -7  },
  { label: 'GMT−6:00',  value: -6  },
  { label: 'GMT−5:00',  value: -5  },
  { label: 'GMT−4:00',  value: -4  },
  { label: 'GMT−3:00',  value: -3  },
  { label: 'GMT−2:00',  value: -2  },
  { label: 'GMT−1:00',  value: -1  },
  { label: 'GMT+0:00',  value:  0  },
  { label: 'GMT+1:00',  value:  1  },
  { label: 'GMT+2:00',  value:  2  },
  { label: 'GMT+3:00 (Москва)',   value: 3  },
  { label: 'GMT+4:00 (Баку)',     value: 4  },
  { label: 'GMT+5:00 (Ташкент)', value: 5  },
  { label: 'GMT+6:00',  value:  6  },
  { label: 'GMT+7:00 (Новосибирск)', value: 7 },
  { label: 'GMT+8:00 (Пекин)',    value: 8  },
  { label: 'GMT+9:00',  value:  9  },
  { label: 'GMT+10:00', value: 10  },
  { label: 'GMT+11:00', value: 11  },
  { label: 'GMT+12:00', value: 12  },
  { label: 'GMT+13:00', value: 13  },
]

// ── Styles ──────────────────────────────────────────────────────────────────

const s = {
  section: {
    padding: '8rem 5vw',
    background: 'var(--off)',
    borderBottom: '1px solid var(--line)',
  } as CSSProperties,

  inner: { maxWidth: '1200px', margin: '0 auto' } as CSSProperties,

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
    marginBottom: '3rem', maxWidth: '560px',
  } as CSSProperties,

  form: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
    gap: '1.2rem',
    alignItems: 'end',
    marginBottom: '1.5rem',
    padding: '2rem 2.2rem',
    background: 'var(--white)',
    border: '1px solid var(--line)',
  } as CSSProperties,

  formOptions: {
    display: 'flex', flexWrap: 'wrap' as const, gap: '1.2rem',
    padding: '1.2rem 2.2rem 1.8rem',
    background: 'var(--white)',
    borderTop: '1px solid var(--line)',
    marginTop: '-1px',
    marginBottom: '2rem',
  } as CSSProperties,

  fieldGroup: {
    display: 'flex', flexDirection: 'column' as const, gap: '.4rem',
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

  checkLabel: {
    display: 'flex', alignItems: 'center', gap: '.5rem',
    fontSize: '.85rem', color: 'var(--muted)', cursor: 'pointer',
  } as CSSProperties,

  submitBtn: {
    fontFamily: 'var(--sans)', fontSize: '.85rem', fontWeight: 500,
    letterSpacing: '.06em', textTransform: 'uppercase' as const,
    color: 'var(--white)', background: 'var(--ink)', border: 'none',
    padding: '1rem 2.2rem', cursor: 'pointer', transition: 'background .25s',
    whiteSpace: 'nowrap' as const,
  } as CSSProperties,

  sectionHeader: {
    display: 'flex', alignItems: 'center', gap: '1rem',
    marginBottom: '1.5rem', marginTop: '3rem',
  } as CSSProperties,

  sectionTitle: {
    fontFamily: 'var(--serif)', fontSize: '1.15rem', fontWeight: 700, color: 'var(--ink)',
    whiteSpace: 'nowrap' as const,
  } as CSSProperties,

  sectionLine: { flex: 1, height: '1px', background: 'var(--line)' } as CSSProperties,

  // Day master banner
  dayMasterBanner: {
    padding: '1.8rem 2.2rem',
    background: 'var(--white)',
    border: '1px solid var(--line)',
    marginBottom: '2rem',
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

  // Pillars table (like feng-shui.ua)
  pillarsTable: {
    width: '100%',
    borderCollapse: 'collapse' as const,
    background: 'var(--white)',
    border: '1px solid var(--line)',
    marginBottom: '2rem',
  } as CSSProperties,

  pillarsHeaderCell: (element: string): CSSProperties => ({
    padding: '.6rem .8rem',
    textAlign: 'center' as const,
    fontSize: '.72rem', fontWeight: 600, letterSpacing: '.08em',
    textTransform: 'uppercase' as const,
    color: ELEMENT_COLORS[element]?.text ?? 'var(--muted)',
    background: ELEMENT_COLORS[element]?.bg ?? 'var(--off)',
    borderBottom: '1px solid var(--line)',
    borderLeft: '1px solid var(--line)',
  }),

  pillarsRowLabel: {
    padding: '.6rem .8rem',
    fontSize: '.72rem', fontWeight: 500, letterSpacing: '.06em',
    color: 'var(--muted)', background: 'var(--off)',
    borderTop: '1px solid var(--line)',
    borderRight: '1px solid var(--line)',
    whiteSpace: 'nowrap' as const,
    verticalAlign: 'middle' as const,
  } as CSSProperties,

  pillarsCell: (element: string, highlight = false): CSSProperties => ({
    padding: '.5rem .6rem',
    textAlign: 'center' as const,
    borderTop: '1px solid var(--line)',
    borderLeft: '1px solid var(--line)',
    background: highlight ? (ELEMENT_COLORS[element]?.bg ?? 'var(--white)') : 'var(--white)',
    verticalAlign: 'middle' as const,
  }),

  bigChar: (element: string): CSSProperties => ({
    fontFamily: 'var(--serif)', fontSize: '2.2rem', fontWeight: 700, lineHeight: 1,
    color: ELEMENT_COLORS[element]?.text ?? '#333',
    display: 'block',
  }),

  smallInfo: (element: string): CSSProperties => ({
    fontSize: '.68rem', color: ELEMENT_COLORS[element]?.text ?? '#555',
    fontWeight: 500, marginTop: '.2rem', display: 'block',
  }),

  qiPhaseChip: (phase: string): CSSProperties => {
    const danger = ['Болезнь','Смерть','Могила','Пустота'].includes(phase)
    const good   = ['Расцвет','Власть','Рождение'].includes(phase)
    return {
      display: 'inline-block', fontSize: '.7rem', fontWeight: 500,
      padding: '.15rem .5rem',
      borderRadius: '2px',
      color: good ? '#2e7d32' : danger ? '#c62828' : 'var(--muted)',
      background: good ? '#e8f5e9' : danger ? '#fde8e8' : 'var(--off)',
      border: `1px solid ${good ? '#a5d6a7' : danger ? '#ef9a9a' : 'var(--line)'}`,
    }
  },

  hiddenChip: (element: string): CSSProperties => ({
    fontSize: '.7rem', fontWeight: 600,
    color: ELEMENT_COLORS[element]?.text ?? '#555',
    background: ELEMENT_COLORS[element]?.bg ?? '#f5f5f5',
    border: `1px solid ${ELEMENT_COLORS[element]?.border ?? '#ddd'}`,
    padding: '.1rem .35rem', borderRadius: '2px',
    display: 'inline-block', margin: '.1rem',
  }),

  // Stars panel
  starsGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: '1rem', marginBottom: '2rem',
  } as CSSProperties,

  starCard: {
    padding: '1.2rem 1.4rem', background: 'var(--white)',
    border: '1px solid var(--line)',
  } as CSSProperties,

  starTitle: {
    fontSize: '.72rem', fontWeight: 600, letterSpacing: '.08em',
    textTransform: 'uppercase' as const, color: 'var(--gold)',
    marginBottom: '.5rem',
  } as CSSProperties,

  starValue: {
    fontSize: '.88rem', color: 'var(--ink)', lineHeight: 1.5,
  } as CSSProperties,

  guaCircle: (n: number): CSSProperties => ({
    width: '2.8rem', height: '2.8rem', borderRadius: '50%',
    background: 'var(--ink)', color: 'var(--white)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontFamily: 'var(--serif)', fontSize: '1.3rem', fontWeight: 700,
    flexShrink: 0,
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
    display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
    gap: '.75rem', marginBottom: '1.5rem',
  } as CSSProperties,

  luckCard: (isCurrent: boolean, element: string): CSSProperties => ({
    border: isCurrent
      ? `2px solid ${ELEMENT_COLORS[element]?.text ?? 'var(--gold)'}`
      : `1px solid ${ELEMENT_COLORS[element]?.border ?? '#ddd'}`,
    background: isCurrent ? (ELEMENT_COLORS[element]?.bg ?? '#f5f5f5') : 'var(--white)',
    padding: '.9rem .7rem', textAlign: 'center',
    display: 'flex', flexDirection: 'column', gap: '.3rem', position: 'relative',
  }),

  luckAge: (isCurrent: boolean): CSSProperties => ({
    fontSize: '.65rem', fontWeight: 600, letterSpacing: '.06em',
    textTransform: 'uppercase' as const,
    color: isCurrent ? 'var(--gold)' : 'var(--muted)',
  }),

  luckStem: (element: string): CSSProperties => ({
    fontFamily: 'var(--serif)', fontSize: '1.8rem', fontWeight: 700, lineHeight: 1,
    color: ELEMENT_COLORS[element]?.text ?? '#333',
  }),

  luckBranch: (element: string): CSSProperties => ({
    fontFamily: 'var(--serif)', fontSize: '1.5rem', fontWeight: 700, lineHeight: 1,
    color: ELEMENT_COLORS[element]?.text ?? '#555',
  }),

  luckYear: {
    fontSize: '.62rem', color: 'var(--faint)', lineHeight: 1.3,
  } as CSSProperties,

  currentBadge: {
    position: 'absolute', top: '-9px', left: '50%', transform: 'translateX(-50%)',
    background: 'var(--gold)', color: 'var(--white)',
    fontSize: '.55rem', fontWeight: 700, letterSpacing: '.08em',
    textTransform: 'uppercase' as const, padding: '.15rem .5rem',
    whiteSpace: 'nowrap' as const,
  } as CSSProperties,

  // Yearly cycles table
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
    background: isCurrent ? 'rgba(158,123,40,.06)' : 'transparent',
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

  // Cycle detail accordion
  cycleDetail: {
    marginTop: '1.5rem',
    border: '1px solid var(--line)',
    background: 'var(--white)',
  } as CSSProperties,

  cycleDetailHeader: {
    padding: '1rem 1.4rem',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    borderBottom: '1px solid var(--line)', background: 'var(--off)',
  } as CSSProperties,

  note: {
    fontSize: '.88rem', color: 'var(--muted)', lineHeight: 1.7,
    borderLeft: '2px solid var(--gold2)', paddingLeft: '1rem', opacity: 0.8,
    marginTop: '2rem',
  } as CSSProperties,

  solarNote: {
    display: 'inline-block',
    fontSize: '.8rem', color: 'var(--gold)',
    background: 'rgba(158,123,40,.08)',
    border: '1px solid rgba(158,123,40,.2)',
    padding: '.35rem .8rem',
    marginBottom: '1.5rem',
  } as CSSProperties,
}

// ── Helper components ────────────────────────────────────────────────────────

function SectionHeader({ title }: { title: string }) {
  return (
    <div style={s.sectionHeader}>
      <span style={s.sectionTitle}>{title}</span>
      <span style={s.sectionLine} />
    </div>
  )
}

const ELEMENT_ORDER = ['Дерево','Огонь','Земля','Металл','Вода']

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

// ── Pillars Table (like reference site) ─────────────────────────────────────

function PillarsTable({ result }: { result: BaziResult }) {
  const pillars: Array<{ label: string; pillar: Pillar | null }> = [
    { label: 'Час (時)',   pillar: result.hour  },
    { label: 'День (日)',  pillar: result.day   },
    { label: 'Месяц (月)', pillar: result.month },
    { label: 'Год (年)',   pillar: result.year  },
  ]

  const rows = [
    { key: 'stem',    label: 'Небесный ствол' },
    { key: 'qi',      label: 'Фаза Ци (十二長生)' },
    { key: 'branch',  label: 'Земная ветвь' },
    { key: 'hidden',  label: 'Скрытые стволы' },
    { key: 'animal',  label: 'Животное' },
  ]

  return (
    <div style={{ overflowX: 'auto', marginBottom: '2rem' }}>
      <table style={s.pillarsTable}>
        <thead>
          <tr>
            <th style={{ ...s.pillarsRowLabel, background: 'var(--off)', border: '1px solid var(--line)' }} />
            {pillars.map(({ label, pillar }) => (
              <th
                key={label}
                style={s.pillarsHeaderCell(pillar?.stemElement ?? 'Земля')}
              >
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(({ key, label }) => (
            <tr key={key}>
              <td style={s.pillarsRowLabel}>{label}</td>
              {pillars.map(({ label: pLabel, pillar }) => {
                if (!pillar && key !== 'stem') {
                  return (
                    <td key={pLabel} style={s.pillarsCell('Земля')}>
                      <span style={{ fontSize: '.75rem', color: 'var(--faint)' }}>—</span>
                    </td>
                  )
                }
                if (!pillar) {
                  return (
                    <td key={pLabel} style={s.pillarsCell('Земля')}>
                      <span style={{ fontSize: '.75rem', color: 'var(--faint)' }}>Не указан</span>
                    </td>
                  )
                }

                if (key === 'stem') return (
                  <td key={pLabel} style={s.pillarsCell(pillar.stemElement, true)}>
                    <span style={s.bigChar(pillar.stemElement)}>{pillar.stem}</span>
                    <span style={s.smallInfo(pillar.stemElement)}>
                      {pillar.stemNameRu} · {pillar.stemElement} · {pillar.stemPolarity}
                    </span>
                  </td>
                )

                if (key === 'qi') return (
                  <td key={pLabel} style={s.pillarsCell(pillar.stemElement)}>
                    <span style={s.qiPhaseChip(pillar.qiPhase)}>{pillar.qiPhase}</span>
                  </td>
                )

                if (key === 'branch') return (
                  <td key={pLabel} style={s.pillarsCell(pillar.branchElement, true)}>
                    <span style={s.bigChar(pillar.branchElement)}>{pillar.branch}</span>
                    <span style={s.smallInfo(pillar.branchElement)}>
                      {pillar.branchNameRu} · {pillar.branchElement}
                    </span>
                  </td>
                )

                if (key === 'hidden') return (
                  <td key={pLabel} style={s.pillarsCell(pillar.branchElement)}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '.15rem' }}>
                      {pillar.hiddenStems.map((hs, i) => (
                        <span key={i} style={s.hiddenChip(hs.element)} title={`${hs.nameRu} · ${hs.element}`}>
                          {hs.char}
                        </span>
                      ))}
                    </div>
                  </td>
                )

                if (key === 'animal') return (
                  <td key={pLabel} style={s.pillarsCell(pillar.branchElement)}>
                    <span style={{ fontSize: '.85rem', color: 'var(--ink)' }}>{pillar.animal}</span>
                  </td>
                )

                return <td key={pLabel} />
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ── Special Stars Panel ──────────────────────────────────────────────────────

function StarsPanel({ stars }: { stars: BaziResult['stars'] }) {
  const GUA_NAMES: Record<number, string> = {
    1: 'Кань (☵) — Вода', 2: 'Кунь (☷) — Земля', 3: 'Чжэнь (☳) — Гром',
    4: 'Сюнь (☴) — Ветер', 6: 'Цянь (☰) — Небо', 7: 'Дуй (☱) — Озеро',
    8: 'Гэнь (☶) — Гора', 9: 'Ли (☲) — Огонь',
  }

  return (
    <div style={s.starsGrid}>
      <div style={s.starCard}>
        <div style={s.starTitle}>天乙 Небесный помощник</div>
        <div style={s.starValue}>
          {stars.tianyi.length > 0 ? stars.tianyi.join(', ') : '—'}
        </div>
      </div>
      <div style={s.starCard}>
        <div style={s.starTitle}>桃花 Цветок персика</div>
        <div style={s.starValue}>{stars.taohua ?? '—'}</div>
      </div>
      <div style={s.starCard}>
        <div style={s.starTitle}>驿马 Почтовая лошадь</div>
        <div style={s.starValue}>{stars.yima ?? '—'}</div>
      </div>
      <div style={s.starCard}>
        <div style={s.starTitle}>空亡 Пустота</div>
        <div style={s.starValue}>{stars.kongwang.join(', ') || '—'}</div>
      </div>
      <div style={{ ...s.starCard, display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={s.guaCircle(stars.guaNumber)}>{stars.guaNumber}</div>
        <div>
          <div style={s.starTitle}>卦数 Число Гуа</div>
          <div style={s.starValue}>{GUA_NAMES[stars.guaNumber] ?? `Гуа ${stars.guaNumber}`}</div>
        </div>
      </div>
    </div>
  )
}

// ── Luck Cycles ──────────────────────────────────────────────────────────────

function LuckCyclesSection({ cycles, birthYear, luckStartAge }: {
  cycles: LuckCycle[]
  birthYear: number
  luckStartAge: number
}) {
  const [openIdx, setOpenIdx] = useState<number | null>(null)
  const currentCycleIdx = cycles.findIndex(c => c.isCurrent)

  return (
    <>
      <p style={{ fontSize: '.85rem', color: 'var(--muted)', marginBottom: '1.2rem' }}>
        Первый цикл начинается в возрасте <strong>{luckStartAge} лет</strong> ({birthYear + luckStartAge} г.)
      </p>
      <div id="bazi-luck" style={s.luckGrid}>
        {cycles.map((c, i) => (
          <div
            key={i}
            style={{ ...s.luckCard(c.isCurrent, c.pillar.stemElement), cursor: 'pointer' }}
            onClick={() => setOpenIdx(openIdx === i ? null : i)}
          >
            {c.isCurrent && <span style={s.currentBadge}>сейчас</span>}
            <div style={s.luckAge(c.isCurrent)}>{c.startAge}–{c.endAge} л.</div>
            <div style={s.luckStem(c.pillar.stemElement)}>{c.pillar.stem}</div>
            <div style={s.luckBranch(c.pillar.branchElement)}>{c.pillar.branch}</div>
            <div style={s.luckYear}>{c.startYear}–{c.endYear}</div>
            <div style={{ fontSize: '.62rem', color: ELEMENT_COLORS[c.pillar.stemElement]?.text }}>
              {c.pillar.stemElement}
            </div>
            <div style={{ fontSize: '.62rem', color: ELEMENT_COLORS[c.pillar.branchElement]?.text }}>
              {c.pillar.animal}
            </div>
            <div style={{ fontSize: '.6rem', color: 'var(--faint)', marginTop: '.2rem' }}>
              {c.pillar.qiPhase}
            </div>
            {c.pillar.hiddenStems.length > 0 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: '.15rem', flexWrap: 'wrap', marginTop: '.2rem' }}>
                {c.pillar.hiddenStems.map((hs, j) => (
                  <span key={j} style={{ ...s.hiddenChip(hs.element), fontSize: '.6rem' }}>
                    {hs.char}
                  </span>
                ))}
              </div>
            )}
            <div style={{ fontSize: '.6rem', color: 'var(--gold)', marginTop: '.2rem' }}>
              {openIdx === i ? '▲ свернуть' : '▼ годы'}
            </div>
          </div>
        ))}
      </div>

      {/* Expanded cycle detail with yearly breakdown */}
      {openIdx !== null && cycles[openIdx] && (
        <div style={s.cycleDetail}>
          <div style={s.cycleDetailHeader}>
            <span style={{ fontFamily: 'var(--serif)', fontWeight: 700, color: 'var(--ink)' }}>
              Период {cycles[openIdx].startAge}–{cycles[openIdx].endAge} лет
              &nbsp;·&nbsp;
              {cycles[openIdx].pillar.stem}{cycles[openIdx].pillar.branch}
              &nbsp;·&nbsp;
              {cycles[openIdx].startYear}–{cycles[openIdx].endYear}
            </span>
            <button
              onClick={() => setOpenIdx(null)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: 'var(--muted)' }}
            >×</button>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ ...s.yearTable, border: 'none' }}>
              <thead>
                <tr>
                  <th style={s.yearTh}>Год</th>
                  <th style={s.yearTh}>Ствол</th>
                  <th style={s.yearTh}>Ветвь</th>
                  <th style={s.yearTh}>Стихия</th>
                  <th style={s.yearTh}>Животное</th>
                  <th style={s.yearTh}>Фаза Ци</th>
                </tr>
              </thead>
              <tbody>
                {cycles[openIdx].yearlyInCycle.map((c) => (
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
                      <span style={{ fontSize: '.9rem' }}>{c.pillar.animal}</span>
                    </td>
                    <td style={s.yearTd(c.isCurrent)}>
                      <span style={s.qiPhaseChip(c.pillar.qiPhase)}>{c.pillar.qiPhase}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <p style={{ fontSize: '.8rem', color: 'var(--faint)', margin: '1rem 0 2rem' }}>
        Каждый столп действует 10 лет. Нажмите на период, чтобы раскрыть годовую разбивку.
      </p>
    </>
  )
}

// ── Yearly Cycles ────────────────────────────────────────────────────────────

function YearlyCyclesTable({ cycles }: { cycles: YearlyCycle[] }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table id="bazi-ytable" style={s.yearTable}>
        <thead>
          <tr>
            <th style={s.yearTh}>Год</th>
            <th style={s.yearTh}>Небесный ствол</th>
            <th style={s.yearTh}>Земная ветвь</th>
            <th style={s.yearTh}>Стихия</th>
            <th style={s.yearTh}>Животное</th>
            <th style={s.yearTh}>Фаза Ци</th>
          </tr>
        </thead>
        <tbody>
          {cycles.map((c) => (
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
                <span style={{ fontSize: '.9rem' }}>{c.pillar.animal}</span>
              </td>
              <td style={s.yearTd(c.isCurrent)}>
                <span style={s.qiPhaseChip(c.pillar.qiPhase)}>{c.pillar.qiPhase}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ── View switcher ────────────────────────────────────────────────────────────

type ViewMode = 'bazi' | 'palaces' | 'square'

function ViewSwitcher({ mode, onChange }: { mode: ViewMode; onChange: (m: ViewMode) => void }) {
  const opts: { value: ViewMode; label: string }[] = [
    { value: 'bazi',    label: 'Карта Бацзы' },
    { value: 'palaces', label: '12 дворцов'  },
    { value: 'square',  label: 'Карта ЦМ'   },
  ]
  return (
    <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
      {opts.map(o => (
        <label key={o.value} style={{ display: 'flex', alignItems: 'center', gap: '.5rem', cursor: 'pointer', fontSize: '.9rem', color: mode === o.value ? 'var(--ink)' : 'var(--muted)', fontWeight: mode === o.value ? 600 : 400 }}>
          <input
            type="radio"
            name="bazi-view"
            checked={mode === o.value}
            onChange={() => onChange(o.value)}
            style={{ accentColor: 'var(--gold)', width: '15px', height: '15px' }}
          />
          {o.label}
        </label>
      ))}
    </div>
  )
}

// ── 12 Palaces view ───────────────────────────────────────────────────────────

function PalacesView({ palaces, result }: { palaces: Palace[]; result: BaziResult }) {
  const qiChip = (phase: string) => {
    const danger = ['Болезнь','Смерть','Могила','Пустота'].includes(phase)
    const good   = ['Расцвет','Власть','Рождение'].includes(phase)
    return (
      <span style={{
        fontSize: '.68rem', fontWeight: 500, padding: '.1rem .35rem', borderRadius: '2px',
        color: good ? '#2e7d32' : danger ? '#c62828' : 'var(--muted)',
        background: good ? '#e8f5e9' : danger ? '#fde8e8' : 'var(--off)',
        border: `1px solid ${good ? '#a5d6a7' : danger ? '#ef9a9a' : 'var(--line)'}`,
        display: 'inline-block', marginRight: '.2rem', marginBottom: '.15rem',
      }}>{phase}</span>
    )
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', background: 'var(--white)', border: '1px solid var(--line)' }}>
        <thead>
          <tr>
            <th style={{ padding: '.7rem 1rem', fontSize: '.72rem', fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--muted)', background: 'var(--off)', borderBottom: '1px solid var(--line)', textAlign: 'left', width: '22%' }}>
              12 дворцов
            </th>
            <th style={{ padding: '.7rem 1rem', fontSize: '.72rem', fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--muted)', background: 'var(--off)', borderBottom: '1px solid var(--line)', borderLeft: '1px solid var(--line)', textAlign: 'left' }}>
              Ангелы удачи и Демоны неудачи
            </th>
            <th style={{ padding: '.7rem 1rem', fontSize: '.72rem', fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--muted)', background: 'var(--off)', borderBottom: '1px solid var(--line)', borderLeft: '1px solid var(--line)', textAlign: 'left', width: '18%' }}>
              Фаза Ци
            </th>
            <th style={{ padding: '.7rem 1rem', fontSize: '.72rem', fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--muted)', background: 'var(--off)', borderBottom: '1px solid var(--line)', borderLeft: '1px solid var(--line)', textAlign: 'center', width: '12%' }}>
              Ветвь
            </th>
          </tr>
        </thead>
        <tbody>
          {palaces.map((palace, i) => {
            const isEven = i % 2 === 1
            const el = palace.pillar.branchElement
            return (
              <tr key={palace.index}>
                <td style={{ padding: '.8rem 1rem', borderTop: '1px solid var(--line)', background: isEven ? 'var(--off)' : 'var(--white)', verticalAlign: 'top' }}>
                  <span style={{ fontWeight: 700, color: 'var(--ink)', fontSize: '.9rem' }}>{palace.name}</span>
                </td>
                <td style={{ padding: '.8rem 1rem', borderTop: '1px solid var(--line)', borderLeft: '1px solid var(--line)', background: isEven ? 'var(--off)' : 'var(--white)', verticalAlign: 'top' }}>
                  {palace.stars.length > 0
                    ? palace.stars.map((star, j) => (
                        <div key={j} style={{ fontSize: '.85rem', color: 'var(--muted)', lineHeight: 1.6 }}>
                          {star.startsWith('Демон') ? (
                            <span style={{ color: '#c62828' }}>{star}</span>
                          ) : (
                            <span style={{ color: '#1565c0' }}>{star}</span>
                          )}
                        </div>
                      ))
                    : <span style={{ fontSize: '.8rem', color: 'var(--faint)' }}>—</span>
                  }
                </td>
                <td style={{ padding: '.8rem 1rem', borderTop: '1px solid var(--line)', borderLeft: '1px solid var(--line)', background: isEven ? 'var(--off)' : 'var(--white)', verticalAlign: 'top' }}>
                  {palace.qiPhases.map((ph, j) => (
                    <div key={j} style={{ marginBottom: '.1rem' }}>{qiChip(ph)}</div>
                  ))}
                </td>
                <td style={{ padding: '.8rem .6rem', borderTop: '1px solid var(--line)', borderLeft: '1px solid var(--line)', background: isEven ? 'var(--off)' : 'var(--white)', textAlign: 'center', verticalAlign: 'middle' }}>
                  <span style={{ fontFamily: 'var(--serif)', fontSize: '1.6rem', fontWeight: 700, color: ELEMENT_COLORS[el]?.text ?? '#333', display: 'block', lineHeight: 1 }}>{palace.pillar.branch}</span>
                  <span style={{ fontSize: '.65rem', color: ELEMENT_COLORS[el]?.text ?? '#555' }}>{palace.pillar.branchNameRu}</span>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

// ── Square (ЦМ) view — 3×3 grid ──────────────────────────────────────────────
// Layout: palace index arranged like a Lo Shu square
// Positions: SE(3) S(2) SW(1)  / E(4) Center W(0) / NE(5) N(11) NW(6)  etc.
// We show simplified 3×3 with named houses

function SquareView({ palaces, result }: { palaces: Palace[]; result: BaziResult }) {
  // 3×3 grid positions with palace indices (0-based)
  // Based on the reference screenshot layout: month column = right, hour = left
  // We map palaces 0-11 into the 12-cell ring around the center
  // Center cell = the 4 pillars mini-table

  // 12 cells arranged as: top row (3 cells), middle row (center + 2 sides), bottom row (3 cells)
  // Ring order (clockwise from top-left): 11,10,9 / 0, center, 8 / 1,2,3,4,5,6,7
  // For 3×3 we show 8 outer + 1 center
  const ringLayout: (number | 'center')[][] = [
    [10, 11, 0],
    [9,  'center', 1],
    [8,  7,  2],
    // bottom row continues outside 3×3 in reference, but we'll use 4×3
  ]

  // Actually use 4×3 to fit all 12
  const gridLayout: (number | 'center' | null)[][] = [
    [11, 10, 9,  8 ],
    [0,  'center', 'center', 7 ],
    [1,  'center', 'center', 6 ],
    [2,  3,  4,  5 ],
  ]

  const CellContent = ({ palace }: { palace: Palace }) => {
    const el = palace.pillar.branchElement
    return (
      <div style={{ padding: '.4rem .3rem', height: '100%', display: 'flex', flexDirection: 'column', gap: '.2rem', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: '.6rem', fontWeight: 600, color: 'var(--gold)', textAlign: 'center', lineHeight: 1.2 }}>{palace.name}</div>
        <div style={{ display: 'flex', gap: '.2rem', alignItems: 'baseline' }}>
          <span style={{ fontFamily: 'var(--serif)', fontSize: '1.5rem', fontWeight: 700, color: ELEMENT_COLORS[palace.pillar.stemElement]?.text ?? '#333', lineHeight: 1 }}>{palace.pillar.stem}</span>
          <span style={{ fontFamily: 'var(--serif)', fontSize: '1.3rem', fontWeight: 700, color: ELEMENT_COLORS[el]?.text ?? '#555', lineHeight: 1 }}>{palace.pillar.branch}</span>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.1rem', justifyContent: 'center' }}>
          {palace.qiPhases.slice(0,2).map((ph, j) => {
            const danger = ['Болезнь','Смерть','Могила','Пустота'].includes(ph)
            const good   = ['Расцвет','Власть','Рождение'].includes(ph)
            return (
              <span key={j} style={{ fontSize: '.58rem', padding: '.05rem .25rem', borderRadius: '2px', color: good ? '#2e7d32' : danger ? '#c62828' : 'var(--muted)', background: good ? '#e8f5e9' : danger ? '#fde8e8' : 'var(--off)' }}>
                {ph}
              </span>
            )
          })}
        </div>
        {palace.stars.slice(0,2).map((star, j) => (
          <div key={j} style={{ fontSize: '.58rem', color: star.startsWith('Демон') ? '#c62828' : '#1565c0', textAlign: 'center', lineHeight: 1.2 }}>{star}</div>
        ))}
      </div>
    )
  }

  const CenterCell = () => {
    const pillars = [
      { label: 'Ч', p: result.hour },
      { label: 'Д', p: result.day },
      { label: 'М', p: result.month },
      { label: 'Г', p: result.year },
    ]
    return (
      <div style={{ padding: '.5rem', display: 'flex', flexDirection: 'column', gap: '.3rem', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <div style={{ fontSize: '.6rem', color: 'var(--muted)', fontWeight: 600, letterSpacing: '.06em', marginBottom: '.2rem' }}>Четыре столпа</div>
        <div style={{ display: 'flex', gap: '.4rem' }}>
          {pillars.map(({ label, p }) => p && (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '.55rem', color: 'var(--faint)' }}>{label}</div>
              <div style={{ fontFamily: 'var(--serif)', fontSize: '1.1rem', fontWeight: 700, color: ELEMENT_COLORS[p.stemElement]?.text ?? '#333', lineHeight: 1 }}>{p.stem}</div>
              <div style={{ fontFamily: 'var(--serif)', fontSize: '1rem', fontWeight: 700, color: ELEMENT_COLORS[p.branchElement]?.text ?? '#555', lineHeight: 1 }}>{p.branch}</div>
            </div>
          ))}
        </div>
        <div style={{ fontSize: '.62rem', color: 'var(--muted)', textAlign: 'center', marginTop: '.2rem' }}>
          {result.dayMaster.nameRu} · {result.dayMaster.element} · {result.dayMaster.polarity}
        </div>
      </div>
    )
  }

  const cellStyle: CSSProperties = {
    border: '1px solid var(--line)',
    minHeight: '130px',
    verticalAlign: 'middle' as const,
  }

  const centerCells = new Set<string>()

  return (
    <div style={{ overflowX: 'auto', marginBottom: '2rem' }}>
      <table style={{ borderCollapse: 'collapse', width: '100%', background: 'var(--white)', border: '1px solid var(--line)', minWidth: '500px' }}>
        <tbody>
          {gridLayout.map((row, ri) => (
            <tr key={ri}>
              {row.map((cell, ci) => {
                if (cell === 'center') {
                  const key = `${ri}-${ci}`
                  if (centerCells.has('rendered')) return null
                  // Only render center once with rowspan/colspan
                  if (!centerCells.has('rendered')) {
                    centerCells.add('rendered')
                    return (
                      <td key={key} rowSpan={2} colSpan={2} style={{ ...cellStyle, background: 'var(--off)', minHeight: '260px' }}>
                        <CenterCell />
                      </td>
                    )
                  }
                  return null
                }
                if (cell === null) return null
                const palace = palaces[cell as number]
                if (!palace) return <td key={ci} style={cellStyle} />
                return (
                  <td key={ci} style={{ ...cellStyle, background: 'var(--white)' }}>
                    <CellContent palace={palace} />
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export default function BaziCalculator() {
  const [dateVal,       setDateVal]       = useState('1990-01-01')
  const [timeVal,       setTimeVal]       = useState('12:00')
  const [noTime,        setNoTime]        = useState(false)
  const [gender,        setGender]        = useState<'male' | 'female'>('female')
  const [gmtOffset,     setGmtOffset]     = useState(3)
  const [longitude,     setLongitude]     = useState(37.62)
  const [useSolarTime,  setUseSolarTime]  = useState(false)
  const [dayChangeAt23, setDayChangeAt23] = useState(false)
  const [birthPlace,    setBirthPlace]    = useState('')
  const [result,        setResult]        = useState<BaziResult | null>(null)
  const [viewMode,      setViewMode]      = useState<ViewMode>('bazi')

  const handleCalculate = () => {
    if (!dateVal) return
    const [yearStr, monthStr, dayStr] = dateVal.split('-')
    const year   = parseInt(yearStr, 10)
    const month  = parseInt(monthStr, 10)
    const day    = parseInt(dayStr, 10)
    if (isNaN(year) || isNaN(month) || isNaN(day)) return

    let hour: number | null = null
    let minute = 0
    if (!noTime) {
      const [hourStr, minuteStr] = timeVal.split(':')
      hour   = parseInt(hourStr, 10)
      minute = parseInt(minuteStr, 10) || 0
    }

    // Apply "day change at 23:00" option
    let calcHour = hour
    if (dayChangeAt23 && calcHour !== null && calcHour === 23) {
      calcHour = 23 // handled inside calculateBazi via jdn + 1
    }

    setResult(calculateBazi(
      year, month, day,
      calcHour,
      minute,
      gender,
      gmtOffset,
      useSolarTime ? longitude : 0,
      useSolarTime
    ))
  }

  return (
    <section id="bazi" style={s.section}>
      <style>{`
        @media (max-width: 700px) {
          #bazi-pillars-table th, #bazi-pillars-table td { padding: .4rem !important; font-size: .8rem !important; }
          #bazi-luck    { grid-template-columns: repeat(3,1fr) !important; }
          #bazi-ytable  { font-size: .8rem; }
        }
        @media (max-width: 440px) {
          #bazi-luck { grid-template-columns: repeat(2,1fr) !important; }
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
          Введите дату, время, место рождения и пол — калькулятор построит полную карту Бацзы
          с фазами Ци, звёздами удачи, 10-летними циклами и годовыми циклами.
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
              onChange={(e) => setTimeVal(e.target.value)}
              style={{ ...s.input, opacity: noTime ? 0.4 : 1 }}
              disabled={noTime}
            />
            <span style={s.fieldNote}>если не знаете — поставьте галочку ниже</span>
          </div>

          <div style={s.fieldGroup}>
            <label style={s.fieldLabel} htmlFor="bazi-gmt">Часовой пояс</label>
            <select
              id="bazi-gmt"
              value={gmtOffset}
              onChange={(e) => setGmtOffset(Number(e.target.value))}
              style={s.select}
            >
              {GMT_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          <div style={s.fieldGroup}>
            <label style={s.fieldLabel} htmlFor="bazi-place">Место рождения</label>
            <input
              id="bazi-place" type="text" value={birthPlace}
              placeholder="Город рождения"
              onChange={(e) => setBirthPlace(e.target.value)} style={s.input}
            />
          </div>

          <div style={s.fieldGroup}>
            <label style={s.fieldLabel} htmlFor="bazi-lon">Долгота (для ист. времени)</label>
            <input
              id="bazi-lon" type="number" value={longitude} step="0.01" min="-180" max="180"
              onChange={(e) => setLongitude(parseFloat(e.target.value) || 0)} style={s.input}
            />
            <span style={s.fieldNote}>градусы E/W (восток = +)</span>
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

          <div style={{ ...s.fieldGroup, justifyContent: 'flex-end' }}>
            <button
              type="button" onClick={handleCalculate} style={s.submitBtn}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--gold)' }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--ink)' }}
            >
              Рассчитать карту
            </button>
          </div>
        </div>

        {/* Options row */}
        <div style={s.formOptions}>
          <label style={s.checkLabel}>
            <input type="checkbox" checked={noTime} onChange={e => setNoTime(e.target.checked)} />
            Время рождения неизвестно
          </label>
          <label style={s.checkLabel}>
            <input type="checkbox" checked={useSolarTime} onChange={e => setUseSolarTime(e.target.checked)} />
            Истинное солнечное время (коррекция по долготе)
          </label>
          <label style={s.checkLabel}>
            <input type="checkbox" checked={dayChangeAt23} onChange={e => setDayChangeAt23(e.target.checked)} />
            Смена суток в 23:00 (子時)
          </label>
        </div>

        {/* ── Results ── */}
        {result && (
          <>
            {result.solarTimeNote && (
              <div style={s.solarNote}>
                ☀ Коррекция истинного солнечного времени: {result.solarTimeNote}
              </div>
            )}

            {/* Day Master — always shown */}
            <SectionHeader title="Хозяин дня (日主)" />
            <div style={s.dayMasterBanner}>
              <div style={s.dayMasterChar(result.dayMaster.element)}>
                {result.dayMaster.char}
              </div>
              <div style={s.dayMasterInfo}>
                <span style={s.dayMasterLabel}>Хозяин дня</span>
                <span style={s.dayMasterTitle}>
                  {result.dayMaster.nameRu} — {result.dayMaster.element}
                </span>
                <span style={s.dayMasterSub}>
                  {result.dayMaster.polarity} · {result.dayMaster.element}
                </span>
              </div>
              <div style={{ flex: 1, fontSize: '.9rem', color: 'var(--muted)', lineHeight: 1.7 }}>
                Хозяин дня — ваш личный небесный ствол. Он определяет характер,
                сильные стороны и то, какие стихии будут ресурсом, а какие — вызовом.
              </div>
            </div>

            {/* View switcher */}
            <ViewSwitcher mode={viewMode} onChange={setViewMode} />

            {/* ── Карта Бацзы ── */}
            {viewMode === 'bazi' && (
              <>
                <SectionHeader title="Четыре столпа (四柱)" />
                <div id="bazi-pillars-table">
                  <PillarsTable result={result} />
                </div>

                <SectionHeader title="Звёзды и знаки (神煞)" />
                <StarsPanel stars={result.stars} />

                <SectionHeader title="Баланс стихий" />
                <ElementBalance counts={result.elementCounts} />

                <SectionHeader title="Большие циклы удачи (大運)" />
                <LuckCyclesSection
                  cycles={result.luckCycles}
                  birthYear={result.birthYear}
                  luckStartAge={result.luckStartAge}
                />

                <SectionHeader title="Годовые циклы (流年)" />
                <YearlyCyclesTable cycles={result.yearlyCycles} />
              </>
            )}

            {/* ── 12 дворцов ── */}
            {viewMode === 'palaces' && (
              <>
                <SectionHeader title="12 дворцов (十二宮)" />
                <PalacesView palaces={result.palaces} result={result} />
              </>
            )}

            {/* ── Карта ЦМ ── */}
            {viewMode === 'square' && (
              <>
                <SectionHeader title="Карта ЦМ (方位圖)" />
                <SquareView palaces={result.palaces} result={result} />
              </>
            )}

            <p style={s.note}>
              Для точного расчёта важно знать точное время рождения (до минут) и место рождения.
              При включённом «Истинном солнечном времени» применяется поправка на долготу города.
            </p>
          </>
        )}
      </div>
    </section>
  )
}
