# Release Follow-Up Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Correct the release follow-up data and simplify the release archive UI so source-backed release, appearance, category, streaming, and physical-buy information are accurate.

**Architecture:** Keep source-led data corrections separate from UI changes. Use existing JSON datasets and archive helpers as the boundary: data tasks update `data/*.json`, helper tasks refine category/availability semantics in `src/lib/archive.ts`, and UI tasks consume those helpers without adding new data rules in page templates.

**Tech Stack:** Astro 6, TypeScript, JSON data files, Node validation scripts, browser verification through the local Astro dev server.

## Global Constraints

- Process `task-notes/task_0626_1_release_wrap_up_follow_up.md` point by point and report results after each point.
- QQ Music and other streaming platform pages are authoritative enough for album formats, OST classification, and appearance records when clear.
- Chyi Yu-owned albums stay in `data/releases.json`; OST vocal appearances and charity/collaboration participations belong in `data/appearances.json`.
- Do not add every performer from charity albums to `data/people.json`.
- `Buy` means verified current physical CD/Vinyl purchase availability only; digital purchase links are streaming or metadata, not purchase availability.
- Use one user-facing category concept; keep internal `releaseType` only for data semantics, validation, sorting, and search.
- Make `Other` a fallback category only.
- Do not commit `.superpowers/`; it is visual-companion working state.

---

## File Structure

- Modify `data/releases.json` for physical format corrections, removal of misclassified appearances, streaming links, and purchase cleanup.
- Modify `data/appearances.json` for `Impression Liu Sanjie`, `Tomorrow Will Be Better`, the two missed OSTs, and the additional charity/collaboration album.
- Modify `data/sources.json` for QQ Music, Spotify, YouTube Music, Kugou Music, and credit-research source records used by changed data.
- Modify `data/songs.json` only when an appearance needs a stable related song identity already implied by the archive.
- Modify `data/people.json` only for lyricists/composers/producers who are credited and not already present.
- Modify `src/lib/archive.ts` for category fallback behavior and physical purchase availability helpers.
- Modify `src/lib/i18n.ts` only if new labels are needed for the dropdown or physical purchase copy.
- Modify `src/pages/releases/index.astro` for the Geist-style category dropdown and duplicate category/type removal on cards.
- Modify `src/pages/releases/[slug].astro` for duplicate category/type removal and simplified availability rendering.
- Modify `src/styles/global.css` for dropdown/select polish and availability spacing.
- Use `scripts/import/qq-album.mjs` to resolve QQ Music short links and generate review candidates/raw snapshots when useful.
- Use `scripts/validate-release-data.mjs` and `package.json` scripts already present for release validation.

## Tasks

### Task 1: Source-Led Data Corrections

**Files:**
- Modify: `data/releases.json`
- Modify: `data/appearances.json`
- Modify: `data/sources.json`
- Modify: `data/songs.json` only if a corrected appearance needs a stable song identity
- Modify: `data/people.json` only for credited lyricists/composers not already present
- Reference: `task-notes/task_0626_1_release_wrap_up_follow_up.md`
- Reference: `scripts/import/qq-album.mjs`
- Test: `scripts/validate-release-data.mjs`

**Interfaces:**
- Consumes: Existing `Release`, `Appearance`, `Song`, `Person`, and `Source` JSON shapes from `src/lib/archive.ts`.
- Produces: Source-backed data where releases and appearances can be consumed by `releases`, `appearances`, `releaseCategoryTags(release)`, and `appearanceAvailabilityChecks(appearance)` without special UI cases.

- [ ] **Step 1: Resolve the QQ Music links from the task note**

Run each user-supplied QQ link through the existing importer so short links resolve and raw/draft snapshots are saved for review:

