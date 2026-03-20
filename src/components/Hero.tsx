export default function Hero() {
  return (
    <section id="hero">
      <div className="hero-left">
        <div className="hero-watermark">命</div>

        <div className="hero-tag">Цимень · Бацзы · Выбор дат</div>

        <h1>
          Твоя судьба —<br />
          <em>твоя стратегия</em>
        </h1>

        <p className="hero-sub">Китайская метафизика · Более 10 лет практики</p>

        <p className="hero-desc">
          Помогаю осознанным людям разобраться в себе, выстроить стратегию жизни
          и действовать в нужное время в нужном направлении. Не магия — система.
        </p>

        <div className="hero-buttons">
          <a href="#contact" className="btn-primary">Записаться на консультацию</a>
          <a href="#services" className="btn-secondary">Об услугах</a>
        </div>

        <div className="hero-stats">
          <div>
            <span className="stat-num">10+</span>
            <span className="stat-label">Лет практики</span>
          </div>
          <div>
            <span className="stat-num">500+</span>
            <span className="stat-label">Консультаций</span>
          </div>
          <div>
            <span className="stat-num">Онлайн</span>
            <span className="stat-label">и офлайн · Москва</span>
          </div>
        </div>
      </div>

      <div className="hero-right">
        <div className="portrait-card">
          <div className="pc tl"></div><div className="pc tr"></div>
          <div className="pc bl"></div><div className="pc br"></div>

          <div className="portrait-avatar">
            <svg viewBox="0 0 40 40" fill="none">
              <circle cx="20" cy="14" r="7.5" stroke="#9E7B28" strokeWidth="1.2" />
              <path d="M4 38c0-8.8 7.2-16 16-16s16 7.2 16 16" stroke="#9E7B28" strokeWidth="1.2" />
            </svg>
          </div>
          <div className="portrait-name">Юлия Соколова</div>
          <div className="portrait-title">Мастер китайской метафизики</div>
          <div className="portrait-location">Москва · Онлайн по всему миру</div>

          <div className="portrait-divider"></div>

          <div className="portrait-quote">
            «Волшебная таблетка — это вы сами. Моя задача — помочь вам это увидеть.»
          </div>
        </div>
      </div>
    </section>
  );
}
