import {
  byId,
  concertAvailabilityChecks,
  concertCoPerformerIds,
  concerts,
  linkCreditLabel,
  linkPlatformList,
  personNames,
  songs
} from "./archive";
import {
  concertCategoryValues,
  concertCityValues,
  concertCountryOrRegionValues,
  concertDisplayTitleValues,
  concertEventTypeValues,
  concertGroupKindValues,
  concertNatureValues,
  concertVenueValues,
  performanceTitleValues,
  personIdValues,
  titleValues,
  valueForLocale
} from "./i18n";

export type ConcertCorrectionField = {
  label: string;
  value: string;
};

export type ConcertCorrectionSetlistEntry = {
  id: string;
  label: string;
  position: string;
  fields: ConcertCorrectionField[];
};

export type ConcertCorrectionLink = {
  id: string;
  label: string;
  fields: ConcertCorrectionField[];
};

export type ConcertCorrectionItem = {
  id: string;
  title: string;
  path: string;
  meta: string;
  searchText: string;
  fields: Record<string, ConcertCorrectionField[]>;
  showLinks: ConcertCorrectionLink[];
  setlist: ConcertCorrectionSetlistEntry[];
  clipLinks: ConcertCorrectionLink[];
};

const notRecorded = "Not recorded";
const boolValue = (value: boolean) => value ? "yes" : "no";
const join = (values: Array<string | undefined | null>) => values.filter(Boolean).join("; ") || notRecorded;
const field = (label: string, value: string | undefined | null): ConcertCorrectionField => ({ label, value: value || notRecorded });

function setlistPosition(entry: typeof concerts[number]["setlist"][number], index: number) {
  return entry.position === null ? "Position not recorded" : `#${entry.position || index + 1}`;
}

function setlistLabel(entry: typeof concerts[number]["setlist"][number], index: number) {
  const linkedSong = byId(songs, entry.song || undefined);
  return join([setlistPosition(entry, index), valueForLocale(performanceTitleValues(entry, linkedSong))]);
}

function linkLabel(link: { label?: string; platform?: string; kind?: string }, index: number) {
  return link.label || link.platform || link.kind || `Link ${index + 1}`;
}

function linkFields(link: typeof concerts[number]["mediaLinks"][number]): ConcertCorrectionField[] {
  return [
    { label: "Link URL", value: link.url || notRecorded },
    { label: "Platform name", value: link.platform || link.label || notRecorded },
    { label: "Kind", value: link.kind || notRecorded },
    { label: "Credit", value: link.credit || notRecorded },
    { label: "Resolution", value: link.resolution || notRecorded },
    { label: "Part", value: link.part || notRecorded },
    { label: "Timestamp", value: link.timestamp || notRecorded },
    { label: "Official", value: boolValue(Boolean(link.isOfficial)) }
  ];
}

function setlistFields(entry: typeof concerts[number]["setlist"][number]): ConcertCorrectionField[] {
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
  if (entry.notes) fields.push(field("Performance note", entry.notes));
  return fields;
}

function categoryFields(concert: typeof concerts[number]) {
  const fields = [
    field("Concert nature", valueForLocale(concertNatureValues(concert.nature))),
    field("Concert category", valueForLocale(concertCategoryValues(concert.category)))
  ];
  if (concert.role) fields.push(field("Role", concert.role));
  if (concert.series) fields.push(field("Series or tour", concert.series));
  if (concert.groupTitle) fields.push(field("Group title", concert.groupTitle));
  if (concert.groupKind) fields.push(field("Group kind", valueForLocale(concertGroupKindValues(concert.groupKind))));
  return fields;
}

function metadataFields(concert: typeof concerts[number]) {
  const fields = [
    field("Date", concert.date),
    field("Event type", valueForLocale(concertEventTypeValues(concert.eventType)))
  ];
  if (concert.anniversaryYear) fields.push(field("Anniversary year", concert.anniversaryYear));
  fields.push(
    field("Venue", valueForLocale(concertVenueValues(concert))),
    field("City", valueForLocale(concertCityValues(concert))),
    field("Country or region", valueForLocale(concertCountryOrRegionValues(concert)))
  );
  return fields;
}