```bash
node scripts/import/qq-album.mjs --url "https://c6.y.qq.com/base/fcgi-bin/u?__=5P2SIhBX70Jq" --access-date 2026-06-26
node scripts/import/qq-album.mjs --url "https://c6.y.qq.com/base/fcgi-bin/u?__=tSzgDMBX7JF7" --access-date 2026-06-26
node scripts/import/qq-album.mjs --url "https://c6.y.qq.com/base/fcgi-bin/u?__=koUa5yzX7vgA" --access-date 2026-06-26
```

Expected: each command prints JSON with `url`, `title`, `tracks`, `draftPath`, and `rawSnapshotPath`. If the duplicate `tSzgDMBX7JF7` task-note link resolves once, do not create duplicate records.

- [ ] **Step 2: Inspect existing misclassified records before editing**

Confirm these records exist and are currently release-modeled:

```bash
npm run validate:releases
```

Expected before edits: validation may fail because `release-impression-liu-sanjie-2003` and `release-ming-tian-hui-geng-hao-1985` are still in releases or because purchase semantics still include digital-only links. Keep the failure details for the point-by-point report.

- [ ] **Step 3: Move `Impression Liu Sanjie` from releases to appearances**

Remove the full `release-impression-liu-sanjie-2003` object from `data/releases.json`. Add this appearance object to `data/appearances.json`, preserving any stronger QQ source discovered in Step 1 by adding its source ID and media link:

```json
{
  "id": "appearance-impression-liu-sanjie-ost",
  "slug": "impression-liu-sanjie-ost",
  "title": "Impression Liu Sanjie OST",
  "titleOriginal": "印象·劉三姐 OST",
  "titleLocalized": {
    "en": "Impression Liu Sanjie OST",
    "zh-Hant": "印象·劉三姐 OST",
    "zh-Hans": "印象·刘三姐 OST"
  },
  "date": "2003",
  "appearanceType": "soundtrack",
  "programOrWork": "Impression Liu Sanjie",
  "role": "OST vocal appearance",
  "relatedSongs": [],
  "tracks": [
    {
      "position": 1,
      "song": null,
      "title": "籐纏樹",
      "titleLocalized": {
        "en": "籐纏樹",
        "zh-Hant": "籐纏樹",
        "zh-Hans": "藤缠树"
      },
      "role": "vocal appearance",
      "performers": ["person-chyi-yu"],
      "duration": null,
      "credits": { "lyricsBy": [], "composedBy": [] },
      "notes": "Listed under the Impression Liu Sanjie soundtrack/concept work; public lyricist/composer credits remain unresolved."
    },
    {
      "position": 2,
      "song": null,
      "title": "多謝了",
      "titleLocalized": {
        "en": "多謝了",
        "zh-Hant": "多謝了",
        "zh-Hans": "多谢了"
      },
      "role": "vocal appearance",
      "performers": ["person-chyi-yu"],
      "duration": null,
      "credits": { "lyricsBy": [], "composedBy": [] },
      "notes": "Listed under the Impression Liu Sanjie soundtrack/concept work; public lyricist/composer credits remain unresolved."
    }
  ],
  "mediaLinks": [],
  "sources": ["source-wikipedia-en-chyi-yu"],
  "notes": "Moved from Releases to Appearances because the user confirmed Impression Liu Sanjie should be treated as OST material, not a Chyi Yu-owned release.",
  "status": "partial"
}
```

If Step 1 found a QQ Music album page for this OST, add its source record to `data/sources.json`, add a `QQ Music OST` media link to `mediaLinks`, and include that source ID in `sources`.

- [ ] **Step 4: Move `Tomorrow Will Be Better` from releases to appearances**

Remove `release-ming-tian-hui-geng-hao-1985` from `data/releases.json`. Add this appearance object to `data/appearances.json`:

