# History Lab — Stage 5.3D · Release Candidate Review (AUDIT ONLY)

**Date:** 2026-10-29  
**Decision:** **REVIEW PACKET PREPARED · NOT RELEASE AUTHORIZED**  
**Production:** `main` and `v1.1` at `3b4ae3f0b512c3926fa267be1b3131fbc7939ef4`. No Netlify deploy or merge.
**E02 integration acceptance:** `docs/stage-5.3C.5-E02-final-integration-signoff.md` (owner-confirmed 6/6 post-integration Microsoft Edge checks).

## 1. Git-tree scope against production

Direct comparison of full Git trees at production `3b4ae3f0...` and the pre-signoff development integration baseline `6b93877792d4fa6904efb3e61ea72005ee7207e1` found **30 changed paths**: **27 additions**, **3 modifications**, **0 deletions**.

**Three existing files changed:** `section1/index.html`, `section2/index.html`, `sitemap.xml`.

**Seven learner-facing HTML files added:**
- `section1/revision-practicum.html` (E01; 16 questions);
- `section2/revision-practicum.html` (E02 Hub);
- `section2/revision-practicum-m1.html` (8 questions);
- `section2/revision-practicum-m2.html` (7);
- `section2/revision-practicum-m3.html` (8);
- `section2/revision-practicum-m4.html` (8);
- `section2/revision-practicum-x.html` (4).

**Twenty new docs** through integration-readiness report. The final sign-off document and this audit are later additional documentation commits; any eventual release diff must be recalculated at its approved frozen code commit.

No lessons §§1–60, shared CSS/JS, or imagery differ from production in the tree comparison.

**Caution about sitemap:** `sitemap.xml` is in the diff even though its active `<loc>` count remains **64**. Its E01 draft-publication comment must be handled in the publication review, not mistaken for a new active entry.

## 2. Development acceptance and evidence

E01: earlier E01 browser/integration approvals.
E02: 35 tasks, five functioning modules, 6/6 post-integration Microsoft Edge checks owner-confirmed, earlier 10/10 module Edge QA owner-confirmed. GitHub source QA: 26 existing Section II lesson cards; 6 regional filters, a standalone E02 index CTA; five valid Hub targets; six distinct SEO titles/descriptions, canonicals, OG/Twitter metadata, LearningResource/BreadcrumbList.
**Manual browser checks are owner's own evidence**, not independent browser execution or formal WCAG certification.

## 3. Publication gate — proposed changes only

- Decide whether E01 + E02 publish together. Prefer unified Stage 5.3 release because both are already in the same development diff.
- At **separately approved release preparation**, remove `noindex,nofollow` from **seven** newly added learner-facing pages; verify page-level SEO indexability, distinct canonicals and actual production responses. Do not change until approval.
- Activate exactly **seven** new sitemap URLs (E01 + E02 Hub + 5 modules) if all are authorized public. Expected active `<loc>` count would be **71** if existing 64 remain intact.
- Check `robots.txt`, permanent redirects, canonical aliases, Open Graph social imagery, social preview, XML validity and JSON-LD against real production URLs.
- Freeze a specific Git commit and build/archive SHA-256, verify complete assets and historical image credits, run local regression from the candidate ZIP.
- Verify branch diff, E01 and E02 navigation, keyboard/zoom, file/local Netlify behavior, and rollback procedure.
- **Do not retag or mutate `v1.1`**; if approved, publish under a new release name/version/tag. No specific version number is authorized yet.

## 4. Risk assessment

| Risk | Impact | Mitigation |
|---|---|---|
| Development HTML remains `noindex,nofollow` at public deployment | High: pages not indexed | Gate on seven SEO flags, release branch only after approval |
| Sitemap new URLs accidentally exposed before ready | Medium | Keep sitemap draft status and deploy as part of controlled release |
| Production 1.1 site changed by unapproved merge/deploy | High | Preserve `main`, `v1.1`; separate go/no-go |
| Browser asset / external image differences | Medium | Validate target release on deployed domain and local ZIP |
| Existing E01/E02 visual regression from SEO/integration | Medium | Stage 5.3C.5 owner sign-off exists; rerun after release-only changes |
| Git history differs from intended frozen artifacts | Medium | Recompute full tree diff and SHA-256 at final freeze |
| Netlify quota limitations | Medium | Avoid preview/production deploy until explicitly budgeted/authorized |

## 5. Suggested rollback

1. Before approved deployment, record the exact `main` SHA and existing published Netlify deploy identifier, plus a checksum of the release archive.
2. Publish only after user GO authorization; preserve previous live version/deploy and `v1.1` tag.
3. If production regression emerges, restore the previously working Netlify deploy and, if branch changed, revert the corresponding release merge through an explicit reviewed commit instead of rewriting history.
4. Check public URL, lessons §§1–60, old and new indexes, key quizzes, sitemap, metadata and 360px reflow after rollback.
5. Document outcome and separately reapprove a revised release candidate.

## 6. Final go/no-go checklist (not yet executed)

- [ ] Owner explicitly approves Release Candidate freeze/version.
- [ ] Release-specific SEO/noindex/sitemap edits authorized and reviewed.
- [ ] New publication URLs and metadata smoke tested on permitted environment.
- [ ] Final 360/390/768/1280px and 200% keyboard/hover regression after release-only edits.
- [ ] Final archives with SHA-256 available; dependency and attribution check complete.
- [ ] Production deployment cost/quota approved; rollback deploy ID recorded.
- [ ] Explicit owner GO for merge and production Netlify release.

**Disposition:** Stage 5.3D **AUDIT-ONLY REVIEW PACKET PREPARED · RELEASE NOT AUTHORIZED**. Next actionable stage requires owner's specific decision whether to proceed with release-candidate preparation, keeping production untouched.
