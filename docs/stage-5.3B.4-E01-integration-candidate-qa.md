# History Lab — Stage 5.3B.4 Section I Integration Candidate

**Date:** 2026-10-27  
**Status:** INTEGRATION IMPLEMENTED · STATIC QA PASS · BROWSER INTEGRATION SIGN-OFF PENDING  
**Branch:** `development/stage-5.3`  
**Frozen production:** `main` and tag `v1.1` at `3b4ae3f0b512c3926fa267be1b3131fbc7939ef4`

## Implementation
- Added a **separate, full-width E01 revision practicum entry** to `section1/index.html`, after the existing nine lesson cards and before the Section I outro banner.
- The E01 entry is **not** a tenth lesson: existing paragraph cards remain nine, stats remain `9 тем`, existing search filters only `.topic-card`, and lesson numbering remains §§1–9.
- The distinct card uses scoped styles, a descriptive heading, four activity counts and a direct relative link to `revision-practicum.html`.
- Enriched `section1/revision-practicum.html` with a unique description, canonical, Open Graph, Twitter metadata and JSON-LD `LearningResource` plus `BreadcrumbList`.
- Kept `<meta name="robots" content="noindex,nofollow">` on the unlaunched prototype.
- Added an XML comment to `sitemap.xml` staging the future entry. **The active sitemap remains at exactly 64 URLs** until both public deployment and removal of `noindex` are authorized. This avoids advertising a currently nonexistent production URL.
- No change to existing §1–9 lesson files, shared assets, `main` or tag `v1.1`. No production deployment performed.

## Static checks
- Nine `.topic-card` cards remain.
- Exactly one new independent practicum card and exactly one link to `revision-practicum.html`.
- The paragraph search remains scoped to the nine lesson cards.
- Existing Section I outro retains position after the new card.
- The prototype contains four activity blocks and 16 question definitions.
- All 19 relative `.html` links on the prototype resolve to file names present in the Section I directory.
- JSON-LD parses as valid JSON; only one meta description; canonical and OG tags present.
- The active XML sitemap URL count remains 64 (excluding the pending XML comment).
- Prototype still declares `noindex,nofollow`.

## Browser integration checklist — pending
1. On the locally extracted development branch, open `section1/index.html`; the new card appears between nine lesson cards and the outro.
2. Verify search in the section index only filters nine paragraph cards; searching for a term must not silently hide the practicum entry.
3. Click the practicum call-to-action; verify `section1/revision-practicum.html` opens, including via `file://`.
4. From the practicum, navigate back to the index, home and the lesson links.
5. Test the new entry in Edge at 1280 / 768 / 390 / 360 px and 200% zoom, including keyboard focus on CTA.
6. Ensure no visual overflow, overlapping buttons or errors in Console.
7. Reconfirm functional blocks B1–B4 after adding metadata; ensure script unaffected.
8. Do not merge or deploy until **Stage 5.3B.5 pilot sign-off** and explicit release authorization.

## Release gate and known caveat
**Stage 5.3B.4 — STATIC INTEGRATION PASS, MANUAL BROWSER CHECK PENDING.**  
During development, the canonical URL identifies the intended future production location, not a URL currently published on Netlify. The sitemap entry is **commented out** and is deliberately not yet discoverable. When publishing a future release, enable the URL in sitemap and remove `noindex,nofollow` together after verifying deployment.
