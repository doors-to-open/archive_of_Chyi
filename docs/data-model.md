# Data Model

This is an early working model. It should evolve as real Chyi Yu archive records are added.

## Shared Fields

Most records should include:

- `id`: stable internal identifier.
- `slug`: URL-safe identifier.
- `title`: display title.
- `titleOriginal`: original-language title when relevant.
- `aliases`: alternate names or translations.
- `summary`: short description.
- `sources`: source IDs that support the record.
- `notes`: editorial notes.
- `status`: `confirmed`, `partial`, `uncertain`, or `needs-source`.

## Song

Suggested fields:

- `id`
- `slug`
- `title`
- `titleOriginal`
- `aliases`
- `language`
- `lyricsBy`
- `composedBy`
- `arrangedBy`
- `firstKnownRelease`
- `relatedReleases`
- `knownPerformances`
- `mediaLinks`
- `sources`
- `notes`
- `status`

## Release

Suggested fields:

- `id`
- `slug`
- `title`
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
- `duration`
- `versionNote`
- `credits`

## Performance

Suggested fields:

- `id`
- `slug`
- `title`
- `date`
- `venue`
- `city`
- `countryOrRegion`
- `eventType`: `concert`, `festival`, `tv-live`, `radio-live`, `award-show`, or `other`
- `setlist`
- `mediaLinks`
- `sources`
- `sourceQuality`
- `notes`
- `status`

## Appearance

Suggested fields:

- `id`
- `slug`
- `title`
- `date`
- `appearanceType`: `tv`, `radio`, `film`, `documentary`, `interview`, `soundtrack`, or `other`
- `programOrWork`
- `role`
- `relatedSongs`
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
- `sourceType`: `official`, `album-booklet`, `platform`, `news`, `book`, `encyclopedia`, `database`, `fan-report`, `audience-memory`, `archive`, or `other`
- `title`
- `authorOrPublisher`
- `date`
- `url`
- `accessDate`
- `citation`
- `reliability`: `high`, `medium`, `low`, or `unknown`
- `notes`

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
- Fan reports and audience memories can be valuable but should be labeled separately.
- Anonymous submissions may be accepted for personal memories, but anonymous factual claims should not become confirmed data without independent sources.
- If a contributor is the primary source, the record should say so clearly.
