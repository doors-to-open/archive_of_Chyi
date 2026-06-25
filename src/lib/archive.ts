import mediaLinksData from "../../data/media-links.json";
import peopleData from "../../data/people.json";
import appearancesData from "../../data/appearances.json";
import concertsData from "../../data/concerts.json";
import musicShowsData from "../../data/music-shows.json";
import releasesData from "../../data/releases.json";
import songsData from "../../data/songs.json";
import sourcesData from "../../data/sources.json";

export type Status = "confirmed" | "partial" | "uncertain" | "needs-source";

export type LocalizedText = {
  en?: string;
  "zh-Hant"?: string;
  "zh-Hans"?: string;
  pinyin?: string;
  [locale: string]: string | undefined;
};

export type Person = {
  id: string;
  slug: string;
  displayName: string;
  nameOriginal?: string;
  nameLocalized?: LocalizedText;
  aliases: string[];
  roles: string[];
  sources: string[];
  notes?: string;
  status: Status;
};

export type Song = {
  id: string;
  slug: string;
  title: string;
  titleLocalized?: LocalizedText;
  titleOriginal?: string;
  aliases: string[];
  language?: string;
  lyricsBy: string[];
  composedBy: string[];
  arrangedBy: string[];
  firstKnownRelease?: string;
  relatedReleases: string[];
  knownConcerts: string[];
  knownMusicShows: string[];
  mediaLinks: string[];
  sources: string[];
  notes?: string;
  status: Status;
};

export type Track = {
  disc?: number;
  position: number | null;
  song: string | null;
  titleOnRelease: string;
  titleOnReleaseLocalized?: LocalizedText;
  duration: string | null;
  versionNote: string | null;
  performers?: string[];
  credits: {
    lyricsBy: string[];
    composedBy: string[];
  };
};

export type AppearanceTrack = {
  position: number | null;
  song: string | null;
  title: string;
  titleLocalized?: LocalizedText;
  role?: string | null;
  performers?: string[];
  duration?: string | null;
  credits: {
    lyricsBy: string[];
    composedBy: string[];
  };
  notes?: string | null;
};

export type ArchiveLink = {
  label: string;
  platform?: string;
  url: string;
  kind?: string;
  isOfficial?: boolean;
  accessRegion?: string;
  credit?: string;
  notes?: string;
};

export type Release = {
  id: string;
  slug: string;
  title: string;
  titleLocalized?: LocalizedText;
  titleOriginal?: string;
  releaseDate?: string;
  releaseType: string;
  artist: string;
  artists?: string[];
  label?: string | null;
  catalogNumber?: string | null;
  formats: string[];
  availability?: {
    physical?: string[];
    streaming?: ArchiveLink[];
    purchase?: ArchiveLink[];
  };
  tracks: Track[];
  credits: Record<string, string[]>;
  sources: string[];
  notes?: string;
  status: Status;
};

export type SongPerformance = {
  position: number | null;
  date?: string | null;
  song: string | null;
  titlePerformed: string;
  titlePerformedLocalized?: LocalizedText;
  originalPerformer?: string | null;
  collaborators?: string[];
  mediaLinks?: ArchiveLink[];
  notes?: string;
};

export type Concert = {
  id: string;
  slug: string;
  title: string;
  titleLocalized?: LocalizedText;
  date?: string | null;
  venue?: string | null;
  city?: string | null;
  countryOrRegion?: string | null;
  eventType: string;
  guests?: string[];
  setlist: SongPerformance[];
  mediaLinks: ArchiveLink[];
  officialRecording?: boolean;
  sources: string[];
  sourceQuality?: string;
  notes?: string;
  status: Status;
};

export type MusicShow = {
  id: string;
  slug: string;
  title: string;
  titleLocalized?: LocalizedText;
  titleOriginal?: string;
  date?: string | null;
  program?: string | null;
  episode?: string | null;
  platform?: string | null;
  performedSongs: SongPerformance[];
  collaborators: string[];
  mediaLinks: ArchiveLink[];
  sources: string[];
  sourceQuality?: string;
  notes?: string;
  status: Status;
};

