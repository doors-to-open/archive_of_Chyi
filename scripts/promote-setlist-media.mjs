// Promotes chaptered Bilibili concert-level videos to per-entry ?p=N setlist mediaLinks.
// Brings mechanically-recovered concerts up to the grace-still standard.
//
// For each target concert:
// 1. Read setlist entries (which already have song/titlePerformed).
// 2. Find Bilibili videos in concert.mediaLinks; re-fetch their multi-part pages[].
// 3. For each part, determine which setlist entry it corresponds to by matching the
//    part title's resolved song id (or normalized title) against the entry.
// 4. Construct https://www.bilibili.com/video/<BV>/?p=<page> and attach to the entry's
//    mediaLinks (copying label/platform/kind/isOfficial/credit from the source link).
// 5. One part may match multiple consecutive entries (a chapter spanning songs) —
//    attach to all, per the grace-still precedent.
//
// Usage:
//   node scripts/promote-setlist-media.mjs --concert <id>            (writes)
//   node scripts/promote-setlist-media.mjs --concert <id> --dry-run   (preview)
//   node scripts/promote-setlist-media.mjs --all-eligible [--dry-run]
import fs from "node:fs";
import path from "node:path";
import { buildSongMatcher, normalizeTitle } from "./import/song-match.mjs";

const root = process.cwd();
const songs = JSON.parse(fs.readFileSync(path.join(root, "data/songs.json"), "utf8"));
const matcher = buildSongMatcher(songs);

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const allEligible = args.includes("--all-eligible");
const concertArg = args[args.indexOf("--concert") + 1];

const ELIGIBLE = [
  "concert-mei-li-ren-sheng-1999-taipei",
  "concert-echo-2018-taipei",
  "concert-echo-2019-guangzhou",
  "concert-echo-2018-nanjing",
  "concert-echo-2018-beijing",
  "concert-tian-shi-yu-lang-2008-beijing",
  "concert-olive-tree-2014-taipei",
  "concert-zhen-qing-nian-lun-2004-shanghai"
];

const PERF_SUFFIXES = ["齊豫", "齐豫", "潘越雲", "潘越云", "溫金龍", "温金龙", "李宗盛", "孫燕姿", "孙燕姿", "ft", "feat", "eTV", "etv", "Ending", "talking", "Talking"];

function resolveSongFromTitle(rawTitle) {
  const t = String(rawTitle || "");
  const bookContents = Array.from(t.matchAll(/《([^》]+)》/g)).map((m) => m[1]);
  const hasPerformerBracket = /【[^】]*】/.test(t);
  const ids = new Set();
  const push = (s) => { const id = matcher(s); if (id) ids.add(id); };
  if (bookContents.length) {
    for (const content of bookContents) {
      for (const sub of content.split(/[&+＋／/]|ft\.|feat\.|and(?=\s)/i)) {
        const s = sub.trim(); if (s && !PERF_SUFFIXES.includes(s)) push(s);
      }
    }
    return [...ids];
  }
  if (hasPerformerBracket) {
    const remainder = t.replace(/【[^】]*】/g, " ").trim();
    for (const sub of remainder.split(/[&+＋／/]/)) { const s = sub.trim(); if (s) push(s); }
    return [...ids];
  }
  push(t);
  if (!ids.size) {
    for (const tok of t.split(/\s+/).filter(Boolean)) push(tok);
  }
  if (!ids.size) {
    for (const sub of t.split(/[+＋、~～\-|–—]/)) { const s = sub.trim(); if (s) push(s); }
  }
  return [...ids];
}

function bvidFromUrl(url) {
  const m = String(url || "").match(/bilibili\.com\/video\/(BV[\w]+)/i);
  return m ? m[1] : null;
}

async function fetchBilibiliParts(bvid) {
  try {
    const res = await fetch(`https://api.bilibili.com/x/web-interface/view?bvid=${bvid}`, {
      headers: { "User-Agent": "Mozilla/5.0 (opencode-setlist-promote)", "Accept": "application/json" }
    });
    if (!res.ok) return { ok: false, reason: `HTTP ${res.status}` };
    const json = await res.json();
    if (json.code !== 0) return { ok: false, reason: `code ${json.code}: ${json.message}` };
    const pages = (json.data && json.data.pages) || [];
    return { ok: true, parts: pages.map((p) => ({ part: p.part, page: p.page })), title: json.data.title };
  } catch (e) {
    return { ok: false, reason: String(e) };
  }
}

function buildPartUrl(bvid, page) {
  return `https://www.bilibili.com/video/${bvid}/?p=${page}`;
}