```json
{
  "id": "appearance-ming-tian-hui-geng-hao-1985",
  "slug": "ming-tian-hui-geng-hao-1985",
  "title": "Tomorrow Will Be Better",
  "titleOriginal": "明天會更好",
  "titleLocalized": {
    "en": "Tomorrow Will Be Better",
    "zh-Hant": "明天會更好",
    "zh-Hans": "明天会更好"
  },
  "date": "1985",
  "appearanceType": "collaboration",
  "programOrWork": "Tomorrow Will Be Better",
  "role": "charity single vocal appearance",
  "relatedSongs": [],
  "tracks": [
    {
      "position": 1,
      "song": null,
      "title": "Tomorrow Will Be Better",
      "titleLocalized": {
        "en": "Tomorrow Will Be Better",
        "zh-Hant": "明天會更好",
        "zh-Hans": "明天会更好"
      },
      "role": "vocal appearance",
      "performers": ["person-chyi-yu"],
      "duration": null,
      "credits": {
        "lyricsBy": [],
        "composedBy": []
      },
      "notes": "Chyi Yu is modeled as a participating vocalist only; the full charity ensemble is intentionally not expanded into People."
    }
  ],
  "mediaLinks": [
    {
      "label": "QQ Music single",
      "platform": "qq-music",
      "url": "https://y.qq.com/n/ryqq/albumDetail/003nsRyO0lXC8F",
      "kind": "streaming",
      "isOfficial": true,
      "accessRegion": "China mainland"
    }
  ],
  "sources": [
    "source-qq-music-ming-tian-hui-geng-hao"
  ],
  "notes": "Moved from Releases to Appearances because this is a charity collaboration with many performers rather than a Chyi Yu-owned release.",
  "status": "partial"
}
```

Then research lyricist/composer using reliable public sources. If the credited lyricist/composer is not already in `data/people.json`, add only those credited people, not all performers, and replace the empty `lyricsBy` / `composedBy` arrays with the person IDs or source-backed literal names following existing data patterns.

- [ ] **Step 5: Add the two missed OST appearances from QQ Music**

For each distinct OST resolved from `https://c6.y.qq.com/base/fcgi-bin/u?__=tSzgDMBX7JF7`, create one `appearanceType: "soundtrack"` record in `data/appearances.json` by adapting the existing `appearance-eight-taels-of-gold-ost` structure. Use the resolved QQ candidate fields as follows:

```text
appearance.id: "appearance-" + a kebab-case work title + "-ost"
appearance.slug: the same value without the leading "appearance-"
appearance.title: resolved album/work title plus " OST" when the title is not already marked as soundtrack
appearance.titleOriginal/titleLocalized: resolved QQ title, with Traditional/Simplified variants added only when known
appearance.date: QQ publicTime year/date when present
appearance.programOrWork: resolved film/work title without the "OST" suffix
appearance.role: "OST vocal appearance"
appearance.mediaLinks[0]: label "QQ Music soundtrack", platform "qq-music", resolved QQ album URL, kind "streaming", official true, China mainland
appearance.sources: the QQ source ID generated or added for the resolved album
```

For `tracks`, keep only tracks where QQ Music lists Chyi Yu or where the task source clearly identifies a Chyi Yu vocal appearance. Each track must include `position`, `song: null` unless an existing `data/songs.json` ID clearly matches, localized title values from QQ, `role: "vocal appearance"`, `performers: ["person-chyi-yu"]`, QQ duration when present, and empty lyric/music arrays unless the same source or a credit source provides them.

- [ ] **Step 6: Add the additional charity/collaboration appearance from QQ Music**

For the album resolved from `https://c6.y.qq.com/base/fcgi-bin/u?__=koUa5yzX7vgA`, create one `appearanceType: "collaboration"` record in `data/appearances.json` by adapting the existing `appearance-turning-1999` structure. Use the resolved QQ candidate fields as follows:

```text
appearance.id: "appearance-" + a kebab-case album/work title
appearance.slug: the same value without the leading "appearance-"
appearance.title/titleOriginal/titleLocalized: resolved QQ album title and known locale variants
appearance.date: QQ publicTime date/year when present
appearance.programOrWork: resolved album title
appearance.role: "vocal appearance" or "charity single vocal appearance" if the source identifies it as charity material
appearance.mediaLinks[0]: label "QQ Music album", platform "qq-music", resolved QQ album URL, kind "streaming", official true, China mainland
appearance.sources: the QQ source ID generated or added for the resolved album
appearance.notes: state that only Chyi Yu-relevant tracks are modeled and the full ensemble is intentionally not expanded into People
```