export type Appearance = {
  id: string;
  slug: string;
  title: string;
  titleLocalized?: LocalizedText;
  titleOriginal?: string;
  date?: string | null;
  appearanceType: string;
  programOrWork?: string | null;
  role?: string | null;
  relatedSongs: string[];
  tracks?: AppearanceTrack[];
  mediaLinks: ArchiveLink[];
  sources: string[];
  notes?: string;
  status: Status;
};

export type Source = {
  id: string;
  sourceType: string;
  title: string;
  authorOrPublisher?: string;
  date?: string | null;
  url?: string;
  accessDate?: string;
  citation?: string;
  reliability: string;
  notes?: string;
};

export type SearchEntry = {
  category: string;
  filterCategory: string;
  title: string;
  href: string;
  summary: string;
  meta: string;
  searchText: string;
};

export type PersonCredit = {
  category: string;
  role: string;
  title: string;
  href: string;
  context?: string;
};

export type SongReleasePlacement = {
  release: Release;
  track: Track;
  href: string;
  label: string;
};

export type SongLiveRecord = {
  kind: "concert" | "music-show";
  category: string;
  title: string;
  href: string;
  date?: string | null;
  context?: string | null;
  entry: SongPerformance;
  mediaLinks: ArchiveLink[];
};

export type SongSummary = {
  song: Song;
  title: string;
  href: string;
  originLabel: "Original" | "Cover" | "Unresolved";
  albumLabel: string;
  albumReleases: Release[];
  releasePlacements: SongReleasePlacement[];
  liveRecords: SongLiveRecord[];
  concertCount: number;
  musicShowCount: number;
  liveCount: number;
  clipCount: number;
  dateSort: string;
  alphaSort: string;
  creditsLabel: string;
  searchText: string;
};

export type DistributionItem = {
  label: string;
  count: number;
  total: number;
  percent: number;
};

export const people = peopleData as Person[];
export const songs = songsData as Song[];
export const releases = releasesData as Release[];
export const concerts = concertsData as Concert[];
export const musicShows = musicShowsData as MusicShow[];
export const appearances = appearancesData as Appearance[];
export const sources = sourcesData as Source[];
export const mediaLinks = mediaLinksData as unknown[];

export function byId<T extends { id: string }>(items: T[], id: string | null | undefined) {
  if (!id) return undefined;
  return items.find((item) => item.id === id);
}

export function personName(id: string) {
  const person = byId(people, id);
  return person ? person.displayName : id;
}

export function personNames(ids: string[] | undefined) {
  return ids?.length ? ids.map(personName).join(", ") : "";
}

export function releaseArtists(release: Release) {
  return personNames(release.artists?.length ? release.artists : [release.artist]);
}

export function releaseProducers(release: Release) {
  return personNames(release.credits.producer || release.credits.producers || []);
}

export function linkPlatformList(links: ArchiveLink[] | undefined) {
  return links?.length
    ? Array.from(new Set(links.map((link) => link.platform || link.label))).join(", ")
    : "";
}

export function availabilityLabels(availability: Release["availability"]) {
  return [
    availability?.streaming?.length ? `Streaming: ${linkPlatformList(availability.streaming)}` : "",
    availability?.purchase?.length ? `Buy: ${linkPlatformList(availability.purchase)}` : ""
  ].filter(Boolean);
}

export function releaseFormatLabels(release: Release) {
  return [
    release.formats.includes("CD") ? "CD" : "",
    release.formats.includes("DVD") ? "DVD" : "",
    release.formats.includes("vinyl") ? "Vinyl" : "",
    release.formats.includes("cassette") ? "Cassette" : ""
  ].filter(Boolean);
}

export function releaseAvailabilityChecks(release: Release) {
  const checks: Array<[string, boolean]> = [
    ["CD", release.formats.includes("CD")],
    ["DVD", release.formats.includes("DVD")],
    ["Vinyl", release.formats.includes("vinyl")],
    ["Cassette", release.formats.includes("cassette")],
    ["Streaming", Boolean(release.availability?.streaming?.length)]
  ];
  if (release.availability?.purchase?.length) {
    checks.push(["Buy", true]);
  }
  return checks;
}

