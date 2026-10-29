# History Lab — Stage 5.3D.2 · RC1 Browser Regression & Release Artifact Validation

**Date:** 2026-10-29
**Status:** **SOURCE / STATIC QA PASS · ARCHIVE & REAL BROWSER QA PENDING**
**Frozen RC code commit:** `ba5079701ddddceac07014fcad91d5ae61481712`.
**RC branch:** `release/stage-5.3-rc1` (branch HEAD also has documentation-only commit).
**Production:** `main` and `v1.1` remain at `3b4ae3f0b512c3926fa267be1b3131fbc7939ef4`, no deployment.

## 1. Independent frozen-commit static QA

The GitHub source files and complete recursive Git tree were read using **the immutable RC commit SHA**, not branch HEAD. **44/44 source/static assertions PASS, no confirmed errors.**

- Seven learning pages are indexable at release candidate source level, canonical URLs agree with OG URLs, and no old noindex remains.
- Exercise JavaScript compiles; all 35 E02 question IDs remain unique with module counts **8/7/8/8/4**. E01 is also present.
- E01 and E02 index pages have working practicum links, exactly **9 and 26** original lesson cards, respectively, with **6** Section II filter groups.
- E02 Hub contains five active module paths, all of which exist in the repository.
- `sitemap.xml` lists **71 distinct URLs**, containing all seven new learning pages.
- `robots.txt` allows public crawling and names the sitemap.
- Local relative HTML/resource references examined in the seven learner pages correspond to files in the immutable Git tree.
- Git tree is complete (`truncated=false`) and contains **246 blob files** at this commit.

**Limit:** Checking source link paths does not verify external HTTP availability, or screenshots / actual rendering.

## 2. Browser environment and artifact blockage

A local Chromium executable was found, but **the frozen RC GitHub ZIP could not be fetched** in the container: HTTPS requests to GitHub failed due to name resolution / network isolation. The available local archives are from **v1.1** and do not contain the Stage 5.3 RC candidate. Therefore a browser run against those older files would be invalid evidence and was **not substituted**.

Result:
- Microsoft Edge full real-browser regression on frozen RC: **NOT RUN**.
- Chromium viewport / 200%-zoom screenshots of frozen RC: **NOT RUN**.
- An exact ZIP of `ba5079701...` in the local container: **NOT VERIFIED**.
- SHA-256 of the full release ZIP: **NOT AVAILABLE — DO NOT INVENT**.
- No GitHub release, Netlify preview or production deploy was performed.

Git commit SHA and Git blob hashes are verifiable identifiers; they are **not** SHA-256 of a ZIP archive.

## 3. Required owner Edge regression scenarios

Extract the *complete* GitHub ZIP for immutable commit `ba5079701ddddceac07014fcad91d5ae61481712` (not a differently timed HEAD snapshot), open `section1/index.html` and `section2/index.html` via local `file://` in Microsoft Edge.

| ID | Manual acceptance check | Expected |
|---|---|---|
| RC-EDGE-01 | Section I index → E01 and back | Entry separate from nine lessons, 16 exercises work |
| RC-EDGE-02 | Section II index → E02 Hub → M1/M2/M3/M4/X | All five destinations and back paths work, filters still affect 26 lesson cards only |
| RC-EDGE-03 | E02 module scoring and reset | M1 8/8, M2 7/7, M3 8/8, M4 8/8, X 4/4; all incorrect/incomplete states and hints work |
| RC-EDGE-04 | Keyboard navigation and visible focus | Tab, Shift+Tab, Enter, Space and ↑/↓ controls; no keyboard traps |
| RC-EDGE-05 | Responsive at 1280, 768, 390, 360 px | No viewport horizontal scroll, clipped labels, broken hero or overlapping CTA |
| RC-EDGE-06 | Browser zoom 200% | All index/practicum layouts and form controls usable |
| RC-EDGE-07 | Media credits and institution | Images and attribution rendered, institution footer intact |
| RC-EDGE-08 | DevTools Console, local links and browser Back/Forward | No new JavaScript exceptions, navigation and file paths work |
| RC-EDGE-09 | Source-level SEO payload in RC files | No noindex, consistent canonical/OG/JSON-LD, sitemap 71 URLs (NOT HTTP 200 certification) |

**Owner must explicitly attest pass/fail; any failure requires a scoped RC2 fix plus repeat QA.**

## 4. Artifact validation protocol

On a local computer with Git and Python (or PowerShell), obtain the exact `ba5079701...` snapshot, exclude `.git`, create a deterministic ZIP (sorted relative paths, fixed ZIP timestamps and permissions, no ephemeral files), and calculate a SHA-256 of that *specific ZIP file*. Record:
- exact commit SHA;
- ZIP file name, byte size, SHA-256;
- archive file count and test that ZIP can be read without CRC errors;
- critical paths: `index.html`, `section1/index.html`, `section2/index.html`, seven new practice pages, `robots.txt`, `sitemap.xml` and `_redirects`;
- QA evidence / screenshots from the same candidate and the tester's Edge version.

Any change in archive contents or compression changes the SHA-256; never treat an unrelated archive's checksum as valid for this one.

## 5. Gate

**Stage 5.3D.2 source/static check: COMPLETE · 44/44 PASS.**
**Stage 5.3D.2 final RC browser and release archive sign-off: PENDING**, for lack of actual frozen RC ZIP + user-performed browser acceptance and file checksum.

**Production `main`, tag `v1.1`, and Netlify: UNCHANGED. No GO for release.**
