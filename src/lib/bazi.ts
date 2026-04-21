// ── Constants ──────────────────────────────────────────────────────────────

const STEMS    = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸']
const BRANCHES = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥']

const STEM_ELEMENTS  = ['Дерево','Дерево','Огонь','Огонь','Земля','Земля','Металл','Металл','Вода','Вода']
const STEM_POLARITY  = ['Ян','Инь','Ян','Инь','Ян','Инь','Ян','Инь','Ян','Инь']
const STEM_NAMES_RU  = ['Цзя','И','Бин','Дин','У','Цзи','Гэн','Синь','Жэнь','Гуй']

const BRANCH_ELEMENTS = ['Вода','Земля','Дерево','Дерево','Земля','Огонь','Огонь','Земля','Металл','Металл','Земля','Вода']
const ANIMALS         = ['Крыса','Бык','Тигр','Кролик','Дракон','Змея','Лошадь','Коза','Обезьяна','Петух','Собака','Свинья']
const BRANCH_NAMES_RU = ['Цзы','Чоу','Инь','Мао','Чэнь','Сы','У','Вэй','Шэнь','Ю','Сюй','Хай']

// Hidden stems (藏干): [main, secondary?, tertiary?]
const HIDDEN_STEMS: Record<number, number[]> = {
  0:  [9],          // 子 → 癸
  1:  [5, 9, 7],    // 丑 → 己癸辛
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

// ── Qi Phases (十二長生) ────────────────────────────────────────────────────
// 12 life phases for each heavenly stem based on earthly branch
// Row = stem element (0=Wood,1=Fire,2=Earth,3=Metal,4=Water by yin/yang)
// Each row starts at 子(0) and goes through all 12 branches
// Yang stems and Yin stems have mirrored cycles

const QI_PHASE_NAMES = [
  'Рождение',    // 长生 (Chang Sheng)
  'Купание',     // 沐浴 (Mu Yu)
  'Оперение',    // 冠带 (Guan Dai)
  'Власть',      // 临官 (Lin Guan)
  'Расцвет',     // 帝旺 (Di Wang)
  'Угасание',    // 衰 (Shuai)
  'Болезнь',     // 病 (Bing)
  'Смерть',      // 死 (Si)
  'Могила',      // 墓 (Mu)
  'Пустота',     // 绝 (Jue)
  'Росток',      // 胎 (Tai)
  'Питание',     // 养 (Yang)
]

// For each of 10 stems: which branch index is the "长生" (birth/changsheng) phase
// Yang stems go forward (+1), Yin stems go backward (-1)
// 甲(0): 长生 at 亥(11), forward
// 乙(1): 长生 at 午(6),  backward
// 丙(2): 长生 at 寅(2),  forward
// 丁(3): 长生 at 酉(9),  backward
// 戊(4): 长生 at 寅(2),  forward
// 己(5): 长生 at 酉(9),  backward
// 庚(6): 长生 at 巳(5),  forward
// 辛(7): 长生 at 子(0),  backward
// 壬(8): 长生 at 申(8),  forward
// 癸(9): 长生 at 卯(3),  backward

const CHANGSHENG_BRANCH: number[] = [11, 6, 2, 9, 2, 9, 5, 0, 8, 3]
const STEM_FORWARD:      boolean[] = [true, false, true, false, true, false, true, false, true, false]

export function getQiPhase(stemIdx: number, branchIdx: number): string {
  const start = CHANGSHENG_BRANCH[stemIdx]
  const forward = STEM_FORWARD[stemIdx]
  let offset: number
  if (forward) {
    offset = ((branchIdx - start) % 12 + 12) % 12
  } else {
    offset = ((start - branchIdx) % 12 + 12) % 12
  }
  return QI_PHASE_NAMES[offset]
}

// ── Special Stars (神煞) ────────────────────────────────────────────────────

// Tianyi (天乙贵人) - Noble helper stars, indexed by day stem
const TIANYI_ACCURATE: Record<number, number[]> = {
  0: [1, 11],   // 甲 → 丑 亥
  1: [0, 9],    // 乙 → 子 申  (actually 子 申)
  2: [8, 6],    // 丙 → 申 亥 (亥 酉)
  3: [6, 8],    // 丁 → 亥 酉
  4: [1, 11],   // 戊 → 丑 亥
  5: [0, 9],    // 己 → 子 申
  6: [1, 7],    // 庚 → 丑 未
  7: [2, 6],    // 辛 → 寅 午
  8: [9, 3],    // 壬 → 酉 卯
  9: [3, 5],    // 癸 → 卯 巳
}

// Taohua (桃花) - Peach Blossom, indexed by year/day branch group
// Branch group: 0=子辰申(0,4,8), 1=丑巳酉(1,5,9), 2=寅午戌(2,6,10), 3=卯未亥(3,7,11)
// Returns the branch index of peach blossom
function getTaohuaBranch(branchIdx: number): number {
  const group = [
    [0, 4, 8],   // 子辰申 → 酉(9)
    [1, 5, 9],   // 丑巳酉 → 午(6)
    [2, 6, 10],  // 寅午戌 → 卯(3)
    [3, 7, 11],  // 卯未亥 → 子(0)
  ]
  const taohua = [9, 6, 3, 0]
  for (let i = 0; i < group.length; i++) {
    if (group[i].includes(branchIdx)) return taohua[i]
  }
  return -1
}

// Yima (驿马) - Traveling Horse, indexed by branch group
// 申子辰 → 寅(2), 寅午戌 → 申(8), 巳酉丑 → 亥(11), 亥卯未 → 巳(5)
function getYimaBranch(branchIdx: number): number {
  if ([8, 0, 4].includes(branchIdx)) return 2   // 申子辰 → 寅
  if ([2, 6, 10].includes(branchIdx)) return 8  // 寅午戌 → 申
  if ([5, 9, 1].includes(branchIdx)) return 11  // 巳酉丑 → 亥
  if ([11, 3, 7].includes(branchIdx)) return 5  // 亥卯未 → 巳
  return -1
}

// Gua number (卦数) calculation
function getGuaNumber(year: number, month: number, day: number, gender: 'male' | 'female'): number {
  const digits = year.toString().split('').map(Number)
  let sum = digits.reduce((a, b) => a + b, 0)
  while (sum >= 10) sum = sum.toString().split('').map(Number).reduce((a, b) => a + b, 0)

  if (gender === 'male') {
    let gua = 10 - sum
    if (gua === 5) gua = 2
    return gua
  } else {
    let gua = sum + 5
    if (gua > 9) gua = gua - 9
    if (gua === 5) gua = 8
    return gua
  }
}

// Kong Wang (空亡) - Void pillars for a day pillar
// Based on the 60-cycle, each 10-day group has 2 void branches
function getKongWang(dayStemIdx: number, dayBranchIdx: number): number[] {
  // Find position in 60-cycle
  const pos60 = (dayStemIdx * 12 + dayBranchIdx) % 60
  // Each group of 10 (0-9, 10-19, etc.) has void branches
  const startBranch = (dayBranchIdx - dayStemIdx % 12 + 12) % 12
  const void1 = (startBranch + 10) % 12
  const void2 = (startBranch + 11) % 12
  return [void1, void2]
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
  qiPhase: string
}

export interface LuckCycle {
  startAge: number
  endAge: number
  startYear: number
  endYear: number
  pillar: Pillar
  isCurrent: boolean
  yearlyInCycle: YearlyCycle[]
}

export interface YearlyCycle {
  year: number
  pillar: Pillar
  isCurrent: boolean
}

export interface SpecialStars {
  tianyi: string[]       // Noble helpers (天乙贵人)
  taohua: string | null  // Peach blossom (桃花)
  yima: string | null    // Traveling horse (驿马)
  kongwang: string[]     // Void (空亡)
  guaNumber: number      // Gua number (卦数)
}

// ── 12 Palaces (十二宮) ────────────────────────────────────────────────────

export interface Palace {
  index: number          // 0–11
  name: string           // Название дворца
  pillar: Pillar         // Столп этого дворца
  stars: string[]        // Звёзды/ангелы в этом дворце
  qiPhases: string[]     // Фазы Ци (от хозяина дня и от месяца)
}

export interface BaziResult {
  year: Pillar
  month: Pillar
  day: Pillar
  hour: Pillar | null    // null when no birth time
  elementCounts: Record<string, number>
  luckCycles: LuckCycle[]
  yearlyCycles: YearlyCycle[]
  dayMaster: { element: string; polarity: string; char: string; nameRu: string }
  gender: 'male' | 'female'
  stars: SpecialStars
  palaces: Palace[]
  luckStartAge: number
  birthYear: number
  birthMonth: number
  birthDay: number
  solarTimeNote?: string
}

// ── Solar Term Dates (节气) ─────────────────────────────────────────────────
// Precise solar term dates for month pillar determination
// Format: [month, approxDay] — actual dates vary ±1-2 days per year
// We use a more precise approach with fixed corrections

const JIEQI_MONTHS: Array<[number, number]> = [
  [1, 6],   // 小寒 Xiaohan (Jan 5-7)
  [2, 4],   // 立春 Lichun  (Feb 3-5)
  [3, 6],   // 惊蛰 Jingzhe (Mar 5-7)
  [4, 5],   // 清明 Qingming (Apr 4-6)
  [5, 6],   // 立夏 Lixia   (May 5-7)
  [6, 6],   // 芒种 Mangzhong (Jun 5-7)
  [7, 7],   // 小暑 Xiaoshu (Jul 6-8)
  [8, 7],   // 立秋 Liqiu   (Aug 6-8)
  [9, 8],   // 白露 Bailu   (Sep 7-9)
  [10, 8],  // 寒露 Hanlu   (Oct 7-9)
  [11, 7],  // 立冬 Lidong  (Nov 6-8)
  [12, 7],  // 大雪 Daxue   (Dec 6-8)
]

// ── Time & Location ────────────────────────────────────────────────────────

// Apply timezone offset and optional solar time correction
// longitude in decimal degrees (east = positive)
export function applyTimeCorrection(
  year: number, month: number, day: number,
  hour: number, minute: number,
  gmtOffset: number,    // e.g. +3 for Moscow
  longitude: number,    // e.g. 37.62 for Moscow
  useSolarTime: boolean
): { year: number; month: number; day: number; hour: number; minute: number; note: string } {
  // Convert to UTC first
  let totalMinutes = hour * 60 + minute - gmtOffset * 60

  // Solar time correction: 4 minutes per degree difference from standard meridian
  // Standard meridian = gmtOffset * 15 degrees (exact, no rounding)
  let solarNote = ''
  if (useSolarTime) {
    const standardMeridian = gmtOffset * 15
    const longitudeDiff = longitude - standardMeridian
    const correctionMinutes = longitudeDiff * 4  // keep fractional for accuracy
    totalMinutes += correctionMinutes
    const corrRounded = Math.round(correctionMinutes)
    solarNote = corrRounded >= 0
      ? `+${corrRounded} мин (долгота ${longitude > 0 ? '+' : ''}${longitude}°, стандарт ${standardMeridian}°)`
      : `${corrRounded} мин (долгота ${longitude > 0 ? '+' : ''}${longitude}°, стандарт ${standardMeridian}°)`
  }

  // Convert back to local date/time handling day overflow
  let d = day
  let m = month
  let y = year
  // Re-add gmtOffset to get local
  totalMinutes += gmtOffset * 60
  while (totalMinutes < 0) { totalMinutes += 1440; d -= 1 }
  while (totalMinutes >= 1440) { totalMinutes -= 1440; d += 1 }

  const newHour   = Math.floor(totalMinutes / 60)
  const newMinute = totalMinutes % 60

  // Handle day overflow (simplified)
  const daysInMonth = [0,31,28,31,30,31,30,31,31,30,31,30,31]
  if (y % 4 === 0 && (y % 100 !== 0 || y % 400 === 0)) daysInMonth[2] = 29

  if (d < 1) {
    m -= 1
    if (m < 1) { m = 12; y -= 1 }
    d = daysInMonth[m]
  }
  if (d > daysInMonth[m]) {
    d = 1; m += 1
    if (m > 12) { m = 1; y += 1 }
  }

  return { year: y, month: m, day: d, hour: newHour, minute: newMinute, note: solarNote }
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
  // Returns 0-11 relative month index (0=Inyin/Tiger month)
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
    qiPhase: getQiPhase(stemIdx, branchIdx),
  }
}