export function releaseCategoryTags(release: Release) {
  const englishCoverReleaseIds = new Set([
    "release-whoever-finds-this-i-love-you-1988",
    "release-where-have-all-the-flowers-gone-1990",
    "release-dare-to-dream-1994",
    "release-chyis-tears-1996",
    "release-the-voice-2010",
    "release-clouds-2011"
  ]);
  const text = [
    release.id,
    release.releaseType,
    release.title,
    release.titleOriginal,
    release.notes,
    ...release.tracks.map((track) => [
      track.titleOnRelease,
      track.versionNote,
      track.titleOnReleaseLocalized ? Object.values(track.titleOnReleaseLocalized).join(" ") : ""
    ].join(" "))
  ].join(" ").toLocaleLowerCase("en-US");
  const tags = new Set<string>();

  if (release.releaseType === "studio-album") tags.add("studio");
  if (release.releaseType === "single" || release.releaseType === "ep") tags.add("ep-single");
  if (release.releaseType === "compilation") tags.add("compilation");
  if (release.releaseType === "collaboration") tags.add("collaboration");
  if (release.releaseType === "live-album") tags.add("live");
  if (release.releaseType === "reissue") tags.add("reissue");
  if (release.releaseType === "other") tags.add("other");

  if (
    englishCoverReleaseIds.has(release.id) ||
    text.includes("english-language") ||
    text.includes("english cover") ||
    text.includes("cover album")
  ) {
    tags.add("english-cover");
  }
  if (
    text.includes("buddha") ||
    text.includes("chanting") ||
    text.includes("cundi") ||
    text.includes("prayer") ||
    text.includes("sutra") ||
    text.includes("佛") ||
    text.includes("經") ||
    text.includes("经") ||
    text.includes("咒") ||
    text.includes("誦") ||
    text.includes("诵")
  ) {
    tags.add("religious");
  }

  return Array.from(tags);
}

export function releasePrimaryCategory(release: Release) {
  const priority = [
    "studio",
    "ep-single",
    "compilation",
    "collaboration",
    "live",
    "reissue",
    "english-cover",
    "religious",
    "other"
  ];
  const tags = releaseCategoryTags(release);
  return priority.find((tag) => tags.includes(tag)) || release.releaseType;
}

export function concertAvailabilityChecks(concert: Concert) {
  return [
    ["Official recording", Boolean(concert.officialRecording)],
    ["Video", concert.mediaLinks.some((link) => link.kind === "video")],
    ["Audio", concert.mediaLinks.some((link) => link.kind === "audio")],
    ["Clips", concert.setlist.some((entry) => entry.mediaLinks?.length)]
  ] as Array<[string, boolean]>;
}

export function showAvailabilityChecks(show: MusicShow) {
  return [
    ["Watch", show.mediaLinks.some((link) => link.kind === "watch")],
    ["Streaming", show.mediaLinks.some((link) => link.kind?.includes("streaming"))],
    ["Clips", show.performedSongs.some((entry) => entry.mediaLinks?.length)]
  ] as Array<[string, boolean]>;
}

export function appearanceAvailabilityChecks(appearance: Appearance) {
  return [
    ["Watch", appearance.mediaLinks.some((link) => link.kind === "watch")],
    ["Streaming", appearance.mediaLinks.some((link) => link.kind === "streaming")],
    ["Metadata", appearance.mediaLinks.some((link) => link.kind === "metadata")],
    ["Tracks", Boolean(appearance.tracks?.length)]
  ] as Array<[string, boolean]>;
}

export function linkCreditLabel(link: ArchiveLink) {
  return link.credit ? `Credit: ${link.credit}` : "";
}

export function sourceTitle(id: string) {
  const source = byId(sources, id);
  return source ? source.title : id;
}

export function songTitle(id: string) {
  const song = byId(songs, id);
  return song ? song.title : id;
}

export function releaseTitle(id: string) {
  const release = byId(releases, id);
  return release ? release.title : id;
}

export function releasesForSong(songId: string) {
  return releases.filter((release) =>
    release.tracks.some((track) => track.song === songId)
  );
}

