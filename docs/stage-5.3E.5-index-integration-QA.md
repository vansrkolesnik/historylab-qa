# History Lab — Stage 5.3E.5 · Index & SEO Development QA

**Дата:** 04.11.2026  
**Статус:** **STATIC / SIMULATED CHROMIUM QA PASS; OWNER WINDOWS EDGE QA PENDING.**  
**Базовий коміт:** `8d993ab8cce27c71a2de87ea90c5562314fa872b`.

## Внесена зміна

Тільки `section3/index.html`: окрема картка «Підсумковий практикум» після §60, перед outro, **поза** `#topicsGrid`. Посилання `revision-practicum.html`, 5 модулів + X, 38 завдань. CSS ізольований, палітра тепла римська. Навчальні завдання та ключі не змінені.

## QA

- Карток параграфів: **25/25**; групи: **11/13/1** — без змін.
- Новий блок не має класу `.topic-card`, розміщений поза `#topicsGrid`, не підпорядковується фільтрам.
- Фільтри: Греція 11, Рим 13, Слов’яни 1, Усі 25 — PASS.
- Viewports **360, 390, 640, 768, 1280, 1600 px**: немає горизонтального переповнення, CTA ≥44 px, фокус доступний — PASS.
- В ізольованих Chromium-тестах із вбудованими CSS/JS нових page JS errors не знайдено.
- E03 Hub + M1–M5 + X мають `noindex,nofollow`; sitemap/robots/redirects не змінені.

## Обмеження і pending gates

В автоматизованому Chromium цього середовища прямі локальні `file://` / тестові HTTP URL заблоковані. Отже реальні переходи Index III → Hub → M1–M5/X → Hub → Index III, браузерний Edge 200%, навігація клавіатурою та Console потребують **Owner Windows Edge QA**. Не позначати final Owner PASS до підтвердження.

**Release gate:** не змінювати `main`, тег `v1.1`, RC1, Netlify, чинні production canonical/OG, `sitemap.xml`, `robots.txt`, `_redirects`. Нові E03 URL не індексувати до окремого погодження.