// ── Element counter ────────────────────────────────────────────────────────

function countElements(pillars: (Pillar | null)[]): Record<string, number> {
  const counts: Record<string, number> = {
    'Дерево': 0, 'Огонь': 0, 'Земля': 0, 'Металл': 0, 'Вода': 0,
  }
  for (const p of pillars) {
    if (!p) continue
    counts[p.stemElement] = (counts[p.stemElement] ?? 0) + 1
    counts[p.branchElement] = (counts[p.branchElement] ?? 0) + 1
    for (const hs of p.hiddenStems) {
      counts[hs.element] = (counts[hs.element] ?? 0) + 0.5
    }
  }
  for (const k of Object.keys(counts)) {
    counts[k] = Math.round(counts[k] * 2) / 2
  }
  return counts
}

// ── 12 Palaces calculation ─────────────────────────────────────────────────

const PALACE_NAMES = [
  '1 Судьба',
  '2 Братья, сёстры',
  '3 Супруги',
  '4 Дети',
  '5 Богатство, власть',
  '6 Недвижимость',
  '7 Служащий',
  '8 Друзья',
  '9 Риск',
  '10 Духовность',
  '11 Движение',
  '12 Родители',
]

// Special stars for each branch position relative to day branch
// These are the main 神煞 stars mapped to each of 12 palaces
// Key: dayStemIdx, value: array of 12 entries (one per palace branch offset)
const PALACE_STARS_BY_BRANCH: Record<number, string[][]> = {
  // 甲 day stem
  0: [
    ['Благородный с удачей в личной жизни'],
    ['Демон уничтожения','Благородный Небесной единицы','Благородный под знаком Тайцзи','Волшебник любви'],
    ['Звезда генерала'],
    ['Благородный небесного управления'],
    ['Почтовая лошадь','Благородный под знаком Тайцзи'],
    [],
    ['Звезда искусств'],
    ['Демон грабежа','Вознаграждение 10 небесных стволов','Благородный правильного размера'],
    ['Овечий нож','Демон красоты','Демон пустоты'],
    ['Благородный небесного управления','Демон пустоты'],
    ['Большая Медведица','Благородный Небесной кухни','Благородный небесной удачи','Благородный литературы'],
    ['Цветок персика','Благородный Небесной единицы'],
  ],
  // 乙 day stem
  1: [
    ['Благородный литературы'],
    ['Демон уничтожения','Демон пустоты'],
    ['Звезда генерала','Почтовая лошадь'],
    ['Благородный небесного управления','Цветок персика'],
    ['Благородный под знаком Тайцзи'],
    ['Волшебник любви','Демон красоты'],
    [],
    ['Вознаграждение 10 небесных стволов','Благородный Небесной единицы'],
    ['Демон грабежа','Овечий нож'],
    ['Большая Медведица','Благородный Небесной кухни'],
    ['Демон пустоты','Благородный небесной удачи'],
    ['Благородный небесного управления','Благородный правильного размера'],
  ],
  // 丙 day stem
  2: [
    ['Звезда удачи'],
    ['Демон уничтожения','Благородный под знаком Тайцзи'],
    ['Почтовая лошадь','Звезда генерала'],
    ['Цветок персика','Благородный небесного управления'],
    ['Благородный Небесной единицы'],
    ['Демон красоты','Волшебник любви'],
    ['Демон пустоты'],
    ['Вознаграждение 10 небесных стволов','Демон грабежа'],
    ['Овечий нож','Демон пустоты'],
    ['Большая Медведица','Благородный литературы'],
    ['Благородный небесной удачи','Благородный Небесной кухни'],
    ['Благородный Небесной единицы','Благородный правильного размера'],
  ],
  // 丁 day stem
  3: [
    ['Благородный небесного управления'],
    ['Демон уничтожения','Волшебник любви'],
    ['Звезда генерала'],
    ['Почтовая лошадь','Цветок персика'],
    ['Демон красоты'],
    ['Благородный Небесной единицы'],
    ['Демон пустоты','Звезда искусств'],
    ['Вознаграждение 10 небесных стволов'],
    ['Демон грабежа','Овечий нож'],
    ['Большая Медведица'],
    ['Благородный небесной удачи','Благородный литературы'],
    ['Цветок персика','Благородный Небесной единицы'],
  ],
  // 戊 day stem
  4: [
    ['Звезда генерала'],
    ['Демон уничтожения'],
    ['Почтовая лошадь'],
    ['Благородный небесного управления','Цветок персика'],
    ['Благородный Небесной единицы','Демон красоты'],
    ['Волшебник любви'],
    ['Демон пустоты'],
    ['Вознаграждение 10 небесных стволов','Демон грабежа'],
    ['Овечий нож'],
    ['Большая Медведица','Благородный литературы'],
    ['Благородный небесной удачи'],
    ['Благородный правильного размера'],
  ],
  // 己 day stem
  5: [
    ['Демон красоты'],
    ['Демон уничтожения','Волшебник любви'],
    ['Звезда генерала'],
    ['Почтовая лошадь'],
    ['Цветок персика'],
    ['Благородный Небесной единицы'],
    ['Демон пустоты'],
    ['Вознаграждение 10 небесных стволов'],
    ['Демон грабежа','Овечий нож'],
    ['Большая Медведица'],
    ['Благородный небесной удачи'],
    ['Благородный небесного управления','Благородный литературы'],
  ],
  // 庚 day stem
  6: [
    ['Благородный небесной удачи'],
    ['Демон уничтожения','Демон красоты'],
    ['Звезда генерала','Волшебник любви'],
    ['Цветок персика'],
    ['Почтовая лошадь'],
    ['Благородный Небесной единицы'],
    ['Демон пустоты','Звезда искусств'],
    ['Вознаграждение 10 небесных стволов','Демон грабежа'],
    ['Овечий нож'],
    ['Большая Медведица','Благородный небесного управления'],
    ['Благородный литературы'],
    ['Благородный Небесной единицы','Благородный правильного размера'],
  ],
  // 辛 day stem
  7: [
    ['Овечий нож'],
    ['Демон уничтожения'],
    ['Волшебник любви'],
    ['Цветок персика','Звезда генерала'],
    ['Почтовая лошадь','Демон красоты'],
    ['Благородный небесного управления'],
    ['Демон пустоты'],
    ['Вознаграждение 10 небесных стволов'],
    ['Демон грабежа','Благородный Небесной единицы'],
    ['Большая Медведица'],
    ['Благородный небесной удачи','Благородный литературы'],
    ['Благородный правильного размера'],
  ],
  // 壬 day stem
  8: [
    ['Большая Медведица'],
    ['Демон уничтожения','Благородный литературы'],
    ['Звезда генерала'],
    ['Волшебник любви','Цветок персика'],
    ['Почтовая лошадь'],
    ['Демон красоты','Благородный небесного управления'],
    ['Демон пустоты'],
    ['Вознаграждение 10 небесных стволов','Благородный Небесной единицы'],
    ['Демон грабежа','Овечий нож'],
    ['Благородный небесной удачи'],
    ['Благородный Небесной единицы'],
    ['Благородный правильного размера'],
  ],
  // 癸 day stem
  9: [
    ['Вознаграждение 10 небесных стволов'],
    ['Демон уничтожения'],
    ['Волшебник любви'],
    ['Звезда генерала','Цветок персика'],
    ['Почтовая лошадь','Демон красоты'],
    ['Благородный Небесной единицы'],
    ['Демон пустоты'],
    ['Демон грабежа'],
    ['Овечий нож','Благородный небесного управления'],
    ['Большая Медведица'],
    ['Благородный небесной удачи'],
    ['Благородный литературы','Благородный правильного размера'],
  ],
}

