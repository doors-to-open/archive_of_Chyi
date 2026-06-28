# Concert Setlist Recovery Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Link concert setlist entries to song ids, move per-song clips from concert-level to performance-level, and remove redundant `knownConcerts`/`knownMusicShows` backrefs — using in-repo evidence first, then tour-clustered research for the rest.

**Architecture:** `concerts.json` remains the source of truth; `liveRecordsForSong` in `src/lib/archive.ts` already derives song live records from `concert.setlist`. No song-level performance cache is introduced. No `SongPerformance` schema change this cycle (confidence model deferred).

**Tech Stack:** Node.js ESM scripts (`scripts/*.mjs`), Astro build (`npm run check` / `npm run build`), existing data validator (`scripts/validate-release-data.mjs`). No test framework is installed and none is added — the validator and build are the test gates, matching the existing project pattern.

## Global Constraints

- Do **not** add `confidence` / `sources` / `evidenceNotes` fields to `SongPerformance` this cycle.
- Do **not** modify `archiveStatistics()` this cycle.
- Do **not** create new song ids in Phase 2. Add aliases to existing songs when a title variant is missing (identity metadata only).
- A setlist entry may have `song: null` when the title is visible but no secure match exists; never invent a song id.
- Preserve medleys/組曲 as `song: null` entries with `titlePerformed` set to the medley title.
- Rehosting copyrighted media is forbidden — store metadata and external links only.
- Every task ends with `npm run validate:releases` green (and `npm run check` + `npm run build` green where the task touches code/data the build reads).
- Commits follow the repo style: short imperative subject, no `Co-authored-by`.

## File Structure

- `data/concerts.json` — modified in Phases 1 (no), 2, 4; primary data target.
- `data/songs.json` — modified in Phase 1 (remove backrefs) and Phase 2 (add `夢` alias to `song-meng`).
- `src/lib/archive.ts` — modified in Phase 1 (remove `knownConcerts`/`knownMusicShows` from `Song` type).
- `scripts/validate-release-data.mjs` — modified in Phase 1 (delete backref check) and Phase 5 (add warn-only duplicate-URL + concert-level song-named-clip checks).
- `scripts/seed-setlists-from-clips.mjs` — **created** in Phase 2; declarative transformation script with `--dry-run` and apply modes.
- `scripts/audit-concerts.mjs` — **created** in Phase 5; emits the audit table for the change report.
- `docs/superpowers/specs/2026-06-28-setlist-recovery-design.md` — the spec; read-only reference for this plan.

---

## Task 1: Phase 1 — Remove `knownConcerts` / `knownMusicShows` backrefs

**Files:**
- Modify: `src/lib/archive.ts:46-47`
- Modify: `data/songs.json` (all 282 entries)
- Modify: `scripts/validate-release-data.mjs:277-290`

**Interfaces:**
- Consumes: the existing `Song` type and the existing bidirectional backref validator.
- Produces: `Song` type without `knownConcerts`/`knownMusicShows`; validator no longer enforces backrefs; `liveRecordsForSong` unchanged and still the derivation source.

- [ ] **Step 1: Verify baseline is green**

Run:
```bash
npm run validate:releases
```
Expected: `Release data validation passed for 32 releases and 14 appearances.` (exit 0).

- [ ] **Step 2: Remove the two fields from the `Song` type**

In `src/lib/archive.ts`, delete lines 46-47 (the `knownConcerts` and `knownMusicShows` fields):

Old:
```ts
  firstKnownRelease?: string;
  relatedReleases: string[];
  knownConcerts: string[];
  knownMusicShows: string[];
  mediaLinks: string[];
```
New:
```ts
  firstKnownRelease?: string;
  relatedReleases: string[];
  mediaLinks: string[];
```

- [ ] **Step 3: Strip the fields from every song in `data/songs.json`**

Create and run a one-off strip script (do not commit it — run inline):

```bash
node -e "const fs=require('fs'); const p='data/songs.json'; const j=JSON.parse(fs.readFileSync(p,'utf8').replace(/^\uFEFF/,'')); let n=0; for(const s of j){ if('knownConcerts' in s){delete s.knownConcerts; n++;} if('knownMusicShows' in s){delete s.knownMusicShows; n++;} } fs.writeFileSync(p, JSON.stringify(j,null,2)+'\n','utf8'); console.log('removed '+n+' field instances across '+j.length+' songs');"
```
Expected: `removed <N> field instances across 282 songs` where N ≈ 81 + 34 = 115 (only songs that had the fields count).

- [ ] **Step 4: Delete the bidirectional backref check from the validator**

