// ── Constants ──────────────────────────────────────────────────────────────

const STEMS   = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸']
const BRANCHES = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥']

const STEM_ELEMENTS  = ['Дерево','Дерево','Огонь','Огонь','Земля','Земля','Металл','Металл','Вода','Вода']
const STEM_POLARITY  = ['Ян','Инь','Ян','Инь','Ян','Инь','Ян','Инь','Ян','Инь']
const STEM_NAMES_RU  = ['Цзя','И','Бин','Дин','У','Цзи','Гэн','Синь','Жэнь','Гуй']

const BRANCH_ELEMENTS = ['Вода','Земля','Дерево','Дерево','Земля','Огонь','Огонь','Земля','Металл','Металл','Земля','Вода']
const ANIMALS         = ['Крыса','Бык','Тигр','Кролик','Дракон','Змея','Лошадь','Коза','Обезьяна','Петух','Собака','Свинья']
const BRANCH_NAMES_RU = ['Цзы','Чоу','Инь','Мао','Чэнь','Сы','У','Вэй','Шэнь','Ю','Сюй','Хай']

// Hidden stems (藏干) for each earthly branch
// Each branch has 1–3 hidden heavenly stems [main, secondary?, tertiary?]
const HIDDEN_STEMS: Record<number, number[]> = {
  0:  [9],          // 子 → 癸
  1:  [5, 9, 3],    // 丑 → 己癸辛
  2:  [0, 2, 4],    // 寅 → 甲丙戊
  3:  [1],          // 卯 → 乙
  4:  [4, 1, 9],    // 辰 → 戊乙癸
  5:  [2, 4, 7],    // 巳 → 丙戊庚
  6:  [2, 5],       // 午 → 丙己
  7:  [5, 3, 1],    // 未 → 己丁乙
  8:  [6, 8, 4],    // 申 → 庚壬戊
  9:  [7],          // 酉 → 辛
  10: [4, 7, 3],    // 戌 → 戊辛丁
  11: [8, 0],       // 亥 → 壬甲
}

export const ELEMENT_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  'Дерево': { bg: '#e8f5e9', text: '#2e7d32', border: '#a5d6a7' },
  'Огонь':  { bg: '#fde8e8', text: '#c62828', border: '#ef9a9a' },
  'Земля':  { bg: '#fef9e7', text: '#7d6608', border: '#f7dc6f' },
  'Металл': { bg: '#f5f5f5', text: '#424242', border: '#bdbdbd' },
  'Вода':   { bg: '#e3f2fd', text: '#1565c0', border: '#90caf9' },
}

// ── Interfaces ─────────────────────────────────────────────────────────────

export interface HiddenStem {
  char: string
  element: string
  polarity: string
  nameRu: string
}

export interface Pillar {
  stem: string
  branch: string
  stemElement: string
  stemPolarity: string
  stemNameRu: string
  branchElement: string
  branchNameRu: string
  animal: string
  stemIndex: number
  branchIndex: number
  hiddenStems: HiddenStem[]
}

export interface LuckCycle {
  startAge: number
  endAge: number
  startYear: number
  endYear: number
  pillar: Pillar
  isCurrent: boolean
}

export interface YearlyCycle {
  year: number
  pillar: Pillar
  isCurrent: boolean
}

export interface BaziResult {
  year: Pillar
  month: Pillar
  day: Pillar
  hour: Pillar
  elementCounts: Record<string, number>
  luckCycles: LuckCycle[]
  yearlyCycles: YearlyCycle[]
  dayMaster: { element: string; polarity: string; char: string }
  gender: 'male' | 'female'
}

// ── Year Pillar ────────────────────────────────────────────────────────────

function getChineseYear(year: number, month: number, day: number): number {
  if (month < 2 || (month === 2 && day < 4)) return year - 1
  return year
}

function yearStemIndex(chineseYear: number): number {
  return ((chineseYear - 4) % 10 + 10) % 10
}

function yearBranchIndex(chineseYear: number): number {
  return ((chineseYear - 4) % 12 + 12) % 12
}

// ── Month Pillar ───────────────────────────────────────────────────────────

function getMonthBranchRelativePrecise(month: number, day: number): number {
  if (month === 1) return 11
  if (month === 2 && day <= 3) return 11
  if (month === 2 || (month === 3 && day <= 5)) return 0
  if (month === 3 || (month === 4 && day <= 4)) return 1
  if (month === 4 || (month === 5 && day <= 5)) return 2
  if (month === 5 || (month === 6 && day <= 5)) return 3
  if (month === 6 || (month === 7 && day <= 6)) return 4
  if (month === 7 || (month === 8 && day <= 6)) return 5
  if (month === 8 || (month === 9 && day <= 7)) return 6
  if (month === 9 || (month === 10 && day <= 7)) return 7
  if (month === 10 || (month === 11 && day <= 6)) return 8
  if (month === 11 || (month === 12 && day <= 6)) return 9
  return 10
}

