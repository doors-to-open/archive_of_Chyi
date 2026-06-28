// Clones a concert's setlist to a sibling concert (same tour) as a partial draft.
// Per the tour-propagation policy: clone the representative setlist, mark partial,
// and note that city-specific confirmation is pending. Never overwrites a non-empty
// setlist unless --force is given.
//
// Usage:
//   node scripts/clone-setlist-to-sibling.mjs --from <srcId> --to <dstId> [--force] [--dry-run]
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const force = args.includes("--force");
const fromId = args[args.indexOf("--from") + 1];
const toId = args[args.indexOf("--to") + 1];
if (!fromId || !toId) {
  console.error("Usage: --from <srcId> --to <dstId> [--force] [--dry-run]");
  process.exit(1);
}

const concertsPath = path.join(root, "data", "concerts.json");
const concerts = JSON.parse(fs.readFileSync(concertsPath, "utf8"));
const src = concerts.find((c) => c.id === fromId);
const dst = concerts.find((c) => c.id === toId);
if (!src) { console.error(`Source ${fromId} not found`); process.exit(1); }
if (!dst) { console.error(`Destination ${toId} not found`); process.exit(1); }
if (!src.setlist.length) { console.error(`Source ${fromId} has an empty setlist; nothing to clone`); process.exit(1); }
if (dst.setlist.length && !force) {
  console.error(`Destination ${toId} already has ${dst.setlist.length} setlist entries; use --force to overwrite`);
  process.exit(1);
}

const cloned = src.setlist.map((e) => ({ ...e }));
const beforeStatus = dst.status;
const cloneNote = `Setlist cloned ${new Date().toISOString().slice(0, 10)} from ${fromId} (same tour) as a partial draft; pending ${dst.city || "city"}-specific source confirmation. City-specific encore/guest variations may exist.`;

if (dryRun) {
  console.log(`=== DRY RUN: ${fromId} -> ${toId} ===`);
  console.log(`Cloning ${cloned.length} entries. Destination was ${dst.setlist.length} entries, status ${beforeStatus}.`);
  for (const e of cloned) console.log(`  ${e.position} | ${e.song || "-"}${e.songParts ? " P:" + e.songParts.join(",") : ""} | ${e.titlePerformed}`);
} else {
  dst.setlist = cloned;
  if (dst.status === "needs-source") dst.status = "partial";
  dst.notes = dst.notes ? `${dst.notes} ${cloneNote}` : cloneNote;
  fs.writeFileSync(concertsPath, JSON.stringify(concerts, null, 2) + "\n");
  console.log(`Cloned ${cloned.length} entries from ${fromId} to ${toId} (status ${beforeStatus} -> ${dst.status}).`);
}