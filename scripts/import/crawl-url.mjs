import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const ALLOWLIST_PATH = path.join(ROOT, "scripts/import/source-allowlist.json");
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

const CATEGORIES = new Set([
  "release",
  "song",
  "concert",
  "music-show",
  "appearance",
  "person",
  "media-link",
  "source"
]);

function usage() {
  return `Usage:
  node scripts/import/crawl-url.mjs --category release --url https://music.apple.com/tw/album/example/123
  node scripts/import/crawl-url.mjs --category release --url https://music.apple.com/tw/album/example/123 --no-fetch --title "Example album"
  node scripts/import/crawl-url.mjs --list-sources

Options:
  --category <value>   One of: ${Array.from(CATEGORIES).join(", ")}
  --url <url>          Public URL to crawl or prepare
  --title <value>      Optional reviewer-facing title when no fetch is used
  --access-date <date> Optional YYYY-MM-DD access date
  --no-fetch           Do not request the URL; create a draft shell only
  --list-sources       Print allowlisted source families
`;
}

function parseArgs(argv) {
  const args = {
    noFetch: false,
    listSources: false
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--no-fetch") {
      args.noFetch = true;
    } else if (arg === "--list-sources") {
      args.listSources = true;
    } else if (arg === "--category") {
      args.category = argv[++i];
    } else if (arg === "--url") {
      args.url = argv[++i];
    } else if (arg === "--title") {
      args.title = argv[++i];
    } else if (arg === "--access-date") {
      args.accessDate = argv[++i];
    } else if (arg === "--help" || arg === "-h") {
      args.help = true;
    } else {
      throw new Error(`Unknown option: ${arg}`);
    }
  }

  return args;
}

async function readJson(filePath) {
  return JSON.parse(await readFile(filePath, "utf8"));
}

function normalizeHost(hostname) {
  return hostname.toLowerCase().replace(/^www\./, "");
}

function isPathAllowed(url, entry) {
  return entry.pathPrefixes.some((prefix) => url.pathname === prefix || url.pathname.startsWith(prefix));
}

function findAllowlistEntry(allowlist, url, category) {
  const hostname = normalizeHost(url.hostname);
  return allowlist.find((entry) => {
    const entryHost = normalizeHost(entry.host);
    return entryHost === hostname &&
      entry.protocols.includes(url.protocol) &&
      entry.categories.includes(category) &&
      isPathAllowed(url, entry);
  });
}

function isSameSourcePage(requestedUrl, finalUrl) {
  if (!finalUrl) return true;
  const parsedFinalUrl = new URL(finalUrl);
  return normalizeHost(parsedFinalUrl.hostname) === normalizeHost(requestedUrl.hostname) &&
    parsedFinalUrl.pathname === requestedUrl.pathname;
}

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "untitled";
}

function hash(value) {
  return createHash("sha256").update(value).digest("hex").slice(0, 10);
}

function decodeHtml(value) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)))
    .trim();
}

function stripTags(value) {
  return decodeHtml(value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " "));
}

function attrValue(tag, name) {
  const pattern = new RegExp(`${name}\\s*=\\s*("([^"]*)"|'([^']*)'|([^\\s>]+))`, "i");
  const match = tag.match(pattern);
  return decodeHtml(match?.[2] || match?.[3] || match?.[4] || "");
}