In `scripts/validate-release-data.mjs`, delete lines 277-290 — the block under the comment `// song.knownConcerts backref: ...`:

Old:
```js
// song.knownConcerts backref: any concert setlist referencing a song should appear in that song's knownConcerts
const songToConcerts = new Map();
for (const song of songs) songToConcerts.set(song.id, new Set(song.knownConcerts || []));
for (const concert of concerts) {
  for (const entry of concert.setlist || []) {
    const ids = [entry.song, ...(entry.songParts || [])].filter(Boolean);
    for (const songId of ids) {
      const refs = songToConcerts.get(songId);
      if (refs && !refs.has(concert.id)) {
        addError(`Concert ${concert.id} performs song ${songId} but song.knownConcerts does not list ${concert.id}`);
      }
    }
  }
}
```
New: (delete the whole block — leave the preceding `}` from the concert loop and the following `// Mirror check:` comment intact).

- [ ] **Step 5: Run validate, check, build**

Run:
```bash
npm run validate:releases
```
Expected: `Release data validation passed for 32 releases and 14 appearances.` (exit 0) — no backref errors.

Run:
```bash
npm run check
```
Expected: exit 0 (no TS errors from the removed `Song` fields — nothing in `archive.ts` reads them).

Run:
```bash
npm run build
```
Expected: build succeeds; song pages still render (they use `liveRecordsForSong`, which is untouched).

- [ ] **Step 6: Commit**

```bash
git add src/lib/archive.ts data/songs.json scripts/validate-release-data.mjs
git commit -m "Remove knownConcerts/knownMusicShows backrefs from songs"
```

---

## Task 2: Phase 2 — Seed setlists from in-repo clip labels

**Files:**
- Create: `scripts/seed-setlists-from-clips.mjs`
- Modify: `data/concerts.json` (9 target concerts)
- Modify: `data/songs.json` (add `夢` alias to `song-meng`)

**Interfaces:**
- Consumes: `data/concerts.json`, `data/songs.json`, and the curated `TARGETS` table below (the human-reviewed mapping of clip URL → song id / `titlePerformed`).
- Produces: 9 concerts move from `clips-only` (empty setlist) to `partial-setlist`; named per-song clips relocate from `concert.mediaLinks` to `setlist[].mediaLinks`; generic clips (full recordings, official short clips, Youku album leads) stay at concert level.

**Curation rules applied to build `TARGETS`:**
- A clip whose label names exactly one song that exists in `songs.json` → setlist entry with that `song` id; clip moves.
- A clip whose label names a medley/組曲/联唱 → setlist entry with `song: null` and `titlePerformed` set to the medley title; clip moves.
- A clip whose label names a song not yet in `songs.json` (e.g. 菩提樹, 愛的代價, HOME 家) → setlist entry with `song: null`; clip moves. (These become Phase 3 research targets.)
- A clip that is a full/partial concert recording, a generic "Official short clip", "Encore clip", "Song compilation", or an album/evidence lead → stays at concert level.
- Multiple clips for the same `titlePerformed` in the same concert share one setlist entry (multiple `mediaLinks`).

- [ ] **Step 1: Add the `夢` alias to `song-meng`**

The chishang clip label is `夢 clip` (Traditional); `song-meng.titleOriginal` is `梦` (Simplified) and its `aliases` is empty. Add the Traditional form so present and future matching works.

In `data/songs.json`, find `song-meng` and change:
```json
  "aliases": [],
```
to:
```json
  "aliases": ["夢"],
```

- [ ] **Step 2: Create the seed script with the full `TARGETS` table**

Create `scripts/seed-setlists-from-clips.mjs` with this complete content:

