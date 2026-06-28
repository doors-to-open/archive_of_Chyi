# Design: Concert Setlist Recovery and Clip Assignment

Supersedes the workflow sections of `docs/setlist_recovery_plan.md`; that document's research/evidence rules are inlined where still relevant.

## 1. Objective

Improve `data/concerts.json` so concert setlist entries link to `data/songs.json` song ids and clips sit at the performance level, making live performances discoverable per song and concert statistics reliable.

## 2. Baseline (verified from the repo, not assumed)

- 56 concerts, 282 songs, 249 sources.
- 7 concerts have a setlist (160 setlist entries; 157 already linked to a song id; 3 `song: null` entries — 1 "Opening", 2 in `concert-tian-shi-yu-lang-2008-beijing`).
- 49 concerts have an empty setlist: `clips-only` or `needs-research`.
- 160 performance-level clips, 106 concert-level clips.
- `src/lib/archive.ts:602` `liveRecordsForSong` already derives song live records from `concert.setlist` directly. `concerts.json` is already the source of truth. No song-level performance cache exists.
- `scripts/validate-release-data.mjs` already validates: song-id refs, source-id refs, unique ids/slugs, a title-normalizing live-linkage gap detector, and a **bidirectional `knownConcerts` backref check** (`:277-290`). `npm run validate:releases` currently passes.
- `songs.json` carries `knownConcerts` / `knownMusicShows` backrefs on 81 / 34 songs respectively; `mediaLinks` is empty on all 282 songs.
- `SongPerformance` has `mediaLinks?: ArchiveLink[]` but no `confidence` / `sources` / `evidenceNotes`.
- `archiveStatistics()` (`archive.ts:731`) counts all `liveRecords` unconditionally.
- Of the 49 no-setlist concerts, **11 have song names embedded in their `mediaLinks[].label`** (e.g. `橄欖樹 clip`, `夢田 clip`, `走在雨中 clip`, `You Raise Me Up clip`), and several have 7–12 such clips.
- The 49 no-setlist concerts cluster into ~5 multi-date tours plus ~27 singletons: Echo/回聲 (6 dates 2018–2019), 真愛女人 (4, 2011–2012), Rollings Tone 30 (5, 2011–2012), 心幸福音樂會 (4, 2012–2017), Olive Tree 2014 (3). Tour clustering cuts research units from 49 to ~32 (5 tour reps + 27 singletons).

## 3. Decisions (confirmed with maintainer)

1. **Drop `knownConcerts` / `knownMusicShows` backrefs.** They are manually maintained and bidirectionally validated, which contradicts the concerts-as-source-of-truth architecture. `liveRecordsForSong` already derives concerts from `concerts.json`, so the backrefs are pure redundancy.
2. **Defer the confidence model.** Ship setlist recovery without `confidence` / `sources` / `evidenceNotes` on `SongPerformance`. All linked entries are treated as confirmed for now. `archiveStatistics()` is unchanged. The "exclude uncertain from statistics" goal is explicitly deferred to a later cycle.
3. **Cluster same-tour concerts.** Research one representative per tour, clone its setlist structure to sibling dates, and correct per-date differences.

Consequences: **no `SongPerformance` schema change**; **no `archiveStatistics()` rewrite**; **no new TS types**. The scope is data edits in `concerts.json` / `sources.json`, one mechanical cleanup in `songs.json` + `archive.ts` + the validator, and research.

## 4. Architecture (unchanged)

```text
concerts.json
  concert.setlist[].song        -> songs.json song id
  concert.setlist[].mediaLinks  -> clips for that specific performance
  concert.mediaLinks            -> clips that belong to the concert but not a specific song
songs.json                       -> identity metadata only (titles, aliases, credits, releases, notes, sources)
```

`liveRecordsForSong` and `songSummary` continue to derive song-level live records from `concerts.json`. No song-level performance cache is introduced.

## 5. Phased Work

### Phase 1 — Mechanical cleanup (no research, no schema change)

1. Remove `knownConcerts` and `knownMusicShows` from every song in `data/songs.json`.
2. Remove the `knownConcerts` and `knownMusicShows` fields from the `Song` type in `src/lib/archive.ts:46-47`.
3. Delete the bidirectional backref check in `scripts/validate-release-data.mjs:277-290`.
4. Run `npm run validate:releases`, `npm run check`, `npm run build`. Expect all green; `liveRecordsForSong` is untouched so song pages are unaffected.

Exit criteria: validator and build green; `songs.json` contains no `knownConcerts` / `knownMusicShows`; no `Song` type field references them.

### Phase 2 — In-repo clip-label seed (no external research)

For each of the ~11 no-setlist concerts whose `mediaLinks[].label` contains a song name:

1. Parse the song name from the label (labels follow patterns like `<SongName> clip`, `<SongName> — Bilibili P2`, `<SongName>（安可重唱）`).
2. Match the parsed name against `songs.json` by normalized title. Reuse the `normalizeTitle` function already in `scripts/validate-release-data.mjs:182-191` (lowercase, strip whitespace/parentheses/punctuation, trim `live`/`清唱` suffixes). Match against `song.title`, `song.titleOriginal`, `song.aliases`, and `song.titleLocalized` values.
3. If a unique song matches, create a setlist entry `{ position, song, titlePerformed, mediaLinks: [<the clip>] }` and remove the clip from `concert.mediaLinks`.
4. If no song matches, create a setlist entry with `song: null` and `titlePerformed` set to the parsed name — do not invent a song id. (These become Phase 4 targets.)
5. Preserve non-song labels (`Opening`, `talking`, `Encore`, `民歌組曲`, `百樂門組曲`, medleys) at concert level or as `song: null` entries without forcing an id.
6. Assign `position` by the order clips appear in `mediaLinks` unless the label encodes order (e.g. `P2`).