Fill `tracks` with only tracks where QQ Music lists Chyi Yu or where the task source makes Chyi Yu participation clear.

- [ ] **Step 7: Correct physical formats and streaming availability**

Use the resolved QQ Music artist/album pages plus direct platform searches to update `data/releases.json`. Use uppercase `"CD"` and lowercase `"vinyl"` because `releaseFormatLabels(release)` checks those exact values:

```json
"formats": ["CD", "vinyl"]
```

Add verified streaming links using this exact object shape, replacing the URL and region with the observed source values:

```json
{
  "label": "Spotify",
  "platform": "spotify",
  "url": "https://open.spotify.com/album/VERIFIED_ALBUM_ID",
  "kind": "streaming",
  "isOfficial": true,
  "accessRegion": "Global"
}
```

Apply the same shape for `youtube-music` and `kugou-music` with their verified platform URLs. Do not add a platform link unless the URL was verified for the specific release or artist page entry.

- [ ] **Step 8: Clean purchase availability semantics**

In `data/releases.json`, remove digital-only purchase links from `availability.purchase`. Keep `availability.purchase` only for current physical CD/Vinyl purchase routes. If a former digital link is still useful, move it to `availability.streaming` with `kind: "streaming"` or remove it if it duplicates an existing streaming link.

Expected examples to review because current sources mention iTunes purchase availability:

```text
source-itunes-lookup-purchase-olive-tree-1979
source-itunes-lookup-purchase-echo-1985
source-itunes-lookup-purchase-camel-bird-fish-1997
```

After cleanup, no release should show `Buy` unless the linked page is a physical CD/Vinyl purchase route.

- [ ] **Step 9: Validate data corrections**

Run:

```bash
npm run validate:releases
```

Expected: `Release data validation passed for <n> releases and <m> appearances.` No error should mention `soundtrack` releases, `release-impression-liu-sanjie-2003`, `release-ming-tian-hui-geng-hao-1985`, missing source IDs, or malformed links.

- [ ] **Step 10: Commit data corrections**

Stage only data and generated source snapshot files that support committed records. Do not stage `.superpowers/`.

```bash
git add data/releases.json data/appearances.json data/sources.json data/songs.json data/people.json supplement/raw supplement/import-drafts
git commit -m "$(cat <<'EOF'
Correct release follow-up archive data
EOF
)"
```

Expected: commit succeeds. If `supplement/` remains ignored and snapshots cannot be staged, commit only the data files and mention in the point report that raw importer snapshots are local review artifacts.

### Task 2: Category and Availability Helpers

**Files:**
- Modify: `src/lib/archive.ts`
- Test: `scripts/validate-release-data.mjs`

**Interfaces:**
- Consumes: `Release` records with `releaseType`, `formats`, and `availability.purchase`.
- Produces: `releaseCategoryTags(release: Release): string[]`, `releasePrimaryCategory(release: Release): string`, `releaseFormatLabels(release: Release): string[]`, `releaseAvailabilityChecks(release: Release): Array<[string, boolean]>`, and new `hasPhysicalPurchaseLinks(release: Release): boolean`.

- [ ] **Step 1: Add physical-purchase helper**

In `src/lib/archive.ts`, add this helper immediately before `releaseAvailabilityChecks`:

```ts
export function hasPhysicalPurchaseLinks(release: Release) {
  return Boolean(release.availability?.purchase?.some((link) => link.kind === "purchase"));
}
```

- [ ] **Step 2: Update availability checks to use physical purchase only**

Replace the existing purchase check inside `releaseAvailabilityChecks` with:

```ts
  if (hasPhysicalPurchaseLinks(release)) {
    checks.push(["Buy", true]);
  }
```

