# Release Wrap-Up Audit

Date: 2026-06-26

## Source Checks

- Re-ran the release-coverage inventory against the current local `data/releases.json`, MusicBrainz release groups for artist `8e6ad6fb-7519-4f78-92bb-ecde3475ad1d`, existing reviewed Wikipedia source records, and QQ Music public search. The local archive had 33 releases before this pass.
- Added partial coverage records for 13 missing release-level candidates: `明天會更好`, `The Unforgettable Stories of CHYI`, `滚石珍藏版金金碟系列·齐豫24K黄金精选`, `唱經給你聽：順心、安心、快樂行三部曲`, `重逢齊豫民歌精選輯`, `Singles 1997-1999`, `二十年精選：永遠的橄欖樹`, `Indescribable Night`, `滾石香港黃金十年：齊豫精選`, `童年・藍天・橄欖樹 回憶三部曲`, `不曾告別（三毛姐姐如晤）`, `奇異恩典`, and `你是我的天使`.
- QQ Music corroborated current platform identities for `明天会更好`, the combined `唱经给你听-顺心、安心、快乐行三部曲`, `滚石香港黄金十年齐豫精选`, `不曾告别（三毛姐姐如晤）`, and `你是我的天使`.
- NetEase Cloud Music public album search matched 13 release records with direct album pages: `The Olive Tree`, `Blessing`, `Stories`, `Whoever Finds This, I Love You`, `Paradise Bird`, `Any Words Like This?`, `Buddha Heart`, `Kshitigarbha Praise`, `Ape Sounds`, `One Thought Between`, the combined `唱经给你听-顺心、安心、快乐行三部曲`, `重逢齊豫民歌精選輯`, and `滾石香港黃金十年：齊豫精選`. These were added as official China-mainland streaming links.
- NetEase false positives were rejected for `Tomorrow Will Be Better` by another artist, `Indescribable Night` by Kate St. John, and generic `橄榄树` matches when searching unrelated compilations.
- Apple Music/iTunes Search was checked beyond the three existing Apple Music links. A full automated pass timed out; a narrower Taiwan pass for records without Apple Music links returned no new high-confidence matches. Existing Apple Music links remain for `The Olive Tree`, `Echo`, and `Camel Bird Fish`.
- Search checks for Spotify, KKBOX, MyMusic, and YouTube Music did not return stable release-detail matches that could be accepted without a logged-in or JavaScript-heavy browser session. No links from those platforms were added in this pass.
- Purchase check found official Apple/iTunes album prices for `The Olive Tree`, `Echo`, and `Camel Bird Fish` in Taiwan, Hong Kong, and the United States through the iTunes Search API. Purchase links were added for those three releases only.
- Rechecked soundtrack appearances after the release move. `Eight Taels of Gold OST` keeps the three Chyi Yu vocal tracks from the maintained QQ source, with credits only on `船歌`; the `Xiu Xiu: The Sent Down Girl OST` appearance now uses the film-title + OST naming rule and keeps the Chyi Yu vocal tracks from the Chyi Yu page soundtrack table.
- `奇異恩典`, `重逢齊豫民歌精選輯`, `二十年精選：永遠的橄欖樹`, `童年・藍天・橄欖樹 回憶三部曲`, `The Unforgettable Stories of CHYI`, and the 24K collection still need non-MusicBrainz corroboration before full track import.
- `Singles 1997-1999` was retained as a Wikipedia-led placeholder because Chinese Wikipedia lists it but QQ public search and the MusicBrainz release-group check did not expose a matching official album identity. `Indescribable Night` was retained as a partial single because Wikipedia lists it separately while QQ currently exposes it only under `The Unheard Of Chyi`.
- Wikipedia API requests from this environment timed out on 2026-06-26, so the live cross-check used existing reviewed Wikipedia source records already in `data/sources.json` plus MusicBrainz and QQ Music. The failed API path should not be treated as negative evidence.
- Verified the project-maintainer QQ short link for `Turning` with the QQ Music album importer. It resolves to album MID `002HM2yh0OU8N2`, title `Turning`, public date `1999-09-14`, and 12 tracks. QQ API artist fields list Suzanne Ciani, so the archive keeps only the Chyi Yu-related title-track appearance instead of modeling the whole album as a Chyi Yu release.
- Checked QQ Music public search API variants for `一念之间`/`一念之間`, `在水中`, `在空中`, `吴青峰`/`吳青峰`, and `齊豫`/`齐豫`. No official QQ song or album match was returned on 2026-06-25.
- Used existing reviewed Wikipedia source records as the release-coverage cross-check for `一念之間`, `Whispering Steppes - Desirous Water`, and `Over the Cloud / 雲端`. NetEase Cloud Music now supplies the official China-mainland platform page for the Wu Tsing-fong 2025 collaboration single; QQ Music still did not expose a direct public-search match.
- Agent Reach skill files were present, but the `agent-reach` CLI was not on the Windows PATH in this workspace. WSL exposed `mcporter`, but the attempted Exa query failed at shell quoting and direct Wikipedia API fetch failed from this environment, so the durable recorded checks are QQ API calls, MusicBrainz API calls, existing source records, and local verification.

