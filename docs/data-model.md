# Data Model

This is an early working model. It should evolve as real Chyi Yu archive records are added.

## Shared Fields

Most records should include:

- `id`: stable internal identifier.
- `slug`: URL-safe identifier.
- `title`: display title.
- `titleLocalized`: optional locale-keyed title variants for future language switching.
- `titleOriginal`: original-language title when relevant.
- `aliases`: alternate names or translations.
- `summary`: short description.
- `sources`: source IDs that support the record.
- `notes`: editorial notes.
- `status`: `confirmed`, `partial`, `uncertain`, or `needs-source`.

## Localized Text

Localized text fields are additive. Existing string fields such as `title`, `titleOriginal`, `titleOnRelease`, and `titlePerformed` remain the current canonical display fields until the UI is migrated.

Use BCP-47-style keys where possible:

- `en`: English.
- `zh-Hant`: traditional Chinese.
- `zh-Hans`: simplified Chinese.
- `pinyin`: romanized Mandarin helper text when useful for search or disambiguation.

Example:

```json
{
  "title": "The Olive Tree",
  "titleOriginal": "橄欖樹",
  "titleLocalized": {
    "en": "The Olive Tree",
    "zh-Hant": "橄欖樹",
    "zh-Hans": "橄榄树",
    "pinyin": "Ganlan Shu"
  }
}
```

The same pattern applies to track-specific titles with `titleOnReleaseLocalized`, person names with `nameLocalized`, and performance titles with `titlePerformedLocalized`.

## Internal Song

Song records are internal identity records. They should support release tracks, concerts, music shows, people credits, statistics, and search. They should not create public song pages.

Suggested fields:

- `id`
- `slug`
- `title`
- `titleLocalized`
- `titleOriginal`
- `aliases`
- `language`
- `lyricsBy`
- `composedBy`
- `arrangedBy`
- `originalPerformers`: canonical performer IDs or literal performer labels for the first/original known recording, especially useful for covers; event-specific cover labels can still use `setlist[].originalPerformer`.
- `firstKnownRelease`
- `relatedReleases`
- `knownConcerts`
- `knownMusicShows`
- `mediaLinks`
- `sources`
- `notes`
- `status`

## Release

Suggested fields:

- `id`
- `slug`
- `title`
- `titleLocalized`
- `titleOriginal`
- `releaseDate`
- `releaseType`: `studio-album`, `single`, `compilation`, `collaboration`, `soundtrack`, `reissue`, or `other`
- `label`
- `catalogNumber`
- `formats`
- `tracks`
- `credits`
- `sources`
- `notes`
- `status`

## Track

Suggested fields:

- `position`
- `song`
- `titleOnRelease`
- `titleOnReleaseLocalized`
- `duration`
- `versionNote`
- `credits`

## Concert

Suggested fields:

- `id`
- `slug`
- `title`
- `date`
- `venue`
- `city`
- `countryOrRegion`
- `eventType`: `concert`, `concert-series`, `festival`, `live-album`, or `other`
- `role`: `headliner`, `co-headliner`, or `guest`
- `series`
- `version`
- `anniversaryYear`: anniversary number such as `30`, `40`, or `50`; use this instead of `version` for anniversary concerts
- `host`
- `nature`: `commercial` or `non-commercial`
- `category`: commercial `solo`, `collaboration`, `anniversary`, `guest`, or `other`; non-commercial `charity`, `religion`, `festival`, or `other`
- `groupKey`: optional stable key for tour/theme drawer grouping
- `groupKind`: optional `tour`, `theme`, or `host`
- `groupTitle`
- `groupTitleLocalized`
- `guests`
- `setlist`
- `mediaLinks`
- `sources`
- `sourceQuality`
- `notes`
- `status`

## Concert Song Performance

Suggested fields inside a concert `setlist`:

- `position`
- `song`
- `titlePerformed`
- `titlePerformedLocalized`
- `collaborators`
- `mediaLinks`
- `notes`

## Music Show

Suggested fields:

- `id`
- `slug`
- `title`
- `titleLocalized`
- `date`
- `program`
- `episode`
- `platform`
- `performedSongs`
- `collaborators`
- `mediaLinks`
- `sources`
- `sourceQuality`
- `notes`
- `status`

## Music-Show Song Performance

Suggested fields inside `performedSongs`:

- `position`
- `song`
- `titlePerformed`
- `titlePerformedLocalized`
- `collaborators`
- `mediaLinks`
- `notes`

## Appearance

Suggested fields:

- `id`
- `slug`
- `title`
- `titleLocalized`
- `date`
- `appearanceType`: `ost-vocal-appearance`, `album-guest-vocal`, `show`, `podcast`, `screen-guest-appearance`, or `other`
- `showContent`: optional summary for `show` records, currently `promo`; future values may include `seminar`, `speech`, `entertainment`, or similar content categories.
- `programOrWork`
- `role`
- `hosts`: optional localized host names for shows and podcasts.
- `workDetails`: optional metadata for film/series/show context, including `releaseDate`, `directors`, and `leadingCast`.
- `relatedSongs`
- `tracks`: Chyi Yu-relevant OST or guest-vocal tracks only; include whole-work music/movie platform links in `mediaLinks`.
- `performedSongs`: optional song-performance rows for shows and podcasts when a non-concert/non-music-show appearance includes singing.
- `mediaLinks`
- `sources`
- `notes`
- `status`

## Media Link

Suggested fields:

- `id`
- `platform`: `youtube`, `spotify`, `apple-music`, `official-site`, `news`, `archive`, or `other`
- `url`
- `label`
- `linkedItemType`
- `linkedItemId`
- `uploaderOrPublisher`
- `isOfficial`
- `accessDate`
- `notes`

## Source

Suggested fields:

- `id`
- `sourceType`: `official`, `album-booklet`, `platform`, `news`, `book`, `encyclopedia`, `database`, `archive`, or `other`
- `title`
- `authorOrPublisher`
- `date`
- `url`
- `accessDate`
- `citation`
- `reliability`: `high`, `medium`, `low`, or `unknown`
- `notes`

## Person

Suggested fields:

- `id`
- `slug`
- `displayName`
- `nameLocalized`
- `nameOriginal`
- `aliases`
- `roles`
- `sources`
- `notes`
- `status`

## Contributor

Suggested fields:

- `id`
- `displayName`
- `contact`
- `creditPreference`: `named`, `anonymous`, or `private`
- `contributions`
- `notes`

## Source Rules

- Official releases and official pages should be treated as high-priority sources for release metadata.
- Encyclopedia and open database sources can be useful for orientation, but should be replaced or strengthened with primary sources when possible.
- Anonymous factual claims should not become confirmed data without independent sources.
- If a contributor is the primary source, the record should say so clearly.