export function calculatePalaces(
  dayPillar: Pillar,
  monthPillar: Pillar,
  yearPillar: Pillar,
  hourPillar: Pillar | null,
): Palace[] {
  // The 12 palaces are distributed across the 12 earthly branches
  // Palace 1 (Судьба/Ming) starts at the month branch and goes forward
  // Each palace corresponds to one branch
  const monthBranch = monthPillar.branchIndex
  const palaces: Palace[] = []

  for (let i = 0; i < 12; i++) {
    const branchIdx = (monthBranch + i) % 12
    // Build pillar for this palace using day stem + palace branch
    const palacePillar = buildPillar(dayPillar.stemIndex, branchIdx)

    // Stars: look up by day stem, palace index
    const starsForDayStem = PALACE_STARS_BY_BRANCH[dayPillar.stemIndex] ?? []
    const stars = starsForDayStem[i] ?? []

    // Qi phases: from day master perspective + from month stem perspective
    const qiFromDay   = getQiPhase(dayPillar.stemIndex, branchIdx)
    const qiFromMonth = getQiPhase(monthPillar.stemIndex, branchIdx)
    const qiPhases = qiFromDay === qiFromMonth
      ? [qiFromDay]
      : [qiFromDay, qiFromMonth]

    palaces.push({
      index: i,
      name: PALACE_NAMES[i],
      pillar: palacePillar,
      stars,
      qiPhases,
    })
  }

  return palaces
}