function getMonthStemIndex(yearStemIdx: number, monthBranchRelativeIndex: number): number {
  const tigerStemMap: Record<number, number> = { 0: 2, 1: 4, 2: 6, 3: 8, 4: 0 }
  const tigerStemIndex = tigerStemMap[yearStemIdx % 5]
  return (tigerStemIndex + monthBranchRelativeIndex) % 10
}

// ── Day Pillar ─────────────────────────────────────────────────────────────

function toJDN(y: number, m: number, d: number): number {
  const a = Math.floor((14 - m) / 12)
  const Y = y + 4800 - a
  const M = m + 12 * a - 3
  return (
    d +
    Math.floor((153 * M + 2) / 5) +
    365 * Y +
    Math.floor(Y / 4) -
    Math.floor(Y / 100) +
    Math.floor(Y / 400) -
    32045
  )
}

function getDayStemIndex(jdn: number): number {
  return ((jdn - 1) % 10 + 10) % 10
}

function getDayBranchIndex(jdn: number): number {
  return ((jdn + 1) % 12 + 12) % 12
}

// ── Hour Pillar ────────────────────────────────────────────────────────────

function hourBranchIndex(hour: number): number {
  return Math.floor(((hour + 1) % 24) / 2)
}

function getHourStemIndex(dayStemIdx: number, hourBranchIdx: number): number {
  const ratStemMap: Record<number, number> = { 0: 0, 1: 2, 2: 4, 3: 6, 4: 8 }
  const ratStemIndex = ratStemMap[dayStemIdx % 5]
  return (ratStemIndex + hourBranchIdx) % 10
}

// ── Pillar builder ─────────────────────────────────────────────────────────

function buildHiddenStems(branchIdx: number): HiddenStem[] {
  return (HIDDEN_STEMS[branchIdx] ?? []).map((sIdx) => ({
    char: STEMS[sIdx],
    element: STEM_ELEMENTS[sIdx],
    polarity: STEM_POLARITY[sIdx],
    nameRu: STEM_NAMES_RU[sIdx],
  }))
}

function buildPillar(stemIdx: number, branchIdx: number): Pillar {
  return {
    stem: STEMS[stemIdx],
    branch: BRANCHES[branchIdx],
    stemElement: STEM_ELEMENTS[stemIdx],
    stemPolarity: STEM_POLARITY[stemIdx],
    stemNameRu: STEM_NAMES_RU[stemIdx],
    branchElement: BRANCH_ELEMENTS[branchIdx],
    branchNameRu: BRANCH_NAMES_RU[branchIdx],
    animal: ANIMALS[branchIdx],
    stemIndex: stemIdx,
    branchIndex: branchIdx,
    hiddenStems: buildHiddenStems(branchIdx),
  }
}

// ── Element counter ────────────────────────────────────────────────────────

function countElements(pillars: Pillar[]): Record<string, number> {
  const counts: Record<string, number> = {
    'Дерево': 0, 'Огонь': 0, 'Земля': 0, 'Металл': 0, 'Вода': 0,
  }
  for (const p of pillars) {
    counts[p.stemElement] = (counts[p.stemElement] ?? 0) + 1
    counts[p.branchElement] = (counts[p.branchElement] ?? 0) + 1
    // Count hidden stems too (with 0.5 weight rounded up for display as separate counter)
    for (const hs of p.hiddenStems) {
      counts[hs.element] = (counts[hs.element] ?? 0) + 0.5
    }
  }
  // Round to nearest 0.5
  for (const k of Object.keys(counts)) {
    counts[k] = Math.round(counts[k] * 2) / 2
  }
  return counts
}

// ── Luck Cycles (大运) ─────────────────────────────────────────────────────
//
// Direction: Yang male / Yin female → forward through stems/branches
//            Yin male / Yang female → backward
// Starting age: calculated from days to next/previous solar term (~3 days = 1 year)

function getLuckCycleDirection(yearStemIdx: number, gender: 'male' | 'female'): 1 | -1 {
  const yearPolarity = STEM_POLARITY[yearStemIdx] // 'Ян' or 'Инь'
  const isMale = gender === 'male'
  return (yearPolarity === 'Ян' && isMale) || (yearPolarity === 'Инь' && !isMale) ? 1 : -1
}