function participantsFields(concert: typeof concerts[number]) {
  const fields = [field("Main performers", personNames(concert.performers))];
  if (concert.guests?.length) fields.push(field("Guests", personNames(concert.guests)));
  if (concert.host || concert.role === "guest" || concert.category === "guest") {
    fields.push(field("Host artist", concert.host ? valueForLocale(personIdValues(concert.host)) : notRecorded));
  }
  const coPerformers = concertCoPerformerIds(concert);
  const shownPeople = new Set([...(concert.performers || []), ...(concert.guests || []), concert.host || ""].filter(Boolean));
  const extraPerformers = coPerformers.filter((id) => !shownPeople.has(id));
  if (extraPerformers.length) fields.push(field("Other performers", personNames(extraPerformers)));
  return fields;
}

export const concertCorrectionCatalog: ConcertCorrectionItem[] = concerts.map((concert) => {
  const title = valueForLocale(concertDisplayTitleValues(concert));
  const showLinks = concert.mediaLinks.map((link, index) => ({
    id: `${concert.id}-show-link-${index}`,
    label: linkLabel(link, index),
    fields: linkFields(link)
  }));
  const setlist = concert.setlist.map((entry, index) => ({
    id: `${concert.id}-setlist-${index}`,
    label: setlistLabel(entry, index),
    position: setlistPosition(entry, index),
    fields: setlistFields(entry)
  }));
  const clipLinks = concert.setlist.flatMap((entry, entryIndex) => {
    const entryLabel = setlistLabel(entry, entryIndex);
    return (entry.mediaLinks || []).map((link, linkIndex) => ({
      id: `${concert.id}-clip-${entryIndex}-${linkIndex}`,
      label: `${entryLabel}: ${linkLabel(link, linkIndex)}`,
      fields: linkFields(link)
    }));
  });
  const meta = join([
    concert.date,
    valueForLocale(concertCityValues(concert)),
    valueForLocale(concertVenueValues(concert)),
    `${concert.setlist.length} songs`,
    showLinks.length ? "Show links available" : "Show links not recorded"
  ]);
  const fields = {
    Category: categoryFields(concert),
    Title: [field("Title", valueForLocale(titleValues(concert)))],
    Metadata: metadataFields(concert),
    Participants: participantsFields(concert),
    Format: concertAvailabilityChecks(concert).map(([label, available]) => ({ label, value: boolValue(available) })),
    "Show links": showLinks.flatMap((link) => link.fields.map((field) => ({ label: `${link.label}: ${field.label}`, value: field.value }))),
    "Setlist sequence": setlist.map((entry) => ({ label: entry.label, value: entry.position || notRecorded })),
    "Setlist song": setlist.flatMap((entry) => entry.fields.map((field) => ({ label: `${entry.label}: ${field.label}`, value: field.value }))),
    "Clip links": clipLinks.flatMap((link) => link.fields.map((field) => ({ label: `${link.label}: ${field.label}`, value: field.value })))
  };
  return {
    id: concert.id,
    title,
    path: `/concerts/${concert.slug}/`,
    meta,
    fields,
    showLinks,
    setlist,
    clipLinks,
    searchText: [
      title,
      concert.title,
      ...Object.values(concert.titleLocalized || {}),
      concert.date,
      concert.eventType,
      concert.venue,
      valueForLocale(concertVenueValues(concert)),
      concert.city,
      valueForLocale(concertCityValues(concert)),
      concert.countryOrRegion,
      valueForLocale(concertCountryOrRegionValues(concert)),
      concert.nature,
      concert.category,
      concert.role,
      concert.series,
      concert.groupTitle,
      ...Object.values(concert.groupTitleLocalized || {}),
      personNames(concert.performers),
      personNames(concert.guests),
      concert.host ? valueForLocale(personIdValues(concert.host)) : "",
      linkPlatformList(concert.mediaLinks),
      ...concert.mediaLinks.map(linkCreditLabel),
      ...concert.setlist.flatMap((entry) => {
        const linkedSong = byId(songs, entry.song || undefined);
        return [
          entry.titlePerformed,
          ...Object.values(entry.titlePerformedLocalized || {}),
          linkedSong ? valueForLocale(titleValues(linkedSong)) : "",
          entry.originalPerformer,
          personNames(entry.collaborators),
          linkPlatformList(entry.mediaLinks),
          ...(entry.mediaLinks || []).map(linkCreditLabel)
        ];
      })
    ].filter(Boolean).join(" ").normalize("NFKC").toLocaleLowerCase("en-US")
  };
});
