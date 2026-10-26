# History Lab — Stage 5.3B / E01: Section I Revision Practicum

**Decision:** APPROVED FOR DEVELOPMENT
**Date:** 2026-10-26
**Source decision:** Stage 5.3A — Enhancement Opportunities Assessment, initiative E01 (P1)
**Pilot coverage:** Section I, §§1–9
**Branch:** `development/stage-5.3`
**Frozen baseline:** tag `v1.1`, commit `3b4ae3f0b512c3926fa267be1b3131fbc7939ef4`
**Status:** SPECIFICATION APPROVED · IMPLEMENTATION NOT YET STARTED

## 1. Purpose and differentiation

Create one cross-lesson interactive revision practicum for Section I, rather than another standalone lesson quiz. Students should connect knowledge from the nine lessons, explain their reasoning, interpret archaeological evidence, and distinguish observation from inference.

This is an *additional* learning page. Existing lessons, quiz results, visual system, links, and lesson navigation must remain unchanged unless an integration change is separately reviewed.

## 2. Grounding in current curriculum

- §§1–3: human origins, anthropogenesis, Neanderthals / early Homo sapiens, archaeological sites.
- §4: Palaeolithic ways of life and material evidence.
- §5: Mesolithic environmental and technological change.
- §6: Neolithic transition to food production, settlements, and crafts.
- §7: social organization and evidence for reconstruction of early communities.
- §8: symbolic culture, art and the limits of interpreting artefacts.
- §9: Eneolithic; Tripillian and Serednii Stih archaeological cultures.

Historical timelines are region-dependent; avoid presenting overlapping processes as one rigid worldwide sequence. Descriptions of prehistoric beliefs and social roles must distinguish evidence from interpretation.

## 3. Four mandatory activities

### B1 — Chronology workshop
Arrange `Палеоліт → Мезоліт → Неоліт → Енеоліт` in the conventional curricular order, then answer one conceptual question about what *changed* between phases. Show concise feedback acknowledging that boundaries and transitions differ by region. Do not reduce the task to memorizing dates alone.

### B2 — Archaeological detective
Using a verified artefact or image already documented in the course (for example, pottery or stone tools), present three stages:
1. **Спостерігаю:** identify what the source visibly shows.
2. **Припускаю:** form a defensible interpretation of everyday life or technology.
3. **Не можу довести:** recognize what cannot be concluded from this source alone.
Include provenance/credit/alt text when an image is shown. Allow reasoning to be checked with an explanation/rubric; do not automatically grade unconstrained free text.

### B3 — Causes, effects, and comparisons
An integrated reasoning task linking environmental changes, tools, food acquisition/production, settlements, and social organization. At least one question must require a *reason* or evidence, not only a term. Distinguish archaeological cultures of §9 from the broader periodization of §§4–6.

### B4 — Final self-check
A short mixed-format formative self-check drawing on several distinct paragraphs, with per-question explanatory feedback, an accessible reset button and an overall completion message. Do not copy existing paragraph test questions verbatim, or imply that this is a formal school grade.

## 4. UX and technical boundaries

- **Provisional page:** `section1/revision-practicum.html` (new page; does not exist in v1.1). Exact route and visible label to be validated before integration.
- Reuse approved History Lab typography, colors, icon system, hero/heading, footer, navigation and Quiz UI patterns.
- Prefer shared `assets/historylab-v842.js` and existing exercise patterns; use isolated, page-specific additions only where required.
- No new external script/CDN or browser account. No collection of pupils' names, personal data, or persistent behavioral tracking.
- Support mouse/touch and keyboard Tab / Enter / Space, visible focus, explanatory feedback using accessible announcements, and independently functioning reset.
- Readable at 360 px / 390 px / 768 px and browser zoom 200%; no document horizontal overflow.
- Keep a clear return to `section1/`, links to referenced §§1–9, and course home.
- **SEO and routing:** when page integration is approved, add an accurate title, unique description, canonical, Open Graph, JSON-LD if appropriate, sitemap entry, and a discoverable link/card from the Section I index. Do not add premature production redirects.
- Preserve production `main` and tag `v1.1`. No Netlify production deploy from this stage.

## 5. Acceptance criteria

1. Four activities are present and meaningfully combine two or more lessons each.
2. Task wording is appropriate for grade 6 and historically defensible; explanations distinguish facts, archaeological evidence and interpretations.
3. Correct/incorrect outcomes, feedback, retries and reset are demonstrated for each interactive component.
4. Keyboard and mobile interactions pass; focus order/visibility and accessible instructions are verified.
5. Design uses existing visual language and remains readable at 360 px, 390 px, 768 px and 200% zoom.
6. New page paths, all navigation links, SEO metadata and sitemap are reviewed before a release candidate.
7. Regression checks cover the Section I index, §§1 and 9, existing quiz/flip/match behavior, and homepage links impacted by integration.
8. Only the working branch is modified; `main`, tag `v1.1` and production deployment remain untouched.

## 6. Delivery gates

- **5.3B.1 — Learning design:** final task text, explanation keys and evidence provenance.
- **5.3B.2 — Prototype:** standalone practicum page in the development branch.
- **5.3B.3 — Functional / accessibility QA:** mouse, touch, keyboard, responsive and 200% zoom.
- **5.3B.4 — Integration candidate:** Section I entry point, metadata, sitemap and selective regression.
- **5.3B.5 — Pilot sign-off:** decision to reuse the practicum pattern for Sections II and III.

**Out of scope now:** site-wide search, saved progress, teacher accounts, worldwide interactive map, modifying existing lessons en masse, and a new Netlify production deploy.

**Decision recorded:** E01 is the first approved implementation of Stage 5.3B. E02/E03 remain later priorities.