// Approximate days to next/prev solar term (jié qì) from birth
// We use a simplified estimate: solar terms occur roughly every 15–16 days
// More precise: use month pillar change dates
function estimateStartAge(
  birthYear: number, birthMonth: number, birthDay: number,
  direction: 1 | -1
): number {
  // Find nearest solar term boundary for the month pillar
  // We use the fixed dates from our month branch table
  const SOLAR_TERMS: Array<[number, number]> = [
    [1, 6], [2, 4], [3, 6], [4, 5], [5, 6], [6, 6],
    [7, 7], [8, 7], [9, 8], [10, 8], [11, 7], [12, 7],
  ]

  const birthJDN = toJDN(birthYear, birthMonth, birthDay)

  // Find the solar term that just passed and the next one
  let prevTermJDN = 0
  let nextTermJDN = 0

  // Build all term JDNs for birth year and adjacent years
  const terms: number[] = []
  for (let y = birthYear - 1; y <= birthYear + 1; y++) {
    for (const [m, d] of SOLAR_TERMS) {
      terms.push(toJDN(y, m, d))
    }
  }
  terms.sort((a, b) => a - b)

  for (let i = 0; i < terms.length; i++) {
    if (terms[i] <= birthJDN) prevTermJDN = terms[i]
    else { nextTermJDN = terms[i]; break }
  }

  const daysToTerm = direction === 1
    ? nextTermJDN - birthJDN   // forward: days to next term
    : birthJDN - prevTermJDN   // backward: days since prev term

  // 3 days ≈ 1 year of luck cycle start age
  const startAge = Math.round(daysToTerm / 3)
  return Math.max(1, startAge)
}

export function calculateLuckCycles(
  monthPillar: Pillar,
  birthYear: number,
  birthMonth: number,
  birthDay: number,
  yearStemIdx: number,
  gender: 'male' | 'female',
  currentYear: number
): LuckCycle[] {
  const direction = getLuckCycleDirection(yearStemIdx, gender)
  const startAge = estimateStartAge(birthYear, birthMonth, birthDay, direction)

  const cycles: LuckCycle[] = []

  for (let i = 0; i < 9; i++) {
    const age = startAge + i * 10
    const stemIdx = ((monthPillar.stemIndex + direction * (i + 1)) % 10 + 10) % 10
    const branchIdx = ((monthPillar.branchIndex + direction * (i + 1)) % 12 + 12) % 12
    const pillar = buildPillar(stemIdx, branchIdx)
    const startYear = birthYear + age
    const endYear = startYear + 9
    cycles.push({
      startAge: age,
      endAge: age + 9,
      startYear,
      endYear,
      pillar,
      isCurrent: currentYear >= startYear && currentYear <= endYear,
    })
  }

  return cycles
}

// ── Yearly Cycles ──────────────────────────────────────────────────────────

export function calculateYearlyCycles(currentYear: number, count = 10): YearlyCycle[] {
  const cycles: YearlyCycle[] = []
  const startYear = currentYear - 2

  for (let i = 0; i < count; i++) {
    const y = startYear + i
    const chY = y // yearly pillar doesn't depend on month/day cutoff for this purpose
    const stemIdx = ((chY - 4) % 10 + 10) % 10
    const branchIdx = ((chY - 4) % 12 + 12) % 12
    cycles.push({
      year: y,
      pillar: buildPillar(stemIdx, branchIdx),
      isCurrent: y === currentYear,
    })
  }

  return cycles
}

// ── Main export ────────────────────────────────────────────────────────────

export function calculateBazi(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  gender: 'male' | 'female' = 'female'
): BaziResult {
  const currentYear = new Date().getFullYear()

  // ── Year ──
  const chineseYear = getChineseYear(year, month, day)
  const yStemIdx = yearStemIndex(chineseYear)
  const yBranchIdx = yearBranchIndex(chineseYear)
  const yearPillar = buildPillar(yStemIdx, yBranchIdx)

  // ── Month ──
  const monthBranchRel = getMonthBranchRelativePrecise(month, day)
  const mBranchIdx = (monthBranchRel + 2) % 12
  const mStemIdx = getMonthStemIndex(yStemIdx, monthBranchRel)
  const monthPillar = buildPillar(mStemIdx, mBranchIdx)

  // ── Day ──
  let jdn = toJDN(year, month, day)
  if (hour >= 23) jdn += 1
  const dStemIdx = getDayStemIndex(jdn)
  const dBranchIdx = getDayBranchIndex(jdn)
  const dayPillar = buildPillar(dStemIdx, dBranchIdx)

  // ── Hour ──
  const hBranchIdx = hourBranchIndex(hour)
  const hStemIdx = getHourStemIndex(dStemIdx, hBranchIdx)
  const hourPillar = buildPillar(hStemIdx, hBranchIdx)

  const elementCounts = countElements([yearPillar, monthPillar, dayPillar, hourPillar])

  const luckCycles = calculateLuckCycles(
    monthPillar, year, month, day, yStemIdx, gender, currentYear
  )

  const yearlyCycles = calculateYearlyCycles(currentYear, 12)

  return {
    year: yearPillar,
    month: monthPillar,
    day: dayPillar,
    hour: hourPillar,
    elementCounts,
    luckCycles,
    yearlyCycles,
    dayMaster: {
      element: dayPillar.stemElement,
      polarity: dayPillar.stemPolarity,
      char: dayPillar.stem,
    },
    gender,
  }
}
