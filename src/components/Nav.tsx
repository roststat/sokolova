'use client';

import { useEffect } from 'react';

export default function Nav() {
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

  return (
    <nav id="nav">
      <a href="#" className="logo">Юлия <span>Соколова</span></a>
      <ul className="nav-links">
        <li><a href="#about">Обо мне</a></li>
        <li><a href="#services">Услуги</a></li>
        <li><a href="#howto">Как задать вопрос</a></li>
        <li><a href="#testimonials">Отзывы</a></li>
      </ul>
      <a href="#contact" className="nav-cta">Записаться</a>
    </nav>
  );
}
