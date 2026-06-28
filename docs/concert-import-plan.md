# Concert Import Plan

This plan covers importing prepared concert drafts into the current archive structure with small model changes only. It records the current decisions before editing `data/concerts.json`.

## Goals

- Load each concert's basic information correctly: date, city, region, venue, title, status, sources, and public media links.
- Store setlists as Chyi Yu performance lists only. Exclude songs performed only by other artists, even when the full event setlist is known.
- Link every Chyi Yu performance to an internal song ID. For covers that do not exist yet, create proper song identity records.
- Add overlapping concert filters such as solo, guest, charity, collaboration, religious, festival, anniversary, and concert-series.
- Add old-to-new and new-to-old sorting on the Concerts page.
- Display concerts grouped by year, with each year expandable to show its concerts.
- Follow `design.md`: restrained Geist-style layout, compact controls, neutral borders, accessible focus states, and no decorative card-heavy redesign.

## Event Type Versus Tags

`eventType` and `tags` should answer different questions.

`eventType` is the structural type of the record. It is one value, mostly stable, and should not try to describe every reason a user may filter the concert. Current allowed values stay close to the existing model:

- `concert`
- `concert-series`
- `festival`
- `live-album`
- `other`

Use `eventType` for the record's primary shape. For example, a one-night charity performance is still usually `eventType: "concert"`. A festival appearance can use `eventType: "festival"`. A future aggregate page for an entire tour can use `eventType: "concert-series"`; individual tour stops should usually remain `eventType: "concert"` and use a `concert-series` tag.

`tags` are filter facets. They are multiple values and can overlap. They describe Chyi Yu's role, purpose, theme, or series membership:

- `solo`
- `guest`
- `collaboration`
- `charity`
- `festival`
- `religious`
- `anniversary`
- `concert-series`
- `other`

Examples:

- A Chyi Yu solo charity concert: `eventType: "concert"`, `tags: ["solo", "charity"]`.
- Echo with Pan Yue-yun: `eventType: "concert"`, `tags: ["collaboration", "concert-series"]`.
- A festival where Chyi Yu performs: `eventType: "festival"`, `tags: ["guest", "festival"]` or `["collaboration", "festival"]`, depending on billing.
- A weak reference-only lead: same event/tag rules, but `status: "needs-source"`.

## Minimal Data Model Changes

Update `Concert` in `src/lib/archive.ts` with optional fields:

```ts
performers?: string[];
tags?: string[];
```

Keep existing fields unchanged:

- `id`
- `slug`
- `title`
- `titleLocalized`
- `date`
- `venue`
- `city`
- `countryOrRegion`
- `eventType`
- `guests`
- `setlist`
- `mediaLinks`
- `officialRecording`
- `sources`
- `sourceQuality`
- `notes`
- `status`

## Import Scope From Drafts

Read candidates from:

- `supplement/import-drafts/2026-06-25/`
- `supplement/import-drafts/2026-06-27/`
- `supplement/import-drafts/2026-06-28/`

Import or update candidates with these states:

- `ready-for-import`
- `ready-for-import-no-media`
- `ready-for-import-partial-setlist`
- `ready-for-existing-record-update`
- `needs-more-source`

Do not import into Concerts:

- `shell-needs-maintainer-confirmation`, unless later confirmed.
- `move-to-tv-shows`, which belongs in Music Shows.
- `skipped-manual-add`, because those records are already handled manually or separately.

## Needs-Source Leads

Show weak leads on the site as concert records with `status: "needs-source"`.

For these records:

- Preserve known title/date/place from the draft.
- Use `setlist: []` unless there are confirmed Chyi Yu-performed songs.
- Use `mediaLinks: []` unless a media item was explicitly kept.
- Use `sourceQuality` like `reference lead; needs independent source`.
- Add notes saying the event is imported as a lead and still needs stronger public evidence.
- Add or reuse a source record such as `source-project-concert-reference-list` instead of pointing public data at ignored local `task-notes/` files.

## Concert Record Normalization

For each imported concert:

