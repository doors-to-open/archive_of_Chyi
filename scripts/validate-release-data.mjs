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
  if (!/export function hasPhysicalPurchaseLinks\(release: Release\)\s*{\s*return Boolean\(release\.availability\?\.purchase\?\.some\(\(link\) => link\.kind === "purchase"\)\);\s*}/s.test(archiveSource)) {
    addError('src/lib/archive.ts must export hasPhysicalPurchaseLinks using purchase links with kind "purchase"');
  }
  if (!/if \(hasPhysicalPurchaseLinks\(release\)\) \{\s*checks\.push\(\["Buy", true\]\);\s*}/s.test(archiveSource)) {
    addError('releaseAvailabilityChecks must add Buy only via hasPhysicalPurchaseLinks(release)');
  }
  if (/release\.releaseType === "other"\) tags\.add\("other"\)/.test(archiveSource)) {
    addError('releaseCategoryTags must treat "other" as a fallback only');
  }
  if (!/if \(!tags\.size\) \{\s*tags\.add\("other"\);\s*}\s*return Array\.from\(tags\);/s.test(archiveSource)) {
    addError('releaseCategoryTags must add "other" only when no category tags were found');
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
