# Chyi Yu Archive

An archive-style website for Chyi Yu, designed to help new fans discover her releases, concerts, music-show performances, appearances, credits, sources, and external media links.

The project is not intended to host copyrighted audio or video. It records metadata, cites sources, and links to external platforms where material is already available.

## Goals

- Build a reliable fan-facing reference site.
- Organize releases, concerts, music shows, appearances, people, and sources.
- Separate official information from fan-sourced or audience-reported information.
- Make every factual claim traceable to a source whenever possible.
- Support future search, statistics, contribution workflows, and richer visual interaction.

## Early Technical Direction

The recommended foundation is Astro with TypeScript and structured content collections. The first implementation should be simple, but the long-term site should support a polished visual design and selective interactive components for search, statistics, timelines, and contribution features.

## Project Principles

- Link outward instead of rehosting copyrighted media.
- Prefer official sources when available.
- Keep uncertain or fan-sourced information clearly labeled.
- Keep songs as internal archive objects that connect releases, concerts, music shows, people, sources, and media links.
- Keep contributor credit visible, while separating personal memories from verified facts.

## Documentation

- [Project plan](docs/project-plan.md)
- [Development notes](docs/development.md)
- [Information architecture](docs/information-architecture.md)
- [Sitemap](docs/sitemap.md)
- [Data model](docs/data-model.md)
- [Copyright and link policy](docs/copyright-link-policy.md)

## Local Development

```sh
npm install
npm run dev
```

The dev server binds to `127.0.0.1` by default. Use `npm run build` for a production build and `npm run check` for Astro diagnostics.

## Versioning

Releases are tracked in [CHANGELOG.md](CHANGELOG.md) (Keep a Changelog format) and tagged with Semantic Versioning. Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` a new feature
- `fix:` a bug fix
- `chore:` tooling, deps, or housekeeping
- `docs:` documentation only
- `refactor:` code changes that neither fix a bug nor add a feature
- `data:` data-file edits (concerts, releases, sources, etc.)

A `feat` or `fix` commit may include a `!` after the type to signal a breaking change (e.g. `feat(concerts)!: ...`).