## Data Decisions

- Added 13 partial release records so known release groups are no longer omitted from Releases. Release coverage count is now 46 records.
- New coverage placeholders remain `partial` until later passes fill formats, platform availability, purchase status, credits, and track lists.
- Added source-backed format data for 30 releases using explicit MusicBrainz release-media rows. Applied formats include cassette, vinyl, CD, SACD, and digital. Blank media rows and pseudo-release-only rows were not treated as format evidence.
- Left format values unresolved where source rows did not expose a medium or where the release is not clearly matched to an explicit MusicBrainz media row. Those records are: `Stories`, `Love of My Life`, `CHYI'S TEARS`, `I Swear`, `Wonderful World`, `Impression Liu Sanjie`, `Buddha Heart`, `The 37 Teachings of Buddha`, `Morning Bell Gatha / Cundi Mantra`, `Eight Auspicious Prayer / Thirty-Seven Practices of Bodhisattvas`, `Kshitigarbha Praise`, `Singles 1997-1999`, and `Indescribable Night`.
- Added 13 NetEase Cloud Music streaming links with `accessRegion: China mainland`.
- Added Apple/iTunes purchase links for the three releases where the lookup API returned collection prices. The purchase UI should be conditional: show it only on releases with purchase links, and do not show a site-wide purchase filter/option as if every release is buyable.
- Removed soundtrack voice appearances from `data/releases.json`; soundtrack/voice material now lives in `data/appearances.json`.
- Updated soundtrack appearance track credits: `Xiu Xiu: The Sent Down Girl OST` now records source-backed lyric/composer fields for `Windflower`, `Whispering Steppes`, `Turning`, `The Rose`, and `I Swear`; unresolved Eight Taels credits remain intentionally blank rather than inferred.
- Moved `Turning` out of releases and into appearances using the user-supplied QQ album context plus the existing 1998 QQ collaboration source.
- Updated `release-one-thought-between-2025` as the Wu Tsing-fong and Chyi Yu 2025 digital collaboration single. It now has two version tracks, `一念之間 - 在水中` and `一念之間 - 在空中`, linked song records, Chyi Yu lyric credit, and a NetEase Cloud Music streaming link; composer and duration remain unresolved.
- Purchase availability remains hidden unless a real official purchase link is present.

## Display Decisions

- Normalized common UI terminology in `src/lib/i18n.ts`: Releases now read as music releases in Chinese, Appearances as performances/appearances, availability as available sources, streaming as streaming platforms, and religious filters as religious/chanting albums.
- Split release-type labels so a true `single` displays as Singles/單曲/单曲 while the release filter can still group EPs and singles together.
- Added localized appearance-type values so appearance cards and detail pages show terms such as soundtrack appearance, collaboration, and talk show instead of raw data keys.
- Extended item-level language support: every release now has `en`, `zh-Hant`, and `zh-Hans` title values; `Camel Bird Fish / 駱駝‧飛鳥‧魚` also has localized track-title values. English cover album titles remain English across locales where translating would reduce recognition.
- Added rendering support for optional localized notes/version notes, but did not bulk-translate unresolved notes. The validator now guards against corrupted localized text before such fields can ship.
- Release filters now cover studio albums, EPs/singles, compilations, collaborations, English cover albums, religious/chanting albums, live albums, reissues, and other releases. Filter labels include counts, and religious filtering uses explicit known release IDs plus safe English keywords to avoid false matches from unrelated Chinese titles.
- Release detail availability now uses a region/platform grid of links with official/unofficial markers, while physical formats are shown separately as a compact checklist. The top metadata row intentionally does not repeat format.
- Verification note: `npm run check` and `npm run validate:releases` pass after the display changes. `npm run build` still fails with `Could not resolve entry module "astro/entrypoints/prerender"`, which appears unrelated to the release layout change; the dev server served `/releases/olive-tree-1979/` successfully for an HTTP markup check.

## Remaining Gaps

- Physical formats are still incomplete for many releases. Existing `unknown` values should be replaced only by booklet, label, Discogs/MusicBrainz, or platform-backed evidence.
- Apple Music/Spotify/KKBOX/MyMusic/NetEase coverage is not complete enough to mark global streaming availability. Current links should be read as platform-specific records, not exhaustive availability.
- `Eight Taels of Gold OST` still needs public lyric/composer credits for `紅棉` and `亂`.
