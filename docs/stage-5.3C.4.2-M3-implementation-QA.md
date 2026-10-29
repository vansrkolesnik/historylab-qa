# History Lab — Stage 5.3C.4.2 · M3 States, Trade & Steppe Implementation

**Date:** 2026-10-29  
**Status:** **CODE COMPLETE · STATIC QA PASS · MANUAL EDGE QA PENDING**  
**Development branch:** `development/stage-5.3`

## Scope

- Created `section2/revision-practicum-m3.html`: **8** formative tasks from the approved `docs/stage-5.3C.2-E02-complete-learning-design.md` covering §§25–29 and a comparative reference to §15.
- Interaction types: matching, single answer, exactly two choices, historical inquiry step ordering with keyboard-operable ↑/↓ buttons.
- Correct keys in task order: `[[0,1,2],[0,2],1,[2,1,0,3],1,[0,1,2],[0,2],1]`; M3.04 is **3 → 2 → 1 → 4**.
- Added correct/incorrect explanations, study links, full and partial reset, revision reflection (not automatically graded) and result calculation out of eight.
- Reused five course-sourced images with their existing attribution/license links: Ahiram sarcophagus §25, Tel Dan stele graphic §26, Hattusa Lion Gate §27, Persepolis relief §28, Tovsta Mohyla pectoral §29.
- Updated only `section2/revision-practicum.html` to activate M3 alongside M1/M2. M4 and X remain inactive without dead links.
- Existing lessons, common CSS, M1 and M2 remain untouched.

## Verification after GitHub write

**12/12 static/source checks passed:** 8 unique tasks; validated answer keys; JavaScript syntax; 5 visual-source blocks; active Hub links for M1/M2/M3; two inactive future tiles; unchanged M1 and M2 blob hashes; section II index retains 26 lesson cards; sitemap retains 64 active URLs; scoped ordinary question-heading wrapping; `noindex,nofollow` preserved.

Source file blobs: M1 `d37f05cb12abe30a4e94e841271556b2190c591d`; M2 `060fdaa29030af326d4f4f9a7f6615edf312e4a6`; M3 `05debbb775243ae4b1df90b8f4be825f212146b9`.

**Limitations:** Static checks and syntax do not establish that all interactions render correctly in Edge. No browser QA was claimed at this stage. Image licenses were copied from original lesson attributions and were not revalidated upstream. M1's existing QA remains separate and has no owner browser sign-off in this stage.

## Microsoft Edge acceptance matrix (to be performed by project owner)

1. Open extracted ZIP `section2/revision-practicum.html` in Edge: M1/M2/M3 open; M4/X remain nonclickable.
2. Open M3: five images display clearly, alt/credits/labels visible; distinguish Tel Dan graphic from a photograph.
3. Enter all correct answers: **8/8**, including M3.01 and M3.06 matching; M3.02 and M3.07 dual choice; M3.04 ordering **3→2→1→4**.
4. Test a deliberately wrong answer: explanation and lesson references appear; repeated checking does not double score.
5. Incomplete match and only one of two statements block checking and lead focus to unfinished task.
6. Change answers after result; previous result is invalidated; retry computes a new result.
7. Check ordering with keyboard arrows and buttons ↑/↓; disabled boundaries, visible focus.
8. Partial reset preserves reflection; full reset clears reflection; result is removed on reset.
9. Navigate M3 → Hub → Section II; open lesson links to §15, §§25–29 via `file://`.
10. Test Edge responsive widths **1280/768/390/360 px** and **200% zoom**, no unwanted horizontal viewport scrolling, clipping or premature balanced heading wraps.
11. Check console for script errors; note external Wikimedia loading failures separately if network conditions interfere.
12. Re-check M1/M2 Hub links after activation of M3.

## Gate

**Stage 5.3C.4.2 = IMPLEMENTED · STATIC QA PASS · REAL BROWSER QA PENDING.** The next planned implementation is **Stage 5.3C.4.3 — M4 India & China**, while M1/M3 manual Edge sign-offs should be obtained before final whole-E02 QA. No merge/deploy or production sitemap activation.
