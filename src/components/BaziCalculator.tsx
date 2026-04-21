'use client'

import { useState, useRef, useEffect, CSSProperties } from 'react'
import { calculateBazi, ELEMENT_COLORS } from '@/lib/bazi'
import type { BaziResult, Pillar, LuckCycle, YearlyCycle } from '@/lib/bazi'

// ── City database with timezone & longitude ──────────────────────────────────

interface City {
  name: string
  nameRu: string
  country: string
  gmt: number
  lon: number
  lat: number
}

const CITIES: City[] = [
  { name: 'Moscow',        nameRu: 'Москва',         country: 'Россия',      gmt: 3,    lon: 37.62,   lat: 55.75 },
  { name: 'Saint Petersburg', nameRu: 'Санкт-Петербург', country: 'Россия', gmt: 3,    lon: 30.32,   lat: 59.93 },
  { name: 'Novosibirsk',   nameRu: 'Новосибирск',    country: 'Россия',      gmt: 7,    lon: 82.92,   lat: 54.98 },
  { name: 'Yekaterinburg', nameRu: 'Екатеринбург',   country: 'Россия',      gmt: 5,    lon: 60.60,   lat: 56.84 },
  { name: 'Kazan',         nameRu: 'Казань',          country: 'Россия',      gmt: 3,    lon: 49.12,   lat: 55.79 },
  { name: 'Omsk',          nameRu: 'Омск',            country: 'Россия',      gmt: 6,    lon: 73.37,   lat: 54.99 },
  { name: 'Samara',        nameRu: 'Самара',          country: 'Россия',      gmt: 4,    lon: 50.15,   lat: 53.20 },
  { name: 'Rostov-on-Don', nameRu: 'Ростов-на-Дону', country: 'Россия',      gmt: 3,    lon: 39.72,   lat: 47.23 },
  { name: 'Ufa',           nameRu: 'Уфа',             country: 'Россия',      gmt: 5,    lon: 55.97,   lat: 54.74 },
  { name: 'Krasnoyarsk',   nameRu: 'Красноярск',      country: 'Россия',      gmt: 7,    lon: 92.87,   lat: 56.01 },
  { name: 'Perm',          nameRu: 'Пермь',           country: 'Россия',      gmt: 5,    lon: 56.24,   lat: 58.01 },
  { name: 'Voronezh',      nameRu: 'Воронеж',         country: 'Россия',      gmt: 3,    lon: 39.20,   lat: 51.67 },
  { name: 'Volgograd',     nameRu: 'Волгоград',       country: 'Россия',      gmt: 3,    lon: 44.52,   lat: 48.71 },
  { name: 'Krasnodar',     nameRu: 'Краснодар',       country: 'Россия',      gmt: 3,    lon: 38.97,   lat: 45.04 },
  { name: 'Saratov',       nameRu: 'Саратов',         country: 'Россия',      gmt: 3,    lon: 46.03,   lat: 51.54 },
  { name: 'Tyumen',        nameRu: 'Тюмень',          country: 'Россия',      gmt: 5,    lon: 68.97,   lat: 57.15 },
  { name: 'Tolyatti',      nameRu: 'Тольятти',        country: 'Россия',      gmt: 4,    lon: 49.41,   lat: 53.51 },
  { name: 'Izhevsk',       nameRu: 'Ижевск',          country: 'Россия',      gmt: 4,    lon: 53.21,   lat: 56.85 },
  { name: 'Barnaul',       nameRu: 'Барнаул',         country: 'Россия',      gmt: 7,    lon: 83.78,   lat: 53.34 },
  { name: 'Vladivostok',   nameRu: 'Владивосток',     country: 'Россия',      gmt: 10,   lon: 131.87,  lat: 43.12 },
  { name: 'Irkutsk',       nameRu: 'Иркутск',         country: 'Россия',      gmt: 8,    lon: 104.28,  lat: 52.29 },
  { name: 'Khabarovsk',    nameRu: 'Хабаровск',       country: 'Россия',      gmt: 10,   lon: 135.07,  lat: 48.48 },
  { name: 'Ulyanovsk',     nameRu: 'Ульяновск',       country: 'Россия',      gmt: 4,    lon: 48.40,   lat: 54.33 },
  { name: 'Yaroslavl',     nameRu: 'Ярославль',       country: 'Россия',      gmt: 3,    lon: 39.87,   lat: 57.63 },
  { name: 'Kemerovo',      nameRu: 'Кемерово',        country: 'Россия',      gmt: 7,    lon: 86.09,   lat: 55.35 },
  { name: 'Tomsk',         nameRu: 'Томск',            country: 'Россия',      gmt: 7,    lon: 84.95,   lat: 56.50 },
  { name: 'Astrakhan',     nameRu: 'Астрахань',       country: 'Россия',      gmt: 3,    lon: 48.04,   lat: 46.34 },
  { name: 'Ryazan',        nameRu: 'Рязань',           country: 'Россия',      gmt: 3,    lon: 39.70,   lat: 54.63 },
  { name: 'Naberezhnye Chelny', nameRu: 'Набережные Челны', country: 'Россия', gmt: 3, lon: 52.43,   lat: 55.74 },
  { name: 'Penza',         nameRu: 'Пенза',            country: 'Россия',      gmt: 3,    lon: 45.00,   lat: 53.20 },
  { name: 'Lipetsk',       nameRu: 'Липецк',           country: 'Россия',      gmt: 3,    lon: 39.60,   lat: 52.61 },
  { name: 'Kirov',         nameRu: 'Киров',            country: 'Россия',      gmt: 3,    lon: 49.67,   lat: 58.60 },
  { name: 'Cheboksary',    nameRu: 'Чебоксары',        country: 'Россия',      gmt: 3,    lon: 47.25,   lat: 56.15 },
  { name: 'Chelyabinsk',   nameRu: 'Челябинск',        country: 'Россия',      gmt: 5,    lon: 61.40,   lat: 55.16 },
  { name: 'Kyiv',          nameRu: 'Киев',             country: 'Украина',     gmt: 2,    lon: 30.52,   lat: 50.45 },
  { name: 'Kharkiv',       nameRu: 'Харьков',          country: 'Украина',     gmt: 2,    lon: 36.25,   lat: 49.99 },
  { name: 'Odessa',        nameRu: 'Одесса',           country: 'Украина',     gmt: 2,    lon: 30.73,   lat: 46.48 },
  { name: 'Dnipro',        nameRu: 'Днепр',            country: 'Украина',     gmt: 2,    lon: 35.05,   lat: 48.46 },
  { name: 'Minsk',         nameRu: 'Минск',            country: 'Беларусь',    gmt: 3,    lon: 27.57,   lat: 53.90 },
  { name: 'Almaty',        nameRu: 'Алматы',           country: 'Казахстан',   gmt: 5,    lon: 76.95,   lat: 43.25 },
  { name: 'Nur-Sultan',    nameRu: 'Астана',           country: 'Казахстан',   gmt: 5,    lon: 71.43,   lat: 51.18 },
  { name: 'Tashkent',      nameRu: 'Ташкент',          country: 'Узбекистан',  gmt: 5,    lon: 69.27,   lat: 41.30 },
  { name: 'Bishkek',       nameRu: 'Бишкек',           country: 'Кыргызстан',  gmt: 6,    lon: 74.57,   lat: 42.87 },
  { name: 'Baku',          nameRu: 'Баку',             country: 'Азербайджан', gmt: 4,    lon: 49.87,   lat: 40.41 },
  { name: 'Tbilisi',       nameRu: 'Тбилиси',          country: 'Грузия',      gmt: 4,    lon: 44.83,   lat: 41.69 },
  { name: 'Yerevan',       nameRu: 'Ереван',           country: 'Армения',     gmt: 4,    lon: 44.50,   lat: 40.18 },
  { name: 'Beijing',       nameRu: 'Пекин',            country: 'Китай',       gmt: 8,    lon: 116.40,  lat: 39.90 },
  { name: 'Shanghai',      nameRu: 'Шанхай',           country: 'Китай',       gmt: 8,    lon: 121.47,  lat: 31.23 },
  { name: 'Guangzhou',     nameRu: 'Гуанчжоу',         country: 'Китай',       gmt: 8,    lon: 113.26,  lat: 23.13 },
  { name: 'Hong Kong',     nameRu: 'Гонконг',          country: 'Китай',       gmt: 8,    lon: 114.16,  lat: 22.31 },
  { name: 'Tokyo',         nameRu: 'Токио',            country: 'Япония',      gmt: 9,    lon: 139.69,  lat: 35.69 },
  { name: 'Seoul',         nameRu: 'Сеул',             country: 'Корея',       gmt: 9,    lon: 126.97,  lat: 37.57 },
  { name: 'Singapore',     nameRu: 'Сингапур',         country: 'Сингапур',    gmt: 8,    lon: 103.82,  lat: 1.35  },
  { name: 'Bangkok',       nameRu: 'Бангкок',          country: 'Таиланд',     gmt: 7,    lon: 100.52,  lat: 13.75 },
  { name: 'Dubai',         nameRu: 'Дубай',            country: 'ОАЭ',         gmt: 4,    lon: 55.30,   lat: 25.20 },
  { name: 'Istanbul',      nameRu: 'Стамбул',          country: 'Турция',      gmt: 3,    lon: 28.97,   lat: 41.01 },
  { name: 'Berlin',        nameRu: 'Берлин',           country: 'Германия',    gmt: 1,    lon: 13.40,   lat: 52.52 },
  { name: 'Paris',         nameRu: 'Париж',            country: 'Франция',     gmt: 1,    lon: 2.35,    lat: 48.85 },
  { name: 'London',        nameRu: 'Лондон',           country: 'Великобритания', gmt: 0, lon: -0.13,   lat: 51.51 },
  { name: 'Madrid',        nameRu: 'Мадрид',           country: 'Испания',     gmt: 1,    lon: -3.70,   lat: 40.42 },
  { name: 'Rome',          nameRu: 'Рим',              country: 'Италия',      gmt: 1,    lon: 12.48,   lat: 41.90 },
  { name: 'Warsaw',        nameRu: 'Варшава',          country: 'Польша',      gmt: 1,    lon: 21.01,   lat: 52.23 },
  { name: 'Prague',        nameRu: 'Прага',            country: 'Чехия',       gmt: 1,    lon: 14.42,   lat: 50.09 },
  { name: 'Vienna',        nameRu: 'Вена',             country: 'Австрия',     gmt: 1,    lon: 16.37,   lat: 48.21 },
  { name: 'New York',      nameRu: 'Нью-Йорк',         country: 'США',         gmt: -5,   lon: -74.01,  lat: 40.71 },
  { name: 'Los Angeles',   nameRu: 'Лос-Анджелес',     country: 'США',         gmt: -8,   lon: -118.24, lat: 34.05 },
  { name: 'Chicago',       nameRu: 'Чикаго',           country: 'США',         gmt: -6,   lon: -87.63,  lat: 41.85 },
  { name: 'Toronto',       nameRu: 'Торонто',          country: 'Канада',      gmt: -5,   lon: -79.38,  lat: 43.65 },
  { name: 'Sydney',        nameRu: 'Сидней',           country: 'Австралия',   gmt: 10,   lon: 151.21,  lat: -33.87 },
  { name: 'Tel Aviv',      nameRu: 'Тель-Авив',        country: 'Израиль',     gmt: 2,    lon: 34.78,   lat: 32.08 },
  { name: 'Riga',          nameRu: 'Рига',             country: 'Латвия',      gmt: 2,    lon: 24.11,   lat: 56.95 },
  { name: 'Tallinn',       nameRu: 'Таллин',           country: 'Эстония',     gmt: 2,    lon: 24.75,   lat: 59.44 },
  { name: 'Vilnius',       nameRu: 'Вильнюс',          country: 'Литва',       gmt: 2,    lon: 25.28,   lat: 54.69 },
  { name: 'Helsinki',      nameRu: 'Хельсинки',        country: 'Финляндия',   gmt: 2,    lon: 24.94,   lat: 60.17 },
  { name: 'Stockholm',     nameRu: 'Стокгольм',        country: 'Швеция',      gmt: 1,    lon: 18.07,   lat: 59.33 },
  { name: 'Amsterdam',     nameRu: 'Амстердам',        country: 'Нидерланды',  gmt: 1,    lon: 4.90,    lat: 52.37 },
  { name: 'Brussels',      nameRu: 'Брюссель',         country: 'Бельгия',     gmt: 1,    lon: 4.35,    lat: 50.85 },
  { name: 'Zurich',        nameRu: 'Цюрих',            country: 'Швейцария',   gmt: 1,    lon: 8.54,    lat: 47.38 },
  { name: 'Bucharest',     nameRu: 'Бухарест',         country: 'Румыния',     gmt: 2,    lon: 26.10,   lat: 44.43 },
  { name: 'Sofia',         nameRu: 'София',            country: 'Болгария',    gmt: 2,    lon: 23.32,   lat: 42.70 },
  { name: 'Athens',        nameRu: 'Афины',            country: 'Греция',      gmt: 2,    lon: 23.73,   lat: 37.98 },
  { name: 'Tehran',        nameRu: 'Тегеран',          country: 'Иран',        gmt: 3.5,  lon: 51.42,   lat: 35.69 },
  { name: 'Karachi',       nameRu: 'Карачи',           country: 'Пакистан',    gmt: 5,    lon: 67.01,   lat: 24.86 },
  { name: 'Mumbai',        nameRu: 'Мумбаи',           country: 'Индия',       gmt: 5.5,  lon: 72.88,   lat: 19.08 },
  { name: 'Delhi',         nameRu: 'Дели',             country: 'Индия',       gmt: 5.5,  lon: 77.21,   lat: 28.66 },
  { name: 'Colombo',       nameRu: 'Коломбо',          country: 'Шри-Ланка',   gmt: 5.5,  lon: 79.86,   lat: 6.93  },
  { name: 'Dhaka',         nameRu: 'Дакка',            country: 'Бангладеш',   gmt: 6,    lon: 90.41,   lat: 23.73 },
  { name: 'Kuala Lumpur',  nameRu: 'Куала-Лумпур',     country: 'Малайзия',    gmt: 8,    lon: 101.69,  lat: 3.14  },
  { name: 'Jakarta',       nameRu: 'Джакарта',         country: 'Индонезия',   gmt: 7,    lon: 106.84,  lat: -6.21 },
  { name: 'Manila',        nameRu: 'Манила',           country: 'Филиппины',   gmt: 8,    lon: 120.98,  lat: 14.60 },
  { name: 'Taipei',        nameRu: 'Тайбэй',           country: 'Тайвань',     gmt: 8,    lon: 121.56,  lat: 25.04 },
  { name: 'Hanoi',         nameRu: 'Ханой',            country: 'Вьетнам',     gmt: 7,    lon: 105.85,  lat: 21.03 },
  { name: 'Ulaanbaatar',   nameRu: 'Улан-Батор',       country: 'Монголия',    gmt: 8,    lon: 106.92,  lat: 47.91 },
]