// ── Luck Cycles (大运) ─────────────────────────────────────────────────────

function getLuckCycleDirection(yearStemIdx: number, gender: 'male' | 'female'): 1 | -1 {
  const yearPolarity = STEM_POLARITY[yearStemIdx]
  const isMale = gender === 'male'
  return (yearPolarity === 'Ян' && isMale) || (yearPolarity === 'Инь' && !isMale) ? 1 : -1
}

function estimateStartAge(
  birthYear: number, birthMonth: number, birthDay: number,
  direction: 1 | -1
): number {
  const birthJDN = toJDN(birthYear, birthMonth, birthDay)

  const terms: number[] = []
  for (let y = birthYear - 1; y <= birthYear + 1; y++) {
    for (const [m, d] of JIEQI_MONTHS) {
      terms.push(toJDN(y, m, d))
    }
  }
  terms.sort((a, b) => a - b)

  let prevTermJDN = 0
  let nextTermJDN = 0
  for (let i = 0; i < terms.length; i++) {
    if (terms[i] <= birthJDN) prevTermJDN = terms[i]
    else { nextTermJDN = terms[i]; break }
  }

  const daysToTerm = direction === 1
    ? nextTermJDN - birthJDN
    : birthJDN - prevTermJDN

  return Math.max(1, Math.round(daysToTerm / 3))
}

