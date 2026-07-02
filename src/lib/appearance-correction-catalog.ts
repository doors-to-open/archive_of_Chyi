import {
  appearanceAvailabilityChecks,
  appearances,
  byId,
  linkCreditLabel,
  linkPlatformList,
  musicShows,
  personNames,
  showAvailabilityChecks,
  songs,
  type Appearance,
  type ArchiveLink,
  type LocalizedName,
  type MusicShow,
  type SongPerformance
} from "./archive";
import {
  appearanceProgramOrWorkValues,
  appearanceRoleValues,
  appearanceShowContentValues,
  appearanceTypeValues,
  performanceTitleValues,
  titleValues,
  trackTitleValues,
  valueForLocale
} from "./i18n";

export type AppearanceCorrectionField = {
  label: string;
  value: string;
};

export type AppearanceCorrectionItem = {
  id: string;
  title: string;
  path: string;
  meta: string;
  category: string;
  recordType: string;
  searchText: string;
  fields: Record<string, AppearanceCorrectionField[]>;
};

const notRecorded = "Not recorded";
const boolValue = (value: boolean) => value ? "yes" : "no";
const join = (values: Array<string | undefined | null>) => values.filter(Boolean).join("; ") || notRecorded;
const field = (label: string, value: string | undefined | null): AppearanceCorrectionField => ({ label, value: value || notRecorded });

function localizedName(name: LocalizedName) {
  return valueForLocale({
    en: name.nameLocalized?.en || name.name,
    "zh-Hant": name.nameLocalized?.["zh-Hant"] || name.name,
    "zh-Hans": name.nameLocalized?.["zh-Hans"] || name.name
  });
}

function localizedNames(names: LocalizedName[] | undefined) {
  return names?.length ? names.map(localizedName).join(", ") : "";
}

function linkLabel(link: { label?: string; platform?: string; kind?: string }, index: number) {
  return link.label || link.platform || link.kind || `Link ${index + 1}`;
}

function linkFields(link: ArchiveLink): AppearanceCorrectionField[] {
  return [
    field("Link URL", link.url),
    field("Platform name", link.platform || link.label),
    field("Kind", link.kind),
    field("Credit", link.credit),
    field("Resolution", link.resolution),
    field("Part", link.part),
    field("Timestamp", link.timestamp),
    field("Official", boolValue(Boolean(link.isOfficial)))
  ];
}

function performancePosition(entry: SongPerformance, index: number) {
  return entry.position === null ? "Position not recorded" : `#${entry.position || index + 1}`;
}

function performanceLabel(entry: SongPerformance, index: number) {
  const linkedSong = byId(songs, entry.song || undefined);
  return join([performancePosition(entry, index), valueForLocale(performanceTitleValues(entry, linkedSong))]);
}

function performanceFields(entry: SongPerformance): AppearanceCorrectionField[] {
  const linkedSong = byId(songs, entry.song || undefined);
  const songParts = entry.songParts?.flatMap((id) => {
    const song = byId(songs, id);
    return song ? [song] : [];
  }) || [];
  const fields = [
    field("Song title performed", valueForLocale(performanceTitleValues(entry, linkedSong))),
    field("Matched song identity", linkedSong ? valueForLocale(titleValues(linkedSong)) : notRecorded)
  ];
  if (songParts.length) fields.push(field("Medley song identities", songParts.map((song) => valueForLocale(titleValues(song))).join("; ")));
  if (entry.originalPerformer) fields.push(field("Original performer or source", entry.originalPerformer));
  if (entry.collaborators?.length) fields.push(field("Performed with", personNames(entry.collaborators)));
  if (entry.date) fields.push(field("Performance date", entry.date));
  return fields;
}

function appearanceCategory(appearance: Appearance) {
  if (["ost-vocal-appearance", "soundtrack", "screen-guest-appearance", "film"].includes(appearance.appearanceType)) return "Soundtrack and screen work";
  if (["album-guest-vocal", "collaboration"].includes(appearance.appearanceType)) return "Guest vocals";
  if (["interview", "article", "podcast", "documentary"].includes(appearance.appearanceType)) return "Interviews and articles";
  if (appearance.appearanceType === "show" || appearance.appearanceType === "talk-show") return "Other shows";
  return "Other appearances";
}

function appearanceTitleFields(appearance: Appearance) {
  const fields = [field("Title", valueForLocale(titleValues(appearance)))];
  if (appearance.titleOriginal && appearance.titleOriginal !== appearance.title) fields.push(field("Original title", appearance.titleOriginal));
  return fields;
}

function appearanceMetadataFields(appearance: Appearance) {
  const fields = [
    field("Date", appearance.date),
    field("Program or work", valueForLocale(appearanceProgramOrWorkValues(appearance))),
    field("Content summary", valueForLocale(appearanceShowContentValues(appearance.showContent))),
    field("Release date", appearance.workDetails?.releaseDate)
  ];
  return fields.filter((item) => item.value !== notRecorded || ["Date", "Program or work"].includes(item.label));
}