export function concertsForSong(songId: string) {
  return concerts.filter((concert) =>
    concert.setlist.some((entry) => entry.song === songId)
  );
}

export function musicShowsForSong(songId: string) {
  return musicShows.filter((show) =>
    show.performedSongs.some((entry) => entry.song === songId)
  );
}

export function sourceRecords(ids: string[]) {
  return ids.map((id) => byId(sources, id)).filter(Boolean) as Source[];
}

export function displayTitle(item: { title: string; titleOriginal?: string }) {
  return item.titleOriginal ? `${item.title} / ${item.titleOriginal}` : item.title;
}

export function localizedTextValues(value: LocalizedText | undefined) {
  return value ? Object.values(value).filter((item): item is string => Boolean(item)) : [];
}

function uniqueById<T extends { id: string }>(items: T[]) {
  return Array.from(new Map(items.map((item) => [item.id, item])).values());
}

function normalizeTitle(value: string) {
  return value.toLocaleLowerCase("en-US");
}

function songTrackLabel(track: Track) {
  return [track.disc ? `D${track.disc}` : "", track.position ? `${track.position}` : ""]
    .filter(Boolean)
    .join(".");
}

function songDateSort(song: Song, releasePlacements: SongReleasePlacement[], liveRecords: SongLiveRecord[]) {
  return [
    ...releasePlacements.map((placement) => placement.release.releaseDate),
    ...liveRecords.map((record) => record.date),
    song.firstKnownRelease ? byId(releases, song.firstKnownRelease)?.releaseDate : ""
  ]
    .filter(Boolean)
    .sort()[0] || "";
}

function hasChyiOriginalPerformer(record: SongLiveRecord) {
  return Boolean(record.entry.originalPerformer?.toLocaleLowerCase("en-US").includes("chyi yu"));
}

function hasCoverClue(song: Song, liveRecords: SongLiveRecord[]) {
  return song.notes?.toLocaleLowerCase("en-US").includes("cover") ||
    liveRecords.some((record) => record.entry.originalPerformer && !hasChyiOriginalPerformer(record));
}

export function releasePlacementsForSong(songId: string): SongReleasePlacement[] {
  return releases.flatMap((release) =>
    release.tracks
      .filter((track) => track.song === songId)
      .map((track) => {
        const trackLabel = songTrackLabel(track);
        return {
          release,
          track,
          href: `/releases/${release.slug}/`,
          label: trackLabel ? `${displayTitle(release)} / ${trackLabel}` : displayTitle(release)
        };
      })
  );
}

export function liveRecordsForSong(songId: string): SongLiveRecord[] {
  const concertRecords = concerts.flatMap((concert) =>
    concert.setlist
      .filter((entry) => entry.song === songId)
      .map((entry) => ({
        kind: "concert" as const,
        category: "Concert",
        title: concert.title,
        href: `/concerts/${concert.slug}/`,
        date: entry.date || concert.date,
        context: text([concert.venue, concert.city, concert.countryOrRegion]),
        entry,
        mediaLinks: entry.mediaLinks || []
      }))
  );

  const musicShowRecords = musicShows.flatMap((show) =>
    show.performedSongs
      .filter((entry) => entry.song === songId)
      .map((entry) => ({
        kind: "music-show" as const,
        category: "Music show",
        title: show.title,
        href: `/music-shows/${show.slug}/`,
        date: entry.date || show.date,
        context: text([show.program, show.episode, show.platform]),
        entry,
        mediaLinks: entry.mediaLinks || []
      }))
  );

  return [...concertRecords, ...musicShowRecords].sort((a, b) =>
    text([a.date, a.title, a.entry.position || 0]).localeCompare(text([b.date, b.title, b.entry.position || 0]), "en")
  );
}

