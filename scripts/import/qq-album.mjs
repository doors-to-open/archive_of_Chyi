import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const DATA_DIR = path.join(ROOT, "data");
const RAW_DIR = path.join(ROOT, "supplement/raw");
const DRAFT_DIR = path.join(ROOT, "supplement/import-drafts");

const DATA_FILES = [
  "sources.json",
  "people.json",
  "songs.json",
  "releases.json",
  "concerts.json",
  "music-shows.json",
  "appearances.json",
  "media-links.json"
];

function usage() {
  return `Usage:
  node scripts/import/qq-album.mjs --url https://y.qq.com/n/ryqq/albumDetail/002usJY80bBhex
  node scripts/import/qq-album.mjs --url https://c6.y.qq.com/base/fcgi-bin/u?__=5V66l0Gq7Av0
  node scripts/import/qq-album.mjs --album-mid 002usJY80bBhex
  node scripts/import/qq-album.mjs --input task_0621_1_6B_album_links.md

Options:
  --url <url>          QQ Music album page URL
  --album-mid <mid>    QQ Music album MID
  --album-id <id>      QQ Music numeric album ID
  --input <file>       Text or markdown file containing QQ album links
  --access-date <date> Optional YYYY-MM-DD access date
`;
}

function parseArgs(argv) {
  const args = {};

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--url") {
      args.url = argv[++i];
    } else if (arg === "--album-mid") {
      args.albumMid = argv[++i];
    } else if (arg === "--album-id") {
      args.albumId = argv[++i];
    } else if (arg === "--input") {
      args.input = argv[++i];
    } else if (arg === "--access-date") {
      args.accessDate = argv[++i];
    } else if (arg === "--help" || arg === "-h") {
      args.help = true;
    } else if (!arg.startsWith("--") && !args.url && !args.albumMid) {
      if (arg.startsWith("https://")) {
        args.url = arg;
      } else if (/\.(md|markdown|txt)$/i.test(arg)) {
        args.input = arg;
      } else {
        args.albumMid = arg;
      }
    } else {
      throw new Error(`Unknown option: ${arg}`);
    }
  }

  return args;
}

async function readJson(filePath) {
  return JSON.parse(await readFile(filePath, "utf8"));
}

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function hash(value) {
  return createHash("sha256").update(value).digest("hex").slice(0, 10);
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 70) || "untitled";
}

function albumMidFromUrl(value) {
  const url = new URL(value);
  const parts = url.pathname.split("/").filter(Boolean);
  const albumIndex = parts.indexOf("albumDetail");
  const albumMid = url.protocol === "https:" && url.hostname === "y.qq.com" && albumIndex >= 0
    ? parts[albumIndex + 1]
    : "";
  if (!albumMid) {
    throw new Error(`Could not find album MID in URL: ${value}`);
  }

  return albumMid;
}

function qqShareLinkUrl(albumId) {
  return `https://i2.y.qq.com/n3/other/pages/details/album.html?albumId=${albumId}`;
}

function qqAlbumUrl(albumMid) {
  return `https://y.qq.com/n/ryqq/albumDetail/${albumMid}`;
}

function qqApiUrl({ albumMid = "", albumId = 0 }) {
  const payload = {
    comm: {
      ct: 24,
      cv: 0
    },
    albumSonglist: {
      method: "GetAlbumSongList",
      param: {
        albumMid,
        albumID: Number(albumId) || 0,
        begin: 0,
        num: 200,
        order: 2
      },
      module: "music.musichallAlbum.AlbumSongList"
    }
  };

  return `https://u.y.qq.com/cgi-bin/musicu.fcg?format=json&data=${encodeURIComponent(JSON.stringify(payload))}`;
}

async function resolveQqShareUrl(inputUrl) {
  const response = await fetch(inputUrl, {
    headers: {
      "user-agent": "Mozilla/5.0",
      "accept": "text/html,*/*;q=0.5"
    },
    redirect: "manual"
  });

  const location = response.headers.get("location") || response.url;
  const resolvedUrl = new URL(location, inputUrl);
  const albumId = resolvedUrl.searchParams.get("albumId");
  if (!albumId) {
    throw new Error(`QQ share link did not expose albumId: ${inputUrl}`);
  }

  return {
    inputUrl,
    resolvedUrl: resolvedUrl.href,
    albumId
  };
}

