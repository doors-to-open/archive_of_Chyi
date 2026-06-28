# Plan: Concert Setlist Confirmation and Clip Assignment
 
Research tool: Agent-Reach `https://github.com/Panniantong/Agent-Reach`

## 1. Objective

Improve the archive so that concert drafts with clips can be converted into source-backed, song-linked performance records.

The practical goal is:

- users can search a song and find available live performances/clips quickly;
- concert statistics, especially most-performed songs, are based on reliable setlist-song links;
- uncertain or fragmentary evidence remains usable but is not treated as confirmed fact.

## 2. Important Architecture Rule

Do **not** create a redundant song-level performance cache unless performance problems are proven.

`concerts.json` should remain the source of truth for concert performances:

```text
concerts.json
  concert.setlist[].song        -> songs.json song id
  concert.setlist[].mediaLinks  -> clips for that specific performance
```

The existing search/song-summary pipeline should derive song-level live records from those links. The agent should verify this behavior instead of duplicating concert data into `songs.json`.

Treat `songs.json` as song identity metadata only: titles, aliases, credits, releases, notes, and sources. Do not manually maintain `knownConcerts`, `knownMusicShows`, or song-level `mediaLinks` for concert-derived facts unless the project already requires them as generated fields.

## 3. Direct Edit Policy

The agent may directly modify `concerts.json` when confidence is high.

Direct edit is allowed when at least one of these is true:

- an official recording, official release, official page, or official platform listing identifies the song/setlist item;
- a chaptered video or track list clearly maps clip order to song titles;
- two independent credible sources agree on the song identity and order;
- a clip title/description/chapter explicitly names the song and clearly belongs to the concert.

For weak or ambiguous evidence, the agent should not force a confirmed song link. Keep the clip at concert level or mark the performance as uncertain/possible.

## 4. Initial Audit

Inspect these files first:

- `data/concerts.json`
- `data/songs.json`
- `data/sources.json`
- `src/lib/archive.ts`
- `src/components/SongSummaryCard.astro`
- `src/pages/search.astro`
- existing validation/check scripts in `package.json` and scripts folders

Generate an audit table/report with:

- concert id
- title/date/venue
- current status
- number of setlist entries
- number of entries with `song` linked
- number of entries with performance-level media links
- number of concert-level media links
- source count
- classification:
  - `confirmed-setlist`
  - `partial-setlist`
  - `clips-only`
  - `needs-research`

## 5. Research Workflow with Agent-Reach

For each `needs-research`, `partial-setlist`, or `clips-only` concert, use Agent-Reach to search across:

- general web pages
- YouTube
- Bilibili
- GitHub if relevant
- RSS/news archives if useful
- Chinese-language sources and fan pages

Use multilingual and variant-name queries, for example:

```text
齊豫 演唱會 曲目
齐豫 演唱会 歌单
齊豫 歌單 現場
齐豫 现场 setlist
Chyi Yu concert setlist
Chyi Yu live full video
齊豫 [concert title] [year]
齐豫 [venue] [date]
齊豫 B站 演唱會
齐豫 YouTube live
```

Also search by:

- exact concert title
- venue name
- city/region
- date/year
- known clip title
- Bilibili BV id or YouTube video id if already present

## 6. Evidence Capture Rules

Before changing archive data, save useful evidence as source records or source candidates.

For each useful source, capture:

- platform/source type
- title
- author/uploader/publisher
- URL
- access date
- whether official
- reliability: `high`, `medium`, `low`, or `unknown`
- notes explaining what the source supports

Do not rely on anonymous comments alone for confirmed data. Anonymous or single fan claims can support `possible` or `probable`, but not `confirmed` unless corroborated.

## 7. Setlist Extraction Rules

When extracting setlists:

1. Normalize song titles against `data/songs.json`.
2. Match Traditional Chinese, Simplified Chinese, English titles, pinyin, aliases, and common alternate names.
3. Reuse an existing song id when the match is secure.
4. Only create a new song id when the song truly does not exist in `songs.json`.
5. If the title is visible but the identity is uncertain, preserve `titlePerformed` and leave `song: null`.
6. Preserve medleys, fragments, reprises, opening music, talks, and non-song segments without forcing them into incorrect song ids.

