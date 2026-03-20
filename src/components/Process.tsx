export default function Process() {
  return (
    <section className="section" id="process">
      <div className="section-inner">
        <div className="section-label" data-n="04">Процесс</div>
        <h2>Как проходит работа</h2>

        <div className="process-grid reveal">
          <div className="process-card">
            <div className="process-num">01</div>
            <div className="process-title">Заявка</div>
            <p className="process-text">Пишете в мессенджер или на почту. Выбираем формат — онлайн или встреча в Москве.</p>
          </div>
          <div className="process-card">
            <div className="process-num">02</div>
            <div className="process-title">Подготовка</div>
            <p className="process-text">Строю карту, готовлю разбор под ваш запрос. К встрече всё уже проанализировано.</p>
          </div>
          <div className="process-card">
            <div className="process-num">03</div>
            <div className="process-title">Консультация</div>
            <p className="process-text">Разбираем карту, отвечаю на вопросы, даю конкретные рекомендации по стратегии.</p>
          </div>
          <div className="process-card">
            <div className="process-num">04</div>
            <div className="process-title">Материалы</div>
            <p className="process-text">После встречи — запись и конспект с ключевыми выводами и рекомендациями.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
