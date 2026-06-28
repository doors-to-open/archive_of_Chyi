import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

function readJson(relativePath) {
  const text = fs.readFileSync(path.join(root, relativePath), "utf8");
  if (text.charCodeAt(0) === 0xfeff) {
    addError(`${relativePath} starts with a UTF-8 BOM`);
  }
  return JSON.parse(text);
}

const errors = [];
const warnings = [];

const releases = readJson("data/releases.json");
const appearances = readJson("data/appearances.json");
const songs = readJson("data/songs.json");
const people = readJson("data/people.json");
const sources = readJson("data/sources.json");
const concerts = readJson("data/concerts.json");
const musicShows = readJson("data/music-shows.json");
const archiveSource = fs.readFileSync(path.join(root, "src/lib/archive.ts"), "utf8");

const sourceIds = new Set(sources.map((source) => source.id));
const songIds = new Set(songs.map((song) => song.id));
const personIds = new Set(people.map((person) => person.id));

const textDatasets = [
  ["data/releases.json", releases],
  ["data/appearances.json", appearances],
  ["data/songs.json", songs],
  ["data/people.json", people],
  ["data/sources.json", sources],
  ["data/concerts.json", readJson("data/concerts.json")],
  ["data/music-shows.json", readJson("data/music-shows.json")],
  ["data/media-links.json", readJson("data/media-links.json")]
];

function addError(message) {
  errors.push(message);
}

function addWarning(message) {
  warnings.push(message);
}

function expectUnique(items, field, label) {
  const seen = new Map();
  for (const item of items) {
    const value = item[field];
    if (!value) {
      addError(`${label} ${item.id || "(missing id)"} is missing ${field}`);
      continue;
    }
    if (seen.has(value)) {
      addError(`${label} ${item.id} duplicates ${field} "${value}" from ${seen.get(value)}`);
    } else {
      seen.set(value, item.id);
    }
  }
}

function pathLabel(parts) {
  return parts.filter(Boolean).join(".");
}

function walkText(value, parts, visitor) {
  if (typeof value === "string") {
    visitor(value, pathLabel(parts));
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((entry, index) => walkText(entry, [...parts, `[${index}]`], visitor));
    return;
  }
  if (value && typeof value === "object") {
    for (const [key, entry] of Object.entries(value)) {
      walkText(entry, [...parts, key], visitor);
    }
  }
}

function validateSourceRefs(record, label) {
  for (const sourceId of record.sources || []) {
    if (!sourceIds.has(sourceId)) {
      addError(`${label} ${record.id} references missing source ${sourceId}`);
    }
  }
}

function validateTrackCredits(track, release) {
  for (const role of ["lyricsBy", "composedBy"]) {
    for (const credit of track.credits?.[role] || []) {
      if (!personIds.has(credit) && /^person-/.test(credit)) {
        addError(`${release.id} track "${track.titleOnRelease}" references missing ${role} person ${credit}`);
      }
    }
  }
  if (track.song && !songIds.has(track.song)) {
    addError(`${release.id} track "${track.titleOnRelease}" references missing song ${track.song}`);
  }
}

function validateLinks(links, label) {
  for (const [index, link] of (links || []).entries()) {
    if (!link.label) addError(`${label} link ${index + 1} is missing label`);
    if (!link.url) addError(`${label} link ${index + 1} is missing url`);
    if (link.kind === "streaming" && !link.accessRegion) {
      addWarning(`${label} streaming link "${link.label || index + 1}" has no accessRegion`);
    }
  }
}

function validateArchiveHelperSemantics() {
  if (/release\.releaseType\s*===\s*["']other["'][\s\S]{0,120}tags\.add\(["']other["']\)/.test(archiveSource)) {
    addError('releaseCategoryTags must treat "other" as a fallback only');
  }
}

function validatePhysicalPurchaseSemantics(release) {
  for (const [index, link] of (release.availability?.purchase || []).entries()) {
    if (link.kind !== "purchase") {
      addError(`Release ${release.id} purchase link ${index + 1} must use kind "purchase" so Buy means physical purchase only`);
    }
  }
}

expectUnique(releases, "id", "Release");
expectUnique(releases, "slug", "Release");
expectUnique(appearances, "id", "Appearance");
expectUnique(appearances, "slug", "Appearance");
validateArchiveHelperSemantics();

for (const release of releases) {
  validateSourceRefs(release, "Release");
  validateLinks(release.availability?.streaming, `Release ${release.id} streaming`);
  validateLinks(release.availability?.purchase, `Release ${release.id} purchase`);
  validatePhysicalPurchaseSemantics(release);

  if (release.releaseType === "soundtrack") {
    addError(`Release ${release.id} is still modeled as soundtrack; soundtrack vocal appearances belong in appearances`);
  }
  if (release.id === "release-turning-1998") {
    addError("release-turning-1998 is still modeled as a release; task requires moving Turning to appearances");
  }
  for (const track of release.tracks || []) {
    validateTrackCredits(track, release);
  }
}

for (const appearance of appearances) {
  validateSourceRefs(appearance, "Appearance");
  validateLinks(appearance.mediaLinks, `Appearance ${appearance.id}`);
  for (const songId of appearance.relatedSongs || []) {
    if (!songIds.has(songId)) {
      addError(`Appearance ${appearance.id} references missing related song ${songId}`);
    }
  }
}

for (const [datasetPath, dataset] of textDatasets) {
  walkText(dataset, [datasetPath], (text, textPath) => {
    if (text.includes("??")) addError(`${textPath} contains literal ??`);
    if (text.includes("\uFFFD")) addError(`${textPath} contains replacement character`);
  });
}

if (!releases.some((release) =>
  release.id === "release-one-thought-between-2025" ||
  release.titleOriginal?.includes("一念") ||
  release.titleLocalized?.["zh-Hant"]?.includes("一念") ||
  release.titleLocalized?.["zh-Hans"]?.includes("一念")
)) {
  addWarning("No obvious Wu Tsing-fong/Chyi Yu 2025 EP candidate is modeled yet");
}

// Live-performance linkage check: flag concert/show entries whose song is null
// but whose title matches a release track or an existing song record. These are
// silent linkage gaps that hide live performances from the songs view and stats.
function normalizeTitle(value) {
  if (!value) return "";
  return String(value)
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[（(].*?[)）]/g, "")
    .replace(/[、,，/／·・?!！？.。]/g, "")
    .replace(/live$/g, "")
    .replace(/清唱$/g, "");
}

