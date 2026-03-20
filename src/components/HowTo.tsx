export default function HowTo() {
  return (
    <section className="section" id="howto">
      <div className="section-inner">
        <div className="section-label" data-n="03">Важно</div>
        <h2>Как правильно задать вопрос</h2>

        <div className="howto-grid">
          <div className="reveal">
            <p className="howto-intro">
              От точности вопроса зависит точность расклада. Цимень работает с конкретными ситуациями — чем конкретнее вопрос, тем точнее карта показывает исходы и пути.
            </p>

            <div className="examples">
              <div className="examples-title">Примеры хорошо сформулированных вопросов</div>
              <ul className="examples-list">
                <li>Стоит ли мне принять это предложение о работе?</li>
                <li>Есть ли перспектива в отношениях с этим партнёром?</li>
                <li>Когда лучше открыть ИП или подписать договор?</li>
                <li>Стоит ли покупать эту квартиру?</li>
                <li>Как найти нужного сотрудника на эту должность?</li>
                <li>Что мешает росту дохода прямо сейчас?</li>
              </ul>
            </div>
          </div>

          <div className="reveal-delay">
            <div className="howto-steps">
              <div className="howto-step">
                <div className="howto-step-num">1</div>
                <div>
                  <div className="howto-step-title">Один вопрос — одна ситуация</div>
                  <div className="howto-step-text">Не смешивайте несколько тем. Карта раскладывается на конкретную ситуацию, а не на «всё сразу».</div>
                </div>
              </div>
              <div className="howto-step">
                <div className="howto-step-num">2</div>
                <div>
                  <div className="howto-step-title">Конкретика, а не общее</div>
                  <div className="howto-step-text">Не «как мне стать богатым», а «стоит ли мне инвестировать в этот проект» — разница принципиальная.</div>
                </div>
              </div>
              <div className="howto-step">
                <div className="howto-step-num">3</div>
                <div>
                  <div className="howto-step-title">Реальный выбор прямо сейчас</div>
                  <div className="howto-step-text">Вопрос должен касаться конкретного выбора, который стоит перед вами сейчас — не гипотетического.</div>
                </div>
              </div>
              <div className="howto-step">
                <div className="howto-step-num">4</div>
                <div>
                  <div className="howto-step-title">Будьте готовы действовать</div>
                  <div className="howto-step-text">Расклад показывает направление. Результат зависит от ваших решений — карта лишь освещает путь.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