```js
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const concertsPath = path.join(root, "data/concerts.json");
const dryRun = process.argv.includes("--dry-run");

function readJson(p) {
  const t = fs.readFileSync(p, "utf8");
  return JSON.parse(t.charCodeAt(0) === 0xfeff ? t.slice(1) : t);
}
function writeJson(p, data) {
  fs.writeFileSync(p, JSON.stringify(data, null, 2) + "\n", "utf8");
}

// Each entry: { clipUrl, songId (string|null), titlePerformed }.
// Entries sharing the same (songId, titlePerformed) collapse into one setlist entry
// with multiple mediaLinks, in the order they appear below.
const TARGETS = {
  "concert-chishang-autumn-harvest-2019-taitung": [
    { clipUrl: "https://www.youtube.com/watch?v=kGaSifEcs1U", songId: "song-olive-tree", titlePerformed: "橄欖樹" },
    { clipUrl: "https://www.bilibili.com/video/BV1NE411q78K/", songId: "song-boat-song", titlePerformed: "船歌" },
    { clipUrl: "https://www.bilibili.com/video/BV1jE411q7Gd/", songId: "song-daylight-avenue", titlePerformed: "一條日光大道" },
    { clipUrl: "https://www.bilibili.com/video/BV1jE411q7SN/", songId: "song-zui-ai", titlePerformed: "最愛" },
    { clipUrl: "https://www.bilibili.com/video/BV1PE411q7oY/", songId: "song-walking-in-the-rain", titlePerformed: "走在雨中" },
    { clipUrl: "https://www.bilibili.com/video/BV1LE411q7kv/", songId: "song-amazing-grace", titlePerformed: "Amazing Grace" },
    { clipUrl: "https://www.bilibili.com/video/BV14E411q7z8/", songId: "song-amazing-grace", titlePerformed: "Amazing Grace" },
    { clipUrl: "https://www.bilibili.com/video/BV1NE411q7SC/", songId: "song-dream-field", titlePerformed: "夢田" },
    { clipUrl: "https://www.bilibili.com/video/BV1jE411q7MT/", songId: "song-meng", titlePerformed: "夢" },
    { clipUrl: "https://www.bilibili.com/video/BV1jE411q7nq/", songId: null, titlePerformed: "民歌組曲" }
  ],
  "concert-olive-tree-2014-taipei": [
    { clipUrl: "https://www.bilibili.com/video/BV13u411r7Vg/?p=1", songId: "song-olive-tree", titlePerformed: "橄欖樹" },
    { clipUrl: "https://www.youtube.com/watch?v=npaDlC3Bd58", songId: "song-olive-tree", titlePerformed: "橄欖樹" },
    { clipUrl: "https://www.bilibili.com/video/BV13u411r7Vg/?p=2", songId: "song-cheng-li-de-yue-guang", titlePerformed: "城裡的月光" },
    { clipUrl: "https://www.youtube.com/watch?v=KFgWE-EVJo0", songId: "song-cheng-li-de-yue-guang", titlePerformed: "城裡的月光" },
    { clipUrl: "https://www.bilibili.com/video/BV13u411r7Vg/?p=3", songId: "song-angel", titlePerformed: "Angel" },
    { clipUrl: "https://www.youtube.com/watch?v=KZUWBaVza-0", songId: "song-angel", titlePerformed: "Angel" }
  ],
  "concert-olive-tree-2014-singapore": [
    { clipUrl: "https://www.youtube.com/watch?v=frPJQ8DER5E", songId: null, titlePerformed: "民歌組曲" },
    { clipUrl: "https://www.bilibili.com/video/BV1tx411Q77d", songId: null, titlePerformed: "民歌組曲" },
    { clipUrl: "https://www.youtube.com/watch?v=qUoE8U1d9K4", songId: null, titlePerformed: "百樂門組曲" },
    { clipUrl: "https://www.bilibili.com/video/BV1tx411Q7Ef", songId: null, titlePerformed: "百樂門組曲" },
    { clipUrl: "https://www.youtube.com/watch?v=b5dR_H9zyKw", songId: null, titlePerformed: "菩提樹" }
  ],
  "concert-huai-nian-charity-2015-singapore": [
    { clipUrl: "https://www.youtube.com/watch?v=oZ5RmcL9T_U", songId: null, titlePerformed: "HOME 家" },
    { clipUrl: "https://www.bilibili.com/video/BV1Nb411W7d1", songId: null, titlePerformed: "HOME 家" },
    { clipUrl: "https://www.youtube.com/watch?v=Vps_DnxfCDw", songId: "song-how-great-thou-art", titlePerformed: "How Great Thou Art" },
    { clipUrl: "https://www.youtube.com/watch?v=Uhj1biJzKNc", songId: "song-olive-tree", titlePerformed: "橄欖樹" },
    { clipUrl: "https://www.youtube.com/watch?v=Fm8kGypX-wE", songId: null, titlePerformed: "愛的代價" },
    { clipUrl: "https://www.youtube.com/watch?v=LEacDUi3UiE", songId: "song-olive-tree", titlePerformed: "橄欖樹" },
    { clipUrl: "https://www.youtube.com/watch?v=SYm5cL6oBJs", songId: "song-walking-in-the-rain", titlePerformed: "走在雨中" }
  ],
  "concert-chuan-yue-yu-jian-2017-genting": [
    { clipUrl: "https://www.bilibili.com/video/BV1UC411J7wE", songId: "song-you-raise-me-up", titlePerformed: "You Raise Me Up" },
    { clipUrl: "https://www.bilibili.com/video/BV1qN411W7GJ", songId: "song-you-raise-me-up", titlePerformed: "You Raise Me Up" },
    { clipUrl: "https://www.youtube.com/watch?v=e2eSpk2OwtQ", songId: "song-flying-bird-and-fish", titlePerformed: "飛鳥與魚" }
  ],
  "concert-yong-heng-de-xing-2025-taipei": [
    { clipUrl: "https://www.youtube.com/watch?v=2k-7qLDuGLs", songId: "song-dream-field", titlePerformed: "夢田" },
    { clipUrl: "https://www.youtube.com/watch?v=94uOgD-nVVo", songId: "song-da-ji-xiang-tian-nu-zhou", titlePerformed: "大吉祥天女咒" }
  ],
  "concert-fenghua-charity-2018-taipei": [
    { clipUrl: "https://www.youtube.com/watch?v=zek7TbZ7Kv8", songId: null, titlePerformed: "民歌联唱" }
  ],
  "concert-echo-2019-guangzhou": [
    { clipUrl: "https://www.xiaohongshu.com/explore/6975a4e8000000", songId: "song-feng", titlePerformed: "風" }
  ],
  "concert-zhen-qing-nian-lun-2004-shanghai": [
    { clipUrl: "https://www.youtube.com/watch?v=TAV8K7k23Io", songId: "song-only-you", titlePerformed: "有一個人" }
  ]
};

const concerts = readJson(concertsPath);
const moved = [];
const errors = [];

for (const [concertId, entries] of Object.entries(TARGETS)) {
  const concert = concerts.find((c) => c.id === concertId);
  if (!concert) { errors.push(`concert not found: ${concertId}`); continue; }
  if (concert.setlist && concert.setlist.length) {
    errors.push(`concert ${concertId} already has a setlist; skipping`);
    continue;
  }

  // Group entries by (songId, titlePerformed) to collapse shared clips into one setlist entry.
  const groups = new Map();
  let order = 0;
  for (const e of entries) {
    const key = `${e.songId || "null"}::${e.titlePerformed}`;
    if (!groups.has(key)) groups.set(key, { songId: e.songId, titlePerformed: e.titlePerformed, clipUrls: [], order: order++ });
    groups.get(key).clipUrls.push(e.clipUrl);
  }

  const newSetlist = [];
  const removedClipUrls = new Set();
  for (const [, g] of [...groups.entries()].sort((a, b) => a[1].order - b[1].order)) {
    const mediaLinks = [];
    for (const url of g.clipUrls) {
      const idx = (concert.mediaLinks || []).findIndex((l) => l.url === url);
      if (idx === -1) { errors.push(`${concertId}: clip not found at concert level: ${url}`); continue; }
      mediaLinks.push(concert.mediaLinks[idx]);
      removedClipUrls.add(url);
    }
    if (!mediaLinks.length) continue;
    newSetlist.push({
      position: newSetlist.length + 1,
      song: g.songId,
      titlePerformed: g.titlePerformed,
      collaborators: [],
      mediaLinks
    });
  }
  concert.setlist = newSetlist;
  concert.mediaLinks = (concert.mediaLinks || []).filter((l) => !removedClipUrls.has(l.url));
  moved.push({ concertId, entries: newSetlist.length, clipsMoved: removedClipUrls.size, clipsRemaining: concert.mediaLinks.length });
}

if (errors.length) {
  console.error("Seed script errors:");
  for (const e of errors) console.error("  - " + e);
  process.exit(1);
}

console.log(`Seed plan (${dryRun ? "dry-run" : "apply"}):`);
for (const m of moved) {
  console.log(`  ${m.concertId}: ${m.entries} setlist entries, ${m.clipsMoved} clips moved, ${m.clipsRemaining} clips remain at concert level`);
}

if (!dryRun) {
  writeJson(concertsPath, concerts);
  console.log("Wrote data/concerts.json");
} else {
  console.log("(dry-run: no files written)");
}
```