async function resolveAlbumInput({ url, albumMid, albumId }) {
  if (albumMid) {
    return {
      inputUrl: url || qqAlbumUrl(albumMid),
      albumMid,
      albumId: null,
      pageUrl: qqAlbumUrl(albumMid),
      resolvedUrl: null
    };
  }

  if (albumId) {
    return {
      inputUrl: url || qqShareLinkUrl(albumId),
      albumMid: null,
      albumId,
      pageUrl: qqShareLinkUrl(albumId),
      resolvedUrl: null
    };
  }

  if (!url) {
    throw new Error("Missing album input.");
  }

  const parsed = new URL(url);
  if (parsed.hostname === "y.qq.com") {
    const mid = albumMidFromUrl(url);
    return {
      inputUrl: url,
      albumMid: mid,
      albumId: null,
      pageUrl: qqAlbumUrl(mid),
      resolvedUrl: null
    };
  }

  if (parsed.hostname === "c6.y.qq.com") {
    const resolved = await resolveQqShareUrl(url);
    return {
      inputUrl: url,
      albumMid: null,
      albumId: resolved.albumId,
      pageUrl: resolved.resolvedUrl,
      resolvedUrl: resolved.resolvedUrl
    };
  }

  throw new Error(`Unsupported QQ album URL: ${url}`);
}

async function fetchQqAlbum({ albumMid, albumId, referer }) {
  const url = qqApiUrl({ albumMid, albumId });
  const response = await fetch(url, {
    headers: {
      "user-agent": "chyi-yu-archive-import/0.1 (+review-candidates-only)",
      "referer": referer || "https://y.qq.com/",
      "accept": "application/json,text/plain;q=0.9,*/*;q=0.5"
    }
  });
  const text = await response.text();
  let json = null;
  try {
    json = JSON.parse(text);
  } catch {
    throw new Error(`QQ Music response was not JSON. HTTP ${response.status}: ${text.slice(0, 200)}`);
  }

  return {
    apiUrl: url,
    httpStatus: response.status,
    contentType: response.headers.get("content-type") || "",
    text,
    json
  };
}

