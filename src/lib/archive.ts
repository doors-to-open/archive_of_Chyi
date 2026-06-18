import mediaLinksData from "../../data/media-links.json";
import peopleData from "../../data/people.json";
import appearancesData from "../../data/appearances.json";
import concertsData from "../../data/concerts.json";
import musicShowsData from "../../data/music-shows.json";
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
  duration: string | null;
  versionNote: string | null;
  performers?: string[];
  credits: {
    lyricsBy: string[];
    composedBy: string[];
  };
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
  originalPerformer?: string | null;
  collaborators?: string[];
  mediaLinks?: ArchiveLink[];
  notes?: string;
};

export type Concert = {
  id: string;
  slug: string;
  title: string;
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
  titleOriginal?: string;
  date?: string | null;
  appearanceType: string;
  programOrWork?: string | null;
  role?: string | null;
  relatedSongs: string[];
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
  return [
    ["CD", release.formats.includes("CD")],
    ["DVD", release.formats.includes("DVD")],
    ["Vinyl", release.formats.includes("vinyl")],
    ["Cassette", release.formats.includes("cassette")],
    ["Streaming", Boolean(release.availability?.streaming?.length)],
    ["Buy", Boolean(release.availability?.purchase?.length)]
  ] as Array<[string, boolean]>;
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
    ["Metadata", appearance.mediaLinks.some((link) => link.kind === "metadata")]
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
  const releaseEntries = releases.map((release) => ({
    category: "Releases",
    filterCategory: "releases",
    title: displayTitle(release),
    href: `/releases/${release.slug}/`,
    summary: text([release.releaseDate, release.releaseType, release.label]),
    meta: `${release.tracks.length} tracks`,
    searchText: text([
      displayTitle(release),
      release.releaseType,
      release.releaseDate,
      release.label,
      releaseArtists(release),
      releaseProducers(release),
      release.formats.join(" "),
      linkPlatformList(release.availability?.streaming),
      ...release.tracks.flatMap((track) => [
        track.titleOnRelease,
        track.disc ? `disc ${track.disc}` : "",
        personNames(track.credits.lyricsBy),
        personNames(track.credits.composedBy),
        personNames(track.performers),
        track.versionNote
      ])
    ])
  }));

  const trackEntries = releases.flatMap((release) =>
    release.tracks.map((track) => ({
      category: "Tracks",
      filterCategory: "tracks",
      title: track.titleOnRelease,
      href: `/releases/${release.slug}/`,
      summary: `Track ${track.position || "-"} on ${displayTitle(release)}`,
      meta: text([personNames(track.credits.lyricsBy), personNames(track.credits.composedBy)]),
      searchText: text([
        track.titleOnRelease,
        displayTitle(release),
        track.disc ? `disc ${track.disc}` : "",
        track.versionNote,
        personNames(track.performers),
        personNames(track.credits.lyricsBy),
        personNames(track.credits.composedBy)
      ])
    }))
  );

  const songEntries = songs.map((song) => {
    const firstRelease = byId(releases, song.firstKnownRelease);
    return {
      category: "Internal songs",
      filterCategory: "songs",
      title: displayTitle(song),
      href: firstRelease ? `/releases/${firstRelease.slug}/` : "/releases/",
      summary: firstRelease ? `Appears on ${displayTitle(firstRelease)}` : "Internal song record",
      meta: text([personNames(song.lyricsBy), personNames(song.composedBy)]),
      searchText: text([
        displayTitle(song),
        song.aliases.join(" "),
        song.language,
        personNames(song.lyricsBy),
        personNames(song.composedBy)
      ])
    };
  });

  const concertEntries = concerts.map((concert) => ({
    category: "Concerts",
    filterCategory: "concerts",
    title: concert.title,
    href: `/concerts/${concert.slug}/`,
    summary: text([concert.date, concert.eventType, concert.venue, concert.city, concert.countryOrRegion]),
    meta: `${concert.setlist.length} songs`,
    searchText: text([
      concert.title,
      concert.date,
      concert.eventType,
      concert.venue,
      concert.city,
      concert.countryOrRegion,
      personNames(concert.guests),
      linkPlatformList(concert.mediaLinks),
      ...concert.setlist.flatMap((entry) => [
        entry.titlePerformed,
        entry.originalPerformer,
        entry.mediaLinks?.map(linkCreditLabel).join(" "),
        linkPlatformList(entry.mediaLinks)
      ])
    ])
  }));

  const musicShowEntries = musicShows.map((show) => ({
    category: "Music shows",
    filterCategory: "music-shows",
    title: show.title,
    href: `/music-shows/${show.slug}/`,
    summary: text([show.date, show.program, show.episode, show.platform]),
    meta: `${show.performedSongs.length} songs`,
    searchText: text([
      show.title,
      show.date,
      show.program,
      show.episode,
      show.platform,
      personNames(show.collaborators),
      linkPlatformList(show.mediaLinks),
      ...show.performedSongs.flatMap((entry) => [
        entry.date,
        entry.titlePerformed,
        entry.originalPerformer,
        personNames(entry.collaborators),
        linkPlatformList(entry.mediaLinks)
      ])
    ])
  }));

  const appearanceEntries = appearances.map((appearance) => ({
    category: "Appearances",
    filterCategory: "appearances",
    title: appearance.title,
    href: `/appearances/${appearance.slug}/`,
    summary: text([appearance.date, appearance.appearanceType, appearance.programOrWork, appearance.role]),
    meta: appearance.status,
    searchText: text([
      appearance.title,
      appearance.date,
      appearance.appearanceType,
      appearance.programOrWork,
      appearance.role,
      appearance.notes
    ])
  }));

  const personEntries = people.map((person) => ({
    category: "People",
    filterCategory: "people",
    title: person.nameOriginal ? `${person.displayName} / ${person.nameOriginal}` : person.displayName,
    href: `/people/${person.slug}/`,
    summary: person.roles.join(", "),
    meta: `${personCredits(person.id).total} links`,
    searchText: text([
      person.displayName,
      person.nameOriginal,
      person.aliases.join(" "),
      person.roles.join(" "),
      person.notes
    ])
  }));

  const sourceEntries = sources.map((source) => ({
    category: "Sources",
    filterCategory: "sources",
    title: source.title,
    href: source.url || "/sources/",
    summary: text([source.sourceType, source.authorOrPublisher, source.reliability]),
    meta: source.accessDate || "",
    searchText: text([
      source.title,
      source.authorOrPublisher,
      source.sourceType,
      source.reliability,
      source.citation,
      source.notes
    ])
  }));

  return [
    ...releaseEntries,
    ...trackEntries,
    ...songEntries,
    ...concertEntries,
    ...musicShowEntries,
    ...appearanceEntries,
    ...personEntries,
    ...sourceEntries
  ];
}
