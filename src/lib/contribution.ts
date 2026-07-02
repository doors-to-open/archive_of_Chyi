export type ContributionKind =
  | "correction"
  | "album"
  | "track"
  | "concert"
  | "music-show"
  | "appearance"
  | "person"
  | "source"
  | "media";

export type ContributionIssueParams = {
  kind: ContributionKind;
  recordType?: string;
  recordTitle?: string;
  recordPath?: string;
};

export type ContributionAction = {
  label: string;
  href: string;
};

export type ContributionTypeOption = {
  kind: ContributionKind;
  label: string;
  defaultRecordType: string;
  helper: string;
};

export const repositoryIssueUrl = "https://github.com/doors-to-open/archive_of_Chyi/issues/new";
const contributionPagePath = "/contribute/";
const contributionCorrectionPath = "/contribute/correction/";
const contributionAdditionPath = "/contribute/addition/";

export const contributionLabels: Record<ContributionKind, string> = {
  correction: "contribution,correction",
  album: "contribution,new-release",
  track: "contribution,track",
  concert: "contribution,concert",
  "music-show": "contribution,music-show",
  appearance: "contribution,appearance",
  person: "contribution,person",
  source: "contribution,source",
  media: "contribution,media-link"
};

export const contributionTitles: Record<ContributionKind, string> = {
  correction: "Correction",
  album: "New album or release",
  track: "Track addition",
  concert: "New concert",
  "music-show": "New music-show performance",
  appearance: "New appearance",
  person: "New person or credit",
  source: "Source",
  media: "Media link"
};

export const contributionTypeOptions: ContributionTypeOption[] = [
  {
    kind: "correction",
    label: "Correct a record",
    defaultRecordType: "Existing page",
    helper: "Use this to fix information on an existing album, song, concert, performance, appearance, person, source, or link."
  },
  {
    kind: "source",
    label: "Add a source",
    defaultRecordType: "Source",
    helper: "Use this when a page, article, book, platform listing, or other source can confirm information on the site."
  },
  {
    kind: "media",
    label: "Add a video or audio link",
    defaultRecordType: "Video or audio link",
    helper: "Use this for video, audio, platform, or clip links. The site links out instead of hosting media."
  },
  {
    kind: "album",
    label: "Add album or single",
    defaultRecordType: "Album or single",
    helper: "Use this for albums, singles, compilations, reissues, collaborations, soundtracks, and related music releases."
  },
  {
    kind: "track",
    label: "Add song detail",
    defaultRecordType: "Song detail",
    helper: "Use this for song order, album placement, duration, version notes, lyricists, composers, or arrangers."
  },
  {
    kind: "concert",
    label: "Add concert",
    defaultRecordType: "Concert",
    helper: "Use this for concert, concert-series, festival, live-album, or setlist records."
  },
  {
    kind: "music-show",
    label: "Add TV or online performance",
    defaultRecordType: "TV or online performance",
    helper: "Use this for televised, streamed, radio, or platform music performances."
  },
  {
    kind: "appearance",
    label: "Add interview or appearance",
    defaultRecordType: "Appearance",
    helper: "Use this for interviews, shows, soundtrack work, film, documentary, articles, podcasts, or similar items."
  },
  {
    kind: "person",
    label: "Add person or credit",
    defaultRecordType: "Person",
    helper: "Use this for people, public profiles, roles, and credits connected to the site."
  }
];

function recordLine(params: ContributionIssueParams) {
  return params.recordTitle
    ? `${params.recordType || "Record"}: ${params.recordTitle}`
    : `${params.recordType || "Record"}:`;
}

function pageLine(path?: string) {
  return path ? `Page: ${path}` : "Page:";
}

function section(title: string, lines: string[]) {
  return [`## ${title}`, ...lines, ""];
}

function contextLines(params: ContributionIssueParams) {
  return [
    `Target: ${contributionTitles[params.kind]}`,
    recordLine(params),
    pageLine(params.recordPath)
  ];
}

function creditLines() {
  return [
    "Contributor credit name:",
    "Can we credit you publicly? yes/no"
  ];
}

function sourceLines() {
  return ["Source link(s):"];
}

