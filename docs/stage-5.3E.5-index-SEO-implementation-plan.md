# History Lab — Stage 5.3E.5 · Index & SEO Integration — Development Plan

**Дата підготовки:** 04.11.2026  
**Статус:** **READY TO START AFTER GITHUB E03 INTEGRATION — NOT IMPLEMENTED**  
**Вхідна версія:** Stage 5.3E.4.2A, Owner Edge PASS 4/4; Whole E03 38/38 завдань, 7 сторінок, 6 модулів.

## Мета

Безпечно додати доступ до E03 на індексній сторінці розділу III, не змінюючи попередні 25 уроків, фільтри, E01/E02 або production SEO. Підготувати SEO-метадані до окремого release review, але не індексувати development-практикум.

## Контрольні вимоги до index

- Перевірений стан `section3/index.html` в development: **25** `.topic-card`, три фільтраційні групи **11 / 13 / 1**; E03 не має власної entry-card.
- Додати одну окрему картку/банер «Підсумковий практикум розділу III» **поза `#topicsGrid`**, після §60 і перед фінальним тематичним outro.
- Посилання тільки відносне: `href="revision-practicum.html"` — локальний Windows `file:///` і майбутня Netlify-навігація.
- На картці: **5 тематичних модулів + міжтемний підсумок X**, 38 завдань, самоперевірка, довільний порядок проходження; не писати про автоматичну шкільну оцінку за 12-бальною шкалою.
- Дотриматися римської палітри, заголовків Hero, Icon System, інституційного footer та адаптивних правил; використати E02 entry як структурний взірець, не копіюючи всі його стилі без звірки.
- Після зміни: у `#topicsGrid` рівно **25 карток**; пошук/фільтри **11/13/1**; старі URL не змінилися.

## Development SEO gate

- У всіх семи E03 HTML зберегти `<meta name="robots" content="noindex,nofollow">`.
- Не додавати E03 до production `sitemap.xml`; не змінювати `robots.txt`, `_redirects`, production canonical і Open Graph до релізного рішення.
- Підготувати окрему таблицю майбутніх canonical, OG title/description, metadata та структурованих даних для **release review**, але не активувати production indexing на development етапі.
- Метадані існуючих 64 сторінок не перезаписувати; уникнути дубльованих описів і відносних canonical до релізу.

## Критерії QA

1. **IDX-01** — Index III → E03 Hub → M1, M2, M3, M4, M5, X → Hub → Index III: всі переходи без помилок.
2. **IDX-02** — кількість карток 25 і фільтрація 11/13/1 залишилися незмінними.
3. **IDX-03** — картка практикуму не потрапляє в `.topic-card`, пошук і лічильники.
4. **IDX-04** — заголовки, контраст, відступи; 360/390/768/1280 px та реальний Edge 200%.
5. **IDX-05** — Tab, Enter, Space, aria-label/видимий фокус.
6. **SEO-01** — E03 усі 7 `noindex,nofollow`, production sitemap/robots/redirects без змін.
7. **SAFE-01** — Git diff лише дозволених development-файлів; `main`, `v1.1`, RC1 і Netlify не змінені.

## Порядок реалізації

1. Закрити попередню контрольну точку: SHA GitHub інтеграційного E03 коміту і підтверджений diff.
2. Створити development зміну `section3/index.html` у вузькому scope.
3. Провести автоматизований Static/Browser QA, потім Owner Windows Edge QA.
4. Оформити Stage 5.3E.5 Final Sign-off. Реліз, зняття `noindex` та production SEO — лише за окремим погодженням.

**Не виконано в рамках цього документа:** HTML індексу, SEO release changes, GitHub commits і Netlify deployment.
