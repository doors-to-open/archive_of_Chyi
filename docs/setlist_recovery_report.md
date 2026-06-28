# Setlist Recovery Report

Generated 2026-06-28; follow-up pass completed 2026-06-29. Implements the lean route agreed for `docs/setlist_recovery_plan.md`.

## Summary

| Metric | Before | After pass 1 | After follow-up | Total delta |
|---|---:|---:|---:|---:|
| Concerts with setlist | 7 | 37 | 46 | +39 |
| Concerts with empty setlist | 49 | 19 | 10 | -39 |
| Total setlist entries | 179 | 417 | 522 | +343 |
| Entries linked to a song id | 160 | 338 | 542 | +382 |
| Linked live song records (statistics page) | ~160 | 427 | 608 | +448 |
| Setlist entries with per-entry mediaLinks | 32 | 32 | 212 | +180 |
| Songs in `songs.json` | 282 | 282 | 303 | +21 |
| Sources in `sources.json` | 249 | 251 | 251 | +2 |

The "after follow-up" column reflects: pass-2 research (9 more concerts), per-entry mediaLinks promotion (110 clips), and pass-3 unmodeled-songs linking (8 existing songs re-linked via aliases + 21 new cover/folk song records + Pan Yueyun solo removal from Echo setlists). 10 concerts remain empty (no public setlist evidence).

All recovered concerts are marked `status: "partial"` pending per-city source confirmation, per the tour-propagation policy (clone as partial, upgrade per-city).

All 37 recovered concerts are marked `status: "partial"` pending per-city source confirmation, per the tour-propagation policy (clone as partial, upgrade per-city).

## What was done

### Phase 0 — Audit
- `scripts/generate-setlist-audit.mjs` emits `docs/setlist_audit.md` (reproducible). Classification: 6 confirmed-setlist, 1 partial-setlist, 25 clips-only, 24 needs-research before recovery.

### Phase 1 — Mechanical chapter extraction tool
- `scripts/extract-setlist-from-chapters.mjs`: reads a concert's existing chaptered `mediaLinks` (Bilibili multi-part via the public `web-interface/view` API; YouTube/label-based fallback), runs each part title through `scripts/import/song-match.mjs` to auto-resolve song ids, and writes a review draft to `supplement/import-drafts/<id>.setlist.json` (gitignored). Handles `《》`-wrapped song names, `【performer】` prefixes, `+`/`&` medley splits, and tagged city prefixes.
- Improved `scripts/import/song-match.mjs` tradSimp map (added 滾→滚, 紅→红, 聲→声, 響→响, 遠→远, 陽→阳, 別→别, 謎→谜, and ~200 more common pairs). This fixed many cross-variant matches (e.g. simplified 掌声响起 now resolves to song-zhang-sheng-xiang-qi).

### Phase 2 — Recovery
Three recovery modes were used, in priority order:

1. **Immediate clone** (no research): `concert-tian-shi-yu-lang-2008-taipei` ← `concert-tian-shi-yu-lang-2008-beijing` setlist (17 entries), same tour.
2. **Mechanical drafts applied** via `scripts/apply-setlist-draft.mjs` (dedup by song id, junk filtering, title cleaning):
   - `concert-mei-li-ren-sheng-1999-taipei` (16 entries, 11 linked)
   - `concert-echo-2018-taipei` (22 entries, 19 linked) — tour representative
   - `concert-echo-2019-guangzhou` (26 entries, 19 linked) — tour representative
   - `concert-olive-tree-2014-taipei` (4 entries, 4 linked) — tour representative
   - `concert-echo-2018-beijing` (7), `concert-echo-2018-nanjing` (10), `concert-huai-nian-charity-2015-singapore` (5), `concert-zhen-qing-nian-lun-2004-shanghai` (4)
   - `concert-chishang-autumn-harvest-2019-taitung` (12, 7 linked), `concert-minge-classics-2015-shanghai` (2), `concert-dian-deng-ying-guang-2016-taipei` (2), `concert-chuan-yue-yu-jian-2017-genting` (7), `concert-minge-50-2025-taipei` (1), `concert-yong-heng-de-xing-2025-taipei` (3)
3. **Tour propagation** via `scripts/clone-setlist-to-sibling.mjs` (clone representative setlist, mark partial):
   - `echo-2018` taipei → wuhan
   - `echo-2019` guangzhou → singapore
   - `olive-tree-2014` taipei → guangzhou, singapore
