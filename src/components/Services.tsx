export default function Services() {
  return (
    <section className="section" id="services">
      <div className="section-inner">
        <div className="services-header">
          <div>
            <div className="section-label" data-n="02">Услуги</div>
            <h2>С чем я работаю</h2>
          </div>
          <p className="services-note">Онлайн и офлайн (Москва). Запись через мессенджер или почту.</p>
        </div>

        <div className="services-grid reveal">
          <div className="service-card">
            <span className="service-glyph">八字</span>
            <div className="service-name">Консультация по Бацзы</div>
            <p className="service-desc">Разбор карты рождения: предназначение, профессия, сильные стороны, личность. Анализ судьбы и прогнозы по годам.</p>
            <div className="service-footer">
              <div className="service-price">от 5 000 ₽</div>
              <div className="service-format">90 мин · Zoom / Офлайн</div>
            </div>
          </div>

          <div className="service-card">
            <span className="service-glyph">奇門</span>
            <div className="service-name">Расклад Цимень</div>
            <p className="service-desc">На любую ситуацию: отношения, бизнес, партнёрство, сделки с недвижимостью, найм, поездки, здоровье и другое.</p>
            <div className="service-footer">
              <div className="service-price">от 3 500 ₽</div>
              <div className="service-format">60 мин · Zoom / Офлайн</div>
            </div>
          </div>

          <div className="service-card">
            <span className="service-glyph">擇日</span>
            <div className="service-name">Выбор даты</div>
            <p className="service-desc">Подбор благоприятного дня для любого события: свадьба, переезд, открытие бизнеса, подписание договора, операция.</p>
            <div className="service-footer">
              <div className="service-price">от 2 500 ₽</div>
              <div className="service-format">Письменно / 45 мин</div>
            </div>
          </div>

          <div className="service-card">
            <span className="service-glyph">風水</span>
            <div className="service-name">Аудит по Фэн Шуй</div>
            <p className="service-desc">Анализ жилья или офиса. Активация секторов здоровья, достатка, отношений. Конкретный план работы с пространством.</p>
            <div className="service-footer">
              <div className="service-price">от 7 000 ₽</div>
              <div className="service-format">По плану · Онлайн / Выезд</div>
            </div>
          </div>

          <div className="service-card">
            <span className="service-glyph">活化</span>
            <div className="service-name">Активизации по Цимень</div>
            <p className="service-desc">Подбор направлений, времени и маршрутов для активизации нужных энергий: удача, деньги, отношения, здоровье, карьера.</p>
            <div className="service-footer">
              <div className="service-price">от 2 000 ₽</div>
              <div className="service-format">Письменно / Онлайн</div>
            </div>
          </div>

          <div className="service-card dark">
            <div className="service-name">Не знаете,<br />с чего начать?</div>
            <p className="service-desc">Напишите — вместе разберёмся, какой формат подойдёт для вашего запроса.</p>
            <div style={{ marginTop: 'auto', paddingTop: '2rem' }}>
              <a href="#contact" className="btn-primary" style={{ display: 'inline-block', fontSize: '.8rem', padding: '.9rem 1.8rem' }}>Написать</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
