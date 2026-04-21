export default function About() {
  return (
    <section className="section" id="about">
      <div className="section-inner">
        <div className="about-grid">

          <div className="about-image reveal">
            <img
              src="/yulia.jpg"
              alt="Юлия Соколова"
              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', display: 'block' }}
            />
            <div className="about-image-label">
              <div className="ail-name">Юлия Соколова</div>
              <div className="ail-sub">Мастер китайской метафизики</div>
            </div>
          </div>

          <div className="reveal-delay">
            <div className="section-label" data-n="01">Обо мне</div>
            <h2>Стратег,<br />а не предсказатель</h2>

            <p className="about-lead">
              Я не говорю «всё будет хорошо». Я показываю, что нужно сделать, чтобы было хорошо — и когда.
            </p>

            <p className="about-text">
              Более 10 лет я занимаюсь китайской метафизикой — Цимень Дунь Цзя, Бацзы, Фэн Шуй и выбором дат.
              Провела сотни консультаций для людей из России и других стран.
            </p>
            <p className="about-text">
              Работаю с теми, кто готов думать стратегически, брать ответственность за свои решения
              и понимать: перемены происходят через действие, а не через ожидание.
            </p>

            <div className="tags">
              <span className="tag">Цимень Дунь Цзя</span>
              <span className="tag">Бацзы</span>
              <span className="tag">Выбор дат</span>
              <span className="tag">Фэн Шуй</span>
              <span className="tag">Активизации</span>
              <span className="tag">Совместимость</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