- [ ] **Step 3: Run dry-run and review**

Run:
```bash
node scripts/seed-setlists-from-clips.mjs --dry-run
```
Expected output (exact):
```
Seed plan (dry-run):
  concert-chishang-autumn-harvest-2019-taitung: 9 setlist entries, 10 clips moved, 2 clips remain at concert level
  concert-olive-tree-2014-taipei: 3 setlist entries, 6 clips moved, 1 clips remain at concert level
  concert-olive-tree-2014-singapore: 3 setlist entries, 5 clips moved, 0 clips remain at concert level
  concert-huai-nian-charity-2015-singapore: 5 setlist entries, 7 clips moved, 0 clips remain at concert level
  concert-chuan-yue-yu-jian-2017-genting: 2 setlist entries, 3 clips moved, 4 clips remain at concert level
  concert-yong-heng-de-xing-2025-taipei: 2 setlist entries, 2 clips moved, 1 clips remain at concert level
  concert-fenghua-charity-2018-taipei: 1 setlist entries, 1 clips moved, 3 clips remain at concert level
  concert-echo-2019-guangzhou: 1 setlist entries, 1 clips moved, 3 clips remain at concert level
  concert-zhen-qing-nian-lun-2004-shanghai: 1 setlist entries, 1 clips moved, 3 clips remain at concert level
(dry-run: no files written)
```
If any line shows 0 clips moved or an error, stop and reconcile the `TARGETS` table against `data/concerts.json` before proceeding.