async function promoteConcert(concert) {
  const setlist = concert.setlist;
  const mediaLinks = concert.mediaLinks || [];
  const bilibiliLinks = mediaLinks.filter((m) => m.platform === "bilibili");
  const report = { added: 0, skippedParts: 0, unmatchedEntries: 0, perVideo: [] };

  for (const link of bilibiliLinks) {
    const bvid = bvidFromUrl(link.url);
    if (!bvid) continue;
    const r = await fetchBilibiliParts(bvid);
    if (!r.ok) { report.perVideo.push({ bvid, ok: false, reason: r.reason }); continue; }
    if (r.parts.length <= 1) { report.perVideo.push({ bvid, ok: true, singlePart: true }); continue; }

    for (const part of r.parts) {
      const partSongIds = resolveSongFromTitle(part.part);
      let matchedEntry = null;
      if (partSongIds.length) {
        matchedEntry = setlist.find((e) => e.song && partSongIds.includes(e.song)) ||
                       setlist.find((e) => (e.songParts || []).some((sp) => partSongIds.includes(sp)));
      }
      if (!matchedEntry) {
        const partNorm = normalizeTitle(part.part);
        const candidates = setlist
          .map((e) => ({ e, n: normalizeTitle(e.titlePerformed) }))
          .filter((x) => x.n.length >= 2 && partNorm.includes(x.n));
        if (candidates.length) {
          candidates.sort((a, b) => b.n.length - a.n.length);
          matchedEntry = candidates[0].e;
        }
      }
      if (!matchedEntry) { report.skippedParts++; continue; }

      const partUrl = buildPartUrl(bvid, part.page);
      const existing = (matchedEntry.mediaLinks || []).find((m) => m.url === partUrl);
      if (existing) continue;
      const newLink = {
        label: `Chaptered Bilibili part ${part.page}`,
        platform: "bilibili",
        url: partUrl,
        kind: link.kind || "video",
        isOfficial: link.isOfficial ?? false,
        credit: link.credit
      };
      matchedEntry.mediaLinks = matchedEntry.mediaLinks || [];
      matchedEntry.mediaLinks.push(newLink);
      report.added++;
    }
    report.perVideo.push({ bvid, ok: true, parts: r.parts.length, title: r.title });
  }

  report.unmatchedEntries = setlist.filter((e) => !e.mediaLinks || !e.mediaLinks.length).length;

  // Remove concert-level mediaLinks that are now redundant with setlist-level ?p=N copies.
  const setlistUrls = new Set(setlist.flatMap((e) => (e.mediaLinks || []).map((m) => m.url)));
  const before = mediaLinks.length;
  concert.mediaLinks = mediaLinks.filter((m) => !setlistUrls.has(m.url));
  report.redundantConcertRemoved = before - concert.mediaLinks.length;
  return report;
}

async function main() {
  const concertsPath = path.join(root, "data/concerts.json");
  const concerts = JSON.parse(fs.readFileSync(concertsPath, "utf8"));
  const targets = allEligible
    ? ELIGIBLE.map((id) => concerts.find((c) => c.id === id)).filter(Boolean)
    : [concerts.find((c) => c.id === concertArg)].filter(Boolean);
  if (!targets.length) { console.error("No matching concerts."); process.exit(1); }

  for (const concert of targets) {
    if (dryRun) {
      const snapshot = JSON.parse(JSON.stringify(concert));
      const report = await promoteConcert(snapshot);
      console.log(`\n=== DRY RUN: ${concert.id} ===`);
      console.log(`Would add ${report.added} per-entry mediaLinks; ${report.skippedParts} parts unmatched; ${report.unmatchedEntries} entries would remain without media.`);
      for (const v of report.perVideo) {
        if (!v.ok) console.log(`  ${v.bvid}: fetch failed (${v.reason})`);
        else if (v.singlePart) console.log(`  ${v.bvid}: single-part, skipped`);
        else console.log(`  ${v.bvid}: ${v.parts} parts (${v.title})`);
      }
      for (const e of snapshot.setlist) {
        if (e.mediaLinks && e.mediaLinks.length) {
          console.log(`  pos ${e.position} | ${e.song || "-"} | ${e.titlePerformed.slice(0, 30)} -> ${e.mediaLinks.map((m) => m.url).join(", ")}`);
        }
      }
    } else {
      const report = await promoteConcert(concert);
      console.log(`${concert.id}: added ${report.added} per-entry mediaLinks; ${report.skippedParts} parts unmatched; ${report.unmatchedEntries} entries still without media; removed ${report.redundantConcertRemoved} redundant concert-level copies.`);
      fs.writeFileSync(concertsPath, JSON.stringify(concerts, null, 2) + "\n");
    }
  }
}

main().catch((e) => { console.error(e); process.exit(1); });