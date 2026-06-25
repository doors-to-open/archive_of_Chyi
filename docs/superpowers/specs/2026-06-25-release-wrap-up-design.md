# Release Wrap-up Design

## Goal

Finish the release archive pass with source-backed release coverage, corrected release/appearance boundaries, cleaner multilingual display, and a release UI that can be verified in the local browser.

## Phases

1. Phase 1 repairs release data only: confirm release coverage, original formats, streaming links, purchase availability, soundtrack boundaries, Turning, the Wu Tsing-fong EP, and obvious encoding placeholders.
2. Phase 2 changes UI and localization: release filters, localized record values, common term wording, and a better availability block.
3. Phase 3 verifies and publishes: data validation, Astro check, build, browser review, commit, and push.

## Data Rules

- Use sources for every new factual claim.
- Keep original titles recognizable. English cover albums keep English titles as primary; Chinese title fields supplement rather than replace them.
- Store category filters as additive tags, not as overloaded `releaseType` values. A record can be both `studio-album` and `english-cover` or `religious`.
- Store streaming links with platform, URL, official status, access region, and source support.
- Preserve `availability.purchase` as data, but hide the purchase UI if the final audit finds no official sale links.
- Move soundtrack vocal appearances and `Turning` out of Releases when they are better modeled as appearances. Appearance records must list only Chyi Yu vocal/voice tracks with lyricist and composer where source-backed.

## Browser Rule

Use the local Astro server and in-app browser for visual checks. The browser backend works on `localhost`; `file:` and `data:` preview URLs are blocked by policy.

## Open Risks

- Some platform pages may be region-gated or inaccessible without login.
- Physical-format evidence may require secondary database or library sources when official label pages are unavailable.
- Existing Chinese display issues may be a mix of real placeholders and browser/font/rendering behavior, so repairs must be verified both through Node JSON reads and browser screenshots.