- [ ] **Step 4: Apply the seed**

Run:
```bash
node scripts/seed-setlists-from-clips.mjs
```
Expected: same summary lines as dry-run, ending with `Wrote data/concerts.json`.

- [ ] **Step 5: Validate and build**

Run:
```bash
npm run validate:releases
```
Expected: `Release data validation passed for 32 releases and 14 appearances.` (exit 0). The validator's existing live-linkage detector will fire if any `song: null` entry's `titlePerformed` matches a song record — the medley titles (民歌組曲, 百樂門組曲, 民歌联唱) and unmatched titles (菩提樹, 愛的代價, HOME 家) do **not** match any song record, so no errors are expected. If an error appears, a title unexpectedly matched a song id — add that song id to the `TARGETS` entry and re-run from Step 3.

Run:
```bash
npm run build
```
Expected: build succeeds; the 9 concerts now show setlist entries on their pages.

- [ ] **Step 6: Commit**

```bash
git add scripts/seed-setlists-from-clips.mjs data/concerts.json data/songs.json
git commit -m "Seed partial setlists from in-repo clip labels"
```

---

## Task 3: Phase 4 — Close existing-setlist null gaps

**Files:**
- Modify: `data/concerts.json` (`concert-tian-shi-yu-lang-2008-beijing`, one entry only)

**Interfaces:**
- Consumes: the 4 `song: null` entries in already-setlisted concerts identified during research.
- Produces: one entry linked (`我愿意` → `song-wo-yuan-yi`); three entries intentionally left `song: null` with `notes` justifying each.

Research findings for the 4 null entries across already-setlisted concerts:
- `concert-unheard-of-chyi-2002-hong-kong` position 1 `titlePerformed: "Opening"` — non-song segment. **Leave `song: null`.** No edit needed (no `notes` required; "Opening" is self-evidently non-song per spec §7 rule 6).
- `concert-tian-shi-yu-lang-2008-beijing` position 7 `titlePerformed: "其实都是一样"` — no match in `songs.json`; this is a Chyi Chin duet piece not in the Chyi Yu song catalogue. **Leave `song: null`.** Add a `notes` field explaining.
- `concert-tian-shi-yu-lang-2008-beijing` position 9 `titlePerformed: "星 + 答案"` — already has `songParts: ["song-xing", "song-answer"]`; `song: null` is correct for a medley (the parts are linked). **Leave `song: null`.** No edit.
- `concert-tian-shi-yu-lang-2008-beijing` position 15 `titlePerformed: "橄榄树 + 狼"` — already has `songParts: ["song-olive-tree"]` and a `notes` field; `song: null` is correct for a medley with a guest's portion unmodelled. **Leave `song: null`.** No edit.
- `concert-tian-shi-yu-lang-2008-beijing` position 16 `titlePerformed: "我愿意"` — matches `song-wo-yuan-yi` (titleOriginal `我願意`). **Link it.**

- [ ] **Step 1: Link `我愿意` and annotate `其实都是一样`**

In `data/concerts.json`, find `concert-tian-shi-yu-lang-2008-beijing`. Edit position 7 and position 16:

Position 7 — old:
```json
{
  "position": 7,
  "song": null,
  "titlePerformed": "其实都是一样",
  "collaborators": [
    "person-chi-chin"
  ]
}
```
New (add `notes`):
```json
{
  "position": 7,
  "song": null,
  "titlePerformed": "其实都是一样",
  "collaborators": [
    "person-chi-chin"
  ],
  "notes": "Chyi Chin duet piece; not in the Chyi Yu song catalogue, so left unlinked."
}
```

Position 16 — old:
```json
{
  "position": 16,
  "song": null,
  "titlePerformed": "我愿意",
  "collaborators": [],
  "notes": "Encore."
}
```
New:
```json
{
  "position": 16,
  "song": "song-wo-yuan-yi",
  "titlePerformed": "我愿意",
  "collaborators": [],
  "notes": "Encore."
}
```

