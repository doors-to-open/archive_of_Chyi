# Starter Data

This folder contains early JSON records used to test the archive model before the Astro implementation is added.

The data is intentionally small. It should prove that songs, releases, performances, people, and sources can connect to each other without forcing us to collect the whole archive at once.

## Files

- `sources.json`: source records used by sample items.
- `people.json`: people referenced in credits.
- `songs.json`: sample song records.
- `releases.json`: sample release records.
- `performances.json`: sample live/performance records.
- `media-links.json`: verified media links. This starts empty until individual links are reviewed.

## Rules

- Do not add factual claims without at least one source ID.
- Use `status: "partial"` when the record is useful but incomplete.
- Use `status: "needs-source"` when a value is plausible but not yet sourced.
- Use `sourceQuality` or `reliability` to separate official sources from encyclopedia, fan, audience, and platform sources.
- Prefer adding less data with clearer sources over adding many uncertain records.

## Current Limitations

The current records use encyclopedia sources as placeholders for model testing. They should be replaced or strengthened with official releases, album booklets, label pages, library records, or platform metadata whenever possible.

