# History Lab — Stage 5.3C.3 · E02 Hub + M2 Egypt Pilot

**Date:** 2026-10-27  
**Status:** **PROTOTYPE CREATED · STATIC QA PASS · BROWSER QA PENDING**  
**Branch:** `development/stage-5.3`  
**Production freeze:** `main` and tag `v1.1` at `3b4ae3f0b512c3926fa267be1b3131fbc7939ef4`  
**Learning Design:** `docs/stage-5.3C.2-E02-complete-learning-design.md`

## Delivered files

- `section2/revision-practicum.html` — independent E02 learning hub with five module tiles (M1, M2, M3, M4, X). **M2 is the only active module**; others are accurately marked as being developed, with no broken placeholder links.
- `section2/revision-practicum-m2.html` — working pilot for **M2 «Давній Єгипет: природа, влада, культура»**, seven questions from §§20–24 (plus optional comparative reference to §12).
- Both reuse the local, pre-existing History Lab CSS assets, typography, icon and hero systems, institutional logo and footer. Their additional styling is scoped to `hlp-prototype` and only inside the new HTML files. No global stylesheet was changed.
- Both pages carry `noindex,nofollow`, have **not** been linked from the Section II public index, and do **not** appear as active sitemap URLs.
- M2 reuses three historical images and licensed source citations from §§21, 23 and 24: Khafre statue, Nakht agricultural scene and an Egyptian papyrus. Attribution/links should be checked visually in browser.

## Learning interactions

Seven exercise types/answers (exactly from Stage 5.3C.2 learning design):
- M2.01 single answer **Б**.
- M2.02 three matching pairs **1–А, 2–Б, 3–В**.
- M2.03 single answer **Б**.
- M2.04 two selections **А + В**.
- M2.05 single answer **Б**.
- M2.06 research-step sequence **4 → 2 → 1 → 3**, controlled by accessible ↑/↓ buttons, no mandatory drag/drop.
- M2.07 single answer **Б**.

The page contains explanations, correction hints, direct paragraph review links, full and partial reset of the module (the latter preserves free-text reflection), a separate manually assessed reflection field, correct/incorrect feedback, accessible focus/labels and an aria-live status region. Score is **0–7 for formative self-check**, not an official grade.

## Static verification completed

1. Both files present in `development/stage-5.3`.
2. Inline JavaScript compiles in a syntax check.
3. Seven M2 task objects parse from embedded JSON; answer keys match Learning Design.
4. Four M1/M2/M3/M4 tiles plus X tile exist, with only M2 actionable.
5. Both pages retain `noindex,nofollow`.
6. All **5** relative HTML links enumerated across hub and module resolve to existing Section II file names.
7. Original `section2/index.html` retains **26/26** `.topic-card` lesson cards.
8. Original `main` and `v1.1` Git refs remain at the frozen baseline.

**Limits:** This is source and static QA, **not** a full automated DOM test of all event handlers and **not** a real Microsoft Edge test. No end-to-end function, accessibility or visual sign-off is yet claimed.

## Required Stage 5.3C.3 browser QA

1. Download ZIP of `development/stage-5.3` and open `section2/revision-practicum.html` in Edge from the extracted folder.
2. Verify M2 tile leads to `revision-practicum-m2.html`; M1/M3/M4/X have no dead or misdirected links.
3. Verify three illustrations load with source/license credits, full widths and no distortion.
4. Verify all **seven** questions, correct score **7/7**, wrong feedback, retry after editing, incomplete answer guard (two-choice item requires exactly 2), and repeat check without duplicate scoring.
5. Test move ↑/↓ buttons, disabled first/last controls and keyboard focus.
6. Test reset button for task answers only, and global reset including reflection.
7. Verify return navigation (M2 → Hub → Section II), paragraph links and `file://` compatibility.
8. Check responsive 1280, 768, 390, 360 px and zoom 200%; no text clipping, extra sideways scroll or unintended balanced title wrapping; mouse, keyboard Tab/Enter/Space.
9. Check DevTools Console for errors and separately inspect external Wikimedia image loading.
10. Keep integration into the Section II index, sitemap activation and public deployment **out of scope** until later approvals.

## Gate decision

**Stage 5.3C.3 — PROTOTYPE COMPLETE · STATIC QA PASS · MANUAL BROWSER SIGN-OFF PENDING.**  
Proceed with browser review, not yet M1/M3/M4/X implementation. Production History Lab v1.1 unchanged.