const releaseTrackTitles = new Map();
for (const release of releases) {
  for (const track of release.tracks || []) {
    const n = normalizeTitle(track.titleOnRelease);
    if (n) releaseTrackTitles.set(n, { release, track });
  }
}
const songTitles = new Map();
for (const song of songs) {
  for (const t of [song.title, song.titleOriginal, ...(song.aliases || [])]) {
    const n = normalizeTitle(t);
    if (n) songTitles.set(n, song);
  }
}

function validateLiveLinkage(entries, recordLabel) {
  for (const entry of entries) {
    if (entry.song || (entry.songParts && entry.songParts.length)) continue;
    const n = normalizeTitle(entry.titlePerformed);
    if (!n) continue;
    const trackMatch = releaseTrackTitles.get(n);
    const songMatch = songTitles.get(n);
    if (trackMatch || songMatch) {
      const matchDesc = trackMatch
        ? `release track ${trackMatch.release.id} "${trackMatch.track.titleOnRelease}"`
        : `song record ${songMatch.id}`;
      addError(
        `${recordLabel} setlist entry "${entry.titlePerformed}" has no song id but matches ${matchDesc}; link it to a song record so the live performance is tracked`
      );
    }
  }
}

for (const concert of concerts) {
  validateLiveLinkage(concert.setlist || [], `Concert ${concert.id}`);
}
for (const show of musicShows) {
  validateLiveLinkage(show.performedSongs || [], `Music show ${show.id}`);
}

// Concert-specific validation
expectUnique(concerts, "id", "Concert");
expectUnique(concerts, "slug", "Concert");

const datePattern = /^\d{4}-\d{2}-\d{2}(\/\d{4}-\d{2}-\d{2})?$|^\d{4}-\d{2}(-\d{2})?$|^\d{4}$/;
for (const concert of concerts) {
  validateSourceRefs(concert, "Concert");
  validateLinks(concert.mediaLinks, `Concert ${concert.id}`);
  if (concert.date && !datePattern.test(concert.date)) {
    addError(`Concert ${concert.id} has unsortable date "${concert.date}"`);
  }
  if (concert.status === "needs-source" && concert.status === "confirmed") {
    addError(`Concert ${concert.id} is marked both needs-source and confirmed`);
  }
  if (concert.status === "needs-source" && concert.sources.length === 0) {
    addError(`Concert ${concert.id} is needs-source but has no source lead reference`);
  }
  for (const entry of concert.setlist || []) {
    if (entry.song && !songIds.has(entry.song)) {
      addError(`Concert ${concert.id} setlist entry "${entry.titlePerformed}" references missing song ${entry.song}`);
    }
    for (const partId of entry.songParts || []) {
      if (!songIds.has(partId)) {
        addError(`Concert ${concert.id} setlist entry "${entry.titlePerformed}" references missing songPart ${partId}`);
      }
    }
    for (const personId of entry.collaborators || []) {
      if (/^person-/.test(personId) && !personIds.has(personId)) {
        addError(`Concert ${concert.id} setlist entry "${entry.titlePerformed}" references missing collaborator person ${personId}`);
      }
    }
  }
  for (const personId of concert.performers || []) {
    if (/^person-/.test(personId) && !personIds.has(personId)) {
      addError(`Concert ${concert.id} references missing performer person ${personId}`);
    }
  }
  for (const personId of concert.guests || []) {
    if (/^person-/.test(personId) && !personIds.has(personId)) {
      addError(`Concert ${concert.id} references missing guest person ${personId}`);
    }
  }
}

// song.knownConcerts backref: any concert setlist referencing a song should appear in that song's knownConcerts
const songToConcerts = new Map();
for (const song of songs) songToConcerts.set(song.id, new Set(song.knownConcerts || []));
for (const concert of concerts) {
  for (const entry of concert.setlist || []) {
    const ids = [entry.song, ...(entry.songParts || [])].filter(Boolean);
    for (const songId of ids) {
      const refs = songToConcerts.get(songId);
      if (refs && !refs.has(concert.id)) {
        addError(`Concert ${concert.id} performs song ${songId} but song.knownConcerts does not list ${concert.id}`);
      }
    }
  }
}

// Mirror check: release tracks with song=null whose title matches an existing song record
for (const release of releases) {
  for (const track of release.tracks || []) {
    if (track.song) continue;
    const n = normalizeTitle(track.titleOnRelease);
    if (!n) continue;
    const songMatch = songTitles.get(n);
    if (songMatch) {
      addError(
        `Release ${release.id} track "${track.titleOnRelease}" has no song id but matches song record ${songMatch.id}; link it so the track is connected to its canonical song`
      );
    }
  }
}

for (const warning of warnings) {
  console.warn(`Warning: ${warning}`);
}

if (errors.length) {
  console.error(`Release data validation failed with ${errors.length} error(s):`);
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log(`Release data validation passed for ${releases.length} releases and ${appearances.length} appearances.`);
