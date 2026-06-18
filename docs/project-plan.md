# Project Plan

## Purpose

This website should work like a fan-friendly dictionary for Chyi Yu. A visitor should be able to search or browse releases, concerts, music shows, appearances, people, and sources, then follow cited links to learn more.

## Stages

### Stage 0: Foundation

- Initialize Git.
- Ignore local task notes and assistant working notes.
- Add public project documentation.
- Define early archive principles.

### Stage 1: Information Architecture

- Define the main site sections.
- Decide the first sitemap.
- Clarify how internal song records, releases, concerts, music shows, appearances, people, sources, and media links relate.

### Stage 2: Data Model

- Define structured records.
- Add source and confidence rules.
- Add a small sample dataset.

### Stage 3: Minimal Archive Website

- Build the first Astro site.
- Render index and detail pages from structured data.
- Keep the design quiet but intentional.
- Before Stage 4, adjust the public IA if early browsing shows the categories are wrong.

### Stage 4: Search and Relationship Browsing

- Add search.
- Add filters.
- Add cross-linking between archive records.
- Do not run broad crawling yet; keep data quality and record shape under direct review.

### Stage 4.5: Curated Seed Data for Testing

- Add a small manually reviewed batch before building statistics.
- Include enough varied releases, concerts, music shows, appearances, internal song records, people credits, sources, and status values to test Stage 4 behavior.
- Use the seed batch to verify search, filters, cross-links, repeated people credits, empty states, and source/status visibility.
- Do not use a broad crawler or automated import in this stage.

### Stage 5: Statistics

- Count known concert and music-show performances per internal song record.
- Show release, concert, music-show, and appearance distributions.
- Make source coverage and uncertainty visible.
- Add album/song browsing modes on Releases, with date, alphabetic, and live-record sorting.
- Simplify global search to song, album, concert, and person results, while keeping tracks as album-specific placements.

### Stage 6: Contribution Workflow

- Start with GitHub Issues or simple forms.
- Require sources for factual additions.
- Add contributor credit rules.
- Add a controlled public-source import/crawler workflow after the review process exists.
- Limit import/crawler sources to allowlisted public pages, keep source metadata, deduplicate records, and send imported items through manual review before confirmation.
- Later, consider moderation and admin tools.

### Stage 7: Visual and Interaction Upgrade

- Improve visual design after the archive structure works.
- Add richer browsing, timelines, transitions, and creative interactions.
- Preserve readability and accessibility.

### Stage 8: Publishing and Operations

- Publish the site.
- Add contact and feedback routes.
- Add copyright, link, and contribution policies.
- Establish an update workflow.

## Immediate Next Step

After Stage 4, complete Stage 4.5 with a small curated seed batch, then build Stage 5 statistics. Defer crawler/import work until Stage 6, when source requirements, deduplication, and manual review can prevent low-quality records from entering the archive.
