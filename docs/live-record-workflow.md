# Live Record Workflow

This note defines the working process for concerts and other live records. It is designed for Bilibili-heavy research, but the same review rules apply to YouTube, official platforms, news clips, and contributor-submitted links.

## Principle

Work event by event.

Do not try to build the whole live archive from broad search results at once. Each batch should start from one event shell, collect candidate links for that event, save them as drafts, ask for maintainer review where needed, and only then import confirmed records into `data/*.json`.

Crawler output and search results are review candidates. They do not become archive data until they pass agent pre-review and maintainer confirmation, unless the maintainer explicitly delegates that batch.

## Event Shell

Before collecting links, create or confirm an event shell with as many of these fields as possible:

- event title or tour title
- date or date range
- city, venue, and country or region
- event type
- known guests
- known setlist or partial setlist
- known official release or broadcast context
- current status and uncertainty notes

If the event itself is uncertain, keep it as `status: "needs-source"` or `status: "partial"` until supported by stronger sources.

## Bilibili Candidate Collection

Bilibili should be handled as a candidate source, especially for fan uploads.

As of 2026-06-24, Bilibili's `robots.txt` disallows unspecified crawlers with `User-agent: *`. Do not run broad automated scraping against Bilibili search or video pages with the project crawler unless we later have a compliant method, permission, or a clearly allowed official API path.

Recommended collection methods:

- manually search Bilibili for the current event
- use external search engines with `site:bilibili.com/video`
- accept links provided by the maintainer or contributors
- use a local script only to canonicalize, dedupe, and draft-review manually collected URLs

Do not download or store full copyrighted videos in the archive. Store links, source metadata, and reviewer observations only.

## Search Anchors

For each event, prepare targeted search anchors:

- artist variants: `Qi Yu`, `Chyi Yu`, simplified Chinese, and traditional Chinese
- concert or tour title variants
- date variants: `YYYY-MM-DD`, `YYYYMMDD`, year plus city
- city and venue names
- guest names
- distinctive setlist songs
- terms such as full concert, full recording, live, clip, encore, rehearsal, and fan cam

Example query patterns:

- `Chyi Yu live Beijing 2025`
- `Qi Yu Grace Still Beijing 20251122`
- `Chyi Yu concert Wu Tsing-fong site:bilibili.com/video`
- `Qi Yu 2002 Unheard of Chyi full concert`

## Candidate Draft Fields

Every possible link should first become a candidate draft with:

- target event ID
- search query or submitter note
- result rank or discovery context
- original URL
- canonical URL
- platform video ID, such as BVID
- page or chapter number, if relevant
- title
- uploader or publisher
- upload date
- duration, when visible
- candidate type: `full-concert`, `partial-concert`, `chaptered`, `single-song-clip`, `interview`, `rehearsal`, `unclear`, or `unrelated`
- review state: `pending`, `agent-accepted`, `needs-maintainer-review`, `maintainer-confirmed`, `rejected`, or `needs-more-source`
- missing fields or maintainer questions
- reviewer notes

## URL Rules

Keep URLs stable and minimal.

For Bilibili:

- full video: `https://www.bilibili.com/video/BVxxxx/`
- chaptered page: `https://www.bilibili.com/video/BVxxxx/?p=3`
- timestamp only when needed for a specific performance

Remove tracking or session parameters such as `spm_id_from`, `vd_source`, share IDs, and unrelated referral parameters.

## Review Criteria

Accept a candidate into real archive data only after maintainer confirmation.

Agent pre-review should classify candidates before asking the maintainer:

- `agent-accepted`: strong metadata match; ready for maintainer confirmation
- `needs-maintainer-review`: likely useful, but visual/audio confirmation, duplicate judgment, or missing context is needed
- `needs-more-source`: useful lead, but not enough support for factual claims
- `rejected`: wrong event, wrong city, wrong artist, duplicate with no added value, or unrelated

After pre-review, provide the maintainer a short review packet before editing `data/*.json`:

- links that need human visual/audio review
- fields the maintainer can fill in, such as observed resolution, camera angle, distance, stability, audio quality, obstructions, timestamps, or whether a duplicate adds value
- proposed imports, with target event/setlist positions and source IDs
- rejected or deferred items, with reasons

A strong match should have at least two supporting signals:

- title names the artist and event, city, date, venue, or tour
- description lists event date, venue, guest, setlist, or source context
- duration fits the claimed scope
- visible or audible content confirms the performance
- uploader context is plausible
- another source supports the same event or setlist claim

If a link is useful but not enough to support a factual claim, keep it as `needs-more-source`. If it is likely relevant but requires a human eye or ear, keep it as `needs-maintainer-review`.

## Import Rules

Only maintainer-confirmed full-event or major partial-event links belong in `concert.mediaLinks`.

Maintainer-confirmed song clips belong in the matching `setlist[].mediaLinks`. Do not duplicate a full concert link into every setlist item unless the upload has reliable chapters, part pages, or timestamps.

Chaptered uploads can be represented in both places:

- base video in `concert.mediaLinks`
- chapter or part URLs in each relevant setlist item

Each confirmed Bilibili video should also have a `sources.json` record. Fan uploads usually have `sourceType: "platform"` and `reliability: "medium"` unless official platform context makes the source stronger.

## Suggested Media Link Fields

Use existing fields first:

- `label`
- `platform`
- `url`
- `kind`
- `isOfficial`
- `credit`

For live-record review, these optional fields are useful:

- `source`
- `bvid`
- `accessDate`
- `observedMaxResolution`
- `resolutionReviewedAt`
- `captureNotes`

Example:

```json
{
  "label": "Full fan upload, 4K",
  "platform": "bilibili",
  "url": "https://www.bilibili.com/video/BV1shUABzErY/",
  "kind": "video",
  "isOfficial": false,
  "credit": "Uploader name",
  "source": "source-bilibili-example-event-full",
  "bvid": "BV1shUABzErY",
  "accessDate": "2026-06-24",
  "observedMaxResolution": "4K",
  "resolutionReviewedAt": "2026-06-24",
  "captureNotes": {
    "cameraPosition": "floor",
    "horizontalAngle": "center-right",
    "distance": "mid-range",
    "shotType": "mostly full-stage",
    "stability": "handheld",
    "obstructions": "occasional heads in foreground",
    "audioQuality": "fair",
    "reviewedAt": "2026-06-24"
  }
}
```

## Resolution Notes

`observedMaxResolution` means the highest quality observed during review, not a permanent platform guarantee.

Bilibili quality availability can vary by login state, region, account type, source stream, platform changes, and deletion or replacement. Record it as an observation with a review date.

Suggested values:

- `360p`
- `480p`
- `720p`
- `1080p`
- `1080p+`
- `2K`
- `4K`
- `8K`
- `unknown`

## Capture Notes

Shooting angle and quality require visual review. They should be treated as reviewer observations, not objective source metadata.

Suggested controlled values:

- `cameraPosition`: `floor`, `stand`, `balcony`, `screen-recording`, `mixed`, `unknown`
- `horizontalAngle`: `left`, `center-left`, `center`, `center-right`, `right`, `mixed`, `unknown`
- `distance`: `close`, `mid-range`, `far`, `mixed`, `unknown`
- `shotType`: `full-stage`, `singer-closeup`, `screen-closeup`, `mixed`, `unknown`
- `stability`: `stable`, `mostly-stable`, `handheld`, `shaky`, `unknown`
- `audioQuality`: `good`, `fair`, `poor`, `unknown`

These fields are mainly for curation. Public display can wait until the archive has enough reviewed live records to justify a user-facing quality filter.

## Source Reliability

Use Bilibili fan uploads primarily for:

- media availability
- event existence leads
- setlist leads
- guest and arrangement clues
- comparison between duplicate uploads

Do not treat fan-upload descriptions as final confirmation for official event facts when stronger official, news, ticketing, platform, or release sources are available.

## Batch Closeout

For each event batch:

1. Save candidate drafts under `supplement/import-drafts/`.
2. Save only allowed lightweight review material under ignored supplement folders.
3. Run agent pre-review and update draft states.
4. Give the maintainer a review packet with required human checks, missing fields, proposed imports, and deferred/rejected items.
5. Wait for maintainer confirmation or corrections.
6. Patch only maintainer-confirmed sources into `data/sources.json`.
7. Patch only maintainer-confirmed media links into the event or setlist entries.
8. Keep uncertain claims marked as `partial`, `uncertain`, or `needs-source`.
9. Run checks or build after data edits.
10. Commit the accepted event batch separately from unrelated release or site changes.