function buildYearlyCyclesForRange(startYear: number, endYear: number, currentYear: number): YearlyCycle[] {
  const cycles: YearlyCycle[] = []
  for (let y = startYear; y <= endYear; y++) {
    const stemIdx   = ((y - 4) % 10 + 10) % 10
    const branchIdx = ((y - 4) % 12 + 12) % 12
    cycles.push({
      year: y,
      pillar: buildPillar(stemIdx, branchIdx),
      isCurrent: y === currentYear,
    })
  }
  return cycles
}

export function calculateLuckCycles(
  monthPillar: Pillar,
  birthYear: number,
  birthMonth: number,
  birthDay: number,
  yearStemIdx: number,
  gender: 'male' | 'female',
  currentYear: number
): { cycles: LuckCycle[]; startAge: number } {
  const direction = getLuckCycleDirection(yearStemIdx, gender)
  const startAge  = estimateStartAge(birthYear, birthMonth, birthDay, direction)

  const cycles: LuckCycle[] = []
  for (let i = 0; i < 9; i++) {
    const age       = startAge + i * 10
    const stemIdx   = ((monthPillar.stemIndex   + direction * (i + 1)) % 10 + 10) % 10
    const branchIdx = ((monthPillar.branchIndex + direction * (i + 1)) % 12 + 12) % 12
    const pillar    = buildPillar(stemIdx, branchIdx)
    const startYear = birthYear + age
    const endYear   = startYear + 9
    cycles.push({
      startAge: age,
      endAge:   age + 9,
      startYear,
      endYear,
      pillar,
      isCurrent: currentYear >= startYear && currentYear <= endYear,
      yearlyInCycle: buildYearlyCyclesForRange(startYear, endYear, currentYear),
    })
  }

  return { cycles, startAge }
}

