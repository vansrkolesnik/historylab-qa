# History Lab — Stage 5.3C.4.5 · Whole E02 Functional, Browser, Responsive & Accessibility Regression QA

**Date:** 2026-10-29  
**State:** **FUNCTIONAL DOM PASS · SOURCE/STATIC PASS · REAL EDGE BROWSER ACCEPTANCE PENDING**  
**Branch:** `development/stage-5.3`  
**Production freeze:** `main` and tag `v1.1` = `3b4ae3f0b512c3926fa267be1b3131fbc7939ef4`.

## 1. Scope and provenance

Examined the exact five E02 module HTML files from the development GitHub branch plus `section2/revision-practicum.html`, `section2/index.html` and `sitemap.xml`.

- `M1`: 8 exercises; `M2`: 7; `M3`: 8; `M4`: 8; `X`: 4. **35 unique exercise IDs total**.
- All five Hub cards have working targets and link to the corresponding file.
- Original section II index remains at 26 topic cards. Sitemap has 64 active URLs and does not publicly advertise new E02 material.
- All E02 draft pages retain `noindex,nofollow`.

**Test provenance:** The actual JavaScript from each page was executed in an instrumented DOM simulation with event/click handling, checked state, form selects and focus. This is **not Microsoft Edge or Chromium end-to-end execution**. The locally available Chromium executable and v1.1 production archive do not independently supply the current E02 development HTML: GitHub download from the local test container failed due to network isolation. No screenshots or verified CSS reflow of the current E02 files are claimed.

## 2. Functional QA findings

The first test harness produced **119/123 green assertions**. Investigation split four apparent failures:
- **One confirmed M1 wording defect:** after reset, M1 said «Підсумок з’явиться після перевірки семи завдань», even though M1 has eight. Fixed **only this one exact string**, changing «семи» to «восьми», in `section2/revision-practicum-m1.html`. GitHub fix commit **`6341aaad1155ff5039ad539895e3d48acee967c2`**; resulting file blob `a550b337b74d44a1c3fb3ee5d9d829d5e29b1b41`.
- **Three harness expectation errors**, not site defects: incomplete-two-choice tests in M1/M2/M3 assumed focus should move immediately to the two-choice task, but preceding questions were still unfilled, and the application correctly focuses the **first incomplete question** in document order. These three inappropriate expectations were removed from acceptance accounting. Remaining behavior assertions were green.
- Follow-up source-level re-read verified correct reset wording in **all five modules**, all five score maxima, and all expected lesson-reference mappings.

**Final reconciled functional result: 120/120 applicable assertions PASS** (119 passing initial assertions + 1 fixed message; 3 invalid test assumptions excluded). This does not mean 120 different independent UI flows were executed in a browser.

Tested functional cases span: script mounting and question rendering; matching and two-answer selection; historical inquiry order/disabled arrow boundaries where present; full correct scores 8/8, 7/7, 8/8, 8/8, 4/4; repeated checks; editing invalidation and hidden old feedback; one wrong answer and remediation; incomplete answer prevention; partial and full reset and optional reflection behavior.

**Reference link verification:** 200 checks against both source and review link maps found **0 unresolved lesson links** (some checks repeat the same links due to shared reference use in multiple question contexts).

## 3. Source QA and accessibility implementation

PASS by code inspection, **not by assistive technology/browser certification**:
- Question data unique across modules; keys and explanations already reviewed in each earlier module stage.
- Focusable conventional form controls, descriptive matching dropdown labels, keyboard-operable ↑/↓ ordering buttons with disabled boundary state.
- `aria-live` result/status areas, in-page skip link, `<main>` and heading structure.
- Scoped CSS with `text-wrap:wrap!important` for question titles and declared mobile breakpoints.
- Source alt text, captions and license links copied from existing course pages.
- No obligatory drag-and-drop, no cross-module lock or personal-data tracking.

No automated axe/WCAG audit, actual screen reader, 200% zoom or visual overflow measurement of the E02 branch was performed. Accessibility at runtime remains to be owner-confirmed.

## 4. Manual Microsoft Edge gate — ten scenarios, PENDING

Open the **complete extracted ZIP of `development/stage-5.3`** in Microsoft Edge by opening `section2/revision-practicum.html` locally.

| Gate | Scenario | Required result |
|---|---|---|
| **E02-EDGE-01** | Hub → M1/M2/M3/M4/X and reverse paths | 5 working modules, no broken link and return to Section II |
| **E02-EDGE-02** | M1 (8 tasks) | 8/8, order **2→1→4→3**, matching/dual choice, reset says eight tasks |
| **E02-EDGE-03** | M2 (7 tasks) | 7/7, accepted prototype stays intact |
| **E02-EDGE-04** | M3 (8 tasks) | 8/8, order **3→2→1→4**, matching/dual choice |
| **E02-EDGE-05** | M4 (8 tasks) | 8/8, order **4→2→1→3**, matching/dual choice |
| **E02-EDGE-06** | X summary (4 tasks) | 4/4, four matching pairs in X.02, X works without prior M1–M4 completion |
| **E02-EDGE-07** | Wrong/incomplete inputs, rechecking and resets | Correct feedback/hints; partial reset preserves reflection, full clears it |
| **E02-EDGE-08** | Keyboard Tab/Shift+Tab/Enter/Space, arrow buttons, visible focus | No traps, boundary arrows disabled, focus targets appropriate |
| **E02-EDGE-09** | 1280/768/390/360 px and 200% browser zoom | No viewport horizontal scroll, clipping, unintended text balancing or control overlap |
| **E02-EDGE-10** | All licensed images, caption readability, Console and `file://` internal links | Images load or network issues recorded; no JS console errors; local navigation works |

**Evidence needed:** project owner states pass/fail for ten manual scenarios, with screenshots or exact defects for any failure. Do not issue overall final QA sign-off until this gate.

## 5. Protection of production

- Only a one-line scoped M1 text change was required; other modules remain byte-identical.
- No changes to existing §§1–60, shared CSS, `section2/index.html`, sitemap or released Netlify production.
- Do not change `main` / `v1.1`, index integrations, robots or sitemap, and do not deploy production without separate explicit approval.

## 6. Decision and next step

**Stage 5.3C.4.5 — FUNCTIONAL + SOURCE REGRESSION COMPLETE · PASS; REAL EDGE BROWSER/RESPONSIVE/ACCESSIBILITY ACCEPTANCE PENDING.**  
After owner verification of E02-EDGE-01–10, record **Stage 5.3C.4.5 Final Browser QA Sign-off** and then plan **Stage 5.3C.5 — E02 Integration Candidate & SEO/Navigation Readiness**, still without production deployment.