- Use ASCII stable IDs and slugs, such as `concert-echo-2018-taipei`.
- Normalize `date` to `YYYY-MM-DD` or `YYYY-MM-DD/YYYY-MM-DD`.
- Normalize region values consistently: `Taiwan`, `China`, `Hong Kong`, `Macau`, `Singapore`, `Malaysia`.
- Keep Chinese venue/city names when source evidence is Chinese, but avoid mojibake and replacement characters.
- Group alternate platform uploads of the same media in notes or adjacent media links without implying the archive hosts the video.
- Keep only metadata and outbound links. Do not download, mirror, repost, or re-upload fan videos.

## Setlist And Song Linking

Concert `setlist` means Chyi Yu-performed songs only.

Include:

- Chyi Yu solo songs.
- Duets where Chyi Yu sings.
- Collaboration songs where Chyi Yu is a performer.
- Medleys if Chyi Yu performs them, using `songParts` when multiple song identities are involved.

Exclude:

- Songs performed only by guests or collaborators.
- Host segments, news clips, interviews, and unrelated chapter markers.
- Full-show songs where the draft source does not indicate Chyi Yu performed.

For each setlist item:

- Set `song` to an existing song ID whenever possible.
- Use `songParts` for medleys.
- Use `titlePerformed` for the stage title.
- Use `titlePerformedLocalized` when useful for Chinese/English display.
- Use `originalPerformer` for covers.
- Use `collaborators` for duet partners.
- Use `mediaLinks` for song-level clips only.

For missing cover songs:

- Create a new `songs.json` identity record with a stable ID.
- Include title, aliases, language, empty or partial credits, sources if available, and `status: "partial"` or `status: "needs-source"`.
- Note that it is a concert cover-performance identity when release/credit details are incomplete.
- Add the concert ID to the song's `knownConcerts`.

## Concert Tags

Add helper functions in `src/lib/archive.ts`:

- `concertCategoryTags(concert)`
- `concertPrimaryCategory(concert)` if a single display label is needed.

Prefer explicit `concert.tags` when present. Fall back to inference only for legacy records:

- `eventType === "festival"` adds `festival`.
- `guests.length > 0` can add `guest` only when no explicit role tags exist.
- `performers` with Chyi Yu plus another primary artist can add `collaboration`.
- `notes` may suggest `charity`, `religious`, or `anniversary`, but explicit tags are better.
- If nothing matches, add `other`.

Add i18n labels in `src/lib/i18n.ts` for all tag options.

## Concert Page UI

Update `src/pages/concerts/index.astro`:

- Add a filter panel similar to Releases.
- Use a select or segmented controls for category filtering.
- Add sort buttons: Oldest and Newest.
- Render year groups as expandable sections.
- Within each year group, render existing record-card style concert links.
- Show the count of visible concerts.
- Hide year groups with no visible records after filtering.

Recommended markup structure:

```astro
<section data-concert-browser>
  <div class="section filter-panel concert-controls-panel">...</div>
  <div class="section concert-year-list">
    <details class="concert-year-group" data-year-group data-year="2025" open>
      <summary>2025 <span>...</span></summary>
      <div class="archive-grid">
        <a data-concert-item data-sort-date="2025-09-06" data-concert-tags="solo|concert-series">...</a>
      </div>
    </details>
  </div>
</section>
```

Use a small concert-specific client script if the shared sorter cannot sort nested year groups cleanly.

## Validation

Extend validation before and after data edits:

- Concert IDs and slugs are unique.
- Concert date strings are valid sortable strings or documented ranges.
- Every `sources` ID exists.
- Every `setlist.song` and `songParts` ID exists.
- Every `performers`, `guests`, and `collaborators` person ID exists when using `person-*`.
- All setlist entries are Chyi Yu performances.
- `needs-source` records are allowed, but they must not be marked `confirmed`.
- Songs referenced from concert setlists include the concert in `knownConcerts`.
- `npm run validate:releases`, `npm run check`, and `npm run build` pass.

## Remaining Decisions

- Decide exact title localization for each imported record, especially Chinese concert names with English display aliases.
- Decide whether to add aggregate tour/series pages later. For now, individual stops should remain normal concert records.
- Decide how much source detail from draft `sourceLeads` should become formal `sources.json` entries versus notes on the concert.
