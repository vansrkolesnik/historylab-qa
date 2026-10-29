# History Lab — Stage 5.3D.2 · RC1 FINAL BROWSER QA SIGN-OFF

**Дата:** 29 жовтня 2026 року  
**Browser QA verdict:** **COMPLETE · PASS · ACCEPTED · CLOSED**  
**Artifact QA verdict:** **PARTIAL PASS · INDEPENDENT ZIP VERIFICATION PENDING**  
**Production release decision:** **NOT AUTHORIZED — NO MERGE / NO DEPLOY**

## 1. Accepted, immutable source

- Repository: `vansrkolesnik/historylab-qa`.
- **Frozen RC1 code commit:** `ba5079701ddddceac07014fcad91d5ae61481712`. This is the reference for all acceptance tests and packaging, **not** the moving HEAD of the release branch.
- Release review branch: `release/stage-5.3-rc1`. Subsequent documentation commits do not change the frozen RC1 code reference.
- Production `main` and `v1.1`: `3b4ae3f0b512c3926fa267be1b3131fbc7939ef4` at sign-off; neither was changed.
- Prior verification: `docs/stage-5.3D.2-RC1-browser-and-artifact-validation.md` — **44/44 source/static assertions PASS** on the immutable RC code.

## 2. Microsoft Edge browser evidence and provenance

On **2026-10-29** the project owner explicitly stated:

> Stage 5.3D.2: підтверджую 9/9 сценаріїв RC-EDGE-01–09 на зафіксованому RC1 у Microsoft Edge. Підготуй підсумковий QA sign-off; статус ZIP SHA-256 залиш окремим, доки не надам перевірений архів і контрольну суму.

These are **owner-performed, owner-attested** Microsoft Edge results. They are accepted as project browser QA; they are **not** presented as independent Edge execution, newly generated screenshots, formal WCAG audit or production-domain testing performed by the assistant.

| ID | RC1 browser scenario | Final verdict |
|---|---|---|
| **RC-EDGE-01** | Section I index → E01; 16 E01 exercises and return navigation | **PASS** |
| **RC-EDGE-02** | Section II index → E02 Hub → five modules and return navigation | **PASS** |
| **RC-EDGE-03** | E02 module results M1 **8/8**, M2 **7/7**, M3 **8/8**, M4 **8/8**, X **4/4**; error/incomplete/reset states | **PASS** |
| **RC-EDGE-04** | Keyboard Tab/Shift+Tab/Enter/Space, ↑/↓ controls and visible focus | **PASS** |
| **RC-EDGE-05** | Responsive **1280/768/390/360 px**, no unexpected page overflow or control clipping | **PASS** |
| **RC-EDGE-06** | **200%** Edge browser zoom, legible and operable layout | **PASS** |
| **RC-EDGE-07** | Historical images, credits and institution identity | **PASS** |
| **RC-EDGE-08** | DevTools Console, local `file://` navigation and browser Back/Forward | **PASS** |
| **RC-EDGE-09** | RC1 source SEO tags, canonical/OG consistency and sitemap presentation | **PASS** |

**Total manual browser verification: 9/9 owner-confirmed PASS.** The RC1 Browser QA gate is **CLOSED**.

## 3. Separate archive/hash evidence — NOT CLOSED

Prior screenshots of the owner's local Windows PowerShell displayed:
- ZIP local filename `history-lab-RC1.zip.zip`.
- User-recorded SHA-256: `026E213D193CD1B299960C54EB0850AE9B0BFFA12424E94C606DA369630A9798`.
- `ZipFile.OpenRead()` succeeded with **257 archive entries**.
- **246 non-directory files**, **11 directory entries**.
- `tar.exe -xf` reported **PASS**, and the extracted directory contained **246 files**.

These are meaningful **owner-attested local hash/extraction checks**, described in `docs/stage-5.3D.2-RC1-user-archive-sha256-evidence.md`. However, **a ZIP with 246 files is not proven byte-for-byte identical to the 246 Git blobs at `ba5079701...`**. The assistant has not independently obtained the user's ZIP bytes and recomputed its SHA-256 or matched the files to the exact Git commit.

**Archive gate result:** Local ZIP hash **RECORDED**, extraction/file-count **PASS**; **independent hash/content-to-frozen-commit attestation PENDING**, per the owner's explicit instruction. The owner's browser sign-off does not close the archive gate.

Do **not** replace the user's observed ZIP SHA-256 with a fabricated canonical value, and do **not** sign the archive as FINAL until the exact ZIP or equivalent independently validated manifest is supplied.

## 4. Scope of accepted RC1

- Stage 5.3 includes **E01 (16 questions)**, E02 Hub, and E02 modules **M1 (8), M2 (7), M3 (8), M4 (8), X (4)**; **51 total learning exercises**.
- Section I retains **9** existing lesson cards; Section II retains **26** existing lesson cards and **6** filter categories.
- Frozen RC1 source has indexable metadata for seven new practice pages; sitemap contains **71 unique active URLs**. This is **release candidate source state only**, not an assertion that those pages are already live.
- No public Netlify deployment, production smoke test or formal accessibility certification is implied.

## 5. Final state and next gate

**Stage 5.3D.2 — FINAL BROWSER QA: COMPLETE · PASS · CLOSED.**  
**Stage 5.3D.2 — RELEASE ZIP ARTIFACT: PARTIAL PASS · EXACT COMMIT / INDEPENDENT SHA-256 MATCH PENDING.**  
**Overall RC1 release readiness: HOLD — DO NOT DEPLOY.**

The remaining practical path is:
1. Receive the exact downloaded RC1 ZIP or a trustworthy byte-level comparison manifest derived from `ba5079701...`.
2. Independently calculate SHA-256, verify archive structure and compare all files to the immutable Git tree; record artifact size, SHA-256 and ZIP/commit match as a separate **Artifact Final Sign-off**.
3. Only after explicit owner approval, prepare a separate release go/no-go decision, including a new version/tag, production deploy ID/rollback and subsequent live URL/SEO testing.

**Production `main`, `v1.1` and Netlify remain unchanged.**