4. **Agent-Reach research** (Exa search) for multi-artist bills where Chyi Yu sings only a segment:
   - **珍愛女人 (Power Woman) tour** (wuhan/beijing/kunming 2011 + macau 2012): 4-song Chyi Yu segment (橄榄树, 欢颜, 梦田 duet with Pan Yue-yun, plus opening group medley) per `source-cnw-zhen-ai-nv-ren-tour-setlist` (CNW setlist report, reliability high) and `source-jendow-zhen-ai-nv-ren-2011-beijing`.
   - **滾石30 anniversary bill** (beijing/shanghai/shenzhen 2011 + hangzhou/chengdu/wuhan/guangzhou 2012): 4-song Chyi Yu segment (答案, 橄榄树, Angel, 梦田) per `source-bilibili-rollings-tone-30-2011-shanghai-chyi-yu` (clip metadata names these four) and CNTV/CFLAC cross-confirmation of 橄榄树 at Shenzhen 2011.

### Phase 4 — Validation
Enhanced `scripts/validate-release-data.mjs` (the existing validator already covered concerts):
- **Removed** the `song.knownConcerts`/`knownMusicShows` backref check (per plan §2/§10: these are derived, not manually maintained; the `liveRecordsForSong` pipeline in `archive.ts` derives concert→song links from setlists). `knownConcerts`/`knownMusicShows` are now optional legacy fields.
- **Added** duplicate media-URL detection within a concert (warnings, since one clip legitimately spans consecutive songs) and concert-vs-setlist URL overlap detection (warnings, to surface silent redundancy).
- The existing checks (song-id refs, source refs, collaborator refs, unique id/slug, date format, live-linkage gaps) were already present and still pass.

### Phase 5 — Verification
- `npm run check`: 0 errors, 0 warnings, 0 hints.
- `npm run build`: 222 pages built successfully.
- `npm run validate:releases`: passed (with 10 pre-existing-data warnings about repeated/overlapping media URLs in `concert-grace-still-chengdu-2025` and `concert-grace-still-changsha-2026`, surfaced by the new checks — these concerts already had setlists and are out of scope for this pass).
- Statistics page now shows 427 linked live song records (was ~160). Most-performed: Olive Tree (35 live records / 33 concerts), Dream Field/夢田 (23/21), Your Smiling Face/歡顏 (19/18), Angel (13/13), Answer/答案 (13/13).

## Files touched

**New scripts:**
- `scripts/generate-setlist-audit.mjs`
- `scripts/extract-setlist-from-chapters.mjs`
- `scripts/apply-setlist-draft.mjs`
- `scripts/clone-setlist-to-sibling.mjs`