function appearancePeopleFields(appearance: Appearance) {
  return [
    field("Main performers", localizedNames(appearance.mainPerformers)),
    field("Hosts", localizedNames(appearance.hosts)),
    field("Directors", localizedNames(appearance.workDetails?.directors)),
    field("Leading cast", localizedNames(appearance.workDetails?.leadingCast))
  ].filter((item) => item.value !== notRecorded);
}

function appearanceTrackPosition(track: NonNullable<Appearance["tracks"]>[number], index: number) {
  return track.position === null ? "Position not recorded" : `#${track.position || index + 1}`;
}

function appearanceTrackLabel(track: NonNullable<Appearance["tracks"]>[number], index: number) {
  return join([appearanceTrackPosition(track, index), valueForLocale(trackTitleValues({
    disc: undefined,
    position: track.position,
    song: track.song,
    titleOnRelease: track.title,
    titleOnReleaseLocalized: track.titleLocalized,
    duration: track.duration || null,
    versionNote: track.notes || null,
    performers: track.performers,
    credits: track.credits
  }))]);
}

function appearanceTrackFields(track: NonNullable<Appearance["tracks"]>[number]): AppearanceCorrectionField[] {
  const linkedSong = byId(songs, track.song || undefined);
  return [
    field("Song title shown here", valueForLocale(trackTitleValues({
      disc: undefined,
      position: track.position,
      song: track.song,
      titleOnRelease: track.title,
      titleOnReleaseLocalized: track.titleLocalized,
      duration: track.duration || null,
      versionNote: track.notes || null,
      performers: track.performers,
      credits: track.credits
    }))),
    field("Matched song identity", linkedSong ? valueForLocale(titleValues(linkedSong)) : notRecorded),
    field("Role", track.role),
    field("Performed with", personNames(track.performers)),
    field("Lyrics by", personNames(track.credits.lyricsBy)),
    field("Music by", personNames(track.credits.composedBy)),
    field("Track length", track.duration)
  ].filter((item) => item.value !== notRecorded || ["Song title shown here", "Matched song identity"].includes(item.label));
}

function appearanceItem(appearance: Appearance): AppearanceCorrectionItem {
  const category = appearanceCategory(appearance);
  const title = valueForLocale(titleValues(appearance));
  const mediaLinks = appearance.mediaLinks.map((link, index) => ({ label: linkLabel(link, index), fields: linkFields(link) }));
  const relatedSongs = appearance.relatedSongs.flatMap((songId) => {
    const song = byId(songs, songId);
    return song ? [field(valueForLocale(titleValues(song)), valueForLocale(titleValues(song)))] : [field(songId, songId)];
  });
  const tracks = appearance.tracks || [];
  const trackItems = tracks.map((track, index) => ({ label: appearanceTrackLabel(track, index), position: appearanceTrackPosition(track, index), fields: appearanceTrackFields(track) }));
  const performanceItems = (appearance.performedSongs || []).map((entry, index) => ({ label: performanceLabel(entry, index), position: performancePosition(entry, index), fields: performanceFields(entry) }));
  const clipLinks = (appearance.performedSongs || []).flatMap((entry, entryIndex) => {
    const entryLabel = performanceLabel(entry, entryIndex);
    return (entry.mediaLinks || []).map((link, linkIndex) => ({ label: `${entryLabel}: ${linkLabel(link, linkIndex)}`, fields: linkFields(link) }));
  });
  const fields = {
    Category: [field("Category", category), field("Role", valueForLocale(appearanceRoleValues(appearance)))],
    Title: appearanceTitleFields(appearance),
    Metadata: appearanceMetadataFields(appearance),
    People: appearancePeopleFields(appearance),
    Format: appearanceAvailabilityChecks(appearance).map(([label, available]) => ({ label, value: boolValue(available) })),
    Links: mediaLinks.flatMap((link) => link.fields.map((field) => ({ label: `${link.label}: ${field.label}`, value: field.value }))),
    "Related songs": relatedSongs,
    "Track sequence": trackItems.map((track) => ({ label: track.label, value: track.position || notRecorded })),
    "Track details": trackItems.flatMap((track) => track.fields.map((field) => ({ label: `${track.label}: ${field.label}`, value: field.value }))),
    "Performance sequence": performanceItems.map((entry) => ({ label: entry.label, value: entry.position || notRecorded })),
    "Performance song": performanceItems.flatMap((entry) => entry.fields.map((field) => ({ label: `${entry.label}: ${field.label}`, value: field.value }))),
    "Clip links": clipLinks.flatMap((link) => link.fields.map((field) => ({ label: `${link.label}: ${field.label}`, value: field.value })))
  };
  return {
    id: appearance.id,
    title,
    path: `/appearances/${appearance.slug}/`,
    meta: join([category, appearance.date, valueForLocale(appearanceProgramOrWorkValues(appearance)), tracks.length ? `${tracks.length} songs` : "", appearance.relatedSongs.length ? `${appearance.relatedSongs.length} related songs` : ""]),
    category,
    recordType: "Appearance",
    fields,
    searchText: [
      title,
      appearance.title,
      appearance.titleOriginal,
      ...Object.values(appearance.titleLocalized || {}),
      category,
      appearance.date,
      appearance.appearanceType,
      valueForLocale(appearanceTypeValues(appearance.appearanceType)),
      valueForLocale(appearanceProgramOrWorkValues(appearance)),
      valueForLocale(appearanceRoleValues(appearance)),
      valueForLocale(appearanceShowContentValues(appearance.showContent)),
      localizedNames(appearance.mainPerformers),
      localizedNames(appearance.hosts),
      localizedNames(appearance.workDetails?.directors),
      localizedNames(appearance.workDetails?.leadingCast),
      linkPlatformList(appearance.mediaLinks),
      ...appearance.mediaLinks.map(linkCreditLabel),
      ...appearance.relatedSongs.map((songId) => {
        const song = byId(songs, songId);
        return song ? valueForLocale(titleValues(song)) : songId;
      }),
      ...tracks.flatMap((track) => [track.title, ...Object.values(track.titleLocalized || {}), track.role, personNames(track.performers)]),
      ...(appearance.performedSongs || []).flatMap((entry) => [
        entry.titlePerformed,
        ...Object.values(entry.titlePerformedLocalized || {}),
        entry.originalPerformer,
        personNames(entry.collaborators),
        linkPlatformList(entry.mediaLinks),
        ...(entry.mediaLinks || []).map(linkCreditLabel)
      ])
    ].filter(Boolean).join(" ").normalize("NFKC").toLocaleLowerCase("en-US")
  };
}

