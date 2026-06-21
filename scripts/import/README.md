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

Create a QQ Music album draft with structured album and track metadata:

```sh
npm run import:qq-album -- --url "https://y.qq.com/n/ryqq/albumDetail/002usJY80bBhex"
```

Run a QQ Music album batch from a task note containing direct album links or QQ share links:

```sh
npm run import:qq-album -- --input task_0621_1_6B_album_links.md
```

Create a no-network draft shell, useful before a crawler exists for a source:

```sh
npm run import:crawl -- --category release --url "https://music.apple.com/tw/album/example/123" --no-fetch --title "Example album"
```

Outputs are written to ignored folders:

- `supplement/raw/`
- `supplement/import-drafts/`

After review, accepted facts are manually or semi-automatically added to `data/*.json`.