export function songSummary(song: Song): SongSummary {
  const releasePlacements = releasePlacementsForSong(song.id);
  const directReleases = [
    song.firstKnownRelease ? byId(releases, song.firstKnownRelease) : undefined,
    ...song.relatedReleases.map((releaseId) => byId(releases, releaseId)),
    ...releasePlacements.map((placement) => placement.release)
  ].filter(Boolean) as Release[];
  const albumReleases = uniqueById(directReleases);
  const liveRecords = liveRecordsForSong(song.id);
  const concertCount = liveRecords.filter((record) => record.kind === "concert").length;
  const musicShowCount = liveRecords.filter((record) => record.kind === "music-show").length;
  const clipCount = liveRecords.reduce((sum, record) => sum + record.mediaLinks.length, 0);
  const originLabel = hasCoverClue(song, liveRecords)
    ? "Cover"
    : albumReleases.length
      ? "Original"
      : "Unresolved";
  const primaryRelease = albumReleases[0];
  const albumLabel = primaryRelease
    ? `${displayTitle(primaryRelease)}${albumReleases.length > 1 ? ` + ${albumReleases.length - 1} more` : ""}`
    : "No linked album";

  return {
    song,
    title: displayTitle(song),
    href: primaryRelease ? `/releases/${primaryRelease.slug}/` : "/releases/",
    originLabel,
    albumLabel,
    albumReleases,
    releasePlacements,
    liveRecords,
    concertCount,
    musicShowCount,
    liveCount: liveRecords.length,
    clipCount,
    dateSort: songDateSort(song, releasePlacements, liveRecords),
    alphaSort: normalizeTitle(displayTitle(song)),
    creditsLabel: text([personNames(song.lyricsBy), personNames(song.composedBy)]),
    searchText: text([
      displayTitle(song),
      ...localizedTextValues(song.titleLocalized),
      song.aliases.join(" "),
      song.language,
      personNames(song.lyricsBy),
      personNames(song.composedBy),
      personNames(song.arrangedBy),
      albumReleases.map(displayTitle).join(" "),
      ...albumReleases.flatMap((release) => localizedTextValues(release.titleLocalized)),
      releasePlacements.map((placement) => placement.track.titleOnRelease).join(" "),
      ...releasePlacements.flatMap((placement) => localizedTextValues(placement.track.titleOnReleaseLocalized)),
      ...liveRecords.flatMap((record) => [
        record.title,
        record.entry.titlePerformed,
        ...localizedTextValues(record.entry.titlePerformedLocalized),
        record.entry.originalPerformer,
        personNames(record.entry.collaborators),
        linkPlatformList(record.mediaLinks)
      ]),
      song.notes
    ])
  };
}

export function songSummaries() {
  return songs.map(songSummary);
}

export function releaseLiveRecordCount(release: Release) {
  const songIds = Array.from(new Set(release.tracks.map((track) => track.song).filter(Boolean))) as string[];
  return songIds.reduce((sum, songId) => sum + liveRecordsForSong(songId).length, 0);
}

export function distribution(items: Array<string | null | undefined>, fallback = "Unknown"): DistributionItem[] {
  const counts = items.reduce((map, value) => {
    const label = value || fallback;
    map.set(label, (map.get(label) || 0) + 1);
    return map;
  }, new Map<string, number>());
  const total = items.length;
  return Array.from(counts.entries())
    .map(([label, count]) => ({
      label,
      count,
      total,
      percent: total ? Math.round((count / total) * 100) : 0
    }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label, "en"));
}

function recordSourceIds(record: { sources?: string[] }) {
  return record.sources || [];
}