function extractMeta(html) {
  const title = stripTags(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || "");
  const meta = {};
  const metaTags = html.match(/<meta\b[^>]*>/gi) || [];

  for (const tag of metaTags) {
    const key = attrValue(tag, "property") || attrValue(tag, "name");
    const content = attrValue(tag, "content");
    if (key && content) {
      meta[key] = content;
    }
  }

  const canonicalTag = (html.match(/<link\b[^>]*rel\s*=\s*["']canonical["'][^>]*>/i) || [])[0] ||
    (html.match(/<link\b[^>]*href\s*=\s*["'][^"']+["'][^>]*rel\s*=\s*["']canonical["'][^>]*>/i) || [])[0];
  const canonicalUrl = canonicalTag ? attrValue(canonicalTag, "href") : "";

  return {
    title: meta["og:title"] || meta["twitter:title"] || title || null,
    description: meta["og:description"] || meta.description || meta["twitter:description"] || null,
    canonicalUrl: meta["og:url"] || canonicalUrl || null,
    metadata: meta
  };
}

function extensionFor(contentType) {
  if (contentType.includes("json")) return "json";
  if (contentType.includes("html")) return "html";
  if (contentType.includes("xml")) return "xml";
  return "txt";
}

async function fetchSnapshot(url) {
  const response = await fetch(url.href, {
    headers: {
      "user-agent": "chyi-yu-archive-import/0.1 (+review-candidates-only)",
      "accept": "text/html,application/xhtml+xml,application/json;q=0.9,text/plain;q=0.8,*/*;q=0.5"
    },
    redirect: "follow"
  });

  const contentType = response.headers.get("content-type") || "";
  const body = await response.text();

  return {
    body,
    finalUrl: response.url,
    httpStatus: response.status,
    contentType
  };
}

async function loadData() {
  const records = [];
  for (const file of DATA_FILES) {
    const fullPath = path.join(DATA_DIR, file);
    try {
      const parsed = await readJson(fullPath);
      records.push({ file, value: parsed });
    } catch (error) {
      records.push({ file, value: null, error: error.message });
    }
  }
  return records;
}

function normalizedText(value) {
  return String(value || "").toLowerCase().replace(/\s+/g, " ").trim();
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

function findDedupeMatches(dataRecords, urls, title) {
  const urlSet = new Set(urls.filter(Boolean).map(String));
  const normalizedTitle = normalizedText(title);
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

    if (normalizedTitle) {
      titleMatches.push(...collectMatches(record.value, (value, currentPath) => {
        if (typeof value === "string" && normalizedText(value) === normalizedTitle) {
          return [{ file: record.file, path: currentPath, value }];
        }
        return [];
      }));
    }
  }

  return {
    existingUrlMatches: urlMatches,
    existingTitleMatches: titleMatches.slice(0, 20),
    needsHumanCheck: true
  };
}

function proposedRecordBucket(category) {
  return {
    sources: [],
    releases: category === "release" ? [] : undefined,
    songs: category === "song" ? [] : undefined,
    concerts: category === "concert" ? [] : undefined,
    musicShows: category === "music-show" ? [] : undefined,
    appearances: category === "appearance" ? [] : undefined,
    people: category === "person" ? [] : undefined,
    mediaLinks: category === "media-link" ? [] : undefined
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

  const allowlist = await readJson(ALLOWLIST_PATH);

  if (args.listSources) {
    console.log(JSON.stringify(allowlist.map((entry) => ({
      id: entry.id,
      label: entry.label,
      host: entry.host,
      pathPrefixes: entry.pathPrefixes,
      categories: entry.categories,
      reliability: entry.reliability
    })), null, 2));
    return;
  }

  if (!args.url || !args.category) {
    throw new Error("Both --url and --category are required.\n\n" + usage());
  }
  if (!CATEGORIES.has(args.category)) {
    throw new Error(`Unsupported category: ${args.category}`);
  }

  const url = new URL(args.url);
  const allowlistEntry = findAllowlistEntry(allowlist, url, args.category);
  if (!allowlistEntry) {
    throw new Error(`URL is not allowlisted for category "${args.category}": ${url.href}`);
  }

  const accessDate = args.accessDate || todayIso();
  const candidateId = `candidate-${args.category}-${allowlistEntry.id}-${accessDate}-${hash(url.href)}`;
  const rawFolder = path.join(RAW_DIR, accessDate);
  const draftFolder = path.join(DRAFT_DIR, accessDate);

  let snapshot = null;
  let rawSnapshotPath = null;
  let extracted = {
    title: args.title || null,
    description: null,
    canonicalUrl: null,
    metadata: {}
  };
  const parserNotes = [];

  if (args.noFetch) {
    parserNotes.push("No network fetch requested; candidate contains URL and reviewer-supplied fields only.");
  } else {
    snapshot = await fetchSnapshot(url);
    extracted = {
      ...extractMeta(snapshot.body),
      title: extractMeta(snapshot.body).title || args.title || null
    };

    await mkdir(rawFolder, { recursive: true });
    const rawFileName = `${candidateId}.${extensionFor(snapshot.contentType)}`;
    const rawFullPath = path.join(rawFolder, rawFileName);
    await writeFile(rawFullPath, snapshot.body, "utf8");
    rawSnapshotPath = path.relative(ROOT, rawFullPath).replace(/\\/g, "/");

    if (snapshot.httpStatus >= 400) {
      parserNotes.push(`Fetch returned HTTP ${snapshot.httpStatus}; candidate requires extra review.`);
    }
  }

  const titleForDedupe = extracted.title || args.title || url.pathname.split("/").filter(Boolean).pop() || url.hostname;
  const dataRecords = await loadData();
  const dedupe = findDedupeMatches(
    dataRecords,
    [url.href, snapshot?.finalUrl, extracted.canonicalUrl],
    titleForDedupe
  );

  const sourceIdBase = `source-${allowlistEntry.id}-${slugify(titleForDedupe)}-${hash(url.href).slice(0, 6)}`;
  const sameSourcePage = isSameSourcePage(url, snapshot?.finalUrl);
  if (!sameSourcePage) {
    parserNotes.push("Fetched final URL differs from requested source page; extracted metadata may describe a redirect or generic landing page.");
  }
  const proposedSourceTitle = sameSourcePage
    ? extracted.title || args.title || allowlistEntry.label
    : args.title || `${allowlistEntry.label} candidate`;
  const proposedRecords = proposedRecordBucket(args.category);
  proposedRecords.sources.push({
    id: sourceIdBase,
    sourceType: allowlistEntry.sourceType,
    title: proposedSourceTitle,
    authorOrPublisher: allowlistEntry.label,
    date: null,
    url: url.href,
    accessDate,
    citation: null,
    reliability: allowlistEntry.reliability,
    notes: `Generated as a Stage 6B review candidate from allowlist entry ${allowlistEntry.id}.`
  });

  const candidate = compactObject({
    schemaVersion: "stage6b-candidate-v1",
    candidateId,
    category: args.category,
    generatedAt: new Date().toISOString(),
    review: {
      state: "pending",
      reviewer: null,
      reviewedAt: null,
      notes: ""
    },
    source: {
      url: url.href,
      finalUrl: snapshot?.finalUrl,
      allowlistId: allowlistEntry.id,
      allowlistLabel: allowlistEntry.label,
      sourceType: allowlistEntry.sourceType,
      reliability: allowlistEntry.reliability,
      accessDate,
      rawSnapshotPath,
      httpStatus: snapshot?.httpStatus,
      contentType: snapshot?.contentType,
      sameSourcePage
    },
    extracted,
    dedupe,
    proposedRecords,
    parserNotes
  });

  await mkdir(draftFolder, { recursive: true });
  const draftFullPath = path.join(draftFolder, `${candidateId}.json`);
  await writeFile(draftFullPath, `${JSON.stringify(candidate, null, 2)}\n`, "utf8");

  console.log(JSON.stringify({
    candidateId,
    draftPath: path.relative(ROOT, draftFullPath).replace(/\\/g, "/"),
    rawSnapshotPath,
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