- [ ] **Step 2: Validate and build**

Run:
```bash
npm run validate:releases
```
Expected: pass (exit 0). The live-linkage detector will not flag `其实都是一样` (no song match) or the medleys (they have `songParts`).

Run:
```bash
npm run build
```
Expected: build succeeds.

- [ ] **Step 3: Commit**

```bash
git add data/concerts.json
git commit -m "Link 我愿意 and annotate unlinked tian-shi-yu-lang entries"
```

---

## Task 4: Phase 5 — Extend the validator (warn-only duplicate URLs, refined concert-clip check)

**Files:**
- Modify: `scripts/validate-release-data.mjs`

**Interfaces:**
- Consumes: the existing `concerts` array and `validateLinks` helper.
- Produces: two new checks that do **not** break the current build (both warn-only), keeping Phase 5 honest over time.

**Design note (from research):** The current data intentionally attaches one multi-song "guest segment" clip to multiple setlist entries (14 such duplicates exist in `concert-grace-still-chengdu-2025` and others). A strict "no duplicate URLs" error rule would break the build on legitimate data. Therefore the duplicate-URL check is **warn-only**, scoped per-concert. The "concert-level clip naming a song" check only flags when the named song's setlist entry does **not** already have that clip (or an equivalent same-URL clip) attached — so the legitimate "context clip also attached to performances" pattern is not flagged.

- [ ] **Step 1: Add the two warn-only checks**

In `scripts/validate-release-data.mjs`, find the existing concert loop ending around line 275 (the `}` closing `for (const concert of concerts)` after the `guests` check). Insert this block **inside** that concert loop, before its closing `}` (after the guests check):

```js
  // Warn-only: duplicate media URLs within a single concert are usually legitimate
  // (a multi-song guest segment shared across setlist entries), so warn rather than error.
  const concertUrls = [
    ...(concert.mediaLinks || []).map((l) => l.url),
    ...(concert.setlist || []).flatMap((e) => (e.mediaLinks || []).map((l) => l.url))
  ];
  const urlCounts = new Map();
  for (const u of concertUrls) urlCounts.set(u, (urlCounts.get(u) || 0) + 1);
  for (const [u, count] of urlCounts) {
    if (count > 1) addWarning(`Concert ${concert.id} has duplicate media URL (${count}x): ${u}`);
  }

  // Warn-only: a concert-level clip whose label names a song that appears in the setlist,
  // where the matching setlist entry does not already share that URL. This catches clips
  // that should have been moved to the performance level. Legitimate context clips that
  // are also attached to the relevant setlist entry are not flagged.
  for (const link of concert.mediaLinks || []) {
    const label = (link.label || "").toLowerCase();
    for (const entry of concert.setlist || []) {
      if (!entry.song) continue;
      const tp = (entry.titlePerformed || "").toLowerCase();
      if (!tp || !label.includes(tp)) continue;
      const entryHasUrl = (entry.mediaLinks || []).some((l) => l.url === link.url);
      if (!entryHasUrl) {
        addWarning(`Concert ${concert.id} concert-level clip "${link.label}" names setlist entry "${entry.titlePerformed}" but is not attached to it; consider moving it to the performance level`);
      }
    }
  }
```

- [ ] **Step 2: Run the validator and confirm warnings (not errors)**

Run:
```bash
npm run validate:releases
```
Expected: the script prints `Warning: Concert ... has duplicate media URL ...` lines (≈14 from the existing guest-segment duplicates) and exits 0 with `Release data validation passed for 32 releases and 14 appearances.` The warnings do not change the exit code. If an `error` appears, the warn-only contract was broken — fix and re-run.

- [ ] **Step 3: Commit**

```bash
git add scripts/validate-release-data.mjs
git commit -m "Add warn-only duplicate-URL and concert-clip naming checks"
```

---

## Task 5: Phase 5 — Audit script and final report

**Files:**
- Create: `scripts/audit-concerts.mjs`

**Interfaces:**
- Consumes: `data/concerts.json`, `data/songs.json`, `data/sources.json`.
- Produces: an audit table (printed to stdout) classifying each concert, used to write the §13 change report. Run it before Task 1 and after Task 4 to capture before/after deltas.

- [ ] **Step 1: Create the audit script**

Create `scripts/audit-concerts.mjs`:

```js
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
function readJson(p) {
  const t = fs.readFileSync(path.join(root, p), "utf8");
  return JSON.parse(t.charCodeAt(0) === 0xfeff ? t.slice(1) : t);
}

const concerts = readJson("data/concerts.json");
const songs = readJson("data/songs.json");
const sources = readJson("data/sources.json");
const sourceIds = new Set(sources.map((s) => s.id));

function classify(c) {
  if (!c.setlist || c.setlist.length === 0) {
    return (c.mediaLinks || []).length ? "clips-only" : "needs-research";
  }
  const allLinked = c.setlist.every((e) => e.song || (e.songParts && e.songParts.length));
  return allLinked ? "confirmed-setlist" : "partial-setlist";
}

const rows = concerts.map((c) => ({
  id: c.id,
  title: c.title,
  date: c.date || "",
  venue: c.venue || "",
  status: c.status,
  classification: classify(c),
  setlist: (c.setlist || []).length,
  linked: (c.setlist || []).filter((e) => e.song || (e.songParts && e.songParts.length)).length,
  perfClips: (c.setlist || []).reduce((n, e) => n + (e.mediaLinks ? e.mediaLinks.length : 0), 0),
  concertClips: (c.mediaLinks || []).length,
  sources: (c.sources || []).length,
  sourcesValid: (c.sources || []).every((id) => sourceIds.has(id))
}));

const totals = {
  concerts: rows.length,
  confirmedSetlist: rows.filter((r) => r.classification === "confirmed-setlist").length,
  partialSetlist: rows.filter((r) => r.classification === "partial-setlist").length,
  clipsOnly: rows.filter((r) => r.classification === "clips-only").length,
  needsResearch: rows.filter((r) => r.classification === "needs-research").length,
  linkedSongs: rows.reduce((n, r) => n + r.linked, 0),
  perfClips: rows.reduce((n, r) => n + r.perfClips, 0),
  concertClips: rows.reduce((n, r) => n + r.concertClips, 0),
  invalidSourceRefs: rows.filter((r) => !r.sourcesValid).length
};

console.log("id\tclassification\tsetlist\tlinked\tperfClips\tconcertClips\tsources\ttitle");
for (const r of rows) {
  console.log(`${r.id}\t${r.classification}\t${r.setlist}\t${r.linked}\t${r.perfClips}\t${r.concertClips}\t${r.sources}\t${r.title}`);
}
console.log("\n--- Totals ---");
console.log(JSON.stringify(totals, null, 2));
```

- [ ] **Step 2: Run the audit and capture output**

Run:
```bash
node scripts/audit-concerts.mjs > docs/superpowers/audit-after.txt 2>&1
```
Expected: a TSV table of 56 rows plus a `Totals` JSON block. The `invalidSourceRefs` field must be 0 (all source refs valid — the existing validator already enforces this).

- [ ] **Step 3: Produce the change report**

Create `docs/superpowers/setlist-recovery-change-report.md` summarising: concerts improved (the 9 from Phase 2 + 1 from Phase 4), songs linked, clips reassigned from concert-level to performance-level, sources added (none this cycle — Phase 3 research is the manual track below), unresolved items (the `song: null` entries that are genuinely non-song or awaiting research: 其实都是一样, 民歌組曲, 百樂門組曲, 民歌联唱, 菩提樹, 愛的代價, HOME 家, and the ~40 no-setlist concerts not seeded). Paste the `Totals` block from `audit-after.txt` into the report. Compare against the baseline totals captured before Task 1 (the plan author will capture the baseline by running the same script on the pre-Task-1 state — see Step 4).

- [ ] **Step 4: Capture the baseline (run once before Task 1, or reconstruct from git)**

If not already captured, run before Task 1:
```bash
node scripts/audit-concerts.mjs > docs/superpowers/audit-before.txt 2>&1
```
(The plan author runs this on the clean tree before any edits. If Tasks 1-4 are already applied, reconstruct from `git stash` or `git show HEAD~4:data/concerts.json` as needed — the exact baseline numbers are: 56 concerts, 0 confirmed-setlist (all 7 setlisted concerts have ≥1 null entry), 7 partial-setlist, 49 clips-only/needs-research, 160 linked songs, 160 perfClips, 106 concertClips.)

- [ ] **Step 5: Final verify**

Run:
```bash
npm run validate:releases
npm run check
npm run build
```
Expected: all three green. The build produces the site with the 9 newly-setlisted concerts showing clips on their song entries (via `liveRecordsForSong`).

- [ ] **Step 6: Commit**

```bash
git add scripts/audit-concerts.mjs docs/superpowers/audit-after.txt docs/superpowers/setlist-recovery-change-report.md
git commit -m "Add concert audit script and change report"
```

---

## Manual Research Track — Phase 3 (not a TDD task; runs in parallel after Task 2)

Phase 3 is human-guided research using Agent-Reach and does not fit the bite-sized TDD task format. It is tracked separately. The gate after each tour is `npm run validate:releases` green.