function musicShowItem(show: MusicShow): AppearanceCorrectionItem {
  const category = "Music shows";
  const title = valueForLocale(titleValues(show));
  const mediaLinks = show.mediaLinks.map((link, index) => ({ label: linkLabel(link, index), fields: linkFields(link) }));
  const performanceItems = show.performedSongs.map((entry, index) => ({ label: performanceLabel(entry, index), position: performancePosition(entry, index), fields: performanceFields(entry) }));
  const clipLinks = show.performedSongs.flatMap((entry, entryIndex) => {
    const entryLabel = performanceLabel(entry, entryIndex);
    return (entry.mediaLinks || []).map((link, linkIndex) => ({ label: `${entryLabel}: ${linkLabel(link, linkIndex)}`, fields: linkFields(link) }));
  });
  const fields = {
    Category: [field("Category", category)],
    Title: [field("Title", title), ...(show.titleOriginal && show.titleOriginal !== show.title ? [field("Original title", show.titleOriginal)] : [])],
    Metadata: [field("Date", show.date), field("Platform", show.platform), field("Program", show.program), field("Episode", show.episode)],
    People: [field("Collaborators", personNames(show.collaborators))].filter((item) => item.value !== notRecorded),
    Format: showAvailabilityChecks(show).map(([label, available]) => ({ label, value: boolValue(available) })),
    Links: mediaLinks.flatMap((link) => link.fields.map((field) => ({ label: `${link.label}: ${field.label}`, value: field.value }))),
    "Performance sequence": performanceItems.map((entry) => ({ label: entry.label, value: entry.position || notRecorded })),
    "Performance song": performanceItems.flatMap((entry) => entry.fields.map((field) => ({ label: `${entry.label}: ${field.label}`, value: field.value }))),
    "Clip links": clipLinks.flatMap((link) => link.fields.map((field) => ({ label: `${link.label}: ${field.label}`, value: field.value })))
  };
  return {
    id: show.id,
    title,
    path: `/music-shows/${show.slug}/`,
    meta: join([category, show.date, show.program, show.platform, `${show.performedSongs.length} songs`]),
    category,
    recordType: "Music show",
    fields,
    searchText: [
      title,
      show.title,
      show.titleOriginal,
      ...Object.values(show.titleLocalized || {}),
      category,
      show.date,
      show.program,
      show.episode,
      show.platform,
      personNames(show.collaborators),
      linkPlatformList(show.mediaLinks),
      ...show.mediaLinks.map(linkCreditLabel),
      ...show.performedSongs.flatMap((entry) => [
        entry.titlePerformed,
        ...Object.values(entry.titlePerformedLocalized || {}),
        entry.originalPerformer,
        personNames(entry.collaborators),
        linkPlatformList(entry.mediaLinks),
        ...(entry.mediaLinks || []).map(linkCreditLabel)
      ])
    ].filter(Boolean).join(" ").normalize("NFKC").toLocaleLowerCase("en-US")
  };
}

export const appearanceCorrectionCatalog: AppearanceCorrectionItem[] = [
  ...musicShows.map(musicShowItem),
  ...appearances.map(appearanceItem)
];
