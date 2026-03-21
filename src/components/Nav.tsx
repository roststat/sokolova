'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Nav() {
  const pathname = usePathname();
  const isHome = pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      const nav = document.getElementById('nav');
      if (nav) {
        nav.classList.toggle('scrolled', window.scrollY > 60);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const anchor = (hash: string) => isHome ? hash : `/${hash}`;

  return (
    <nav id="nav">
      <Link href="/" className="logo">Юлия <span>Соколова</span></Link>
      <ul className="nav-links">
        <li><a href={anchor('#about')}>Обо мне</a></li>
        <li><a href={anchor('#services')}>Услуги</a></li>
        <li><a href={anchor('#howto')}>Как задать вопрос</a></li>
        <li><a href={anchor('#testimonials')}>Отзывы</a></li>
        <li><Link href="/bazi">Калькулятор Бацзы</Link></li>
      </ul>
      <a href={anchor('#contact')} className="nav-cta">Записаться</a>
    </nav>
  );
}