**Tour clusters to research (representative → siblings):**
1. **Echo/回聲 (6 dates 2018-2019):** representative `concert-echo-2018-taipei` (2 clips, 3 sources); siblings `echo-2018-beijing`, `echo-2018-wuhan`, `echo-2018-nanjing`, `echo-2019-singapore`, `echo-2019-guangzhou` (guangzhou already seeded `風` in Phase 2 — merge, don't overwrite).
2. **真愛女人 (4 dates 2011-2012):** representative `concert-zhen-ai-nv-ren-2011-wuhan` (0 clips, 2 sources) or `concert-zhen-ai-nv-ren-2011-beijing` (3 sources); siblings `2011-kunming`, `2012-macau`.
3. **Rollings Tone 30 (5 dates 2011-2012):** representative `concert-rollings-tone-30-2011-shanghai` (1 clip, 5 sources); siblings `2011-beijing`, `2011-shenzhen`, `2012-hangzhou`, `2012-chengdu`, `2012-wuhan`, `2012-guangzhou`.
4. **心幸福音樂會 (4 dates 2012-2017):** representative `concert-xin-xing-fu-2012-tainan` (1 clip, 3 sources); siblings `2013-pingdong`, `2014-taoyuan`, `2016-yilan`, `2017-taizhong`.
5. **Olive Tree 2014 (3 dates):** `concert-olive-tree-2014-taipei` and `concert-olive-tree-2014-singapore` are already Phase-2-seeded; research `concert-olive-tree-2014-guangzhou` (2 clips, 2 sources) and reconcile the three.

**Research workflow per representative:**
1. Use Agent-Reach with multilingual queries (Traditional/Simplified Chinese, English, pinyin, venue, date, BV/YouTube ids already in the data) per the spec §5.
2. For each useful source, add a record to `data/sources.json` with: `id` (`source-<platform>-<concert-slug>-<topic>`), `sourceType`, `title`, `authorOrPublisher`, `url`, `accessDate` (today's ISO date), `reliability` (`high`/`medium`/`low`/`unknown`), and `notes` explaining what the source supports.
3. Build the representative's setlist in `data/concerts.json`: link to existing `songs.json` ids where the match is secure; use `titlePerformed` + `song: null` for uncertain titles; preserve medleys via `songParts`.
4. Clone the setlist structure to sibling dates, then correct per-date differences (dropped/added songs, encores, guests). Add a `notes` field on cloned entries: `"Setlist cloned from <representative-id>; per-date corrections applied."` so a future confidence pass can treat cloned entries together.
5. Run `npm run validate:releases` after each tour. Resolve any live-linkage errors (a `song: null` title matching a song record must be linked, not left null).

**Singletons (~27 no-setlist concerts, research independently):** Prioritise those with clips > 0 (in-repo evidence) over those with 0 clips. If no setlist is recoverable, leave the concert as `clips-only` / `needs-research` — do not fabricate. The Phase 2 `song: null` entries (菩提樹, 愛的代價, HOME 家) become research targets here: if research confirms they are Chyi Yu repertoire, add a song id to `songs.json` and link; otherwise leave `song: null`.

**Direct-edit policy (from spec §3):** link a song id only when at least one of: official recording/release/page; chaptered video mapping; two independent credible sources; or clip title/description explicitly naming the song. Weak evidence stays `titlePerformed` + `song: null`.

---

## Self-Review Notes

- **Spec coverage:** Phase 1 → spec §5 Phase 1. Phase 2 → spec §5 Phase 2 (in-repo clip-label seed). Phase 3 → spec §5 Phase 3 (manual track). Phase 4 → spec §5 Phase 4 (existing-setlist gaps). Phase 5 → spec §5 Phase 5 + §6 validation extensions. Decision 1 (drop backrefs) → Task 1. Decision 2 (defer confidence) → Global Constraints; no task adds the fields. Decision 3 (tour clustering) → Manual Research Track. §7 non-goals → Global Constraints. §8 risks → addressed by warn-only validator + clone-basis notes.
- **Placeholder scan:** `TARGETS` is fully populated with real clip URLs and song ids verified against `data/concerts.json` and `data/songs.json`. No TBD/TODO. All expected outputs are concrete.
- **Type consistency:** `song-wo-yuan-yi`, `song-meng`, `song-olive-tree`, etc. all verified to exist. The `Song` type after Task 1 has no `knownConcerts`/`knownMusicShows`; no later task references them. `seed-setlists-from-clips.mjs` field names (`position`, `song`, `titlePerformed`, `collaborators`, `mediaLinks`) match the existing `SongPerformance` shape.