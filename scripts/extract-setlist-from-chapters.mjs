// Extracts a setlist draft from a concert's existing chaptered mediaLinks.
// Primary signal: mediaLink.label already names the song (e.g. "夢田 clip").
// Secondary signal (--fetch): Bilibili multi-part video page titles via the
// public web-interface/view API. YouTube chapter scraping is intentionally out
// of scope for v1 (labels already cover the common single-clip case).
//
// Output is a REVIEW DRAFT written to supplement/import-drafts/<id>.setlist.json.
// This script never edits data/concerts.json.
//
// Usage:
//   node scripts/extract-setlist-from-chapters.mjs --concert <concertId>
//   node scripts/extract-setlist-from-chapters.mjs --concert <concertId> --fetch
//   node scripts/extract-setlist-from-chapters.mjs --all              (label-only)
//   node scripts/extract-setlist-from-chapters.mjs --all --fetch
import fs from "node:fs";
import path from "node:path";
import { buildSongMatcher, normalizeTitle } from "./import/song-match.mjs";

const root = process.cwd();
const concerts = JSON.parse(fs.readFileSync(path.join(root, "data/concerts.json"), "utf8"));
const songs = JSON.parse(fs.readFileSync(path.join(root, "data/songs.json"), "utf8"));
const matcher = buildSongMatcher(songs);

const args = process.argv.slice(2);
const fetchMode = args.includes("--fetch");
const allMode = args.includes("--all");
const concertArg = args[args.indexOf("--concert") + 1];

const CLIP_MARKERS = ["clip", "片段", "剪辑", "片段", "cut", "live", "現場", "现场", "chapter", "part", "p1", "p2", "p3", "歌", "演唱"];
const NON_SONG_LABELS = ["opening", "talking", "talk", "encore", "intro", "outro", "medley", "組曲", "组曲", "talk"];

function bvidFromUrl(url) {
  const m = String(url || "").match(/bilibili\.com\/video\/(BV[\w]+)/i);
  return m ? m[1] : null;
}

function labelSignalsSong(label) {
  const norm = normalizeTitle(label);
  if (!norm) return null;
  const songId = matcher(label);
  if (songId) return { songId, rawLabel: label };
  for (const marker of CLIP_MARKERS) {
    if (norm.includes(normalizeTitle(marker))) return { songId: null, rawLabel: label };
  }
  return null;
}

const PERF_SUFFIXES = ["齊豫", "齐豫", "潘越雲", "潘越云", "溫金龍", "温金龙", "李宗盛", "孫燕姿", "孙燕姿", "ft", "feat", "eTV", "etv", "Ending", "talking", "Talking"];

function matchTitleComplex(rawTitle) {
  const t = String(rawTitle || "");
  const bookContents = Array.from(t.matchAll(/《([^》]+)》/g)).map((m) => m[1]);
  const hasPerformerBracket = /【[^】]*】/.test(t);
  const matchedParts = [];
  let primary = null;

  const pushMatch = (s) => {
    const id = matcher(s);
    if (id && !matchedParts.includes(id)) {
      matchedParts.push(id);
      if (!primary) primary = id;
    }
  };

  if (bookContents.length) {
    for (const content of bookContents) {
      for (const sub of content.split(/[&+＋／/]|ft\.|feat\.|and(?=\s)/i)) {
        const s = sub.trim();
        if (s && !PERF_SUFFIXES.includes(s)) pushMatch(s);
      }
    }
    return { song: primary, songParts: matchedParts.length > 1 ? matchedParts : [] };
  }

  if (hasPerformerBracket) {
    const remainder = t.replace(/【[^】]*】/g, " ").trim();
    for (const sub of remainder.split(/[&+＋／/]/)) {
      const s = sub.trim();
      if (s) pushMatch(s);
    }
    return { song: primary, songParts: matchedParts.length > 1 ? matchedParts : [] };
  }

  pushMatch(t);
  if (!primary) {
    const tokens = t.split(/\s+/).filter(Boolean);
    for (let i = 1; i < tokens.length; i++) {
      const suffix = tokens.slice(i).join(" ");
      const id = matcher(suffix);
      if (id && !matchedParts.includes(id)) {
        matchedParts.push(id);
        if (!primary) primary = id;
      }
    }
    for (const tok of tokens) {
      const id = matcher(tok);
      if (id && !matchedParts.includes(id)) {
        matchedParts.push(id);
        if (!primary) primary = id;
      }
    }
  }
  if (!primary) {
    for (const sub of t.split(/[+＋、~～\-|–—]/)) {
      const s = sub.trim();
      if (s) {
        const id = matcher(s);
        if (id && !matchedParts.includes(id)) {
          matchedParts.push(id);
          if (!primary) primary = id;
        }
      }
    }
  }
  return { song: primary, songParts: matchedParts.length > 1 ? matchedParts : [] };
}

