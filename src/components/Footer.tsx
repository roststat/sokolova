export default function Footer() {
  return (
    <footer>
      <a href="#" className="f-logo">Юлия <span>Соколова</span></a>
      <ul className="f-links">
        <li><a href="/#about">О мне</a></li>
        <li><a href="/#services">Услуги</a></li>
        <li><a href="/#howto">Как задать вопрос</a></li>
        <li><a href="/#testimonials">Отзывы</a></li>
        <li><a href="/#contact">Контакты</a></li>
        <li><a href="/bazi">Калькулятор Бацзы</a></li>
      </ul>
      <div className="f-copy">
        <a href="mailto:b-yulia20@yandex.ru">b-yulia20@yandex.ru</a>
        <span> · </span>© 2025 Юлия Соколова
      </div>
    </footer>
  );
}