export function archiveStatistics() {
  const summaries = songSummaries();
  const statusRecords = [
    ...songs,
    ...releases,
    ...concerts,
    ...musicShows,
    ...appearances,
    ...people
  ];
  const sourceBackedRecords = statusRecords.filter((record) => recordSourceIds(record).length);
  const sourceIds = new Set(statusRecords.flatMap(recordSourceIds));

  return {
    totals: {
      songs: songs.length,
      albums: releases.length,
      concerts: concerts.length,
      musicShows: musicShows.length,
      appearances: appearances.length,
      people: people.length,
      sources: sources.length,
      concertPerformances: concerts.reduce((sum, concert) => sum + concert.setlist.length, 0),
      musicShowPerformances: musicShows.reduce((sum, show) => sum + show.performedSongs.length, 0)
    },
    songPerformanceTotal: summaries.reduce((sum, summary) => sum + summary.liveCount, 0),
    topSongs: [...summaries]
      .filter((summary) => summary.liveCount > 0)
      .sort((a, b) => b.liveCount - a.liveCount || a.alphaSort.localeCompare(b.alphaSort, "en"))
      .slice(0, 10),
    leastPerformedSongs: [...summaries]
      .sort((a, b) => a.liveCount - b.liveCount || a.alphaSort.localeCompare(b.alphaSort, "en"))
      .slice(0, 10),
    releaseTypeDistribution: distribution(releases.map((release) => release.releaseType)),
    concertRegionDistribution: distribution(concerts.map((concert) => concert.countryOrRegion)),
    musicShowPlatformDistribution: distribution(musicShows.map((show) => show.platform)),
    appearanceTypeDistribution: distribution(appearances.map((appearance) => appearance.appearanceType)),
    statusDistribution: distribution(statusRecords.map((record) => record.status)),
    sourceCoverage: {
      totalRecords: statusRecords.length,
      withSources: sourceBackedRecords.length,
      withoutSources: statusRecords.length - sourceBackedRecords.length,
      citedSourceIds: sourceIds.size
    }
  };
}

function hasPerson(personIds: string[] | undefined, personId: string) {
  if (!personIds) return false;
  const person = byId(people, personId);
  return personIds.some((id) =>
    id === personId ||
    id === person?.displayName ||
    person?.aliases.includes(id)
  );
}

function trackCreditRoles(track: Track, personId: string) {
  const roles: string[] = [];
  if (hasPerson(track.credits.lyricsBy, personId)) roles.push("lyrics");
  if (hasPerson(track.credits.composedBy, personId)) roles.push("music");
  return roles;
}

function songCreditRoles(song: Song, personId: string) {
  const roles: string[] = [];
  if (hasPerson(song.lyricsBy, personId)) roles.push("lyrics");
  if (hasPerson(song.composedBy, personId)) roles.push("music");
  if (hasPerson(song.arrangedBy, personId)) roles.push("arrangement");
  return roles;
}

export function personCredits(personId: string) {
  const releaseCredits: PersonCredit[] = releases.flatMap((release) => {
    const credits = Object.entries(release.credits)
      .filter(([, ids]) => hasPerson(ids, personId))
      .map(([role]) => role);
    if (release.artist === personId) credits.unshift("artist");
    if (hasPerson(release.artists, personId) && release.artist !== personId) credits.unshift("artist");

    return credits.length
      ? [{
          category: "Releases",
          role: credits.join(", "),
          title: displayTitle(release),
          href: `/releases/${release.slug}/`,
          context: release.releaseDate || release.releaseType
        }]
      : [];
  });

  const trackCredits: PersonCredit[] = releases.flatMap((release) =>
    release.tracks.flatMap((track) => {
      const roles = trackCreditRoles(track, personId);
      return roles.length
        ? [{
            category: "Tracks",
            role: roles.join(", "),
            title: track.titleOnRelease,
            href: `/releases/${release.slug}/`,
            context: displayTitle(release)
          }]
        : [];
    })
  );

  const songCredits: PersonCredit[] = songs.flatMap((song) => {
    const roles = songCreditRoles(song, personId);
    const firstRelease = byId(releases, song.firstKnownRelease);
    return roles.length
      ? [{
          category: "Internal songs",
          role: roles.join(", "),
          title: displayTitle(song),
          href: firstRelease ? `/releases/${firstRelease.slug}/` : "/releases/",
          context: firstRelease ? displayTitle(firstRelease) : "No linked release"
        }]
      : [];
  });

  const concertCredits: PersonCredit[] = concerts.flatMap((concert) => {
    const credits: PersonCredit[] = [];
    if (hasPerson(concert.guests, personId)) {
      credits.push({
        category: "Concerts",
        role: "guest",
        title: concert.title,
        href: `/concerts/${concert.slug}/`,
        context: concert.date || concert.eventType
      });
    }

    concert.setlist.forEach((entry) => {
      if (hasPerson(entry.collaborators, personId)) {
        credits.push({
          category: "Concerts",
          role: "collaborator",
          title: entry.titlePerformed,
          href: `/concerts/${concert.slug}/`,
          context: concert.title
        });
      }
    });

    return credits;
  });

  const musicShowCredits: PersonCredit[] = musicShows.flatMap((show) => {
    const credits: PersonCredit[] = [];
    if (hasPerson(show.collaborators, personId)) {
      credits.push({
        category: "Music shows",
        role: "collaborator",
        title: show.title,
        href: `/music-shows/${show.slug}/`,
        context: show.date || show.program || undefined
      });
    }

    show.performedSongs.forEach((entry) => {
      if (hasPerson(entry.collaborators, personId)) {
        credits.push({
          category: "Music shows",
          role: "song collaborator",
          title: entry.titlePerformed,
          href: `/music-shows/${show.slug}/`,
          context: show.title
        });
      }
    });

    return credits;
  });

  const all = [
    ...releaseCredits,
    ...trackCredits,
    ...songCredits,
    ...concertCredits,
    ...musicShowCredits
  ];

  return {
    releaseCredits,
    trackCredits,
    songCredits,
    concertCredits,
    musicShowCredits,
    all,
    total: all.length
  };
}

