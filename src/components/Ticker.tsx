const items = [
  'Цимень Дунь Цзя',
  'Бацзы',
  'Выбор дат',
  'Фэн Шуй',
  'Прогнозы по годам',
  'Активизации',
  'Анализ судьбы',
  'Онлайн · Офлайн',
];

function TickerGroup() {
  return (
    <>
      {items.map((item, i) => (
        <span key={i}>
          <span className="ticker-item">{item}</span>
          <span className="ticker-sep">◆</span>
        </span>
      ))}
    </>
  );
}

export default function Ticker() {
  return (
    <div className="ticker">
      <div className="ticker-track">
        <TickerGroup />
        <TickerGroup />
        <TickerGroup />
        <TickerGroup />
        <TickerGroup />
        <TickerGroup />
      </div>
    </div>
  );
}
