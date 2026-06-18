# Starter Data

This folder contains early JSON records used to test the archive model.

The data is intentionally small. It should prove that internal song records, releases, concerts, music shows, appearances, people, and sources can connect to each other without forcing us to collect the whole archive at once.

## Files

- `sources.json`: source records used by sample items.
- `people.json`: people referenced in credits.
- `songs.json`: internal song identity and credit records. These do not create public song pages.
- `releases.json`: sample release records.
- `concerts.json`: sample concert and concert-series records.
- `music-shows.json`: sample televised, streamed, or radio music-show performance records.
- `appearances.json`: sample non-concert and non-music-show appearance records.
- `media-links.json`: verified media links. This starts empty until individual links are reviewed.

## Rules

- Do not add factual claims without at least one source ID.
- Use `status: "partial"` when the record is useful but incomplete.
- Use `status: "needs-source"` when a value is plausible but not yet sourced.
- Use `sourceQuality` or `reliability` to separate official sources from encyclopedia, platform, archived, and other source types.
- Prefer adding less data with clearer sources over adding many uncertain records.

## Current Limitations

The current records use encyclopedia sources as placeholders for model testing. They should be replaced or strengthened with official releases, album booklets, label pages, library records, or platform metadata whenever possible.
