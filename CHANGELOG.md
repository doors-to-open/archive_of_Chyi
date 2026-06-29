# Changelog

All notable changes to the Chyi Yu Archive are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).
Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/).

## [Unreleased]

### Added
- Concerts: `role`, `series`, `version`, and `host` fields on the `Concert` schema to distinguish Chyi Yu as headliner, co-headliner, or guest, and to anchor concert series.
- Concerts: new "Around the Fire" (圍爐) guest-appearance record — Lo Ta-yu's 2002 Beijing New Year concert where Chyi Yu co-performed five songs, with official CD and Bilibili clip sources.
- Concerts: top-level Year-stage and Region filters, plus second-level filters (Guest under Solo, Series under Concert series).
- Concerts: "All at once" flat paginated view alongside the default "By year" view, mirroring the Releases page.
- Concerts: alpha (A-Z / Z-A) sort options.
- i18n: localized labels for year stage, region, series, version, and host.
- Versioning: `CHANGELOG.md` and Conventional Commits guidance.

### Changed
- Concerts: every concert now carries `titleLocalized` with monolingual per-locale titles (EN / zh-Hant / zh-Hans), enabling the UI language switch on the concerts list for the first time.
- Concerts: titles normalized — name only, with `:` (EN) / `：` (ZH) for short:long subtitles; year, location, and collaborators moved to meta rows; decorative symbols (`·`, `・`, `—`, `～`, `／`, `「」`, etc.) removed.
- Concerts: series stops (Grace Still, Rolling Stone 30, Folk, Echo, Power Woman, Angel and Wolf) now share an identical title across stops, differing only by location meta.
- Concerts: category derivation moved from `guests.length` inference to `role` + `series`, fixing the conflation of "Chyi Yu invites a guest" with "Chyi Yu is the guest."
- Concerts: selecting a category filter now flattens the view (no year drawers); year drawers only appear in the default "By year" view with no category selected.

## [0.1.0] - 2026-06-29

### Added
- Initial public snapshot of the archive: releases, concerts, music shows, appearances, people, sources, and search.
- Concert setlist recovery and per-entry clip links.
- Releases page with Albums / Songs view toggle, pagination, and sort options.
- Concerts page with year-grouped drawers, category filter, and date sort.
- Geist-based design system tokens and i18n (EN / zh-Hant / zh-Hans) locale switch.

[Unreleased]: #unreleased
[0.1.0]: https://github.com/doors-to-open/archive_of_Chyi/releases/tag/v0.1.0