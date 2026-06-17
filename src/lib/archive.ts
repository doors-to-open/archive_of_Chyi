import mediaLinksData from "../../data/media-links.json";
import peopleData from "../../data/people.json";
import performancesData from "../../data/performances.json";
import releasesData from "../../data/releases.json";
import songsData from "../../data/songs.json";
import sourcesData from "../../data/sources.json";

export type Status = "confirmed" | "partial" | "uncertain" | "needs-source";

export type Person = {
  id: string;
  slug: string;
  displayName: string;
  nameOriginal?: string;
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
  titleOriginal?: string;
  aliases: string[];
  language?: string;
  lyricsBy: string[];
  composedBy: string[];
  arrangedBy: string[];
  firstKnownRelease?: string;
  relatedReleases: string[];
  knownPerformances: string[];
  mediaLinks: string[];
  sources: string[];
  notes?: string;
  status: Status;
};

export type Track = {
  position: number | null;
  song: string | null;
  titleOnRelease: string;
  duration: string | null;
  versionNote: string | null;
  credits: {
    lyricsBy: string[];
    composedBy: string[];
  };
};

export type Release = {
  id: string;
  slug: string;
  title: string;
  titleOriginal?: string;
  releaseDate?: string;
  releaseType: string;
  artist: string;
  label?: string | null;
  catalogNumber?: string | null;
  formats: string[];
  tracks: Track[];
  credits: Record<string, string[]>;
  sources: string[];
  notes?: string;
  status: Status;
};

export type Performance = {
  id: string;
  slug: string;
  title: string;
  date?: string | null;
  venue?: string | null;
  city?: string | null;
  countryOrRegion?: string | null;
  eventType: string;
  setlist: {
    position: number | null;
    song: string;
    titlePerformed: string;
  }[];
  mediaLinks: string[];
  sources: string[];
  sourceQuality?: string;
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

export const people = peopleData as Person[];
export const songs = songsData as Song[];
export const releases = releasesData as Release[];
export const performances = performancesData as Performance[];
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

export function performancesForSong(songId: string) {
  return performances.filter((performance) =>
    performance.setlist.some((entry) => entry.song === songId)
  );
}

export function sourceRecords(ids: string[]) {
  return ids.map((id) => byId(sources, id)).filter(Boolean) as Source[];
}

export function displayTitle(item: { title: string; titleOriginal?: string }) {
  return item.titleOriginal ? `${item.title} / ${item.titleOriginal}` : item.title;
}

