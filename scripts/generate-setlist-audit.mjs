// Generates docs/setlist_audit.md from data/concerts.json.
// Run: node scripts/generate-setlist-audit.mjs
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const concerts = JSON.parse(fs.readFileSync(path.join(root, "data/concerts.json"), "utf8"));

function classify(c) {
  const entries = c.setlist.length;
  const linked = c.setlist.filter((e) => e.song).length;
  const media = (c.mediaLinks || []).length;
  if (entries === 0 && media === 0) return "needs-research";
  if (entries === 0 && media > 0) return "clips-only";
  if (entries > 0 && linked / entries >= 0.8) return "confirmed-setlist";
  return "partial-setlist";
}

function tourKey(id) {
  const m = id.match(/^concert-(.+)-(\d{4})-[a-z]+$/);
  return m ? `${m[1]}-${m[2]}` : id;
}

const rows = concerts.map((c) => {
  const entries = c.setlist.length;
  const linked = c.setlist.filter((e) => e.song).length;
  const perfMedia = c.setlist.reduce((s, e) => s + (e.mediaLinks ? e.mediaLinks.length : 0), 0);
  return {
    id: c.id,
    title: c.title,
    date: c.date || "",
    venue: c.venue || "",
    city: c.city || "",
    status: c.status,
    entries,
    linked,
    perfMedia,
    concertMedia: (c.mediaLinks || []).length,
    sources: (c.sources || []).length,
    classification: classify(c),
    tour: tourKey(c.id)
  };
});

const byClass = {};
for (const r of rows) (byClass[r.classification] = byClass[r.classification] || []).push(r);

const lines = [];
lines.push("# Setlist Audit");
lines.push("");
lines.push(`Generated from \`data/concerts.json\` (${concerts.length} concerts).`);
lines.push("");
lines.push("## Summary");
lines.push("");
lines.push("| Classification | Count | Description |");
lines.push("|---|---:|---|");
lines.push(`| confirmed-setlist | ${byClass["confirmed-setlist"]?.length || 0} | entries with song links ≥ 80% |`);
lines.push(`| partial-setlist | ${byClass["partial-setlist"]?.length || 0} | has setlist, song link rate < 80% |`);
lines.push(`| clips-only | ${byClass["clips-only"]?.length || 0} | empty setlist, has concert-level media |`);
lines.push(`| needs-research | ${byClass["needs-research"]?.length || 0} | empty setlist, no media |`);
lines.push("");
lines.push("## Tour Clusters (empty-setlist concerts only)");
lines.push("");
const tourGroups = {};
for (const r of rows) {
  if (r.entries === 0) (tourGroups[r.tour] = tourGroups[r.tour] || []).push(r);
}
for (const tour of Object.keys(tourGroups).sort()) {
  const g = tourGroups[tour];
  lines.push(`- **${tour}** (${g.length} cities): ${g.map((x) => x.id.replace(/^concert-/, "")).join(", ")}`);
}
lines.push("");
lines.push("## Per-Concert Table");
lines.push("");
lines.push("| id | title | date | venue | city | status | entries | linked | perf-media | concert-media | sources | class | tour |");
lines.push("|---|---|---|---|---|---|---:|---:|---:|---:|---:|---|---|");
for (const r of rows) {
  lines.push(`| ${r.id} | ${r.title.replace(/\|/g, "\\|")} | ${r.date} | ${r.venue.replace(/\|/g, "\\|")} | ${r.city} | ${r.status} | ${r.entries} | ${r.linked} | ${r.perfMedia} | ${r.concertMedia} | ${r.sources} | ${r.classification} | ${r.tour} |`);
}
lines.push("");
lines.push("## Priority for Phase 2 recovery");
lines.push("");
lines.push("High-value cluster (this pass):");
lines.push("");
lines.push("- Tour-grouped empty concerts (research one, propagate rest as `partial`):");
const tourClustered = Object.keys(tourGroups).filter((t) => tourGroups[t].length > 1).sort();
for (const t of tourClustered) {
  lines.push(`  - ${t}: ${tourGroups[t].map((x) => x.id.replace(/^concert-/, "")).join(", ")}`);
}
lines.push("");
lines.push("- Clips-only concerts (chaptered media present): mechanical extraction in Phase 1, no web research needed:");
for (const r of byClass["clips-only"] || []) lines.push(`  - ${r.id}`);
lines.push("");
lines.push("Deferred to follow-up pass (no media, no tour siblings):");
for (const r of byClass["needs-research"] || []) {
  const alone = !tourClustered.includes(r.tour);
  if (alone) lines.push(`  - ${r.id}`);
}
lines.push("");

fs.writeFileSync(path.join(root, "docs/setlist_audit.md"), lines.join("\n"));
console.log(`Wrote docs/setlist_audit.md (${rows.length} concerts, ${Object.keys(byClass).length} classes).`);