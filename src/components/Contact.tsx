export default function Contact() {
  return (
    <section id="contact">
      <div className="contact-inner">
        <div className="contact-label">Записаться на консультацию</div>
        <h2 className="contact-title reveal">
          Готовы строить<br /><em>свою стратегию?</em>
        </h2>
        <p className="contact-sub reveal-delay">
          Напишите мне — отвечу в течение дня. Подберём формат,
          который подойдёт для вашего запроса.
        </p>
        <div className="contact-buttons reveal">
          <a href="https://t.me/lovabazi" className="cbtn-gold">Написать в Telegram</a>
          <a href="https://wa.me/" className="cbtn-outline">WhatsApp</a>
        </div>

        <div className="contact-info">
          <div className="contact-info-item">
            <div className="ci-label">Telegram</div>
            <a href="https://t.me/lovabazi" className="ci-val">@lovabazi</a>
          </div>
<div className="contact-info-item">
            <div className="ci-label">Формат</div>
            <div className="ci-val">Онлайн · Офлайн Москва</div>
          </div>
        </div>
      </div>
    </section>
  );
}
