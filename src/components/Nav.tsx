'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Nav() {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const nav = document.getElementById('nav');
      if (nav) nav.classList.toggle('scrolled', window.scrollY > 60);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // close menu on route/hash navigation
  const close = () => setOpen(false);

  // lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const anchor = (hash: string) => isHome ? hash : `/${hash}`;

  const links = [
    { href: anchor('#about'),        label: 'Обо мне' },
    { href: anchor('#services'),     label: 'Услуги' },
    { href: anchor('#howto'),        label: 'Как задать вопрос' },
    { href: anchor('#testimonials'), label: 'Отзывы' },
    { href: '/bazi',                 label: 'Калькулятор Бацзы' },
  ];

  return (
    <>
      <style>{`
        .burger {
          display: none;
          flex-direction: column;
          justify-content: center;
          gap: 5px;
          width: 36px; height: 36px;
          background: none; border: none;
          cursor: pointer; padding: 4px;
          z-index: 310;
        }
        .burger span {
          display: block; width: 100%; height: 1.5px;
          background: var(--ink);
          transition: transform .3s, opacity .3s;
          transform-origin: center;
        }
        .burger.open span:nth-child(1) { transform: translateY(6.5px) rotate(45deg); }
        .burger.open span:nth-child(2) { opacity: 0; }
        .burger.open span:nth-child(3) { transform: translateY(-6.5px) rotate(-45deg); }

        .nav-cta-desktop { display: flex; }

        .mobile-menu {
          display: none;
          position: fixed;
          inset: 0;
          z-index: 300;
          background: var(--white);
          flex-direction: column;
          padding: 6rem 6vw 3rem;
          overflow-y: auto;
        }
        .mobile-menu.open { display: flex; }
        .mobile-menu-links {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0;
          flex: 1;
        }
        .mobile-menu-links li {
          border-bottom: 1px solid var(--line);
        }
        .mobile-menu-links a {
          display: block;
          padding: 1.2rem 0;
          font-family: var(--serif);
          font-size: 1.6rem;
          font-weight: 700;
          color: var(--ink);
          text-decoration: none;
          letter-spacing: -.01em;
          transition: color .2s;
        }
        .mobile-menu-links a:hover { color: var(--gold); }
        .mobile-menu-links li:last-child a { color: var(--gold); }

        @media (max-width: 1050px) {
          .burger { display: flex; }
          .nav-links { display: none !important; }
          .nav-cta-desktop { display: none !important; }
        }
      `}</style>

      <nav id="nav">
        <Link href="/" className="logo" onClick={close}>Юлия <span>Соколова</span></Link>

        {/* desktop links */}
        <ul className="nav-links">
          {links.map(l => (
            <li key={l.href}><a href={l.href}>{l.label}</a></li>
          ))}
        </ul>

        {/* desktop CTA */}
        <a href={anchor('#contact')} className="nav-cta nav-cta-desktop">Записаться</a>

        {/* burger button */}
        <button
          className={`burger${open ? ' open' : ''}`}
          onClick={() => setOpen(o => !o)}
          aria-label="Меню"
        >
          <span /><span /><span />
        </button>
      </nav>

      {/* mobile fullscreen menu */}
      <div className={`mobile-menu${open ? ' open' : ''}`}>
        <ul className="mobile-menu-links">
          {links.map(l => (
            <li key={l.href}>
              <a href={l.href} onClick={close}>{l.label}</a>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