function bodyFor(params: ContributionIssueParams) {
  const body: string[] = [];

  if (params.kind === "correction") {
    body.push(
      ...section("What is this about?", [
        ...contextLines(params),
        "Field to correct:"
      ]),
      ...section("Information", [
        "Current value:",
        "Suggested value:",
        "Why this should change:"
      ]),
      ...section("Sources", sourceLines()),
      ...section("Credits", creditLines()),
      ...section("Notes", ["Notes:"])
    );
    return body.join("\n").trim();
  }

  if (params.kind === "album") {
    body.push(
      ...section("What is this about?", [
        ...contextLines(params),
        "Proposed album/release title:",
        "Release type: studio album / single / compilation / soundtrack / collaboration / reissue / other"
      ]),
      ...section("Information", [
        "Original title:",
        "Release date:",
        "Label:",
        "Catalog number:",
        "Format(s):",
        "Track list with positions:",
        "Known credits:"
      ]),
      ...section("Sources", sourceLines()),
      ...section("Credits", creditLines()),
      ...section("Notes", ["Notes:"])
    );
    return body.join("\n").trim();
  }

  if (params.kind === "track") {
    body.push(
      ...section("What is this about?", [
        ...contextLines(params),
        "Release/album:",
        "Track title:"
      ]),
      ...section("Information", [
        "Track position:",
        "Internal song title, if known:",
        "Title as printed on release:",
        "Duration:",
        "Lyricist:",
        "Composer:",
        "Arranger:",
        "Version note:"
      ]),
      ...section("Sources", sourceLines()),
      ...section("Credits", creditLines()),
      ...section("Notes", ["Notes:"])
    );
    return body.join("\n").trim();
  }

  if (params.kind === "concert") {
    body.push(
      ...section("What is this about?", [
        ...contextLines(params),
        "Concert title:"
      ]),
      ...section("Information", [
        "Date:",
        "Venue:",
        "City and country/region:",
        "Event type: concert / concert series / festival / live album / other",
        "Guests:",
        "Setlist, if known:",
        "Known media links:"
      ]),
      ...section("Sources", sourceLines()),
      ...section("Credits", creditLines()),
      ...section("Notes", ["Notes:"])
    );
    return body.join("\n").trim();
  }

  if (params.kind === "music-show") {
    body.push(
      ...section("What is this about?", [
        ...contextLines(params),
        "Program or performance title:"
      ]),
      ...section("Information", [
        "Date:",
        "Program:",
        "Episode:",
        "Platform or broadcaster:",
        "Performed song(s):",
        "Collaborators:",
        "Known media links or timecodes:"
      ]),
      ...section("Sources", sourceLines()),
      ...section("Credits", creditLines()),
      ...section("Notes", ["Notes:"])
    );
    return body.join("\n").trim();
  }

  if (params.kind === "appearance") {
    body.push(
      ...section("What is this about?", [
        ...contextLines(params),
        "Appearance title:"
      ]),
      ...section("Information", [
        "Date:",
        "Appearance type: OST vocal appearance / guest vocal album or single / show / podcast / screen guest appearance / other",
        "Show content summary, if show: promo / seminar / speech / entertainment / other",
        "Program or work:",
        "Role:",
        "Host(s), if show/podcast:",
        "Work release date / director / leading cast, if movie or series:",
        "Related song(s):",
        "Performed song(s), if any:",
        "Known media links:"
      ]),
      ...section("Sources", sourceLines()),
      ...section("Credits", creditLines()),
      ...section("Notes", ["Notes:"])
    );
    return body.join("\n").trim();
  }

  if (params.kind === "person") {
    body.push(
      ...section("What is this about?", [
        ...contextLines(params),
        "Person name:"
      ]),
      ...section("Information", [
        "Original-language name:",
        "Role(s):",
        "Credit or relationship to add:",
        "Related release, song, concert, show, or appearance:",
        "Existing public profile link, if any:"
      ]),
      ...section("Sources", sourceLines()),
      ...section("Credits", creditLines()),
      ...section("Notes", ["Notes:"])
    );
    return body.join("\n").trim();
  }

  if (params.kind === "source") {
    body.push(
      ...section("What is this about?", [
        ...contextLines(params),
        "Which record or fact does this source support?"
      ]),
      ...section("Information", [
        "Source title:",
        "Author or publisher:",
        "Publication date:",
        "Source type: official / platform / news / book / database / archive / other",
        "Relevant excerpt or summary:"
      ]),
      ...section("Sources", [
        "Source link:",
        "Archive link, if the page is unstable:",
        "Access date:"
      ]),
      ...section("Credits", creditLines()),
      ...section("Notes", ["Notes:"])
    );
    return body.join("\n").trim();
  }

  body.push(
    ...section("What is this about?", [
      ...contextLines(params),
      "Media link:"
    ]),
    ...section("Information", [
      "Platform:",
      "Official or unofficial upload:",
      "Uploader or publisher:",
      "Video or audio:",
      "Resolution:",
      "Full item or clip:",
      "Part or timestamp, if clip:",
      "Optional details (angle / handheld / single-person / vertical):",
      "Related record, song, or track:",
      "Availability notes:"
    ]),
    ...section("Sources", [
      "Media page link:",
      "Source or context link:",
      "Access date:"
    ]),
    ...section("Credits", creditLines()),
    ...section("Notes", ["Notes:"])
  );

  return body.join("\n").trim();
}

export function contributionIssueUrl(params: ContributionIssueParams) {
  const title = params.recordTitle
    ? `${contributionTitles[params.kind]}: ${params.recordTitle}`
    : contributionTitles[params.kind];
  const query = new URLSearchParams({
    title,
    labels: contributionLabels[params.kind],
    body: bodyFor(params)
  });

  return `${repositoryIssueUrl}?${query.toString()}`;
}

export function contributionIssueBody(params: ContributionIssueParams) {
  return bodyFor(params);
}

export function contributionPageUrl(params: ContributionIssueParams) {
  const query = new URLSearchParams();
  query.set("kind", params.kind);
  if (params.recordType) query.set("recordType", params.recordType);
  if (params.recordTitle) query.set("recordTitle", params.recordTitle);
  if (params.recordPath) query.set("recordPath", params.recordPath);

  const path = params.kind === "correction" ? contributionCorrectionPath : contributionAdditionPath;
  return `${path}?${query.toString()}`;
}

export function contributionFreeformUrl(params: Partial<ContributionIssueParams> = {}) {
  const query = new URLSearchParams();
  if (params.kind) query.set("kind", params.kind);
  if (params.recordType) query.set("recordType", params.recordType);
  if (params.recordTitle) query.set("recordTitle", params.recordTitle);
  if (params.recordPath) query.set("recordPath", params.recordPath);

  return query.toString() ? `${contributionPagePath}freeform/?${query.toString()}` : `${contributionPagePath}freeform/`;
}

export function contributionActions(recordType: string, recordTitle: string, recordPath: string): ContributionAction[] {
  return [
    {
      label: "Suggest correction",
      href: contributionPageUrl({ kind: "correction", recordType, recordTitle, recordPath })
    },
    {
      label: "Add source",
      href: contributionPageUrl({ kind: "source", recordType, recordTitle, recordPath })
    },
    {
      label: "Add media link",
      href: contributionPageUrl({ kind: "media", recordType, recordTitle, recordPath })
    }
  ];
}
