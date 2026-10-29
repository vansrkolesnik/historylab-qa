# History Lab — Stage 5.3C.4.3 · M4 India & China Implementation QA

**Date:** 2026-10-29  
**Status:** **IMPLEMENTED · STATIC QA PASS · MICROSOFT EDGE BROWSER QA PENDING**  
**Development branch:** `development/stage-5.3`  
**Production baseline:** `main` and tag `v1.1` = `3b4ae3f0b512c3926fa267be1b3131fbc7939ef4`.

## Delivered

- `section2/revision-practicum-m4.html` — eight learning tasks M4.01–M4.08 for §§30–35 from the previously prepared Stage 5.3C.2 learning design, plus a comparative question linked to §20.
- Four exercise types: one answer, two answers, matching and ordered historical-research steps. Includes keys, explanations, hints, article links, score out of eight, feedback, independent full/partial reset and optional written reflection.
- Six illustration blocks from existing History Lab lessons §§30–35, with their existing source and license citations: Great Bath at Mohenjo-daro; Painted Grey Ware; Lion Capital of Ashoka; Shang bronze ding; Qin Terracotta Army; Shang oracle bone.
- A scoped lesson-like design with mobile breakpoints, regular question heading wrapping and accessible button alternatives to drag-and-drop. Shared CSS and runtime files unchanged.
- Updated `section2/revision-practicum.html` so all **M1–M4** cards are actionable, while **X** still displays `У розробці` and does not lead to an empty page.

## Source QA — PASS

- 8 unique M4 task IDs and all expected keys match the Learning Design: `[[0,2],[0,1,2],1,[0,1,2],1,[3,1,0,2],[0,2],1]`.
- JavaScript syntax check PASS.
- Six credited illustrations in source; source/license links copied from corresponding lessons.
- Hub contains exactly five module tiles; four are active and link to M1/M2/M3/M4, X remains inactive. CSS text also includes the activation class name; tile count was correctly measured from the HTML cards, not a raw substring count.
- Existing M1 SHA `d37f05cb12abe30a4e94e841271556b2190c591d`, M2 SHA `060fdaa29030af326d4f4f9a7f6615edf312e4a6`, M3 SHA `05debbb775243ae4b1df90b8f4be825f212146b9` remain unchanged.
- Section II index still contains exactly 26 existing lesson cards; sitemap has 64 active `<loc>` entries; all new E02 pages remain `noindex,nofollow`.
- M4 content makes no claim that Harappan inscriptions have been deciphered.

## Required manual Edge acceptance

1. Download the complete development ZIP; navigate E02 Hub → M4 → E02 Hub → Section II via local `file://`.
2. Confirm six images load with correct crop, alt and readable license captions.
3. Answer eight questions correctly and verify **8/8**; also try wrong selections and confirm proper hints/review links.
4. Confirm matching tasks M4.02 and M4.04; the two-answer questions M4.01/M4.07 accept exactly two answers.
5. Verify ordering task M4.06 is **4 → 2 → 1 → 3**, and arrow buttons work using keyboard, with boundary-disabled state and visible focus.
6. Confirm incomplete match/two-choice blocks checking; changes after checking invalidate the previous result, and repeated checks do not double-count.
7. Check partial reset preserves reflection, full reset clears it.
8. Check keyboard Tab/Shift+Tab/Enter/Space, focus visibility, status messages and no traps.
9. Test 1280/768/390/360 px layouts and zoom at 200%; look for overflow, clipped control text, distorted sources and premature balanced heading wraps.
10. Test M1, M2, M3 Hub links and check Edge Console; distinguish remote Wikimedia loading conditions from source errors.

**Limit:** This is post-commit static/source validation, not a full Edge visual/functional test. No owner sign-off yet for M4; M1 and M3 also retain their separate manual Edge gates.

## Disposition

**Stage 5.3C.4.3 — CODE COMPLETE · STATIC PASS · BROWSER SIGN-OFF PENDING.**  
Next build stage: **Stage 5.3C.4.4 — X Cross-Civilization Summary (4 tasks)**. Whole-E02 browser regression remains Stage 5.3C.4.5. No production merge/deployment authorization.