function secondsToDuration(seconds) {
  if (!Number.isFinite(seconds) || seconds <= 0) return null;
  const minutes = Math.floor(seconds / 60);
  const remainder = Math.round(seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${remainder}`;
}

function unique(values) {
  return Array.from(new Set(values.filter(Boolean)));
}

function normalizeText(value) {
  return String(value || "").toLowerCase().replace(/\s+/g, " ").trim();
}

function hasCjk(value) {
  return /\p{Script=Han}/u.test(String(value || ""));
}

function localizedTitle(value) {
  const title = String(value || "").trim();
  if (!title) return undefined;
  return hasCjk(title) ? { "zh-Hans": title } : { en: title };
}

async function loadData() {
  const records = [];
  for (const file of DATA_FILES) {
    const fullPath = path.join(DATA_DIR, file);
    try {
      records.push({ file, value: await readJson(fullPath) });
    } catch (error) {
      records.push({ file, value: null, error: error.message });
    }
  }
  return records;
}

function collectMatches(value, visitor, currentPath = "$") {
  const matches = [];
  const result = visitor(value, currentPath);
  if (result) matches.push(...result);

  if (Array.isArray(value)) {
    value.forEach((item, index) => {
      matches.push(...collectMatches(item, visitor, `${currentPath}[${index}]`));
    });
  } else if (value && typeof value === "object") {
    Object.entries(value).forEach(([key, item]) => {
      matches.push(...collectMatches(item, visitor, `${currentPath}.${key}`));
    });
  }

  return matches;
}

function findDedupeMatches(dataRecords, urls, titles) {
  const urlSet = new Set(urls.filter(Boolean).map(String));
  const normalizedTitles = new Set(titles.filter(Boolean).map(normalizeText));
  const urlMatches = [];
  const titleMatches = [];

  for (const record of dataRecords) {
    if (!record.value) continue;

    urlMatches.push(...collectMatches(record.value, (value, currentPath) => {
      if (typeof value === "string" && urlSet.has(value)) {
        return [{ file: record.file, path: currentPath, value }];
      }
      return [];
    }));

    titleMatches.push(...collectMatches(record.value, (value, currentPath) => {
      if (typeof value === "string" && normalizedTitles.has(normalizeText(value))) {
        return [{ file: record.file, path: currentPath, value }];
      }
      return [];
    }));
  }

  return {
    existingUrlMatches: urlMatches,
    existingTitleMatches: titleMatches.slice(0, 40),
    needsHumanCheck: true
  };
}

function firstAlbumInfo(songList, fallbackMid) {
  const firstSong = songList[0]?.songInfo || {};
  return {
    id: firstSong.album?.id || null,
    mid: firstSong.album?.mid || fallbackMid,
    title: firstSong.album?.title || firstSong.album?.name || null,
    name: firstSong.album?.name || firstSong.album?.title || null,
    subtitle: firstSong.album?.subtitle || null,
    publicTime: firstSong.album?.time_public || firstSong.time_public || null,
    pmid: firstSong.album?.pmid || null
  };
}

function extractAlbumData(albumMid, json) {
  const payload = json.albumSonglist;
  if (!payload || payload.code !== 0) {
    throw new Error(`QQ Music albumSonglist returned code ${payload?.code ?? "missing"}`);
  }

  const data = payload.data || {};
  const songList = data.songList || [];
  if (!songList.length) {
    throw new Error(`QQ Music album ${albumMid} returned no songs`);
  }

  const album = firstAlbumInfo(songList, data.albumMid || albumMid);
  const artists = unique(songList.flatMap((item) => (item.songInfo?.singer || []).map((singer) => singer.name)));

  return {
    album: {
      ...album,
      totalNum: data.totalNum ?? songList.length
    },
    artists,
    tracks: songList.map((item, index) => {
      const song = item.songInfo || {};
      return {
        position: Number(song.index_album) || index + 1,
        disc: Number(song.index_cd) || null,
        songMid: song.mid || null,
        songId: song.id || null,
        title: song.title || song.name || null,
        name: song.name || song.title || null,
        subtitle: song.subtitle || null,
        duration: secondsToDuration(song.interval),
        singers: (song.singer || []).map((singer) => ({
          id: singer.id || null,
          mid: singer.mid || null,
          name: singer.name || singer.title || null
        })),
        albumMid: song.album?.mid || album.mid,
        publicTime: song.time_public || null,
        raw: {
          language: song.language,
          genre: song.genre,
          mvVid: song.mv?.vid || null
        }
      };
    })
  };
}

function proposedRelease(albumUrl, sourceId, albumMid, albumData) {
  const albumTitle = albumData.album.title || albumData.album.name || "Untitled QQ Music album";
  const artistNames = albumData.artists.length ? albumData.artists.join(", ") : null;
  const midSlug = slugify(albumMid);

  return {
    id: `release-review-qq-${midSlug}`,
    slug: `qq-${midSlug}-review`,
    title: albumTitle,
    titleLocalized: localizedTitle(albumTitle),
    titleOriginal: albumData.album.name && albumData.album.name !== albumTitle ? albumData.album.name : undefined,
    releaseDate: albumData.album.publicTime || null,
    releaseType: "other",
    artist: "person-chyi-yu",
    artists: [],
    label: null,
    catalogNumber: null,
    formats: ["unknown"],
    availability: {
      physical: ["unknown"],
      streaming: [
        {
          label: "QQ Music",
          platform: "qq-music",
          url: albumUrl,
          kind: "streaming",
          isOfficial: true,
          accessRegion: "China mainland"
        }
      ],
      purchase: []
    },
    tracks: albumData.tracks.map((track) => {
      const trackTitle = track.title || track.name || "Untitled track";
      return {
        position: track.position,
        disc: track.disc || undefined,
        song: null,
        titleOnRelease: trackTitle,
        titleOnReleaseLocalized: localizedTitle(trackTitle),
        duration: track.duration,
        versionNote: track.subtitle || null,
        performers: [],
        credits: {
          lyricsBy: [],
          composedBy: []
        },
        importNotes: {
          qqSongMid: track.songMid,
          qqSongId: track.songId,
          singers: track.singers.map((singer) => singer.name).filter(Boolean)
        }
      };
    }),
    credits: {
      vocalist: []
    },
    sources: [sourceId],
    notes: [
      `Stage 6B QQ Music candidate. QQ artists: ${artistNames || "unknown"}.`,
      "Release ID, slug, release type, song identity, and person IDs require human review before import."
    ].join(" "),
    status: "partial"
  };
}

function compactObject(value) {
  if (Array.isArray(value)) {
    return value.map(compactObject);
  }
  if (!value || typeof value !== "object") {
    return value;
  }
  return Object.fromEntries(
    Object.entries(value)
      .filter(([, item]) => item !== undefined)
      .map(([key, item]) => [key, compactObject(item)])
  );
}

function extractQqLinksFromText(text) {
  const matches = text.match(/https:\/\/(?:c6\.y|y)\.qq\.com\/[^\s)>\]]+/g) || [];
  return unique(matches.map((url) => url.replace(/[，。；、）)]+$/u, "")));
}

async function importOneAlbum(input, accessDate) {
  const resolved = await resolveAlbumInput(input);
  const response = await fetchQqAlbum({
    albumMid: resolved.albumMid || "",
    albumId: resolved.albumId || 0,
    referer: resolved.pageUrl
  });
  const preliminaryAlbumMid = resolved.albumMid || response.json.albumSonglist?.data?.albumMid || resolved.albumId;
  const albumData = extractAlbumData(preliminaryAlbumMid, response.json);
  const albumMid = albumData.album.mid || resolved.albumMid || preliminaryAlbumMid;
  const albumUrl = qqAlbumUrl(albumMid);
  const candidateId = `candidate-release-qq-music-album-api-${accessDate}-${hash(albumMid)}`;
  const rawFolder = path.join(RAW_DIR, accessDate);
  const draftFolder = path.join(DRAFT_DIR, accessDate);
  const rawFullPath = path.join(rawFolder, `${candidateId}.json`);
  const draftFullPath = path.join(draftFolder, `${candidateId}.json`);

  await mkdir(rawFolder, { recursive: true });
  await writeFile(rawFullPath, `${JSON.stringify(response.json, null, 2)}\n`, "utf8");

  const dataRecords = await loadData();
  const dedupe = findDedupeMatches(
    dataRecords,
    unique([albumUrl, resolved.inputUrl, resolved.pageUrl, resolved.resolvedUrl]),
    [
      albumData.album.title,
      albumData.album.name,
      ...albumData.tracks.map((track) => track.title)
    ]
  );

  const sourceId = `source-qq-music-album-${slugify(albumMid)}`;
  const sourceRecord = {
    id: sourceId,
    sourceType: "platform",
    title: `${albumData.album.title || albumMid} on QQ Music`,
    authorOrPublisher: "QQ Music",
    date: null,
    url: albumUrl,
    accessDate,
    citation: `QQ Music. "${albumData.album.title || albumMid}."`,
    reliability: "high",
    notes: `QQ Music API returned albumMID ${albumMid}, publicTime ${albumData.album.publicTime || "unknown"}, and ${albumData.tracks.length} tracks.`
  };

  const candidate = compactObject({
    schemaVersion: "stage6b-qq-album-candidate-v1",
    candidateId,
    category: "release",
    generatedAt: new Date().toISOString(),
    review: {
      state: "pending",
      reviewer: null,
      reviewedAt: null,
      notes: ""
    },
    source: {
      url: albumUrl,
      inputUrl: resolved.inputUrl,
      resolvedUrl: resolved.resolvedUrl,
      apiUrl: response.apiUrl,
      allowlistId: "qq-music-album",
      allowlistLabel: "QQ Music album pages",
      sourceType: "platform",
      reliability: "high",
      accessDate,
      rawSnapshotPath: path.relative(ROOT, rawFullPath).replace(/\\/g, "/"),
      httpStatus: response.httpStatus,
      contentType: response.contentType,
      sameSourcePage: true
    },
    extracted: albumData,
    dedupe,
    proposedRecords: {
      sources: [sourceRecord],
      releases: [proposedRelease(albumUrl, sourceId, albumMid, albumData)]
    },
    parserNotes: [
      "QQ Music API candidate only. Release ID, slug, credits, label, release type, formats, song IDs, and person IDs require human review before import.",
      "Localized title fields are inferred from QQ Music text for review convenience; confirm or expand traditional Chinese and English variants during import."
    ]
  });

  await mkdir(draftFolder, { recursive: true });
  await writeFile(draftFullPath, `${JSON.stringify(candidate, null, 2)}\n`, "utf8");

  return {
    candidateId,
    albumMid,
    albumId: resolved.albumId,
    inputUrl: resolved.inputUrl,
    url: albumUrl,
    title: albumData.album.title,
    publicTime: albumData.album.publicTime,
    tracks: albumData.tracks.length,
    draftPath: path.relative(ROOT, draftFullPath).replace(/\\/g, "/"),
    rawSnapshotPath: path.relative(ROOT, rawFullPath).replace(/\\/g, "/"),
    dedupeSummary: {
      existingUrlMatches: dedupe.existingUrlMatches.length,
      existingTitleMatches: dedupe.existingTitleMatches.length
    }
  };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    console.log(usage());
    return;
  }

  const accessDate = args.accessDate || todayIso();

  if (args.input) {
    const inputPath = path.resolve(ROOT, args.input);
    const text = await readFile(inputPath, "utf8");
    const urls = extractQqLinksFromText(text);
    if (!urls.length) {
      throw new Error(`No QQ album links found in ${args.input}`);
    }

    const results = [];
    for (const url of urls) {
      results.push(await importOneAlbum({ url }, accessDate));
    }

    console.log(JSON.stringify({
      input: args.input,
      count: results.length,
      results
    }, null, 2));
    return;
  }

  if (!args.albumMid && !args.albumId && !args.url) {
    throw new Error(`Missing --url or --album-mid.\n\n${usage()}`);
  }

  console.log(JSON.stringify(await importOneAlbum(args, accessDate), null, 2));
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