Exit criteria: ~11 concerts move from `clips-only` to `partial-setlist`; clips that name a specific song sit at the performance level; `npm run validate:releases` green.

### Phase 3 — Tour-clustered Agent-Reach research

1. Group the remaining ~38 no-setlist concerts into tours. Known clusters: Echo/回聲 (6), 真愛女人 (4), Rollings Tone 30 (5), 心幸福 (4), Olive Tree 2014 (3). The rest are singletons (~27).
2. For each tour, pick the representative with the most clips and sources. Research its setlist via Agent-Reach using multilingual queries (Traditional/Simplified Chinese, English, pinyin, venue, date, BV/YouTube ids already in the data). For each useful source, capture into `data/sources.json`: platform/source type, title, author/uploader/publisher, URL, access date, whether official, reliability (`high`/`medium`/`low`/`unknown`), and a notes field explaining what the source supports. Do not rely on anonymous comments alone for a confirmed song link; a single informal fan claim supports `titlePerformed` + `song: null`, not a song id.
3. Build the representative's setlist in `concerts.json`: link to existing `songs.json` ids where the match is secure; use `titlePerformed` + `song: null` for uncertain titles; preserve medleys via the existing `songParts` field.
4. Clone the setlist structure to sibling tour dates, then correct per-date differences: dropped/added songs, different encores, different guests/collaborators. Note the clone basis in the entry's existing free-text `notes` field (no schema change, since confidence is deferred). Distinguish cloned entries from directly-researched ones in the `notes` text so a future confidence pass can treat them differently.
5. For singletons, research independently. If no setlist is recoverable, leave the concert as `clips-only` / `needs-research` honestly — do not fabricate.

Direct edit policy (from §3 of the original plan) governs when a song id may be set: official recording/release/page, chaptered video mapping, two independent credible sources, or a clip title/description explicitly naming the song. Weak evidence stays as `titlePerformed` + `song: null`.

Exit criteria: every recoverable tour has a researched representative and cloned siblings with per-date corrections; unrecoverable concerts remain honestly flagged.

### Phase 4 — Existing-setlist gap closure

Resolve the 3 `song: null` entries in already-setlisted concerts:
- `concert-unheard-of-chyi-2002-hong-kong` position 1 ("Opening") — leave as `song: null` (non-song segment, per §7 rule 6).
- `concert-tian-shi-yu-lang-2008-beijing` 2 entries — check sources; link if a credible source names the song, else leave `song: null`.

Also close any `song: null` entries created in Phase 2 step 4 where a later source match becomes available.

Exit criteria: no `song: null` entry that has a secure match remains unlinked; remaining `song: null` entries are genuinely non-song or unresolved.

### Phase 5 — Verify and report

1. `npm run validate:releases`, `npm run check`, `npm run build`.
2. Regenerate the audit table (concert id, title, date, venue, status, setlist count, linked count, performance-clip count, concert-clip count, source count, classification) before and after; produce the §13 change report (concerts improved, songs linked, clips reassigned, sources added, unresolved items).
3. Classifications: `confirmed-setlist` (setlist with all entries linked), `partial-setlist` (setlist with some `song: null`), `clips-only` (no setlist, has clips), `needs-research` (no setlist, no clips or only uninformative clips).

## 6. Validation (extend the existing script, do not reinvent)

The existing `scripts/validate-release-data.mjs` already covers song-id refs, source-id refs, unique ids/slugs, and live-linkage gap detection. Extend it to add:

- Every performance-level `mediaLinks` entry has `platform`, `url`, `label`, and `kind`.
- No duplicate media URLs across a concert (concert-level + all setlist entries).
- A concert-level clip whose label names a song that appears in the setlist is flagged (it should have been moved to the performance level) — keeps Phase 2 honest over time.
- (Deferred) confidence-field checks — not added in this cycle.

Remove the `knownConcerts` backref check per Phase 1. Run `npm run validate:releases` as the primary gate; `npm run check` and `npm run build` as secondary gates.

## 7. Non-Goals

- No `confidence` / `sources` / `evidenceNotes` fields on `SongPerformance` this cycle.
- No `archiveStatistics()` change; statistics still count all linked live records.
- No `songs.json` performance fields (`knownConcerts`, `knownMusicShows`, `mediaLinks`) — all removed or already empty.
- No public song pages beyond what exists.
- No rehosting of copyrighted media; metadata and external links only.
- No marking fan-sourced claims as confirmed without corroboration; uncertain items stay `song: null` or `titlePerformed`.

## 8. Risks

- **Clip-label parsing is heuristic.** Labels like `民歌組曲 clip` or `Amazing Grace clip (day 1)` don't map cleanly to one song. Phase 2 must conservatively skip ambiguous labels rather than over-link. The validator's existing live-linkage detector will catch any title that matches a song record but was left `song: null`.
- **Tour cloning propagates errors.** A wrong song id in the representative spreads to all sibling dates. Mitigation: clone only after the representative is source-backed, and record the clone basis in `notes` so a future confidence pass can downgrade cloned entries together.
- **Research load for ~27 singletons is still large.** Many have 0 clips and only 1–2 sources. Some will remain `needs-research` honestly; the plan does not require full coverage.