// ── Yearly Cycles ──────────────────────────────────────────────────────────

export function calculateYearlyCycles(currentYear: number, count = 12): YearlyCycle[] {
  const cycles: YearlyCycle[] = []
  const startYear = currentYear - 2
  for (let i = 0; i < count; i++) {
    const y         = startYear + i
    const stemIdx   = ((y - 4) % 10 + 10) % 10
    const branchIdx = ((y - 4) % 12 + 12) % 12
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
  hour: number | null,
  minute: number,
  gender: 'male' | 'female' = 'female',
  gmtOffset = 0,
  longitude = 0,
  useSolarTime = false
): BaziResult {
  const currentYear = new Date().getFullYear()

  let calcYear = year, calcMonth = month, calcDay = day
  let calcHour = hour ?? 12, calcMinute = minute
  let solarTimeNote: string | undefined

  if (useSolarTime) {
    const corrected = applyTimeCorrection(
      year, month, day, calcHour, calcMinute, gmtOffset, longitude, true
    )
    calcYear   = corrected.year
    calcMonth  = corrected.month
    calcDay    = corrected.day
    calcHour   = corrected.hour
    calcMinute = corrected.minute
    solarTimeNote = corrected.note
  }

  // ── Year ──
  const chineseYear = getChineseYear(calcYear, calcMonth, calcDay)
  const yStemIdx    = yearStemIndex(chineseYear)
  const yBranchIdx  = yearBranchIndex(chineseYear)
  const yearPillar  = buildPillar(yStemIdx, yBranchIdx)

  // ── Month ──
  const monthBranchRel = getMonthBranchRelativePrecise(calcMonth, calcDay)
  const mBranchIdx     = (monthBranchRel + 2) % 12
  const mStemIdx       = getMonthStemIndex(yStemIdx, monthBranchRel)
  const monthPillar    = buildPillar(mStemIdx, mBranchIdx)

  // ── Day ──
  let jdn = toJDN(calcYear, calcMonth, calcDay)
  if (calcHour >= 23) jdn += 1
  const dStemIdx  = getDayStemIndex(jdn)
  const dBranchIdx = getDayBranchIndex(jdn)
  const dayPillar = buildPillar(dStemIdx, dBranchIdx)

  // ── Hour ──
  let hourPillar: Pillar | null = null
  if (hour !== null) {
    const hBranchIdx = hourBranchIndex(calcHour)
    const hStemIdx   = getHourStemIndex(dStemIdx, hBranchIdx)
    hourPillar = buildPillar(hStemIdx, hBranchIdx)
  }

  const elementCounts = countElements([yearPillar, monthPillar, dayPillar, hourPillar])

  const { cycles: luckCycles, startAge: luckStartAge } = calculateLuckCycles(
    monthPillar, year, month, day, yStemIdx, gender, currentYear
  )

  const yearlyCycles = calculateYearlyCycles(currentYear, 14)

  // ── Special Stars ──
  const tianyiBranches = TIANYI_ACCURATE[dStemIdx] ?? []
  const tianyiNames = tianyiBranches.map(b => `${BRANCHES[b]} ${BRANCH_NAMES_RU[b]} (${ANIMALS[b]})`)

  const taohuaBranch = getTaohuaBranch(dayPillar.branchIndex)
  const taohua = taohuaBranch >= 0
    ? `${BRANCHES[taohuaBranch]} ${BRANCH_NAMES_RU[taohuaBranch]} (${ANIMALS[taohuaBranch]})`
    : null

  const yimaBranch = getYimaBranch(yearPillar.branchIndex)
  const yima = yimaBranch >= 0
    ? `${BRANCHES[yimaBranch]} ${BRANCH_NAMES_RU[yimaBranch]} (${ANIMALS[yimaBranch]})`
    : null

  const kongwangBranches = getKongWang(dStemIdx, dBranchIdx)
  const kongwang = kongwangBranches.map(b => `${BRANCHES[b]} ${BRANCH_NAMES_RU[b]} (${ANIMALS[b]})`)

  const guaNumber = getGuaNumber(year, month, day, gender)

  const palaces = calculatePalaces(dayPillar, monthPillar, yearPillar, hourPillar)

  return {
    year:   yearPillar,
    month:  monthPillar,
    day:    dayPillar,
    hour:   hourPillar,
    elementCounts,
    luckCycles,
    yearlyCycles,
    dayMaster: {
      element:  dayPillar.stemElement,
      polarity: dayPillar.stemPolarity,
      char:     dayPillar.stem,
      nameRu:   dayPillar.stemNameRu,
    },
    gender,
    stars: {
      tianyi:    tianyiNames,
      taohua,
      yima,
      kongwang,
      guaNumber,
    },
    palaces,
    luckStartAge,
    birthYear:  year,
    birthMonth: month,
    birthDay:   day,
    solarTimeNote,
  }
}
