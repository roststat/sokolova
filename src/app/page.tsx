import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import Ticker from '@/components/Ticker';
import About from '@/components/About';
import Services from '@/components/Services';
import HowTo from '@/components/HowTo';
import Process from '@/components/Process';
import Testimonials from '@/components/Testimonials';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import RevealObserver from '@/components/RevealObserver';
import FloatingCalcBtn from '@/components/FloatingCalcBtn';

export default function Home() {
  return (
    <>
      <FloatingCalcBtn />
      <Nav />
      <Hero />
      <Ticker />
      <About />
      <Services />
      <HowTo />
      <Process />
      <Testimonials />
      <Contact />
      <Footer />
      <RevealObserver />
    </>
  );
}
