export default function Testimonials() {
  return (
    <section className="section" id="testimonials">
      <div className="section-inner">
        <div className="section-label" data-n="05">Отзывы</div>
        <h2>Что говорят клиенты</h2>

        <div className="testi-grid">
          <div className="testi-card reveal">
            <p className="testi-text">После консультации по Бацзы наконец поняла, почему одни решения давались легко, а другие — как в стену. Юля объяснила это так точно и системно, что стало по-настоящему легче жить.</p>
            <div className="testi-divider">
              <div className="testi-divider-line"></div>
              <div className="testi-divider-dot"></div>
              <div className="testi-divider-line"></div>
            </div>
            <div className="testi-name">Екатерина М.</div>
            <div className="testi-city">Москва</div>
          </div>

          <div className="testi-card reveal">
            <p className="testi-text">Я скептик. Но расклад Цимень на бизнес-партнёрство дал такой точный анализ и конкретный план действий, что я не мог его игнорировать. Через три месяца всё вышло именно так, как описала Юля.</p>
            <div className="testi-divider">
              <div className="testi-divider-line"></div>
              <div className="testi-divider-dot"></div>
              <div className="testi-divider-line"></div>
            </div>
            <div className="testi-name">Алексей В.</div>
            <div className="testi-city">Москва</div>
          </div>

          <div className="testi-card reveal">
            <p className="testi-text">Выбор даты для открытия бизнеса — казалось бы, мелочь. Но Юля объяснила логику так чётко, что я поняла: это не суеверие, это система. Открылись в нужный день — старт оказался мощным.</p>
            <div className="testi-divider">
              <div className="testi-divider-line"></div>
              <div className="testi-divider-dot"></div>
              <div className="testi-divider-line"></div>
            </div>
            <div className="testi-name">Марина Л.</div>
            <div className="testi-city">Санкт-Петербург</div>
          </div>
        </div>
      </div>
    </section>
  );
}
