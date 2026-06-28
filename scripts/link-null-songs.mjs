// Auto-links song:null setlist/performance entries to existing song records via the matcher.
// Handles medleys: if the titlePerformed splits into multiple matched songs (on + / & etc.),
// sets song = first match and songParts = all matches.
//
// Usage: node scripts/link-null-songs.mjs            (writes)
//        node scripts/link-null-songs.mjs --dry-run   (preview)
import fs from "node:fs";
import path from "node:path";
import { buildSongMatcher } from "./import/song-match.mjs";

const root = process.cwd();
const dryRun = process.argv.includes("--dry-run");
const songs = JSON.parse(fs.readFileSync(path.join(root, "data/songs.json"), "utf8"));
const matcher = buildSongMatcher(songs);

const MEDLEY_SPLIT = /[+＋／/、~～&|]/;

function resolveEntry(title) {
  const direct = matcher(title);
  if (direct) return { song: direct, songParts: [] };
  const parts = String(title || "").split(MEDLEY_SPLIT).map((s) => s.trim()).filter(Boolean);
  if (parts.length > 1) {
    const ids = [];
    for (const p of parts) {
      const id = matcher(p);
      if (id && !ids.includes(id)) ids.push(id);
    }
    if (ids.length > 1) return { song: ids[0], songParts: ids };
    if (ids.length === 1) return { song: ids[0], songParts: [] };
  }
  return { song: null, songParts: [] };
}

let linked = 0;
let medley = 0;
const concerts = JSON.parse(fs.readFileSync(path.join(root, "data/concerts.json"), "utf8"));
const musicShows = JSON.parse(fs.readFileSync(path.join(root, "data/music-shows.json"), "utf8"));

const processEntries = (entries, label) => {
  for (const e of entries) {
    if (e.song) continue;
    if (e.songParts && e.songParts.length) continue;
    const { song, songParts } = resolveEntry(e.titlePerformed);
    if (song) {
      e.song = song;
      if (songParts.length) { e.songParts = songParts; medley++; }
      linked++;
      if (dryRun) console.log(`  ${label} pos ${e.position} | ${song}${songParts.length ? " P:" + songParts.join(",") : ""} | ${e.titlePerformed}`);
    }
  }
};

for (const c of concerts) processEntries(c.setlist || [], c.id);
for (const s of musicShows) processEntries(s.performedSongs || [], s.id);

if (dryRun) {
  console.log(`\nWould link ${linked} entries (${medley} medleys).`);
} else {
  fs.writeFileSync(path.join(root, "data/concerts.json"), JSON.stringify(concerts, null, 2) + "\n");
  fs.writeFileSync(path.join(root, "data/music-shows.json"), JSON.stringify(musicShows, null, 2) + "\n");
  console.log(`Linked ${linked} entries (${medley} medleys).`);
}