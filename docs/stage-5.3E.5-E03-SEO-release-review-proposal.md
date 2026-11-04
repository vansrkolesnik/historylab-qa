# History Lab — Stage 5.3E.5 · SEO Release Review Proposal

**Дата:** 04.11.2026  
**Статус:** **PROPOSAL ONLY — NO PRODUCTION SEO ACTIVATION**.

Поточний стан: сім E03 HTML мають `<meta name="robots" content="noindex,nofollow">`, кожен має окремі `title` та `meta description`. У development не додавати production canonical, Open Graph або E03 URL до `sitemap.xml` без окремого release review.

## Запропоновані майбутні canonical

| Сторінка | Canonical після погодження релізу |
|---|---|
| E03 Hub | https://history-lab.netlify.app/section3/revision-practicum.html |
| M1 | https://history-lab.netlify.app/section3/revision-practicum-m1.html |
| M2 | https://history-lab.netlify.app/section3/revision-practicum-m2.html |
| M3 | https://history-lab.netlify.app/section3/revision-practicum-m3.html |
| M4 | https://history-lab.netlify.app/section3/revision-practicum-m4.html |
| M5 | https://history-lab.netlify.app/section3/revision-practicum-m5.html |
| X | https://history-lab.netlify.app/section3/revision-practicum-x.html |

## Запропоновані Open Graph теми

| Сторінка | Тема `og:title` |
|---|---|
| Hub | Практикум розділу III — Античний світ |
| M1 | Грецький світ і демократія |
| M2 | Культура, колонізація та еллінізм |
| M3 | Римська республіка |
| M4 | Римська імперія |
| M5 | Пізня Античність і ранні слов’яни |
| X | Антична спадщина |

Пропоновані `og:description` повинні бути унікальними й підтверджувати зміст кожного модуля; перед активацією перевірити OG-зображення (наявність, права, 1200×630), canonical, sitemap, robots, соціальні прев’ю й deployment. До цього часу всі E03 залишаються **noindex,nofollow**.