function searchCities(query: string): City[] {
  if (!query || query.length < 1) return []
  const q = query.toLowerCase()
  return CITIES.filter(c =>
    c.nameRu.toLowerCase().includes(q) ||
    c.name.toLowerCase().includes(q) ||
    c.country.toLowerCase().includes(q)
  ).slice(0, 8)
}

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

type ViewMode = 'bazi' | 'square'

function ViewSwitcher({ mode, onChange }: { mode: ViewMode; onChange: (m: ViewMode) => void }) {
  const opts: { value: ViewMode; label: string }[] = [
    { value: 'bazi',   label: 'Карта Бацзы' },
    { value: 'square', label: 'Карта ЦМ'   },
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

// ── Qi Men Dun Jia view (奇門遁甲) ─────────────────────────────────────────────
// 9 palaces (Lo Shu square) layout with current year/month pillars
// Lo Shu order: SE=4, S=9, SW=2 / E=3, Center=5, W=7 / NE=8, N=1, NW=6

// 8 Gates (八門) of Qi Men
const QM_GATES = ['休','生','傷','杜','景','死','驚','開']
const QM_GATES_RU = ['Покой','Жизнь','Рана','Преграда','Пейзаж','Смерть','Страх','Открытие']

// 9 Stars (九星) of Qi Men
const QM_STARS = ['天蓬','天芮','天冲','天辅','天禽','天心','天柱','天任','天英']
const QM_STARS_RU = ['Пэн','Жуй','Чун','Фу','Цинь','Синь','Чжу','Жэнь','Ин']

// 8 Spirits/Gods (八神)
const QM_SPIRITS = ['值符','螣蛇','太陰','六合','白虎','玄武','九地','九天']
const QM_SPIRITS_RU = ['Страж','Змея','Иньское','Союз','Тигр','Воин','Земля','Небо']

// Lo Shu palace positions (row, col) for palaces 1-9
// Layout: row 0 = top (S side), row 2 = bottom (N side) per classical orientation
// Displayed: top-left=SE(4), top-center=S(9), top-right=SW(2)
//            mid-left=E(3),  center=5,        mid-right=W(7)
//            bot-left=NE(8), bot-center=N(1), bot-right=NW(6)
const LO_SHU_GRID = [
  [4, 9, 2],
  [3, 5, 7],
  [8, 1, 6],
]

const PALACE_NAMES_RU: Record<number, string> = {
  1: 'С (坎)', 2: 'ЮЗ (坤)', 3: 'В (震)',
  4: 'ЮВ (巽)', 5: 'Центр (中)', 6: 'СЗ (乾)',
  7: 'З (兌)', 8: 'СВ (艮)', 9: 'Ю (離)',
}

function getQmPalaceData(result: BaziResult) {
  const currentYear = new Date().getFullYear()
  const yearStemIdx = result.year.stemIndex
  const monthStemIdx = result.month.stemIndex
  const dayStemIdx = result.day.stemIndex

  // Gate assignment: rotate gates based on day stem (simplified)
  const gateOffset = dayStemIdx % 8
  // Star assignment: rotate stars based on year stem
  const starOffset = yearStemIdx % 9
  // Spirit assignment: rotate spirits based on month stem
  const spiritOffset = monthStemIdx % 8

  const palaces: Record<number, {
    palace: number
    gate: string; gateRu: string
    star: string; starRu: string
    spirit: string; spiritRu: string
    stem: string; stemEl: string
    branch: string; branchEl: string
  }> = {}

  for (let i = 1; i <= 9; i++) {
    if (i === 5) {
      palaces[5] = {
        palace: 5,
        gate: '—', gateRu: '—',
        star: QM_STARS[4], starRu: QM_STARS_RU[4],
        spirit: '—', spiritRu: '—',
        stem: result.day.stem, stemEl: result.day.stemElement,
        branch: result.month.branch, branchEl: result.month.branchElement,
      }
      continue
    }
    const gIdx = ((i - 1 + gateOffset) % 8)
    const sIdx = ((i - 1 + starOffset) % 9)
    const spIdx = ((i - 1 + spiritOffset) % 8)
    palaces[i] = {
      palace: i,
      gate: QM_GATES[gIdx], gateRu: QM_GATES_RU[gIdx],
      star: QM_STARS[sIdx], starRu: QM_STARS_RU[sIdx],
      spirit: QM_SPIRITS[spIdx], spiritRu: QM_SPIRITS_RU[spIdx],
      stem: result.year.stem, stemEl: result.year.stemElement,
      branch: result.year.branch, branchEl: result.year.branchElement,
    }
  }
  return palaces
}

function SquareView({ result }: { result: BaziResult }) {
  const palaces = getQmPalaceData(result)

  const cellBase: CSSProperties = {
    border: '1px solid var(--line)',
    verticalAlign: 'top',
    width: '33.33%',
  }

  const PalaceCell = ({ num }: { num: number }) => {
    const p = palaces[num]
    const isCenter = num === 5
    const isDeath = p.gateRu === 'Смерть'
    const isLife = p.gateRu === 'Жизнь' || p.gateRu === 'Открытие'

    return (
      <td style={{
        ...cellBase,
        background: isCenter ? 'var(--off)' : 'var(--white)',
        padding: '.8rem .6rem',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '.3rem', alignItems: 'center', minHeight: '140px', justifyContent: 'center' }}>
          {/* Palace number & direction */}
          <div style={{ fontSize: '.65rem', fontWeight: 700, color: 'var(--gold)', letterSpacing: '.06em', textAlign: 'center' }}>
            {PALACE_NAMES_RU[num]}
          </div>

          {/* Heavenly stem + Branch from pillars */}
          <div style={{ display: 'flex', gap: '.2rem', alignItems: 'baseline', justifyContent: 'center' }}>
            <span style={{ fontFamily: 'var(--serif)', fontSize: '1.8rem', fontWeight: 700, lineHeight: 1, color: ELEMENT_COLORS[p.stemEl]?.text ?? '#333' }}>
              {p.stem}
            </span>
            <span style={{ fontFamily: 'var(--serif)', fontSize: '1.5rem', fontWeight: 700, lineHeight: 1, color: ELEMENT_COLORS[p.branchEl]?.text ?? '#555' }}>
              {p.branch}
            </span>
          </div>

          {/* Gate */}
          {!isCenter && (
            <div style={{
              fontSize: '.72rem', fontWeight: 600, padding: '.1rem .5rem',
              color: isDeath ? '#c62828' : isLife ? '#2e7d32' : 'var(--ink)',
              background: isDeath ? '#fde8e8' : isLife ? '#e8f5e9' : 'var(--off)',
              border: `1px solid ${isDeath ? '#ef9a9a' : isLife ? '#a5d6a7' : 'var(--line)'}`,
              display: 'flex', alignItems: 'center', gap: '.25rem',
            }}>
              <span style={{ fontFamily: 'var(--serif)', fontSize: '1rem' }}>{p.gate}</span>
              <span>{p.gateRu}</span>
            </div>
          )}

          {/* Star */}
          <div style={{ fontSize: '.68rem', color: '#1565c0', display: 'flex', alignItems: 'center', gap: '.2rem' }}>
            <span style={{ fontFamily: 'var(--serif)', fontSize: '.85rem' }}>{p.star}</span>
            <span style={{ color: 'var(--muted)' }}>{p.starRu}</span>
          </div>

          {/* Spirit */}
          {!isCenter && (
            <div style={{ fontSize: '.65rem', color: 'var(--muted)' }}>{p.spiritRu}</div>
          )}

          {isCenter && (
            <div style={{ fontSize: '.7rem', color: 'var(--muted)', textAlign: 'center', lineHeight: 1.5, marginTop: '.2rem' }}>
              {result.dayMaster.nameRu}<br />
              {result.dayMaster.element} · {result.dayMaster.polarity}
            </div>
          )}
        </div>
      </td>
    )
  }

  return (
    <div style={{ overflowX: 'auto', marginBottom: '2rem' }}>
      <table style={{ borderCollapse: 'collapse', width: '100%', background: 'var(--white)', border: '1px solid var(--line)', minWidth: '480px', tableLayout: 'fixed' }}>
        <tbody>
          {LO_SHU_GRID.map((row, ri) => (
            <tr key={ri}>
              {row.map((num) => (
                <PalaceCell key={num} num={num} />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <p style={{ fontSize: '.78rem', color: 'var(--faint)', marginTop: '1rem' }}>
        Карта Ци Мен Дун Цзя: 9 дворцов Ло Шу. Врата (門), Звёзды (星) и Духи (神) рассчитаны от столпов дня, года и месяца. Для профессионального расчёта ЦМ используйте специализированный инструмент.
      </p>
    </div>
  )
}

// ── City search autocomplete ──────────────────────────────────────────────────

function CitySearch({ onSelect }: {
  onSelect: (city: City) => void
}) {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<City[]>([])
  const [selectedCity, setSelectedCity] = useState<City | null>(null)
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleInput = (val: string) => {
    setQuery(val)
    setSelectedCity(null)
    if (val.length >= 1) {
      const results = searchCities(val)
      setSuggestions(results)
      setOpen(results.length > 0)
    } else {
      setSuggestions([])
      setOpen(false)
    }
  }

  const handleSelect = (city: City) => {
    setSelectedCity(city)
    setQuery(`${city.nameRu}, ${city.country}`)
    setSuggestions([])
    setOpen(false)
    onSelect(city)
  }

  const gmtLabel = selectedCity
    ? `GMT${selectedCity.gmt >= 0 ? '+' : ''}${selectedCity.gmt}:00`
    : ''

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <label style={s.fieldLabel} htmlFor="bazi-city">Место рождения</label>
      <div style={{ position: 'relative' }}>
        <input
          id="bazi-city"
          type="text"
          value={query}
          placeholder="Начните вводить город..."
          onChange={(e) => handleInput(e.target.value)}
          onFocus={() => { if (suggestions.length > 0) setOpen(true) }}
          style={s.input}
          autoComplete="off"
        />
        {selectedCity && (
          <span style={{
            position: 'absolute', right: '.7rem', top: '50%', transform: 'translateY(-50%)',
            fontSize: '.72rem', color: 'var(--gold)', fontWeight: 600,
            background: 'var(--off)', padding: '.1rem .4rem',
            pointerEvents: 'none',
          }}>
            {gmtLabel}
          </span>
        )}
      </div>
      {!selectedCity && query.length === 0 && (
        <span style={s.fieldNote}>часовой пояс и долгота подставятся автоматически</span>
      )}
      {open && suggestions.length > 0 && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 100,
          background: 'var(--white)', border: '1px solid var(--line)',
          borderTop: 'none', maxHeight: '260px', overflowY: 'auto',
          boxShadow: '0 4px 16px rgba(0,0,0,.1)',
        }}>
          {suggestions.map((city) => (
            <div
              key={`${city.name}-${city.country}`}
              onMouseDown={() => handleSelect(city)}
              style={{
                padding: '.7rem 1rem', cursor: 'pointer', fontSize: '.88rem',
                borderBottom: '1px solid var(--line)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.background = 'var(--off)' }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.background = 'var(--white)' }}
            >
              <span>
                <strong style={{ color: 'var(--ink)' }}>{city.nameRu}</strong>
                <span style={{ color: 'var(--muted)', marginLeft: '.4rem' }}>{city.country}</span>
              </span>
              <span style={{ fontSize: '.72rem', color: 'var(--gold)', fontWeight: 600 }}>
                GMT{city.gmt >= 0 ? '+' : ''}{city.gmt}
              </span>
            </div>
          ))}
        </div>
      )}
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
  const [result,        setResult]        = useState<BaziResult | null>(null)
  const [viewMode,      setViewMode]      = useState<ViewMode>('bazi')

  const handleCitySelect = (city: City) => {
    setGmtOffset(city.gmt)
    setLongitude(city.lon)
  }

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

    let calcHour = hour
    if (dayChangeAt23 && calcHour !== null && calcHour === 23) {
      calcHour = 23
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

          <div style={{ ...s.fieldGroup, position: 'relative' as const }}>
            <CitySearch onSelect={handleCitySelect} />
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
            Истинное солнечное время
          </label>
          <label style={s.checkLabel}>
            <input type="checkbox" checked={dayChangeAt23} onChange={e => setDayChangeAt23(e.target.checked)} />
            Смена суток в 23:00 (子時)
          </label>
          <div style={{ fontSize: '.78rem', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '.5rem' }}>
            <span>GMT{gmtOffset >= 0 ? '+' : ''}{gmtOffset}</span>
            <span>·</span>
            <span>Долгота {longitude > 0 ? '+' : ''}{longitude.toFixed(2)}°</span>
          </div>
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

            {/* ── Карта ЦМ ── */}
            {viewMode === 'square' && (
              <>
                <SectionHeader title="Карта ЦМ (奇門遁甲)" />
                <SquareView result={result} />
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
