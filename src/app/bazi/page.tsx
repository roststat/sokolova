import type { Metadata } from 'next'
import Nav from '@/components/Nav'
import BaziCalculator from '@/components/BaziCalculator'
import Footer from '@/components/Footer'
import RevealObserver from '@/components/RevealObserver'

export const metadata: Metadata = {
  title: 'Калькулятор Бацзы · Юлия Соколова',
  description: 'Рассчитайте карту четырёх столпов судьбы по дате и времени рождения. Бесплатный онлайн-калькулятор Бацзы.',
}

export default function BaziPage() {
  return (
    <>
      <Nav />
      <div style={{ paddingTop: '80px' }}>
        <BaziCalculator />
      </div>
      <Footer />
      <RevealObserver />
    </>
  )
}