Expected final function body:

```ts
export function releaseAvailabilityChecks(release: Release) {
  const checks: Array<[string, boolean]> = [
    ["CD", release.formats.includes("CD")],
    ["DVD", release.formats.includes("DVD")],
    ["Vinyl", release.formats.includes("vinyl")],
    ["Cassette", release.formats.includes("cassette")],
    ["Streaming", Boolean(release.availability?.streaming?.length)]
  ];
  if (hasPhysicalPurchaseLinks(release)) {
    checks.push(["Buy", true]);
  }
  return checks;
}
```

- [ ] **Step 3: Make `Other` a fallback category only**

In `releaseCategoryTags`, remove this line:

```ts
  if (release.releaseType === "other") tags.add("other");
```

Then replace the return statement with:

```ts
  if (!tags.size) {
    tags.add("other");
  }

  return Array.from(tags);
```

Expected: releases with an English-cover or religious tag no longer also receive `other` just because `releaseType` is `other`.

- [ ] **Step 4: Validate helper behavior through existing validation**

Run:

```bash
npm run validate:releases
```

Expected: validation passes. If validation fails, fix the data or helper logic rather than weakening validation.

- [ ] **Step 5: Commit helper changes**

```bash
git add src/lib/archive.ts
git commit -m "$(cat <<'EOF'
Clarify release category and purchase helpers
EOF
)"
```

### Task 3: Release List Dropdown UI

**Files:**
- Modify: `src/pages/releases/index.astro`
- Modify: `src/styles/global.css`
- Test: `src/layouts/BaseLayout.astro` existing `[data-filter-select]` behavior

**Interfaces:**
- Consumes: `releaseFilterOptions`, `releaseCategoryTags(release)`, `releasePrimaryCategory(release)`, and existing filter script support for `data-filter-select`.
- Produces: a compact category `<select data-filter-select data-filter-key="release-tags">` that filters the same `data-release-tags` values currently used by filter buttons.

- [ ] **Step 1: Replace category button group with select markup**

In `src/pages/releases/index.astro`, replace the entire release category fieldset:

```astro
      <fieldset class="filter-option-group release-filter-group">
        <legend {...i18nAttrs(uiText("label.category"))}>{valueForLocale(uiText("label.category"))}</legend>
        <div class="filter-options" data-filter-options data-filter-key="release-tags">
          {releaseFilterOptions.map((option, index) => (
            <button type="button" data-filter-option data-filter-value={option.value} aria-pressed={index === 0 ? "true" : "false"}>
              <span {...i18nAttrs(option.label)}>{valueForLocale(option.label)}</span>
            </button>
          ))}
        </div>
      </fieldset>
```

with:

```astro
      <label class="release-filter-select-label">
        <span {...i18nAttrs(uiText("label.category"))}>{valueForLocale(uiText("label.category"))}</span>
        <select data-filter-select data-filter-key="release-tags" aria-label={valueForLocale(uiText("label.category"))}>
          {releaseFilterOptions.map((option) => (
            <option value={option.value} {...i18nAttrs(option.label)}>{valueForLocale(option.label)}</option>
          ))}
        </select>
      </label>
```

- [ ] **Step 2: Remove duplicate `Type` display from release cards**

In the release card metadata block in `src/pages/releases/index.astro`, remove the `typeValues` constant and this span:

```astro
              <span {...i18nAttrs(labelValueValues("label.type", typeValues))}>
                {valueForLocale(labelValueValues("label.type", typeValues))}
              </span>
```

Keep the category span:

```astro
              <span {...i18nAttrs(labelValueValues("label.category", categoryValues))}>
                {valueForLocale(labelValueValues("label.category", categoryValues))}
              </span>
```

Keep `release.releaseType` in `data-search` so search still finds internal type words.

- [ ] **Step 3: Remove now-unused import**

In `src/pages/releases/index.astro`, remove `releaseTypeValues` from the import list from `../../lib/i18n` if no longer used in the file.

