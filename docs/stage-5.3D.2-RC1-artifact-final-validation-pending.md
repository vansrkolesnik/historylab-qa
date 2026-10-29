# History Lab — Stage 5.3D.2 · RC1 Artifact Final Validation

**Date:** 2026-10-29
**Status:** **ARCHIVE EXTRACTION + LOCAL SHA-256 RECORDED · EXACT GIT CONTENT MATCH PENDING**

## Verified evidence so far

- Immutable RC1 code commit: `ba5079701ddddceac07014fcad91d5ae61481712`.
- Official GitHub API recursive Git tree at this commit: **246 Git blobs**, **not truncated**, no symlinks.
- Local Windows ZIP filename: `history-lab-RC1.zip.zip`.
- User-reported PowerShell ZIP SHA-256: **`026E213D193CD1B299960C54EB0850AE9B0BFFA12424E94C606DA369630A9798`**.
- Local ZIP inventory: **246 regular files + 11 directory entries = 257 total**.
- User-reported `tar.exe -xf`: **PASS**, extracted **246 files**.
- RC1 static QA: **44/44 PASS**; browser QA: **9/9 owner-attested PASS**, documented in `stage-5.3D.2-RC1-final-browser-QA-signoff.md`.
- Production `main` and tag `v1.1` remain at `3b4ae3f0b512c3926fa267be1b3131fbc7939ef4`; no production deploy.

## What is not yet verified

Screenshots of the checksum, counts and extraction do **not** establish that each of the ZIP's 246 file contents matches its expected frozen Git blob at `ba5079701...`.

The original downloaded ZIP bytes have **not** been uploaded for independent SHA-256 recomputation, nor has a successful file-by-file Git blob comparison report been provided.

**No Artifact Final Sign-off can be issued on this evidence alone.**

## Exact source-comparison procedure without Git/Python

A Windows PowerShell validator was prepared in the current ChatGPT conversation: `HistoryLab-RC1-Verify-Exact-Commit.ps1`. It:
1. Hashes the local ZIP with SHA-256 and compares to the user-recorded value above.
2. Downloads the full 246-blob Git tree for the **immutable commit** directly from official GitHub's REST API (the network must be accessible).
3. Iterates all non-directory ZIP entries and computes the real Git object ID as **SHA-1(ASCII('blob ' + uncompressed byte length) + NUL + uncompressed bytes)**.
4. Compares path and Git blob SHA for all **246/246** files; rejects duplicates, missing or extra entries.
5. Writes `Downloads\history-lab-RC1-exact-commit-verification.json` with PASS/FAIL, hashes, counts and mismatches.

**Owner action:** run this validator locally and submit its JSON plus output, **or attach the original RC1 ZIP** to ChatGPT for independent verification. Do not enter a passing status in the report unless the script actually finishes and prints `PASS`.

The new verifier script was created in ChatGPT's file environment; its PowerShell execution on the owner's Windows PC has **not yet** occurred.

## Decision boundary

- **RC1 Browser QA:** CLOSED · PASS (owner attestation).
- **RC1 ZIP extraction + local checksum:** PASS / RECORDED (owner evidence).
- **RC1 exact file/commit content match:** **PENDING**.
- **Overall Stage 5.3D.2 Artifact Final Validation:** **IN PROGRESS — NO FINAL ARTIFACT SIGN-OFF**.
- **Release decision:** **HOLD**. No merge, deployment, tag rewrite, sitemap change or production update.
