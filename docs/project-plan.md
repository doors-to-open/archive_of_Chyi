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
- Add a curated seed batch manually while testing search, filters, and relationships.
- Do not run broad crawling yet; keep data quality and record shape under direct review.

### Stage 5: Statistics

- Count known concert and music-show performances per internal song record.
- Show release, concert, music-show, and appearance distributions.
- Make source coverage and uncertainty visible.

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

After Stage 3, build Stage 4 search, filters, and relationship browsing with a small curated seed batch. Defer crawler/import work until Stage 6, when source requirements, deduplication, and manual review can prevent low-quality records from entering the archive.
