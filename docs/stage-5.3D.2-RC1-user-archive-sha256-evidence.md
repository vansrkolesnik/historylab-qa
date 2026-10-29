# History Lab — Stage 5.3D.2 · User-provided RC1 archive SHA-256 evidence

**Evidence date:** 2026-10-29
**Frozen RC1 code target:** `ba5079701ddddceac07014fcad91d5ae61481712`
**Evidence source:** User screenshot of Windows PowerShell commands executed locally. These results are user-provided and not independently calculated from ZIP bytes in the assistant's container.

## Observed local file

- Windows filename: `history-lab-RC1.zip.zip`
- Windows location: `C:\Users\User\Downloads\history-lab-RC1.zip.zip`
- PowerShell command: `Get-FileHash "$env:USERPROFILE\Downloads\history-lab-RC1.zip.zip" -Algorithm SHA256 | Format-List`
- SHA-256 (64 hex digits): **`026E213D193CD1B299960C54EB0850AE9B0BFFA12424E94C606DA369630A9798`**
- `[System.IO.Compression.ZipFile]::OpenRead(...)` opened the file successfully.
- ZipArchive `Entries.Count` displayed **257**. This count includes folder/directory records, not exclusively regular files.

## Outstanding archive validation

The immutable RC Git tree has **246 blobs**, so the ZIP's 257 entries are plausible if 11 are directories, but the precise count of regular files has **not yet been confirmed**. A successful ZipArchive directory listing is not a full CRC or byte-by-byte integrity test. The GitHub-generated ZIP hash has not been independently recomputed or matched against a trusted independent checksum; therefore this evidence alone does not prove the ZIP represents the exact frozen commit.

To close the artifact gate, verify **246 non-directory entries**, the expected page and resource paths, and extraction/readability of all entries; optionally upload the ZIP for independent inspection. The separately owner-tested browser regression is also pending for frozen RC1.

## Scope boundary

This document is metadata-only in `release/stage-5.3-rc1` and **does not alter the immutable source code commit** `ba5079701ddddceac07014fcad91d5ae61481712`, nor `main`, `v1.1` or Netlify production.

**Artifact QA status: SHA-256 USER-RECORDED · ZIP DIRECTORY READ PASS · FILE COUNT/CRC/RC COMMIT MATCH PENDING.**

## Additional user-provided extraction evidence — 2026-10-29

A later screenshot of Windows PowerShell confirms the user executed `tar.exe -xf` against the local ZIP into a separate Windows temporary directory. PowerShell printed:
- **PASS: Архів розпаковано без помилок**
- **Розпаковано файлів: 246**

Earlier ZipArchive enumeration had exactly **246 non-directory entries + 11 directory entries = 257 total**. These counts now match the frozen RC1 Git tree's 246 blobs.

**Accepted gate:** directory listing / archive extraction and count verification — **PASS (owner-attested screenshot)**.

**Remaining limitations:** Successful extraction and identical counts do not cryptographically establish that each extracted file matches Git commit `ba5079701ddddceac07014fcad91d5ae61481712`. The SHA-256 is calculated for the downloaded ZIP, but no independent local-byte comparison to an authoritative immutable commit's blob inventory has yet occurred. Do not represent this as full frozen-source content validation. Manual Edge RC1 acceptance also remains PENDING.

**Production:** no merge, tag mutation or Netlify deployment.