- [ ] **Step 4: Adjust release controls grid CSS**

In `src/styles/global.css`, replace:

```css
.release-controls-panel {
  grid-template-columns: minmax(10rem, 0.35fr) minmax(16rem, 0.8fr) minmax(24rem, 1fr) auto;
}

.release-filter-group .filter-options {
  max-width: 42rem;
}
```

with:

```css
.release-controls-panel {
  grid-template-columns: minmax(10rem, 0.35fr) minmax(14rem, 0.45fr) minmax(24rem, 1fr) auto;
}

.release-filter-select-label {
  max-width: 18rem;
}
```

- [ ] **Step 5: Add select dropdown affordance**

In `src/styles/global.css`, after the `.filter-panel input, .filter-panel select` rule, add:

```css
.filter-panel select {
  background-image: linear-gradient(45deg, transparent 50%, var(--muted) 50%), linear-gradient(135deg, var(--muted) 50%, transparent 50%);
  background-position: calc(100% - 16px) 50%, calc(100% - 11px) 50%;
  background-repeat: no-repeat;
  background-size: 5px 5px, 5px 5px;
  padding-right: 2.2rem;
}
```

- [ ] **Step 6: Verify dropdown behavior in build checks**

Run:

```bash
npm run check
```

Expected: Astro check completes without TypeScript or template errors.

- [ ] **Step 7: Commit release list UI**

```bash
git add src/pages/releases/index.astro src/styles/global.css
git commit -m "$(cat <<'EOF'
Compact release category filtering
EOF
)"
```

### Task 4: Release Detail Availability UI

**Files:**
- Modify: `src/pages/releases/[slug].astro`
- Modify: `src/styles/global.css` only if spacing needs adjustment after template changes

**Interfaces:**
- Consumes: `hasPhysicalPurchaseLinks(release)`, `releaseFormatLabels(release)`, `release.availability.streaming`, and `release.availability.purchase`.
- Produces: detail pages that show streaming links cleanly, show purchase links only for physical purchase availability, and avoid duplicate category/type metadata.

- [ ] **Step 1: Import physical purchase helper**

In `src/pages/releases/[slug].astro`, add `hasPhysicalPurchaseLinks` to the import from `../../lib/archive`:

```astro
  hasPhysicalPurchaseLinks,
```

- [ ] **Step 2: Remove duplicate `Type` display from release detail metadata**

In the detail metadata block, remove this span:

```astro
        <span {...i18nAttrs(labelValueValues("label.type", releaseTypeValues(release.releaseType)))}>
          {valueForLocale(labelValueValues("label.type", releaseTypeValues(release.releaseType)))}
        </span>
```

Also remove `releaseTypeValues` from the import list from `../../lib/i18n` if no longer used.

- [ ] **Step 3: Add concise formats metadata**

After the category span, add this conditional span:

```astro
        {releaseFormatLabels(release).length ? (
          <span {...i18nAttrs(labelValueValues("label.formats", releaseFormatLabels(release).join(", ")))}>
            {valueForLocale(labelValueValues("label.formats", releaseFormatLabels(release).join(", ")))}
          </span>
        ) : null}
```

This keeps physical formats available without a repeated lower availability block.

- [ ] **Step 4: Gate purchase section on physical purchase links**

Replace:

```astro
      {release.availability?.purchase?.length ? (
```

with:

```astro
      {hasPhysicalPurchaseLinks(release) ? (
```

Keep the purchase table body unchanged so physical purchase links still render when present.

- [ ] **Step 5: Remove the repeated physical formats availability block**

Delete this block from the availability section:

```astro
      {releaseFormatLabels(release).length ? (
        <div class="format-checklist">
          <h3 {...i18nAttrs(uiText("label.physicalFormats"))}>{valueForLocale(uiText("label.physicalFormats"))}</h3>
          <div class="availability-row availability-row-detail">
            {releaseFormatLabels(release).map((format) => (
              <span class="available">{format}</span>
            ))}
          </div>
        </div>
      ) : null}
```