function isNonSongSegment(label) {
  const norm = normalizeTitle(label);
  return NON_SONG_LABELS.some((m) => norm.includes(normalizeTitle(m)));
}

async function fetchBilibiliParts(bvid) {
  const url = `https://api.bilibili.com/x/web-interface/view?bvid=${bvid}`;
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (opencode-setlist-audit)", "Accept": "application/json" }
    });
    if (!res.ok) return { ok: false, reason: `HTTP ${res.status}` };
    const json = await res.json();
    if (json.code !== 0) return { ok: false, reason: `code ${json.code}: ${json.message}` };
    const pages = (json.data && json.data.pages) || [];
    return { ok: true, parts: pages.map((p) => ({ part: p.part, cid: p.cid, duration: p.duration })) };
  } catch (e) {
    return { ok: false, reason: String(e) };
  }
}

function entryFromTitle(title, sourceUrl, sourceLabel, position) {
  const clean = String(title || "").trim();
  const { song, songParts } = matchTitleComplex(clean);
  const nonSong = isNonSongSegment(clean) || (!song && !songParts.length && PERF_SUFFIXES.some((p) => normalizeTitle(clean).includes(normalizeTitle(p))));
  return {
    position,
    song,
    songParts: songParts.length ? songParts : undefined,
    titlePerformed: clean,
    sourceMediaLinkUrl: sourceUrl,
    sourceMediaLinkLabel: sourceLabel,
    nonSongSegment: nonSong,
    confidence: song ? "mechanical-matched" : songParts.length ? "mechanical-medley" : "mechanical-unmatched"
  };
}

async function extractForConcert(concert) {
  const entries = [];
  const unextractedMedia = [];
  const mediaLinks = concert.mediaLinks || [];
  let position = 1;

  for (const link of mediaLinks) {
    const url = link.url || "";
    const label = link.label || "";
    const platform = link.platform || "";
    let handled = false;

    if (platform === "bilibili") {
      const bvid = bvidFromUrl(url);
      if (bvid && fetchMode) {
        const r = await fetchBilibiliParts(bvid);
        if (r.ok && r.parts.length > 1) {
          for (const p of r.parts) {
            entries.push(entryFromTitle(p.part, url, label, position++));
          }
          handled = true;
        } else if (r.ok && r.parts.length <= 1) {
          // single-part: fall through to label-based extraction
        } else {
          unextractedMedia.push({ url, label, reason: `bilibili fetch failed: ${r.reason}` });
        }
      }
    }

    if (!handled) {
      const signal = labelSignalsSong(label);
      if (signal && !isNonSongSegment(label)) {
        entries.push(entryFromTitle(label, url, label, position++));
        handled = true;
      } else if (isNonSongSegment(label)) {
        entries.push(entryFromTitle(label, url, label, position++));
        handled = true;
      }
    }

    if (!handled) {
      unextractedMedia.push({ url, label, reason: "no extractable structure (single video, generic label)" });
    }
  }

  return {
    concertId: concert.id,
    concertTitle: concert.title,
    date: concert.date || null,
    extractedAt: new Date().toISOString(),
    fetchMode,
    entries,
    unextractedMedia,
    summary: {
      totalMediaLinks: mediaLinks.length,
      extractedEntries: entries.length,
      matchedToSongId: entries.filter((e) => e.song || (e.songParts && e.songParts.length)).length,
      nonSongSegments: entries.filter((e) => e.nonSongSegment).length,
      unextracted: unextractedMedia.length
    }
  };
}

function draftPath(concertId) {
  return path.join(root, "supplement", "import-drafts", `${concertId}.setlist.json`);
}

async function runOne(concert) {
  const draft = await extractForConcert(concert);
  const out = draftPath(concert.id);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, JSON.stringify(draft, null, 2));
  console.log(`${concert.id}: ${draft.summary.extractedEntries} entries (${draft.summary.matchedToSongId} matched), ${draft.summary.unextracted} unextracted → ${path.relative(root, out)}`);
}

async function main() {
  const targets = allMode
    ? concerts.filter((c) => c.setlist.length === 0 && (c.mediaLinks || []).length > 0)
    : [concerts.find((c) => c.id === concertArg)].filter(Boolean);
  if (!targets.length) {
    console.error("No matching concerts. Use --concert <id> or --all.");
    process.exit(1);
  }
  for (const c of targets) await runOne(c);
}

main().catch((e) => { console.error(e); process.exit(1); });