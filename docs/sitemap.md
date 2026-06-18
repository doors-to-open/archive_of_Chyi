# Sitemap

This document describes the first planned site map and the role of each route. It is a planning document, not a generated XML sitemap.

## Top Level

### `/`

Home page. It should give a short entry point into the archive without explaining the project machinery.

Primary links:

- Search
- Releases
- Concerts
- Music Shows
- Appearances
- People

Footer links:

- Sources
- Contribute
- About

### `/search/`

Global search across the main user-facing discovery targets: songs, albums, concerts, and people.

Expected controls:

- Search by title, original title, alias, person, date, source, release track, concert song, or program/work title.
- Filter by song, album, concert, or person.
- Link results to the nearest public route. Internal song records should link to their release context rather than to standalone song pages.
- Show song results as expandable song summaries, not as standalone song pages.

### `/releases/`

Release index for albums, singles, compilations, reissues, collaborations, soundtracks, and other release appearances.

Expected controls later:

- Filter by release type.
- Switch between album and song views.
- Sort by release date, alphabetic title, and live-record counts.
- Search by title, label, catalog number, track title, lyricist, and composer.

### `/releases/[slug]/`

Release detail page.

Expected sections:

- Release metadata.
- Expandable track list.
- Track sorting by album order, alphabetic title, and linked live-record counts.
- Track-level lyricist, composer, arrangement, version, and duration when known.
- Known concert and music-show connections by track.
- External platform links.
- Sources.
- Notes.

Track titles should not link to standalone song pages.

### `/concerts/`

Concert and concert-series index.

Expected controls later:

- Filter by location.
- Filter by source quality.
- Sort by date.
- Search by concert title, venue, city, guest, and song.

### `/concerts/[slug]/`

Concert detail page.

Expected sections:

- Concert or series metadata.
- Show-level media links.
- Guests when known.
- Expandable song performance list.
- Clip-level media links per song performance.
- Source confidence.
- Notes.

### `/music-shows/`

Music-show performance index for televised, streamed, and radio music programs.

Expected controls later:

- Filter by program or platform.
- Sort by date.
- Search by episode, collaborator, and performed song.

### `/music-shows/[slug]/`

Music-show detail page.

Expected sections:

- Program, platform, and episode metadata.
- Performed songs.
- Collaborators.
- Show-level media links.
- Clip-level media links.
- Sources.

### `/appearances/`

General appearance index for talk shows, film appearances, soundtrack work, podcasts, interviews, documentaries, and similar records.

Expected controls later:

- Filter by appearance type.
- Sort by date.
- Search by program/work title, host, role, and related song.

### `/appearances/[slug]/`

Appearance detail page.

Expected sections:

- Program or work metadata.
- Role or involvement.
- Related songs when relevant.
- Media links.
- Sources.

### `/people/`

People index for credits and relationships.

Expected controls later:

- Search by name.
- Filter by role.
- Sort by relationship counts.

### `/people/[slug]/`

Person detail page.

Expected sections:

- Known roles.
- Release and track credits.
- Concert collaborations.
- Music-show collaborations.
- General appearances.
- Sources.

### `/sources/`

Source index. This is appendix navigation, not a primary archive category.

Expected controls later:

- Filter by source type.
- Filter by reliability.
- Search by title, publisher, author, and URL.

### `/sources/[slug]/`

Source detail page.

Expected sections:

- Citation.
- Source type.
- Reliability note.
- Archive records supported by the source.

### `/contribute/`

Contribution instructions. This is appendix navigation.

Expected sections:

- How to submit corrections.
- Source requirements.
- Credit choices.
- What anonymous submissions can and cannot be used for.
- How factual claims differ from personal memories.

### `/about/`

Site purpose, project status, contact route, credits, copyright/link policy, and non-affiliation disclaimer. This is appendix navigation.

## Removed Public Routes

Song records remain in the data layer, but public song pages are removed:

- no `/songs/`
- no `/songs/[slug]/`

### `/statistics/`

Statistics page for the current reviewed dataset.

Expected sections:

- Archive totals.
- Known concert and music-show performances per internal song record.
- Release, concert, music-show, and appearance distributions.
- Source coverage and status distribution.

## Later Routes

These should wait until the basic archive works:

- `/timeline/`
- `/media/`
- `/memories/`
- `/changelog/`
- `/contributors/`
