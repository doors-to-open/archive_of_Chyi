# Information Architecture

## Main Sections

The site should be organized for two kinds of visitors:

- A new fan who wants a clear path into Chyi Yu's work.
- A returning fan or contributor who wants to locate a specific item and verify details.

### Songs

The central archive object. A song can connect to releases, performances, composers, lyricists, arrangers, external media, translations, notes, and fan memories.

### Albums / Discography

Official releases and related release formats. This section should support studio albums, compilations, singles, collaborations, reissues, and appearances on other artists' or compilation releases.

### Concerts / Live Performances

Concerts, televised live events, festival performances, and other known live appearances. Some records may be official, while others may come from audience reports.

### TV / Radio / Film Appearances

Broadcast, interview, acting, soundtrack, documentary, and special-program appearances.

### People / Credits

Composers, lyricists, arrangers, producers, musicians, directors, hosts, and other people connected to archive items.

### Sources

Official websites, album booklets, streaming platforms, news articles, books, fan reports, archived pages, YouTube pages, and other evidence.

### Contribute

Instructions for corrections, additions, source requirements, credit, and review.

### About

Site purpose, contact information, copyright/link policy, contributor credits, and project status.

## Browsing Rules

### Songs

- Default sort: alphabetic by English display title.
- Secondary views: original title, first known release year, language, lyricist, composer, live performance count.
- Song detail pages should prioritize relationships: releases, known performances, media links, credits, sources, and notes.

### Albums / Discography

- Default sort: release date.
- Secondary views: release type, label, format, involvement type.
- Release detail pages should show track list, credits, source coverage, and linked song records.

### Concerts / Live Performances

- Default sort: performance date, newest or oldest toggle later.
- Secondary views: event type, place, source quality, available media.
- Performance detail pages should show setlist when known, links to performed songs, media links, and source confidence.

### TV / Radio / Film Appearances

- Default sort: date.
- Secondary views: appearance type, program/work title, related songs.
- Appearance detail pages should separate broadcast/work metadata from song-performance metadata.

### People / Credits

- Default sort: alphabetic.
- Detail pages should show credited songs, releases, performances, and appearances.

### Sources

- Default sort: source type, then title.
- Detail pages should show which archive records a source supports.

## First Navigation

- `/`
- `/songs/`
- `/songs/[slug]/`
- `/releases/`
- `/releases/[slug]/`
- `/performances/`
- `/performances/[slug]/`
- `/appearances/`
- `/appearances/[slug]/`
- `/people/`
- `/people/[slug]/`
- `/sources/`
- `/contribute/`
- `/about/`

## Relationship Priorities

The first implementation should make these relationships easy:

- Song to releases.
- Song to performances.
- Song to media links.
- Release to tracks.
- Performance to performed songs.
- Any factual record to sources.

## Contribution Entry Points

Each item detail page should eventually include a contribution action. The action should route contributors into a structured correction or addition process rather than free-form comments.

First supported contribution types:

- Correct a factual field.
- Add a missing source.
- Add an external media link.
- Add a performance record.
- Add a short personal memory or fan note.

Factual contribution forms should ask for source links. Personal memories should be stored separately from verified archive data.

## Open Information Architecture Questions

- Whether the first public version should include bilingual navigation or stay English-only until the archive model stabilizes.
- Whether media links should be shown inline on item pages or grouped in a separate media panel.
- Whether "Movies" should be a top-level section or live under broader appearances until there is enough content.
