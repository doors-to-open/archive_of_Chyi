# Information Architecture

## Main Sections

The public site should read like a quiet reference index. Visitors should see the work first and the archive process only when they need sources, contribution rules, or project notes.

### Releases

Official releases and related release formats. A release page should show the album or release title, basic release information, and an expandable track list.

Each track should show core credits such as lyricist and composer. If the song has known live records, the track can expand to show linked concerts or music-show performances. Song names are not public navigation targets.

### Concerts

Concerts and concert series. A concert record should show date, location, guests when known, show-level media links, and an expandable song performance list.

Each song performance should have room for clip-level media links.

### Music Shows

Televised, streamed, or radio music-show performances. This section is separate from concerts because it is a major way singers perform live outside their own shows.

A music-show record should show the program or platform, date, episode information, performed songs, collaborators, show-level links, and clip-level links.

### Appearances

Non-concert and non-music-show appearances: talk shows, film appearances, soundtrack work, podcasts, interviews, documentaries, and similar records.

This section should separate general appearances from song-performance records.

### People

Composers, lyricists, arrangers, producers, musicians, hosts, directors, collaborators, and other people connected to archive items.

People records should eventually support relationship summaries such as frequent lyricists, composers, producers, and performance collaborators.

### Sources

Official websites, album booklets, streaming platforms, news articles, books, fan reports, archived pages, platform pages, and other evidence.

Sources are appendix material. They should be accessible from the footer, not the main navigation.

### Contribute

Instructions for corrections, additions, source requirements, credit, and review.

Contribution instructions are appendix material. They should be accessible from the footer.

### About

Site purpose, contact information, copyright/link policy, contributor credits, and project status.

About is appendix material. It should be accessible from the footer.

## Browsing Rules

### Releases

- Default sort: release date.
- Secondary views later: release type, label, format, involvement type.
- Release detail pages should show release facts, track list, credits, source coverage, and known live connections by track.
- Track titles should not link to standalone song pages.

### Concerts

- Default sort: concert date.
- Secondary views later: location, series, guests, source quality, available media.
- Concert pages should show show-level links first, then the song performance list.
- Each song performance should support clip-level links.

### Music Shows

- Default sort: date.
- Secondary views later: program, platform, episode, collaborator, related song.
- Music-show pages should show episode metadata, performed songs, collaborators, and media links.

### Appearances

- Default sort: date.
- Secondary views later: appearance type, program/work title, role, related song.
- Appearance pages should avoid mixing general appearances with concert or music-show performance records.

### People

- Default sort: alphabetic.
- Detail pages should later show credited releases, songs, concerts, music shows, appearances, and relationship counts.

### Sources

- Default sort: source type, then title.
- Source detail pages should later show which archive records each source supports.

## First Navigation

Top navigation:

- `/`
- `/releases/`
- `/concerts/`
- `/music-shows/`
- `/appearances/`
- `/people/`

Footer navigation:

- `/sources/`
- `/contribute/`
- `/about/`

Internal-only song data:

- `songs.json`

Public song routes are intentionally removed:

- no `/songs/`
- no `/songs/[slug]/`

## Relationship Priorities

The first implementation should make these relationships easy:

- Release to tracks.
- Track to internal song record.
- Internal song record to concerts.
- Internal song record to music-show performances.
- Concert to performed songs.
- Music show to performed songs and collaborators.
- Person to credits and collaborations.
- Any factual record to sources.

## Contribution Entry Points

Each public item page should eventually include a contribution action. The action should route contributors into a structured correction or addition process rather than free-form comments.

First supported contribution types:

- Correct a factual field.
- Add a missing source.
- Add an external media link.
- Add a release track or credit.
- Add a concert record.
- Add a music-show performance.
- Add a general appearance.
- Add a short personal memory or fan note.

Factual contribution forms should ask for source links. Personal memories should be stored separately from verified archive data.

## Open Information Architecture Questions

- Whether the first public version should include bilingual navigation or stay English-only until the archive model stabilizes.
- Whether media links should be shown inline under each record or grouped in a compact media panel.
- Whether OST work should stay under appearances or become its own section if enough records are added.
