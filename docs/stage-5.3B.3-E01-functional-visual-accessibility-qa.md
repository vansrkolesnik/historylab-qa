# History Lab — Stage 5.3B.3 · Functional, Visual & Accessibility QA

**Date:** 2026-10-26  
**Branch:** `development/stage-5.3`  
**Prototype:** `section1/revision-practicum.html`  
**Source commit under test:** `4517b22d2d3b5ac974a58990b385510ced728db6`  
**Frozen production baseline:** `3b4ae3f0b512c3926fa267be1b3131fbc7939ef4` (`main` and `v1.1`)  
**Overall status:** **PARTIAL PASS — BROWSER VISUAL / ACCESSIBILITY SIGN-OFF PENDING**

## A. Scope and test environment

- The prototype HTML/JS was fetched directly from the GitHub development branch through the connected GitHub interface.
- Shared stylesheet, JavaScript, favicon and logo paths were confirmed to exist in the archived v1.1 production build.
- Inline JavaScript syntax passed V8 compilation.
- A scripted DOM mock executed the prototype's *actual inline JavaScript* and drove the core handlers using simulated UI element nodes.
- Real browser rendering of the *complete prototype* was **not** available in the current verification environment, because GitHub's source was available only through the connector, while the local browser workspace could not download the page. Therefore the tests must not be misrepresented as Microsoft Edge or Chromium end-to-end browser QA.
- Color contrast of manually sampled explicit foreground/background CSS pairs was checked by WCAG relative luminance calculation, not by complete computed-style or image-based analysis.
- No source changes or deployment occurred as part of these checks.

## B. Behavioral unit/integration checks: 21/21 PASS in simulated DOM

1. Four block data sets load.
2. All 16 task cards are instantiated.
3. Chronology activity exposes 8 move buttons (up/down for 4 cards).
4. Pressing an order control swaps adjacent items.
5. Reset restores the original order.
6. Correct answers B1 result in 2/2.
7. Correct answers B2 result in 4/4.
8. Correct answers B3 result in 4/4.
9. Correct answers B4 result in 6/6.
10. The cumulative completed score is 16/16.
11. The completed state is shown after all four blocks.
12. Deliberately incorrect answers B1 result in 0/2.
13. Deliberately incorrect answers B2 result in 0/4.
14. Deliberately incorrect answers B3 result in 0/4.
15. Deliberately incorrect answers B4 result in 0/6.
16. The cumulative incorrect score is 0/16.
17. The review area includes four targeted revision recommendations.
18. An individual reset clears its own block without clearing an independently checked block.
19. Editing an answer invalidates the former score for that block.
20. Incomplete tasks block scoring.
21. Global reset clears all four scores.

**Limit:** These checks confirm handler and scoring logic against simulated DOM behavior. They do not prove native browser focus behavior, styling, pointer/touch interaction or screen-reader announcements.

## C. Static markup & accessibility presence checks: 21/21 PASS

Confirmed: `lang=uk`, viewport, unique `main` and `h1`, skip link, `alt` on all four images (three artifacts plus institution logo), headings for all four sections, non-submitting task buttons, dynamic `aria-live` feedback, aria-live score status, :focus-visible outline, prefers-reduced-motion, mobile breakpoint rules, noindex on prototype, no external JS CDN, no localStorage/sessionStorage/IndexedDB, no personal data form, copyright/license captions for three museum/reconstruction illustrations, four reset controls and four check controls.

Sample calculated CSS contrast:
- White text `#fff` on the primary orange `#b45309`: **5.02:1**.
- Main choice text `#f1f5f9` on choice background `#203048`: **12.15:1**.
- Muted paragraph text `#a9b9d0` on panel background `#141f30`: **8.31:1**.

**Limit:** CSS ratio checks are static samples. Actual computed colors can differ through global style cascade, backgrounds, opacity and browser/platform rendering.

## D. Shared assets and links

The v1.1 archive contains the referenced:
- `favicon.ico`;
- `assets/tailwind-local/tw-09-section1-09-midno-kamianyi-vik.css`;
- `assets/historylab-v842.css`;
- `assets/historylab-typography.css`;
- `assets/historylab-v842.js`;
- `assets/institution/kharkiv-lyceum-99.gif`;
- the referenced Section I lesson file names `01`–`09`.

**Pending:** live network loading of the three Wikimedia images, exact attribution/license URLs, actual CSS rendering of the new page, possible cross-effects from shared script, and the page's `file://` interaction.

## E. Mandatory manual browser gate (not yet completed)

Open extracted **development branch** as one complete folder in **Microsoft Edge**; open `section1/revision-practicum.html` (not the production website). Perform and record:

### E1 · Interactions
- [ ] Check all 16 questions with correct answers and verify 16/16 overall.
- [ ] Check several wrong answers in all four blocks; confirm readable per-question explanation and visible correct selection.
- [ ] B1: move each chronology card with up/down buttons and verify disabled boundary buttons.
- [ ] B2: match S2/S3, inspect illustrations and credits, enter a free-text reflection; ensure text is not automatically graded.
- [ ] B3: three-row matching question with different selections; retry after corrections.
- [ ] B4: select exactly two checkboxes; 1 or 3 must not be scored, and exactly the two expected should pass.
- [ ] Confirm all four independent resets and one global reset.
- [ ] Repeatedly check the same block to verify no double-counting; changing a response should invalidate the old score.
- [ ] Ensure the practical review URLs and return links navigate correctly under `file://`.

### E2 · Accessibility
- [ ] Navigate without mouse using Tab, Shift+Tab, Enter and Space; all options and up/down buttons work.
- [ ] Visible focus never disappears; focus follows a moved chronology card or lands on an intelligible element.
- [ ] When checking, announcing updates through a screen reader should be understandable and not excessively repeated; verify with NVDA if available.
- [ ] Inputs and matching selects have usable spoken labels.
- [ ] No keyboard trap; skip-to-main works.

### E3 · Visual / responsive
- [ ] Desktop 1280 px: hero, block borders, choices, 3 image cards, summary and footer.
- [ ] Phone 390 px: no sideways page scroll; card labels, buttons and selects readable.
- [ ] Phone 360 px: matching rows, long answer options and chronology arrows fully usable.
- [ ] Tablet 768 px: no overlap and images reflow predictably.
- [ ] Zoom 200% at a suitable desktop viewport: no cropped labels, obscured controls or inaccessible navigation.
- [ ] Images S1/S2/S3 display successfully and no distorted/cropped content; license attribution and labels remain legible.
- [ ] Inspect browser Console and Network for unintended errors (external Wikimedia 429 limitations distinguished from local broken paths).

### E4 · Isolation and regression
- [ ] Prototype not reachable via production Section I index (by design).
- [ ] Existing §§1, 9 and Section I index continue to function when opened locally from the same downloaded development branch.
- [ ] All prototype tests run without editing the current production `main` or tag `v1.1`.

## F. Gate decision

**Stage 5.3B.3 — SCRIPT/STATIC QA PASS; BROWSER SIGN-OFF PENDING.**

**Do not proceed to Stage 5.3B.4 integration before the outstanding manual browser gates have been confirmed.**

No newly confirmed source defect from the automated checks. This does **not** mean that all visual or accessibility defects have been ruled out.
