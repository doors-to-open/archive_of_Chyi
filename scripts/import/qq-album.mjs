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
  node scripts/import/qq-album.mjs --album-mid 002usJY80bBhex

Options:
  --url <url>          QQ Music album page URL
  --album-mid <mid>    QQ Music album MID
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
    } else if (arg === "--access-date") {
      args.accessDate = argv[++i];
    } else if (arg === "--help" || arg === "-h") {
      args.help = true;
    } else if (!arg.startsWith("--") && !args.url && !args.albumMid) {
      if (arg.startsWith("https://")) {
        args.url = arg;
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
  if (url.protocol !== "https:" || url.hostname !== "y.qq.com") {
    throw new Error(`Unsupported QQ album URL: ${value}`);
  }

  const parts = url.pathname.split("/").filter(Boolean);
  const albumIndex = parts.indexOf("albumDetail");
  const albumMid = albumIndex >= 0 ? parts[albumIndex + 1] : "";
  if (!albumMid) {
    throw new Error(`Could not find album MID in URL: ${value}`);
  }

  return albumMid;
}

function qqAlbumUrl(albumMid) {
  return `https://y.qq.com/n/ryqq/albumDetail/${albumMid}`;
}

function qqApiUrl(albumMid) {
  const payload = {
    comm: {
      ct: 24,
      cv: 0
    },
    albumSonglist: {
      method: "GetAlbumSongList",
      param: {
        albumMid,
        albumID: 0,
        begin: 0,
        num: 200,
        order: 2
      },
      module: "music.musichallAlbum.AlbumSongList"
    }
  };

  return `https://u.y.qq.com/cgi-bin/musicu.fcg?format=json&data=${encodeURIComponent(JSON.stringify(payload))}`;
}

async function fetchQqAlbum(albumMid) {
  const url = qqApiUrl(albumMid);
  const response = await fetch(url, {
    headers: {
      "user-agent": "chyi-yu-archive-import/0.1 (+review-candidates-only)",
      "referer": qqAlbumUrl(albumMid),
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
    tracks: albumData.tracks.map((track) => ({
      position: track.position,
      disc: track.disc || undefined,
      song: null,
      titleOnRelease: track.title || track.name || "Untitled track",
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
    })),
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

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    console.log(usage());
    return;
  }

  const albumMid = args.albumMid || (args.url ? albumMidFromUrl(args.url) : "");
  if (!albumMid) {
    throw new Error(`Missing --url or --album-mid.\n\n${usage()}`);
  }

  const accessDate = args.accessDate || todayIso();
  const albumUrl = qqAlbumUrl(albumMid);
  const candidateId = `candidate-release-qq-music-album-api-${accessDate}-${hash(albumMid)}`;
  const rawFolder = path.join(RAW_DIR, accessDate);
  const draftFolder = path.join(DRAFT_DIR, accessDate);
  const rawFullPath = path.join(rawFolder, `${candidateId}.json`);
  const draftFullPath = path.join(draftFolder, `${candidateId}.json`);

  const response = await fetchQqAlbum(albumMid);
  await mkdir(rawFolder, { recursive: true });
  await writeFile(rawFullPath, `${JSON.stringify(response.json, null, 2)}\n`, "utf8");

  const albumData = extractAlbumData(albumMid, response.json);
  const dataRecords = await loadData();
  const dedupe = findDedupeMatches(
    dataRecords,
    [albumUrl],
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
      "QQ Music API candidate only. Release ID, slug, credits, label, release type, formats, song IDs, and person IDs require human review before import."
    ]
  });

  await mkdir(draftFolder, { recursive: true });
  await writeFile(draftFullPath, `${JSON.stringify(candidate, null, 2)}\n`, "utf8");

  console.log(JSON.stringify({
    candidateId,
    albumMid,
    title: albumData.album.title,
    publicTime: albumData.album.publicTime,
    tracks: albumData.tracks.length,
    draftPath: path.relative(ROOT, draftFullPath).replace(/\\/g, "/"),
    rawSnapshotPath: path.relative(ROOT, rawFullPath).replace(/\\/g, "/"),
    dedupeSummary: {
      existingUrlMatches: dedupe.existingUrlMatches.length,
      existingTitleMatches: dedupe.existingTitleMatches.length
    }
  }, null, 2));
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
