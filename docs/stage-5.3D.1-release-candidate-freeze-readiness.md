# History Lab — Stage 5.3D.1 · Release Candidate Freeze and Publication Readiness

**Date:** 2026-10-29
**Status:** **RC SOURCE PREPARED · STATIC GATE PASS · RELEASE / DEPLOY NOT AUTHORIZED**

## Frozen source references

- **Accepted development baseline:** `development/stage-5.3` @ `90b1fe1d5c9dd656c67a14f8d721ddaa48cac998`.
- **Release candidate branch:** `release/stage-5.3-rc1`.
- **RC code freeze commit, before this report:** `ba5079701ddddceac07014fcad91d5ae61481712`. **Use this exact commit SHA as the immutable build source**, not the moving branch HEAD.
- **Production:** `main` and `v1.1` both at `3b4ae3f0b512c3926fa267be1b3131fbc7939ef4`; neither was changed. No Netlify deployment or public URLs were tested.

## Controlled release-only changes

Direct Git tree comparison with the accepted development baseline found **exactly eight changed paths, zero additions and zero deletions**:
1. `section1/revision-practicum.html` — remove development `noindex,nofollow`.
2. `section2/revision-practicum.html` — likewise.
3–7. `section2/revision-practicum-m1.html`, `-m2.html`, `-m3.html`, `-m4.html`, `-x.html` — likewise.
8. `sitemap.xml` — replace draft E01 comment, add seven active URLs.

Existing canonical and Open Graph/Twitter + JSON-LD release targets were already prepared in development. Changes do **not** touch exercise data, body markup, scripts, shared CSS, existing lesson files, institutional branding, original index lesson card counts or navigation.

## Static RC verification — 10/10 PASS

- All seven added learner-facing pages have no `noindex,nofollow`.
- Each has its own expected self-referencing canonical, Open Graph and structured-data script.
- The original `<body>` and inline exercise JavaScript match the accepted development baseline byte for byte.
- Sitemap contains **71 distinct active <loc> URLs**, including all seven new pages, up from 64.
- No duplicate sitemap addresses or leftover E01 draft comment detected.

**Limits:** This is source-level validation, not a real Chromium/Edge rendering pass of the RC branch, full XSD sitemap validation, HTTP 200 check, live robots/canonical behavior, external image retrieval or WCAG certification. The immutable archive's SHA-256 has **not** been calculated; only Git commit/blob identities are presently verified.

## Risk review and publication gate

**RC prepared does not mean production-approved.** Before any release:
1. Obtain manual Microsoft Edge QA **of the RC branch / frozen commit**, not only the development branch, at 360/390/768/1280px, 200% zoom, keyboard, hover and focus; verify E01 and E02 reset/score flows.
2. Verify `section1/index.html` and `section2/index.html` both link to their practicum, 9 and 26 lesson cards remain intact, and historical image credits render.
3. Independently validate sitemap XML, 71 canonical URL targets, `robots.txt`, redirect behavior and asset paths on the intended deployment environment; avoid public preview before explicit permission.
4. Package an exact archive from `ba5079701...` and record SHA-256 before GO.
5. Record an existing live Netlify deploy ID and reversible deployment route; keep old `main` SHA and `v1.1` tag for fallback.
6. Request separate explicit owner **GO/NO-GO** for branch merge, new release version/tag and Netlify deployment; do not reuse or rewrite `v1.1`.

## Rollback plan — only after authorized deployment

Preserve previous Netlify deployment and production Git commit. If public regression occurs, restore the previously verified Netlify deploy, and revert approved release merge using a reviewable commit if needed. Retest the existing course, 7 new pages, sitemap and both indices. Do not force-push production history.

## Decision

**Stage 5.3D.1 — RC CODE FREEZE PREPARED · STATIC PASS · RC BROWSER QA / ARCHIVE HASH / RELEASE GO PENDING.** No merge, retag or production deploy.
