export default function Hero() {
  return (
    <section id="hero">
      <div className="hero-left">
        <div className="hero-watermark">命</div>

        <div className="hero-tag">Цимень · Бацзы · Выбор дат</div>

        <h1>Твоя судьба — <em>твоя стратегия</em></h1>

        <p className="hero-sub">Китайская метафизика · Более 10 лет практики</p>

        <p className="hero-desc">
          Помогаю осознанным людям разобраться в себе, выстроить стратегию жизни
          и действовать в нужное время в нужном направлении. Не магия — система.
        </p>

        <div className="hero-buttons">
          <a href="#contact" className="btn-primary">Записаться на консультацию</a>
          <a href="#services" className="btn-secondary">Об услугах</a>
        </div>
      </div>

      <div className="hero-stats-col">
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
    </section>
  );
}
