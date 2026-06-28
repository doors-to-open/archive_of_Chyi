// Applies a setlist draft (from extract-setlist-from-chapters.mjs) to data/concerts.json.
// Links setlist entries to song ids; does NOT promote concert-level mediaLinks to
// setlist-level this pass (per-entry clip promotion is a follow-up).
//
// - Filters junk entries (non-song segments with generic labels).
// - Deduplicates by song id: keeps first occurrence, drops later repeats of the same song.
// - Maps to SongPerformance { position, song, songParts?, titlePerformed, collaborators: [] }.
// - Sets status to "partial" only if the concert currently has an empty setlist; never downgrades.
//
// Usage:
//   node scripts/apply-setlist-draft.mjs --concert <id>           (writes)
//   node scripts/apply-setlist-draft.mjs --concert <id> --dry-run  (preview only)
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const concertId = args[args.indexOf("--concert") + 1];
if (!concertId) {
  console.error("Usage: --concert <id> [--dry-run]");
  process.exit(1);
}

const draftPath = path.join(root, "supplement", "import-drafts", `${concertId}.setlist.json`);
if (!fs.existsSync(draftPath)) {
  console.error(`No draft at ${draftPath}. Run extract-setlist-from-chapters.mjs first.`);
  process.exit(1);
}
const draft = JSON.parse(fs.readFileSync(draftPath, "utf8"));

const JUNK_PATTERNS = [
  /full (fan )?recording/i,
  /官方錄影|官方录音|official recording/i,
  /official mv/i,
  /kept for (concert )?context/i,
  /event segment/i,
  /learning guitar/i,
  /標清|高清|720p|480p|4k/i,
  /全場dvd|全场dvd/i,
  /安可-?聽歌的人|安可-?听歌的人/i,
  /版[0-9]+/i,
  /後半部分|后半部分/i,
  /^ending$/i,
  /— youtube source$/i,
  /— bilibili (alternate|source)$/i,
  /alternate$/i
];

function isJunkTitle(t) {
  return JUNK_PATTERNS.some((p) => p.test(t));
}

function isJunk(entry) {
  if (entry.song || (entry.songParts && entry.songParts.length)) return false;
  const raw = String(entry.titlePerformed || "");
  return isJunkTitle(raw) || isJunkTitle(cleanTitlePerformed(raw));
}

const PERFORMER_PREFIXES = ["齊豫", "齐豫", "潘越雲", "潘越云", "孫燕姿", "孙燕姿", "李宗盛", "溫金龍", "温金龙", "齊秦", "齐秦"];

function cleanTitlePerformed(raw) {
  let t = String(raw || "").trim();
  const bookMatch = t.match(/《([^》]+)》/);
  if (bookMatch) return bookMatch[1].trim();
  t = t.replace(/【[^】]*】/g, "").trim();
  for (const p of PERFORMER_PREFIXES) {
    t = t.replace(new RegExp(`^${p}\\s*[-~～&]?\\s*`, "i"), "").trim();
  }
  const concertSeg = t.match(/^.+?演唱[會会]|^.+?concert/i);
  if (concertSeg) {
    const after = t.slice(concertSeg[0].length).replace(/^[-~～／/\s]+/, "").trim();
    if (after) t = after;
  }
  t = t.replace(/^[\s\-~～|]+/, "").replace(/[\s\-~～|]+$/, "").trim();
  return t || String(raw || "").trim();
}

const kept = [];
const seenSongs = new Set();
const seenTitles = new Set();
const droppedJunk = [];
const droppedDup = [];
for (const e of draft.entries) {
  if (isJunk(e)) { droppedJunk.push(e); continue; }
  if (e.song && seenSongs.has(e.song)) { droppedDup.push(e); continue; }
  const dupKey = !e.song && e.songParts && e.songParts.length ? e.songParts.join("+") : "";
  if (!e.song && dupKey && seenSongs.has(dupKey)) { droppedDup.push(e); continue; }
  if (!e.song && !dupKey && seenTitles.has(e.titlePerformed)) { droppedDup.push(e); continue; }
  if (e.song) seenSongs.add(e.song);
  else if (dupKey) seenSongs.add(dupKey);
  else seenTitles.add(e.titlePerformed);
  kept.push(e);
}

const setlist = kept.map((e, i) => {
  const entry = {
    position: i + 1,
    song: e.song,
    titlePerformed: cleanTitlePerformed(e.titlePerformed),
    collaborators: []
  };
  if (!e.song && e.songParts && e.songParts.length) entry.songParts = e.songParts;
  if (e.nonSongSegment) entry.notes = "Non-song segment (opening/talk/encore); song identity not resolved.";
  return entry;
});

const concertsPath = path.join(root, "data", "concerts.json");
const concerts = JSON.parse(fs.readFileSync(concertsPath, "utf8"));
const concert = concerts.find((c) => c.id === concertId);
if (!concert) {
  console.error(`Concert ${concertId} not found in data/concerts.json`);
  process.exit(1);
}

const wasEmpty = concert.setlist.length === 0;
const beforeStatus = concert.status;

if (dryRun) {
  console.log(`=== DRY RUN: ${concertId} ===`);
  console.log(`Draft entries: ${draft.entries.length}`);
  console.log(`Dropped junk: ${droppedJunk.length} (${droppedJunk.map((e) => e.titlePerformed).join(" | ")})`);
  console.log(`Dropped duplicates: ${droppedDup.length} (${droppedDup.map((e) => e.titlePerformed).join(" | ")})`);
  console.log(`Applied entries: ${setlist.length}`);
  console.log(`Was empty: ${wasEmpty}; current status: ${beforeStatus}`);
  console.log("\nProposed setlist:");
  for (const e of setlist) console.log(`  ${e.position} | ${e.song || "-"}${e.songParts ? " P:" + e.songParts.join(",") : ""} | ${e.titlePerformed}`);
} else {
  concert.setlist = setlist;
  if (wasEmpty && beforeStatus === "needs-source") concert.status = "partial";
  if (!concert.notes) concert.notes = "";
  const cloneNote = `Setlist recovered ${new Date().toISOString().slice(0, 10)} from chaptered video metadata via scripts/extract-setlist-from-chapters.mjs; song links are mechanically matched and reviewable. Marked partial pending per-city source confirmation.`;
  concert.notes = concert.notes ? `${concert.notes} ${cloneNote}` : cloneNote;

  fs.writeFileSync(concertsPath, JSON.stringify(concerts, null, 2) + "\n");
  console.log(`Applied ${setlist.length} entries to ${concertId} (wasEmpty=${wasEmpty}, status ${beforeStatus} -> ${concert.status}). Dropped ${droppedJunk.length} junk, ${droppedDup.length} dups.`);
}