function text(values: Array<string | number | null | undefined | false>) {
  return values.filter(Boolean).join(" ");
}

export function buildSearchEntries(): SearchEntry[] {
  const albumEntries = releases.map((release) => ({
    category: "Album",
    filterCategory: "album",
    title: displayTitle(release),
    href: `/releases/${release.slug}/`,
    summary: text([release.releaseDate, release.releaseType, release.label]),
    meta: `${release.tracks.length} tracks`,
    searchText: text([
      displayTitle(release),
      ...localizedTextValues(release.titleLocalized),
      release.releaseType,
      release.releaseDate,
      release.label,
      releaseArtists(release),
      releaseProducers(release),
      release.formats.join(" "),
      linkPlatformList(release.availability?.streaming),
      ...release.tracks.flatMap((track) => [
        track.titleOnRelease,
        ...localizedTextValues(track.titleOnReleaseLocalized),
        track.disc ? `disc ${track.disc}` : "",
        personNames(track.credits.lyricsBy),
        personNames(track.credits.composedBy),
        personNames(track.performers),
        track.versionNote
      ])
    ])
  }));

  const songEntries = songSummaries().map((summary) => ({
    category: "Song",
    filterCategory: "song",
    title: summary.title,
    href: summary.href,
    summary: text([summary.originLabel, summary.albumLabel]),
    meta: `${summary.liveCount} live records`,
    searchText: summary.searchText
  }));

  const concertEntries = concerts.map((concert) => ({
    category: "Concert",
    filterCategory: "concert",
    title: concert.title,
    href: `/concerts/${concert.slug}/`,
    summary: text([concert.date, concert.eventType, concert.venue, concert.city, concert.countryOrRegion]),
    meta: `${concert.setlist.length} songs`,
    searchText: text([
      concert.title,
      ...localizedTextValues(concert.titleLocalized),
      concert.date,
      concert.eventType,
      concert.venue,
      concert.city,
      concert.countryOrRegion,
      personNames(concert.guests),
      linkPlatformList(concert.mediaLinks),
      ...concert.setlist.flatMap((entry) => [
        entry.titlePerformed,
        ...localizedTextValues(entry.titlePerformedLocalized),
        entry.originalPerformer,
        entry.mediaLinks?.map(linkCreditLabel).join(" "),
        linkPlatformList(entry.mediaLinks)
      ])
    ])
  }));

  const personEntries = people.map((person) => ({
    category: "Person",
    filterCategory: "person",
    title: person.nameOriginal ? `${person.displayName} / ${person.nameOriginal}` : person.displayName,
    href: `/people/${person.slug}/`,
    summary: person.roles.join(", "),
    meta: `${personCredits(person.id).total} links`,
    searchText: text([
      person.displayName,
      person.nameOriginal,
      ...localizedTextValues(person.nameLocalized),
      person.aliases.join(" "),
      person.roles.join(" "),
      person.notes
    ])
  }));

  return [
    ...songEntries,
    ...albumEntries,
    ...concertEntries,
    ...personEntries
  ];
}
