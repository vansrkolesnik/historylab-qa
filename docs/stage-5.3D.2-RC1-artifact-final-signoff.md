# History Lab — Stage 5.3D.2 · RC1 ARTIFACT FINAL SIGN-OFF

**Date:** 2026-10-29  
**Decision:** **COMPLETE · PASS · ACCEPTED — ARTIFACT GATE CLOSED**  
**Frozen RC1 code:** `ba5079701ddddceac07014fcad91d5ae61481712`  
**Branch holding release documentation:** `release/stage-5.3-rc1` (HEAD includes docs after code freeze)  
**Production baseline:** `main` and `v1.1` = `3b4ae3f0b512c3926fa267be1b3131fbc7939ef4`; not changed.

## Evidence and provenance

The project owner uploaded a JSON report generated on their Windows PC by `HistoryLab-RC1-Verify-Exact-Commit.ps1` and supplied a screenshot of the passing PowerShell terminal. The assistant inspected the uploaded JSON and the script, and re-confirmed the immutable RC Git tree has 246 files. This is **owner-run, source-matching evidence**; the ZIP itself has not been uploaded, so the assistant has not independently hashed the ZIP bytes.

**Preserved evidence:** `docs/stage-5.3D.2-RC1-exact-commit-verification-evidence.json`.

| Check | Owner-verified result |
|---|---|
| Verification report verdict | **PASS** |
| Frozen commit matched | `ba5079701ddddceac07014fcad91d5ae61481712` |
| Local archive | `history-lab-RC1.zip.zip` |
| SHA-256 of local ZIP | `026E213D193CD1B299960C54EB0850AE9B0BFFA12424E94C606DA369630A9798` |
| ZIP hash same as earlier PowerShell screenshot | **true** |
| Regular file count | **246 / 246** |
| Directory records | **11** |
| Git blob SHA-1 hashes of uncompressed contents | **246 / 246 exact matches** |
| Mismatches or errors | **none** |
| Verification time reported by script (UTC) | `2026-10-29T18:40:32.0475749Z` |

The validator compares Git object hashes for every uncompressed file against the official GitHub API recursive tree of the pinned commit, including file paths, and rejects missing, extra or duplicated regular files. This is stronger than checking archive entry counts or extraction alone.

**Scope limit:** This acceptance is based on the owner-run validator and JSON evidence rather than independent receipt of the actual ZIP bytes. The supplied ZIP SHA-256 specifically identifies the owner's downloaded GitHub archive, not any other repacked ZIP.

## Browser QA and consolidated decision

Prior sign-off `docs/stage-5.3D.2-RC1-final-browser-QA-signoff.md` accepted **9/9 Microsoft Edge scenarios** on the frozen RC1, owner-confirmed, and prior source static QA passed **44/44**.

**Stage 5.3D.2 — RC1 BROWSER QA: COMPLETE · PASS.**  
**Stage 5.3D.2 — RC1 ARTIFACT VALIDATION: COMPLETE · PASS.**  
**Stage 5.3D.2 — FINAL OVERALL: COMPLETE · PASS · CLOSED.**

## Release decision boundary

This document is **not production deployment authorization**. No merge into `main`, tag mutation or creation, Netlify deployment, production smoke test or public SEO verification was conducted. Continue with a separate **Stage 5.3D.3 — Release Go/No-Go Readiness Review**, including rollback, Netlify credits, planned new version/tag, public HTTP checks and an explicit owner GO before deployment.