- [ ] **Step 6: Remove unused CSS if applicable**

Search for `.format-checklist`:

```bash
git grep -n "format-checklist"
```

Expected: no remaining template usage. If CSS contains `.format-checklist`, remove that CSS rule. If there is no output, no CSS change is needed.

- [ ] **Step 7: Verify release detail template**

Run:

```bash
npm run check
```

Expected: Astro check completes without unused import or template errors.

- [ ] **Step 8: Commit release detail UI**

```bash
git add src/pages/releases/[slug].astro src/styles/global.css
git commit -m "$(cat <<'EOF'
Simplify release availability details
EOF
)"
```

### Task 5: Final Verification and Manual App Review

**Files:**
- Read/verify: `data/releases.json`
- Read/verify: `data/appearances.json`
- Read/verify: `src/pages/releases/index.astro`
- Read/verify: `src/pages/releases/[slug].astro`
- Verify command output only; do not commit `.superpowers/`

**Interfaces:**
- Consumes: completed Tasks 1-4.
- Produces: verified working tree ready for user review, PR, or push decision.

- [ ] **Step 1: Run data validation**

```bash
npm run validate:releases
```

Expected: `Release data validation passed for <n> releases and <m> appearances.`

- [ ] **Step 2: Run Astro type/template check**

```bash
npm run check
```

Expected: command exits 0 with no errors.

- [ ] **Step 3: Run production build**

```bash
npm run build
```

Expected: Astro build exits 0 and writes `dist/`.

- [ ] **Step 4: Start local app for manual verification**

```bash
npm run dev
```

Expected: dev server prints a local URL such as `http://127.0.0.1:4321/`.

- [ ] **Step 5: Manually verify release index**

Open `/releases/` in the browser and verify:

```text
- Category control is a compact dropdown.
- Selecting Studio albums changes the visible album count and hides non-studio releases.
- Selecting Other shows only fallback records without a better category.
- Album/Songs view toggle still works.
- Sort buttons still reorder the active view.
- Release cards show Category but do not show a separate duplicate Type row.
```

- [ ] **Step 6: Manually verify release details**

Open these detail pages if still present after data corrections:

```text
/releases/olive-tree-1979/
/releases/whoever-finds-this-i-love-you-1988/
/releases/chanting-for-you-2-peace-of-mind-2004/
```

Verify on each:

```text
- Metadata shows category and concise formats.
- Metadata does not show duplicate Type when it repeats category.
- Streaming table renders available platforms.
- Purchase section appears only if the page has a verified physical CD/Vinyl purchase link.
- No separate Physical formats availability block repeats the metadata.
```

- [ ] **Step 7: Manually verify appearances**

Open `/appearances/` and the new/changed appearance detail pages. Verify:

```text
- Impression Liu Sanjie appears as OST/soundtrack appearance, not a release.
- Tomorrow Will Be Better appears as collaboration/charity appearance, not a release.
- New QQ-sourced OST and collaboration appearances have source-backed media links.
- No charity ensemble performers were added as People unless they are lyricist/composer credits needed by the archive.
```

- [ ] **Step 8: Inspect final git state**

```bash
git diff --check
git status --short
```

Expected: no whitespace errors. `dist/`, `.astro/`, and `.superpowers/` may be untracked or ignored; do not commit them. All intended source/data changes should already be committed by prior tasks.

- [ ] **Step 9: Report point-by-point results**

Report in the user’s requested sequence. For each item, include `Done`, `Partially done`, or `Blocked`, followed by the source or command evidence observed:

```text
1. Physical formats/Vinyl
2. Missed OSTs
3. Impression Liu Sanjie
4. Tomorrow Will Be Better
5. Additional charity/collaboration album
6. Buy semantics
7. Streaming platforms
8. Category/type/filter
9. Availability layout
10. Verification
```

Do not claim completion unless the command output and manual verification were actually observed.
