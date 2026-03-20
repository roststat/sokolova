// ── Constants ──────────────────────────────────────────────────────────────

const STEMS = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸']
const BRANCHES = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥']

const STEM_ELEMENTS = ['Дерево','Дерево','Огонь','Огонь','Земля','Земля','Металл','Металл','Вода','Вода']
const STEM_POLARITY = ['Ян','Инь','Ян','Инь','Ян','Инь','Ян','Инь','Ян','Инь']

const BRANCH_ELEMENTS = ['Вода','Земля','Дерево','Дерево','Земля','Огонь','Огонь','Земля','Металл','Металл','Земля','Вода']

const ANIMALS = ['Крыса','Бык','Тигр','Кролик','Дракон','Змея','Лошадь','Коза','Обезьяна','Петух','Собака','Свинья']

export const ELEMENT_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  'Дерево': { bg: '#e8f5e9', text: '#2e7d32', border: '#a5d6a7' },
  'Огонь':  { bg: '#fde8e8', text: '#c62828', border: '#ef9a9a' },
  'Земля':  { bg: '#fef9e7', text: '#7d6608', border: '#f7dc6f' },
  'Металл': { bg: '#f5f5f5', text: '#424242', border: '#bdbdbd' },
  'Вода':   { bg: '#e3f2fd', text: '#1565c0', border: '#90caf9' },
}

// ── Interfaces ─────────────────────────────────────────────────────────────

export interface Pillar {
  stem: string
  branch: string
  stemElement: string
  stemPolarity: string
  branchElement: string
  animal: string
  stemIndex: number
  branchIndex: number
}

export interface BaziResult {
  year: Pillar
  month: Pillar
  day: Pillar
  hour: Pillar
  elementCounts: Record<string, number>
}

// ── Year Pillar ────────────────────────────────────────────────────────────

