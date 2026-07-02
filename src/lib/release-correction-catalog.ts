import {
  byId,
  linkPlatformList,
  personNames,
  releaseArtists,
  releaseAvailabilityChecks,
  releaseCategoryTags,
  releasePrimaryCategory,
  releaseProducers,
  releases,
  songs,
  usesCoverTrackContext
} from "./archive";
import { originalReleaseTitle, releaseCategoryValues, titleValues, valueForLocale } from "./i18n";

export type ReleaseCorrectionTrackField = {
  label: string;
  value: string;
};

export type ReleaseCorrectionTrack = {
  id: string;
  label: string;
  position: string;
  fields: ReleaseCorrectionTrackField[];
};

export type ReleaseCorrectionLink = {
  id: string;
  label: string;
  fields: ReleaseCorrectionTrackField[];
};

export type ReleaseCorrectionItem = {
  id: string;
  title: string;
  path: string;
  meta: string;
  searchText: string;
  fields: Record<string, ReleaseCorrectionTrackField[]>;
  streamingLinks: ReleaseCorrectionLink[];
  tracks: ReleaseCorrectionTrack[];
};

const notRecorded = "Not recorded";
const boolValue = (value: boolean) => value ? "yes" : "no";
const join = (values: Array<string | undefined | null>) => values.filter(Boolean).join("; ") || notRecorded;

function trackPosition(track: typeof releases[number]["tracks"][number]) {
  return [track.disc ? `Disc ${track.disc}` : "", track.position === null ? "Position not recorded" : `#${track.position}`]
    .filter(Boolean)
    .join(" ");
}

function trackLabel(track: typeof releases[number]["tracks"][number]) {
  const linkedSong = byId(songs, track.song || undefined);
  return join([trackPosition(track), track.titleOnRelease || linkedSong?.titleOriginal || linkedSong?.title || undefined]);
}

function trackFields(release: typeof releases[number], track: typeof releases[number]["tracks"][number]) {
  const linkedSong = byId(songs, track.song || undefined);
  const fields: ReleaseCorrectionTrackField[] = [
    { label: "Song title shown on this album", value: track.titleOnRelease || notRecorded },
    { label: "Matched song identity", value: linkedSong ? valueForLocale(titleValues(linkedSong)) : notRecorded },
    { label: "Lyrics by", value: personNames(track.credits.lyricsBy.length ? track.credits.lyricsBy : linkedSong?.lyricsBy) || notRecorded },
    { label: "Music by", value: personNames(track.credits.composedBy.length ? track.credits.composedBy : linkedSong?.composedBy) || notRecorded },
    { label: "Arrangement by", value: personNames(linkedSong?.arrangedBy) || notRecorded },
    { label: "Track length", value: track.duration || notRecorded },
    { label: "Version or performance note", value: track.versionNote || notRecorded }
  ];
  if (usesCoverTrackContext(release)) {
    fields.push({ label: "Original performer or source", value: linkedSong?.originalPerformers?.length ? personNames(linkedSong.originalPerformers) : track.versionNote || notRecorded });
  }
  const coPerformers = track.performers?.filter((id) => id !== "person-chyi-yu") || [];
  if (coPerformers.length) fields.push({ label: "Performed with", value: personNames(coPerformers) });
  return fields;
}

export const releaseCorrectionCatalog: ReleaseCorrectionItem[] = releases.map((release) => {
  const title = originalReleaseTitle(release);
  const categoryTags = releaseCategoryTags(release);
  const category = valueForLocale(releaseCategoryValues(releasePrimaryCategory(release)));
  const streamingLinks = release.availability?.streaming || [];
  const purchaseLinks = release.availability?.purchase || [];
  const meta = join([
    release.releaseDate,
    category,
    `${release.tracks.length} songs`,
    streamingLinks.length ? "Streaming available" : "Streaming not recorded"
  ]);
  const formatFields = releaseAvailabilityChecks(release).map(([label, available]) => ({ label, value: boolValue(available) }));
  const linkItems = [...streamingLinks, ...purchaseLinks].map((link, index) => ({
    id: `${release.id}-link-${index}`,
    label: link.label || link.platform || `Link ${index + 1}`,
    fields: [
      { label: "Link URL", value: link.url || notRecorded },
      { label: "Platform name", value: link.platform || link.label || notRecorded },
      { label: "Available region", value: link.accessRegion || notRecorded },
      { label: "Official", value: boolValue(Boolean(link.isOfficial)) }
    ]
  }));
  const tracks = release.tracks.map((track, index) => ({
    id: `${release.id}-track-${index}`,
    label: trackLabel(track),
    position: trackPosition(track),
    fields: trackFields(release, track)
  }));
  const fields = {
    Category: [{ label: "Category", value: category }],
    Title: [
      { label: "English title", value: release.title || notRecorded },
      { label: "Original title", value: release.titleOriginal || notRecorded }
    ],
    Metadata: [
      { label: "Release date", value: release.releaseDate || notRecorded },
      { label: "Artist", value: releaseArtists(release) || notRecorded },
      { label: "Label", value: release.label || notRecorded },
      { label: "Producer", value: releaseProducers(release) || notRecorded }
    ],
    Format: formatFields,
    Streaming: linkItems.flatMap((link) => link.fields.map((field) => ({ label: `${link.label}: ${field.label}`, value: field.value }))),
    "Tracklist sequence": tracks.map((track) => ({ label: track.label, value: track.position || notRecorded })),
    "Tracklist song": tracks.flatMap((track) => track.fields.map((field) => ({ label: `${track.label}: ${field.label}`, value: field.value }))),
    "Live records": [{ label: "Live records", value: "Live records belong to the related concert or music performance page. Please choose that live record page to correct it." }]
  };
  return {
    id: release.id,
    title,
    path: `/releases/${release.slug}/`,
    meta,
    fields,
    streamingLinks: linkItems,
    tracks,
    searchText: [
      title,
      release.title,
      release.titleOriginal,
      ...Object.values(release.titleLocalized || {}),
      release.releaseType,
      category,
      categoryTags.join(" "),
      release.releaseDate,
      release.label,
      releaseArtists(release),
      releaseProducers(release),
      linkPlatformList(streamingLinks),
      linkPlatformList(purchaseLinks)
    ].filter(Boolean).join(" ").normalize("NFKC").toLocaleLowerCase("en-US")
  };
});