**Edited:**
- `scripts/import/song-match.mjs` (expanded tradSimp map)
- `scripts/validate-release-data.mjs` (dropped knownConcerts backref; added media-URL overlap/dup warnings)
- `data/concerts.json` (30 concerts' setlists filled; clone notes appended)
- `data/sources.json` (+2 tour-level sources: `source-cnw-zhen-ai-nv-ren-tour-setlist`, `source-jendow-zhen-ai-nv-ren-2011-beijing`)

**New docs:**
- `docs/setlist_audit.md`
- `docs/setlist_recovery_report.md` (this file)

**Not touched (per the agreed lean route):**
- `data/songs.json` — no new song ids created this pass; `knownConcerts`/`knownMusicShows` left as legacy.
- `src/lib/archive.ts` — derived pipeline already works; no edits.
- `src/components/SongSummaryCard.astro` — already consumes derived `liveRecords`; no edits.
- `package.json` — no new npm scripts added (the new scripts are run directly via `node`).

## Follow-up pass (2026-06-29): deferred clips-only & no-media concerts

Researched the 19 deferred concerts via Agent-Reach (Exa search + Jina reader + Bilibili/YouTube metadata). 9 recovered; 10 remain empty (no public setlist evidence exists).

**Recovered in the follow-up (9 concerts, +126 entries):**

| Concert | Source | Entries | Linked |
|---|---|---:|---:|
| `concert-zhen-ai-nv-ren-2017-macau` | Bilibili fan-recording description (BV1Yx41187ZR, 17:55) | 4 | 0 (covers/group songs not modeled) |
| `concert-minge-40-2016-shenzhen` | YouTube clip description (wU1rdzm90F8, 齊豫部分) | 4 | 4 |
| `concert-gan-en-charity-2017-singapore` | Zaobao post-event review (high reliability) | 13 | 11 |
| `concert-fenghua-charity-2018-taipei` | PChome detailed attendee setlist (白菜2) | 23 | 13 |
| `concert-echoes-back-2022-taipei` | Vocus detailed attendee report (DD) | 33 | ~20 |
| `concert-hui-yi-shi-yu-ge-de-qi-yu-2003-taipei` | Official VCD tracklist (美丽邂逅, douban 1458145) | 22 | 21 |
| `concert-yun-duan-2012-taipei` | Pixnet attendee review (ned921; partial, order unconfirmed) | 13 | 13 |
| `concert-jing-dian-jin-qu-hao-ting-2007-taipei` | PChome detailed attendee report (Gina) | 7 | 5 |
| `concert-jing-dian-hao-ting-2008-genting` | Cloned from 2007 Taipei (pre-event news confirms same setlist) | 7 | 5 |

Notes on the recovered follow-up concerts:
- `fenghua-charity-2018-taipei` and `jing-dian-jin-qu-hao-ting-2007-taipei` are multi-artist bills; the Chyi-Yu-only rule was applied (pure 吳青峰/趙詠華/周治平/羅大佑/潘越雲 solo segments excluded, duets/group numbers with Chyi Yu included).
- `echoes-back-2022-taipei` is a co-billed 齊豫+潘越雲 Echo anniversary show; per the echo-2018 precedent both singers' repertoire is included, with 潘越雲 solos marked via `collaborators`.
- `yun-duan-2012-taipei` setlist order is unconfirmed (the review is impressionistic); positions approximate.
- Two linkage gaps were caught by the validator and fixed: 有没有这种说法 → `song-any-words-like-this` (alias was pinyin-only), Annie's Song → `song-annie-s-song`.

## Completed follow-ups (2026-06-29)

**grace-still media-URL cleanup:**
- Removed 2 redundant concert-level mediaLinks that duplicated setlist-level placement: `BV1YWYMzyEYZ/` (Wu Tsing-fong guest segment) from `concert-grace-still-chengdu-2025`, and `BV16idWB3Ek2/` (Cheng Fangyuan guest segment) from `concert-grace-still-changsha-2026`. The setlist-level entries fully capture these guest segments.
- The remaining 8 duplicate-setlist-URL warnings in grace-still are **intentional and retained**: one Bilibili chapter legitimately spans 2-3 consecutive songs (medley / no chapter break), and the clip is correctly attached to each song it covers so every song's live record shows its clip. Kept as informational alerts.

**Per-entry mediaLinks promotion (Phase 3):**
- New `scripts/promote-setlist-media.mjs`: re-fetches Bilibili multi-part video metadata, matches each part to a setlist entry by resolved song id (or normalized title, preferring the longest match to avoid 告別 matching inside 不曾告別), and attaches `?p=N` URLs to the entries' `mediaLinks`. Also auto-removes concert-level copies that become redundant.
- Applied to 8 eligible concerts, adding **110 per-entry mediaLinks** total (mei-li-ren-sheng-1999: 16, echo-2018-taipei: 28, echo-2019-guangzhou: 30, echo-2018-nanjing: 9, echo-2018-beijing: 6, tian-shi-yu-lang-2008-beijing: 17, olive-tree-2014-taipei: 4, zhen-qing-nian-lun-2004-shanghai: 0 — its videos aren't song-chaptered).
- Also removed 3 newly-redundant concert-level `?p=N` copies from `concert-olive-tree-2014-taipei`.
- Setlist entries with per-entry mediaLinks rose from 32 to **212**.

**zhen-qing-nian-lun-2004-shanghai setlist rebuild:**
- The mechanical-extraction placeholder for this concert had only junk-label entries. Replaced with the authoritative 25-song setlist from the official pre-event announcement (Epoch Times, 齊豫演唱會曲目曝光). 齊秦 guest duets (藤纏樹, 夢田) included; the 齊秦 solo segment (大約在冬季＋原來的我) excluded per the Chyi-Yu-only rule.

## Completed follow-ups (2026-06-29): unmodeled songs

**Matcher fix:**
- `scripts/import/song-match.mjs`: `buildSongMatcher` now indexes `titleLocalized.*` values (previously only `title`/`titleOriginal`/`aliases`), fixing misses like `不曾告別` (whose Chinese title lived only in `titleLocalized`). Added missing trad-simp pair 愿→愿.

**Linked 8 existing songs via new aliases:**
- `song-lian-hua-chu-chu-kai` ← 一念心清淨蓮花處處開 (full Buddhist-gatha title)
- `song-ai-de-zhen-yan` ← 爱的笺言 (笺/箴 variant)
- `song-shi-qi-sui` ← At Seventeen (English title of the 十七岁 cover)
- `song-qiao-di` ← Geordie (English title of the 乔第 cover)
- `song-bo-ruo-bo-luo-mi-duo-xin-jing` ← 般若波羅密多心經 (密/蜜 variant + traditional)
- `song-amazing-grace` ← 奇異恩典 (Chinese title of the hymn)
- `song-not-saying-goodbye` ← 不曾告別 (via titleLocalized matcher fix)
- `song-wo-yuan-yi` ← 我愿意 (via 愿→愿 matcher fix)

**Removed Pan Yueyun solo entries from Echo co-billed setlists:**
- 21 entries removed across `echo-2018-taipei/wuhan`, `echo-2019-singapore/guangzhou`, `echoes-back-2022-taipei` (鎖上記憶, 相思已是不曾閑, 浮生千山路, 謝謝你曾經愛我, 天天天藍, 野百合也有春天, 守著陽光守著你, 我是不是你最疼爱的人). Per the stricter Chyi-Yu-only rule, these Pan Yueyun solos (performed BY Pan Yueyun, not Chyi Yu) are excluded. Group numbers and already-linked duets retained.

**Created 21 new song records** (covers + folk; `data/songs.json` 282 → 303):
- Other-artist covers (14): 滾滾紅塵, 追夢人, 天堂, 天空, 愛的代價, 明天我要嫁给你, 沈默是金, 海海人生, 驛動的心, 夜來香, 其實都是一樣, And I Love You So, Dancing Queen, When Will I See You Again
- Campus folk songs (5): 看我聽我, 浮雲遊子, 風中的早晨, 阿蘭娜, 牽掛
- Covers with pending original-performer (2): 我的思念 (蔡琴 cover), 無言的歌 (original pending)
- Credits populated (`composedBy`) where a verified person record exists: 羅大佑 (滾滾紅塵/追夢人), 李宗盛 (愛的代價), 周華健 (明天我要嫁给你), 梁弘志 (驛動的心). All others use the notes-only "Cover; original performer X, YEAR" pattern matching the existing cover-song convention.

**Linked the new ids + handled medleys:**
- `scripts/link-null-songs.mjs` auto-linked 54 entries total (20 from the 8 existing songs + 34 from the 21 new songs), including 5 medley conversions to `songParts`: 爱的笺言+是否, 沈默是金+海海人生, 牽掛+不曾告別.
- 36 `song: null` entries remain — all are genuine non-song segments (Opening, Talking, Encore, clip-only labels, Official short clip) with no song identity to link.

## Still empty after follow-up (10 concerts)

These genuinely lack public setlist evidence. Per the direct-edit policy, no setlist was fabricated; they retain their existing `needs-source`/`partial` status.

**Prison charity concerts (6)** — private 法鼓山 心幸福音乐会 / prison events with no public song list:
- `concert-ai-yu-xi-wang-2019-jiayi` (嘉義监狱; full video exists but has no chapters/description)
- `concert-xin-xing-fu-2012-tainan` (台南监狱; full video, no chapters)
- `concert-xin-xing-fu-2013-pingdong`, `concert-xin-xing-fu-2014-taoyuan`, `concert-xin-xing-fu-2016-yilan`, `concert-xin-xing-fu-2017-taizhong` (心幸福 prison series; needs-source, no online setlist)

**Needs-source one-offs (4)** — no online setlist evidence located:
- `concert-jing-dian-yin-le-ye-2019-macau` (齊豫·齊秦)
- `concert-tian-lai-zhi-yin-yun-ding-2008-malaysia` (天籟之音; possible reference conflict)
- `concert-ai-ci-bei-guan-huai-2024-changhua` (愛、慈悲與關懷)
- `concert-a-na-ya-sanya-2025-hainan` (阿那亞·三亞新春; the 2026 event page lists different artists)

Recovering these would require either an attendee coming forward with a setlist, official event documentation, or manually viewing the two prison-charity full videos (ai-yu-xi-wang-2019, xin-xing-fu-2012) to transcribe songs by ear — out of scope for this research pass.

## Remaining optional follow-up

- **Enrich credits** for the 21 new cover/folk songs: where `composedBy`/`lyricsBy` were left empty (songwriter not in people.json or credit unverified), a future pass could add person records for 蘇來, 王夢麟, 黎錦光, 鄭怡, 王菲, etc. and populate the credits.
- **`無言的歌` original performer**: currently noted as "pending"; verify whether it's a 李泰祥/Pan Yueyun song or another artist's.
- **9 Pan Yueyun song records not created**: since her Echo-show solos were excluded from setlists, no song records were created for 天天天蓝/野百合也有春天/etc. If the Chyi-Yu-only rule is later relaxed for co-billed tours, these would be needed.

## Commands run

```bash
node scripts/generate-setlist-audit.mjs
node scripts/extract-setlist-from-chapters.mjs --all --fetch
node scripts/apply-setlist-draft.mjs --concert <id>          # per concert
node scripts/clone-setlist-to-sibling.mjs --from <src> --to <dst>
npm run check          # 0 errors
npm run build          # 222 pages
npm run validate:releases  # passed
```