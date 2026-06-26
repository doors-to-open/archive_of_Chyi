# Release Wrap-Up Follow-Up Design

## Context

The release archive has completed its initial crawling and import pass, but the follow-up task identifies missing or misclassified release metadata, especially from QQ Music and other streaming platform pages. Streaming platform pages are authoritative enough for release formats, OST classification, and appearance records when the page clearly shows the information.

## Goals

- Correct release and appearance data using the task note as an ordered checklist.
- Treat QQ Music and other streaming platform pages as direct sources for album formats, OST status, and appearance records.
- Move soundtrack and charity/collaboration participations out of releases when they are not Chyi Yu-owned releases.
- Add or verify Spotify, YouTube Music, Kugou Music, and other relevant streaming links.
- Redefine `Buy` as verified physical CD/Vinyl purchase availability only.
- Simplify release filtering and availability display so the UI reflects the cleaned data.

## Non-goals

- Do not add every performer from charity albums to `People`.
- Do not perform a full re-audit of every release before addressing the named task-note misses.
- Do not add advanced multi-dimensional filters beyond the category dropdown requested for this follow-up.

## Data correction workflow

Process the task note point by point. For each content item:

1. Resolve the provided QQ Music or streaming source.
2. Extract only archive-relevant facts: title, date, format, OST/collaboration status, track credits, and platform links.
3. Update the proper dataset:
   - Chyi Yu-owned albums remain in `data/releases.json`.
   - OST vocal appearances and charity/collaboration participations belong in `data/appearances.json`.
   - New citations belong in `data/sources.json`.
   - `data/songs.json` and `data/people.json` are expanded only when needed for credited lyricists/composers or existing archive linkage.
4. Run release validation after meaningful data groups.
5. Report the result before moving to the next task-note point.

## Specific data decisions

- Physical formats shown on streaming pages, including Vinyl, can update `formats` and source notes directly.
- `Impression Liu Sanjie` is an OST appearance, not a normal release category.
- `Tomorrow Will Be Better` belongs in appearances. Its lyricist/composer credits should be researched and recorded, but the full charity ensemble should not be added to `People`.
- The additional user-supplied charity/collaboration QQ album belongs in appearances.
- `Buy` means current physical purchase availability for CD/Vinyl. Digital purchase links should be treated as streaming or metadata links, not purchase availability; if no physical purchase route is verified, hide purchase/buy UI.
- Streaming availability should include verified platform links for Spotify, YouTube Music, Kugou Music, QQ Music, and other relevant platforms found during the point-by-point pass.

## Release list UI

Use the selected option A layout direction.

- Replace the category button group on `/releases/` with a compact Geist-style dropdown/select.
- Keep the album/song view toggle and sort controls as compact buttons.
- Use one user-facing category concept for filtering and metadata.
- Avoid showing both category and type when they repeat the same meaning.
- Keep internal `releaseType` where needed for data semantics, sorting, validation, and search.
- Make `Other` a true fallback category. It should not appear for releases that already have a more specific category.

## Release detail availability UI

- Keep a streaming platform table when streaming links exist.
- Show physical purchase/buy links only when the source represents real physical CD/Vinyl availability.
- Do not show a large `Availability` structure only to repeat physical formats.
- Keep physical format information as concise release metadata when useful.

## Validation and manual verification

Run these automated checks:

- `npm run validate:releases`
- `npm run check`
- `npm run build`

Manually verify the running app:

- The release category dropdown works.
- The `Other` filter no longer includes records with a better category.
- Release cards and detail pages no longer show duplicate category/type meaning.
- Release detail availability shows streaming cleanly.
- Physical buy appears only for verified physical CD/Vinyl purchase links.

## Implementation sequence

1. Correct release/appearance/source data in the order of the task note.
2. Validate data after each meaningful group.
3. Simplify archive category helpers so `Other` is a fallback.
4. Update release list UI to use the dropdown category filter.
5. Update release detail availability display.
6. Run automated checks and manually verify the app.
