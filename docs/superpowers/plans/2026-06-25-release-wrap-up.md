# Release Wrap-up Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Complete the release archive wrap-up in three independently verifiable phases.

**Architecture:** Keep release data corrections separate from UI behavior. Add small validation helpers before editing shared archive code so data regressions are caught mechanically.

**Tech Stack:** Astro 6, TypeScript, JSON data files, Node validation scripts, local browser verification through `http://127.0.0.1:<port>/`.

---

## File Structure

- Modify `data/releases.json` for release coverage, formats, tags, availability, and corrected placeholders.
- Modify `data/appearances.json` for soundtrack and voice/vocal appearances.
- Modify `data/songs.json` and `data/people.json` only for track identity and credit links needed by moved appearances.
- Modify `data/sources.json` for every new or strengthened source.
- Modify `src/lib/archive.ts` for release tags and availability helpers.
- Modify `src/lib/i18n.ts` for clean common terms and value localization.
- Modify `src/pages/releases/index.astro` for category filters.
- Modify `src/pages/releases/[slug].astro` for localized detail values and availability layout.
- Modify `src/styles/global.css` for release filter and availability styling.
- Add `scripts/validate-release-data.mjs` for release-specific data checks.
- Add `docs/release-wrap-up-audit.md` to record platform coverage, blocked checks, and deferred source questions.

## Tasks

### Task 1: Add Release Data Validation

- [ ] Create `scripts/validate-release-data.mjs` with checks for duplicate IDs/slugs, unresolved sources, literal `??`, empty URL labels, purchase visibility assumptions, and release/appearance boundary rules.
- [ ] Run it before data edits and confirm it fails on current known issues, especially `Over the Cloud / ??`.
- [ ] Add `npm` script `validate:releases`.
- [ ] Run `npm run validate:releases` and keep the failure output for the audit notes.

### Task 2: Phase 1 Research And Data Repair

- [ ] Inventory current releases and compare against multilingual Wikipedia plus official/popular music platforms.
- [ ] Check platforms by priority: Apple Music, Spotify, YouTube Music/YouTube official-topic pages, QQ Music, NetEase Cloud Music, KKBOX, MyMusic, StreetVoice/Bandcamp only if relevant, Discogs/MusicBrainz/RateYourMusic/Open Library/WorldCat where physical format evidence is needed.
- [ ] Confirm whether official purchase links exist. If none are found, record the checked platforms and date in `docs/release-wrap-up-audit.md`.
- [ ] Move soundtrack vocal appearances and `Turning` to `data/appearances.json` if source-backed.
- [ ] Add or update the Wu Tsing-fong EP if source-backed.
- [ ] Fix real encoding placeholders and suspicious `??` fields with cited values.
- [ ] Run `npm run validate:releases` until it passes.

### Task 3: Phase 2 UI And Localization

- [ ] Add release tag helpers in `src/lib/archive.ts`.
- [ ] Update `src/lib/i18n.ts` with clean English, traditional Chinese, and simplified Chinese terms.
- [ ] Make release titles, track titles, notes, and metadata use locale-aware values where data exists.
- [ ] Add category filters on `src/pages/releases/index.astro`.
- [ ] Redesign the release detail availability section as a region/platform matrix with link cells.
- [ ] Remove duplicate top-row format text from release detail metadata.
- [ ] Hide purchase UI when no official purchase links exist.

### Task 4: Phase 3 Verification And Publish

- [ ] Run `npm run validate:releases`.
- [ ] Run `npm run check`.
- [ ] Run `npm run build`.
- [ ] Use the local dev server and in-app browser to review release index filters and at least three release detail pages: a studio album, an English cover album, and a religious release.
- [ ] Inspect `git diff --check` and `git status --short`.
- [ ] Commit scoped changes.
- [ ] Push `main` to GitHub.