Recommended setlist item fields, if the schema permits or can be safely extended:

```json
{
  "position": 1,
  "song": "song-example-id",
  "titlePerformed": "Example Title",
  "mediaLinks": [],
  "sources": [],
  "confidence": "confirmed",
  "evidenceNotes": "Official chapter title identifies this song."
}
```

If adding `sources`, `confidence`, or `evidenceNotes` requires TypeScript/schema updates, update the relevant types and validation scripts together.

## 8. Clip-to-Song Assignment Rules

Attach a clip to `concert.setlist[].mediaLinks` only when it can be assigned to a specific performance.

Strong assignment evidence includes:

- video chapter title names the song;
- video title/description names the song;
- official or reliable source maps the clip to the song;
- timestamp range in a full video clearly corresponds to a setlist item;
- subtitles/lyrics strongly identify the song;
- ordered chaptered upload matches a reliable setlist order.

If the clip belongs to the concert but not to a specific song, keep it in `concert.mediaLinks`.

Do not rehost copyrighted media. Store metadata and external links only.

## 9. Confidence Model

Use performance-level confidence when available.

Recommended values:

- `confirmed`: official source, official/chaptered release, or two independent credible sources agree.
- `probable`: one credible source plus strong title/chapter/timestamp evidence.
- `possible`: weak source, unclear ordering, partial fragment, or single informal claim.
- `unknown`: clip exists but song identity/order is not secure.

Statistics should default to `confirmed` + `probable` only. `possible`, `unknown`, and `song: null` entries should not count as confirmed song performances.

## 10. Source of Truth for Search and Statistics

Do not manually duplicate live performance data into `songs.json`.

Instead:

- link each reliable setlist item to the correct `songs.json` id;
- attach the clip to that setlist item if the clip-song mapping is clear;
- update `src/lib/archive.ts` only if needed so song summaries, search entries, and statistics derive from setlist links;
- verify that `SongSummaryCard` displays live records and clips through derived `liveRecords`.

If the current statistics count all setlist items regardless of confidence, update the statistics logic to exclude uncertain records by default or to expose a clear confidence filter.

## 11. Validation Requirements

Add or update validation scripts to check:

- every non-null `setlist[].song` exists in `data/songs.json`;
- every source id exists in `data/sources.json`;
- every performance-level media link has platform, URL, label, and kind where applicable;
- no `confirmed` performance lacks supporting evidence;
- duplicate media URLs are detected;
- concert-level clips are not silently counted as song-level clips;
- statistics exclude uncertain/unknown entries by default;
- generated search/song summaries still build correctly.

Run the project checks before finishing:

```bash
npm install
npm run check
npm run build
```

If the repository uses different commands, inspect `package.json` and run the equivalent validation/build commands.

## 12. Suggested Work Order

1. Audit current concert coverage.
2. Identify the top-priority concerts:
   - many clips but few linked songs;
   - concerts likely to affect most-performed-song statistics;
   - official/chaptered recordings where high-confidence automation is possible.
3. Research sources with Agent-Reach.
4. Add or improve source records.
5. Link confirmed/probable setlist items to song ids.
6. Move assignable clips from concert-level media links to setlist-level media links where appropriate.
7. Keep ambiguous clips at concert level.
8. Update types/validation if confidence fields are introduced.
9. Verify search and song summary output.
10. Verify statistics with confidence filtering.
11. Produce a final change report.

## 13. Final Deliverables

The agent should produce:

- updated `data/concerts.json`;
- updated `data/sources.json` if new sources are added;
- updated `data/songs.json` only when genuinely new song identities are needed;
- updated TypeScript types or validation scripts if the data model changes;
- an audit/research report listing:
  - concerts improved;
  - songs linked;
  - clips assigned;
  - sources added;
  - uncertain items left unresolved;
  - commands run and results.

## 14. Non-Goals

Do not:

- create public song pages unless separately requested;
- duplicate derived concert performance records into `songs.json`;
- mark fan-sourced claims as confirmed without corroboration;
- assign clips to songs based only on guesswork;
- rehost copyrighted audio or video;
- hide uncertainty from users or statistics.
