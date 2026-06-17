# Sitemap

This document describes the first planned site map and the role of each route. It is a planning document, not a generated XML sitemap.

## Top Level

### `/`

Home page. It should introduce the archive purpose briefly and route visitors into the main archive sections. It should not become a marketing landing page; the first screen should help users browse the archive.

Primary links:

- Songs
- Albums / Discography
- Performances
- Appearances
- Sources
- Contribute

### `/songs/`

Song index. This should become the main dictionary-like entry point.

Expected controls:

- Search by English title, original title, alias, lyricist, composer.
- Filter by language.
- Sort by title, first known release year, and known performance count.

### `/songs/[slug]/`

Song detail page.

Expected sections:

- Basic titles and aliases.
- Credits.
- Release appearances.
- Known live performances.
- External media links.
- Source list.
- Contribution action.
- Optional fan memories later.

### `/releases/`

Release index for albums, singles, compilations, reissues, collaborations, soundtracks, and other release appearances.

Expected controls:

- Filter by release type.
- Sort by release date.
- Search by title, label, catalog number.

### `/releases/[slug]/`

Release detail page.

Expected sections:

- Release metadata.
- Track list linked to song records.
- Credits.
- External platform links.
- Sources.
- Notes.

### `/performances/`

Concert and live performance index.

Expected controls:

- Filter by event type.
- Filter by source quality.
- Sort by date.
- Search by event, venue, city, and song.

### `/performances/[slug]/`

Performance detail page.

Expected sections:

- Event metadata.
- Setlist when known.
- Related songs.
- External media links.
- Source confidence.
- Notes.

### `/appearances/`

TV, radio, film, documentary, interview, soundtrack, and other appearance index.

Expected controls:

- Filter by appearance type.
- Sort by date.
- Search by program/work title and related song.

### `/appearances/[slug]/`

Appearance detail page.

Expected sections:

- Program or work metadata.
- Role or involvement.
- Related songs.
- Media links.
- Sources.

### `/people/`

People index for credits and relationships.

Expected controls:

- Search by name.
- Filter by role.

### `/people/[slug]/`

Person detail page.

Expected sections:

- Known roles.
- Song credits.
- Release credits.
- Appearance or performance relationships.
- Sources.

### `/sources/`

Source index.

Expected controls:

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

Contribution instructions.

Expected sections:

- How to submit corrections.
- Source requirements.
- Credit choices.
- What anonymous submissions can and cannot be used for.
- How factual claims differ from personal memories.

### `/about/`

Site purpose, project status, contact route, credits, copyright/link policy, and non-affiliation disclaimer.

## Later Routes

These should wait until the basic archive works:

- `/timeline/`
- `/statistics/`
- `/media/`
- `/memories/`
- `/changelog/`
- `/contributors/`

