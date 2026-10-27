# History Lab — Stage 5.3C.3 · E02 Hub & M2 Egypt Functional and Responsive QA

**Date:** 2026-10-27  
**Status:** **DOM FUNCTIONAL PASS · STATIC/ACCESSIBILITY SOURCE PASS · BROWSER VISUAL SIGN-OFF PENDING**  
**Branch:** `development/stage-5.3`  
**Application code under test:** `d6ef8be97adafe434031cb83f297b9cd409d9009` (E02 M2 implementation; later development commits contain only QA docs).  
**Production freeze:** `main` / tag `v1.1` → `3b4ae3f0b512c3926fa267be1b3131fbc7939ef4`.  
**Files:** `section2/revision-practicum.html`, `section2/revision-practicum-m2.html`.

## 1. Test method and provenance

- The exact JavaScript `<script>` from the GitHub M2 HTML file was read and executed in a controlled, purpose-built simulated document supporting creation of DOM elements, field/value state, focus, selectors and UI event handlers.
- Assertions operated through the **actual event-handler functions registered by the source**; the test was **not** a rewrite of the answer-scoring algorithm.
- A second static pass inspected the source HTML/CSS of both pages plus `section2/index.html` and `sitemap.xml`.
- Local Chromium was available, but the current complete development ZIP/HTML could not be transferred from the GitHub-connected source to the local container: network resolution/download failed. **No claim of a real Microsoft Edge, Chromium rendering, actual image-loading or viewport screenshots is made.**
- Do not confuse a DOM mock with Playwright or browser end-to-end accessibility QA. Real responsive/zoom results remain an explicit owner browser acceptance gate.

## 2. Behavioral DOM-mock execution — 30/30 PASS

| Scenario | Result |
|---|---|
| Actual M2 JS executes without mount errors in simulated DOM | PASS |
| Seven question cards with headings and feedback created | PASS |
| Three labelled matching dropdowns created | PASS |
| Four order elements with up/down controls created | PASS |
| Boundary arrows disabled for first/last elements | PASS |
| Correct order reached through real arrow click handlers | PASS |
| Moving a card restores keyboard focus | PASS |
| Full correct answers yield **7/7** | PASS |
| All feedback revealed after checking | PASS |
| All-correct state has no remediation lesson list | PASS |
| Rechecking 7/7 does not double-count | PASS |
| Editing an answer invalidates previous result | PASS |
| Editing an answer hides obsolete feedback | PASS |
| One wrong answer produces **6/7** | PASS |
| Incorrect answer displays explanation and hint | PASS |
| Missed answer generates paragraph review links | PASS |
| Only one checked in two-answer task blocks scoring | PASS |
| Incomplete two-choice field directs focus to missing task | PASS |
| Incomplete matching task blocks scoring | PASS |
| Incomplete matching directs focus to select | PASS |
| Corrections restore **7/7** | PASS |
| Partial reset clears all checked/selected fields | PASS |
| Partial reset preserves free-text reflection | PASS |
| Partial reset removes feedback and score | PASS |
| Reset restores original ordering | PASS |
| Global reset clears reflection | PASS |
| All wrong answers produce **0/7** | PASS |
| All-wrong state displays explanations and review links | PASS |
| Hub only links to available M2, not M1/M3/M4 placeholders | PASS |

**Execution result:** **30/30 assertions PASS**, no confirmed behavioral defect. This is a development test on the source, not a browser certification.

## 3. Static structure, navigation and responsive CSS checks — 16/16 PASS

1. Exactly one `<main>` and one `<h1>` per new page.
2. Hub contains M1–M4 + X module cards.
3. Only the M2 Hub card is marked active.
4. Every local `.html` link in Hub/M2 corresponds to a file in the Section II directory.
5. Exactly one title/description each and `noindex,nofollow` on both development pages.
6. Three illustrated sources with alt text, Wikimedia attribution and CC0 1.0 source-license links in the HTML.
7. Focus-visible CSS and explicit high-contrast focus outlines present.
8. Responsive rules exist at 750 px and 520 px in both pages.
9. Module card grid has a single-column breakpoint at 730 px.
10. M2 question headings override shared `text-wrap:balance` via scoped `text-wrap:wrap!important`.
11. `role=status` / `aria-live` and explicit reflection label present.
12. Up/down controls have dynamic `aria-label` and keyboard focus logic.
13. `section2/index.html` retains exactly 26 existing lesson cards.
14. Active sitemap has exactly 64 `<loc>` URLs.
15. New E02 draft URLs do not appear as active sitemap entries.
16. Section II production index has no entry to the pilot yet.

**Result:** **16/16 static checks PASS.** Media licensing was taken from original course page credits; it has not been separately reverified against upstream Commons metadata in this gate.

## 4. Manual Microsoft Edge browser test plan — PENDING

Work on the **complete extracted ZIP of `development/stage-5.3`**; do not open source HTML snippets detached from assets.

| ID | Manual browser scenario and evidence | Acceptance condition |
|---|---|---|
| EDGE-01 | Open `section2/revision-practicum.html` via local `file://`; navigate Hub → M2 → Hub → Section II | All routes open, icon/hero/footer display correctly |
| EDGE-02 | M1/M3/M4/X visible in hub; M2 clickable | Only M2 navigates; future tiles are unmistakably `У розробці` |
| EDGE-03 | Review S1 Khafre, S2 Tomb of Nakht, S3 papyrus | Images load, are not distorted/cropped misleadingly, and attribution is readable |
| EDGE-04 | Answer all seven correctly including M2.02 matching and M2.06 chronology arrows; check | **7 із 7**, all seven have feedback, no double-scoring |
| EDGE-05 | Try wrong answers, one missing dropdown, one/three checked selections on M2.04; change answers | Wrong feedback and hints; incomplete blocks checking; result invalidated after edits |
| EDGE-06 | Use ↑/↓ for M2.06, keyboard Tab/Shift+Tab/Enter/Space, focus ring and screen-reader-friendly labels | Boundary buttons disabled, no keyboard trap, focus remains visible and predictable |
| EDGE-07 | Test partial reset with text in reflection, full reset, and re-check | Partial reset preserves reflection; full reset clears reflection, all tasks and score |
| EDGE-08 | 1280px desktop, 768px tablet, 390px phone, 360px phone | No horizontal viewport scroll, clipping, cut-off labels or overlapping buttons; full-width question titles do not balance line lengths |
| EDGE-09 | Browser zoom **200%**, keyboard and image/button layout | Full reflow, readable labels and usable controls |
| EDGE-10 | Open Edge DevTools Console; test links and external images, optionally offline `file://` to separate internal assets vs Wikimedia | No script exceptions; relative internal links function; externally hosted media status accurately recorded |

**Evidence requested for sign-off:** the project owner confirms all ten manual scenarios passed, or supplies screenshots/defect details for fixing. If images fail due to network conditions, record that explicitly rather than silently claiming PASS.

## 5. Gate decision and deployment isolation

- **Stage 5.3C.3 Functional DOM and static QA: COMPLETE · PASS.**
- **Stage 5.3C.3 Browser visual/real Edge/zoom QA: NOT VERIFIED · USER ACCEPTANCE PENDING.**
- **Stage 5.3C.3 overall:** **PARTIAL PASS — DO NOT FINAL SIGN OFF BEFORE EDGE-01–EDGE-10.**
- No code changes were necessary, because no confirmed source-level bug was detected.
- Do not implement remaining M1/M3/M4/X or link E02 into Section II's index before the M2 browser acceptance gate unless separately authorized.
- Do not merge to `main`, alter `v1.1`, activate sitemap, or deploy Netlify production without explicit release authorization.
