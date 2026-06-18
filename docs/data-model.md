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

## Internal Song

Song records are internal identity records. They should support release tracks, concerts, music shows, people credits, statistics, and search. They should not create public song pages.

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
- `collaborators`
- `mediaLinks`
- `notes`

## Music Show

Suggested fields:

- `id`
- `slug`
- `title`
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
- `collaborators`
- `mediaLinks`
- `notes`

## Appearance

Suggested fields:

- `id`
- `slug`
- `title`
- `date`
- `appearanceType`: `talk-show`, `film`, `soundtrack`, `podcast`, `interview`, `documentary`, `book`, `article`, or `other`
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
- `sourceType`: `official`, `album-booklet`, `platform`, `news`, `book`, `encyclopedia`, `database`, `archive`, or `other`
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
- Anonymous factual claims should not become confirmed data without independent sources.
- If a contributor is the primary source, the record should say so clearly.
