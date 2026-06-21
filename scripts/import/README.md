# Import Tools

These scripts generate Stage 6B review drafts. They do not edit `data/*.json`.

## Commands

List allowed source families:

```sh
npm run import:allowlist
```

Create a draft from an allowlisted URL:

```sh
npm run import:crawl -- --category release --url "https://music.apple.com/tw/album/example/123"
```

Create a no-network draft shell, useful before a crawler exists for a source:

```sh
npm run import:crawl -- --category release --url "https://music.apple.com/tw/album/example/123" --no-fetch --title "Example album"
```

Outputs are written to ignored folders:

- `supplement/raw/`
- `supplement/import-drafts/`

After review, accepted facts are manually or semi-automatically added to `data/*.json`.
