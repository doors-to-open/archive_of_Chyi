# Release Wrap-Up Audit

Date: 2026-06-25

## Source Checks

- Verified the project-maintainer QQ short link for `Turning` with the QQ Music album importer. It resolves to album MID `002HM2yh0OU8N2`, title `Turning`, public date `1999-09-14`, and 12 tracks. QQ API artist fields list Suzanne Ciani, so the archive keeps only the Chyi Yu-related title-track appearance instead of modeling the whole album as a Chyi Yu release.
- Checked QQ Music public search API variants for `一念之间/一念之間`, `在水中`, `在空中`, `吴青峰/吳青峰`, and `齐豫/齊豫`. No official QQ song or album match was returned on 2026-06-25.
- Used existing reviewed Wikipedia source records as the release-coverage cross-check for `一念之間`, `Whispering Steppes - Desirous Water`, and `Over the Cloud / 雲端`. Official platform corroboration for the Wu Tsing-fong 2025 release is still pending.
- Agent Reach skill files were present, but the `agent-reach` CLI was not on the Windows PATH in this workspace. WSL exposed `mcporter`, but the attempted Exa query failed at shell quoting and direct Wikipedia API fetch failed from this environment, so the durable recorded checks are the QQ API calls, existing source records, and browser-visible local verification.

## Data Decisions

- Removed soundtrack voice appearances from `data/releases.json`; soundtrack/voice material now lives in `data/appearances.json`.
- Moved `Turning` out of releases and into appearances using the user-supplied QQ album context plus the existing 1998 QQ collaboration source.
- Added `release-one-thought-between-2025` as a partial single/EP record for the Wu Tsing-fong and Chyi Yu collaboration because the task explicitly flagged it and the existing Chinese Wikipedia source records the 2025-09-12 release date.
- Fixed the literal `??` placeholder in `Over the Cloud / 雲端`.
- Purchase availability remains hidden unless a real official purchase link is present. No official purchase links are currently modeled.

## Remaining Gaps

- Physical formats are still incomplete for many releases. Existing `unknown` values should be replaced only by booklet, label, Discogs/MusicBrainz, or platform-backed evidence.
- Apple Music/Spotify/KKBOX/MyMusic/NetEase coverage is not complete enough to mark global streaming availability. Current links should be read as platform-specific records, not exhaustive availability.
- `Eight Taels of Gold OST` still needs public lyric/composer credits for `紅棉` and `亂`.