function getChineseYear(year: number, month: number, day: number): number {
  // Start of Spring (立春) fixed at Feb 4
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

// Each entry: [month (1-based), day_start] → relative branch index (0 = Tiger/寅)
// The table defines when each month branch begins
const MONTH_BRANCH_TABLE: Array<[number, number, number]> = [
  // [month, dayStart, branchRelativeIndex (0=Tiger)]
  [2,  4,  0],  // 寅 Tiger
  [3,  6,  1],  // 卯 Rabbit
  [4,  5,  2],  // 辰 Dragon
  [5,  6,  3],  // 巳 Snake
  [6,  6,  4],  // 午 Horse
  [7,  7,  5],  // 未 Goat
  [8,  7,  6],  // 申 Monkey
  [9,  8,  7],  // 酉 Rooster
  [10, 8,  8],  // 戌 Dog
  [11, 7,  9],  // 亥 Pig
  [12, 7, 10],  // 子 Rat
  [1,  6, 11],  // 丑 Ox (Jan 6 – Feb 3)
]

// Month branch index (relative, 0=Tiger) in BRANCHES array:
// Tiger is index 2, so actual BRANCHES index = (relativeIndex + 2) % 12
function getMonthBranchRelativeIndex(month: number, day: number): number {
  // Default: 丑 Ox (index 11) covers Jan 1-5 and Jan 6 onward
  // We iterate in reverse to find the latest start date that has been passed
  let result = 11 // 丑 Ox as default (covers early Jan and Dec before the 7th)

  for (const [m, dStart, branchRel] of MONTH_BRANCH_TABLE) {
    if (month === m && day >= dStart) {
      result = branchRel
    } else if (month > m && m !== 1) {
      // month is later than entry month (but only non-Jan entries for forward comparison)
      result = branchRel
    }
  }

  // More precise: find exact match
  // Build sorted list by calendar position and pick the right one
  return getMonthBranchRelativePrecise(month, day)
}

function getMonthBranchRelativePrecise(month: number, day: number): number {
  // Encode each boundary as [monthEncoded, dayStart, branchRel]
  // monthEncoded: treat Jan as 13, Feb as 2, ..., Dec as 12 for easy comparison
  // Actually just do a straightforward comparison:

  // Order by calendar:
  // Jan 1–5: 丑 (11)
  // Jan 6–Feb 3: 丑 (11) — same
  // Feb 4–Mar 5: 寅 (0)
  // Mar 6–Apr 4: 卯 (1)
  // Apr 5–May 5: 辰 (2)
  // May 6–Jun 5: 巳 (3)
  // Jun 6–Jul 6: 午 (4)
  // Jul 7–Aug 6: 未 (5)
  // Aug 7–Sep 7: 申 (6)
  // Sep 8–Oct 7: 酉 (7)
  // Oct 8–Nov 6: 戌 (8)
  // Nov 7–Dec 6: 亥 (9)
  // Dec 7–Dec 31: 子 (10)

  if (month === 1) return 11                           // 丑 whole January
  if (month === 2 && day <= 3) return 11               // 丑
  if (month === 2 || (month === 3 && day <= 5)) return 0  // 寅
  if (month === 3 || (month === 4 && day <= 4)) return 1  // 卯
  if (month === 4 || (month === 5 && day <= 5)) return 2  // 辰
  if (month === 5 || (month === 6 && day <= 5)) return 3  // 巳
  if (month === 6 || (month === 7 && day <= 6)) return 4  // 午
  if (month === 7 || (month === 8 && day <= 6)) return 5  // 未
  if (month === 8 || (month === 9 && day <= 7)) return 6  // 申
  if (month === 9 || (month === 10 && day <= 7)) return 7 // 酉
  if (month === 10 || (month === 11 && day <= 6)) return 8 // 戌
  if (month === 11 || (month === 12 && day <= 6)) return 9  // 亥
  return 10  // 子 (Dec 7 – Dec 31)
}

// Five Tigers rule: determines stem index of Tiger month for a given year stem
function getMonthStemIndex(yearStemIdx: number, monthBranchRelativeIndex: number): number {
  const tigerStemMap: Record<number, number> = {
    0: 2,  // 甲/己 year → Tiger month stem = 丙 (index 2)
    1: 4,  // 乙/庚 year → 戊 (index 4)
    2: 6,  // 丙/辛 year → 庚 (index 6)
    3: 8,  // 丁/壬 year → 壬 (index 8)
    4: 0,  // 戊/癸 year → 甲 (index 0)
  }
  const tigerStemIndex = tigerStemMap[yearStemIdx % 5]
  return (tigerStemIndex + monthBranchRelativeIndex) % 10
}

// ── Day Pillar (JDN method) ────────────────────────────────────────────────

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

// Calibrated: Jan 27, 2019 (JDN = 2458511) = 甲子 (stem 0, branch 0)
// stemIndex  = (jdn - 1) % 10  → at JDN 2458511: (2458511-1)%10 = 2458510%10 = 0 ✓
// branchIndex = (jdn + 1) % 12 → at JDN 2458511: (2458511+1)%12 = 2458512%12 = 0 ✓
function getDayStemIndex(jdn: number): number {
  return ((jdn - 1) % 10 + 10) % 10
}

function getDayBranchIndex(jdn: number): number {
  return ((jdn + 1) % 12 + 12) % 12
}

// ── Hour Pillar ────────────────────────────────────────────────────────────

function hourBranchIndex(hour: number): number {
  // 子: 23-1, 丑: 1-3, 寅: 3-5, ...
  return Math.floor(((hour + 1) % 24) / 2)
}

// Five Rats rule: determines stem index of Rat hour for a given day stem
function getHourStemIndex(dayStemIdx: number, hourBranchIdx: number): number {
  const ratStemMap: Record<number, number> = {
    0: 0,  // 甲/己 day → 甲子 (index 0)
    1: 2,  // 乙/庚 day → 丙子 (index 2)
    2: 4,  // 丙/辛 day → 戊子 (index 4)
    3: 6,  // 丁/壬 day → 庚子 (index 6)
    4: 8,  // 戊/癸 day → 壬子 (index 8)
  }
  const ratStemIndex = ratStemMap[dayStemIdx % 5]
  return (ratStemIndex + hourBranchIdx) % 10
}

// ── Pillar builder ─────────────────────────────────────────────────────────

function buildPillar(stemIdx: number, branchIdx: number): Pillar {
  return {
    stem: STEMS[stemIdx],
    branch: BRANCHES[branchIdx],
    stemElement: STEM_ELEMENTS[stemIdx],
    stemPolarity: STEM_POLARITY[stemIdx],
    branchElement: BRANCH_ELEMENTS[branchIdx],
    animal: ANIMALS[branchIdx],
    stemIndex: stemIdx,
    branchIndex: branchIdx,
  }
}

// ── Element counter ────────────────────────────────────────────────────────

function countElements(pillars: Pillar[]): Record<string, number> {
  const counts: Record<string, number> = {
    'Дерево': 0,
    'Огонь': 0,
    'Земля': 0,
    'Металл': 0,
    'Вода': 0,
  }
  for (const p of pillars) {
    counts[p.stemElement] = (counts[p.stemElement] ?? 0) + 1
    counts[p.branchElement] = (counts[p.branchElement] ?? 0) + 1
  }
  return counts
}

// ── Main export ────────────────────────────────────────────────────────────

export function calculateBazi(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number
): BaziResult {
  // ── Year ──
  const chineseYear = getChineseYear(year, month, day)
  const yStemIdx = yearStemIndex(chineseYear)
  const yBranchIdx = yearBranchIndex(chineseYear)
  const yearPillar = buildPillar(yStemIdx, yBranchIdx)

  // ── Month ──
  const monthBranchRel = getMonthBranchRelativePrecise(month, day)
  // Actual BRANCHES index: Tiger is index 2, so shift by 2
  const mBranchIdx = (monthBranchRel + 2) % 12
  const mStemIdx = getMonthStemIndex(yStemIdx, monthBranchRel)
  const monthPillar = buildPillar(mStemIdx, mBranchIdx)

  // ── Day ──
  // If hour >= 23, new Bazi day starts — advance JDN by 1
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

  return {
    year: yearPillar,
    month: monthPillar,
    day: dayPillar,
    hour: hourPillar,
    elementCounts,
  }
}
