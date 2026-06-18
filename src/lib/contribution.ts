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

const repositoryIssueUrl = "https://github.com/doors-to-open/archive_of_Chyi/issues/new";

const labels: Record<ContributionKind, string> = {
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

const titles: Record<ContributionKind, string> = {
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
    `Target: ${titles[params.kind]}`,
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
  return [
    "Source link(s):",
    "Source title(s):",
    "Source type(s): official / platform / news / book / database / archive / other",
    "Access date:"
  ];
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
        "Appearance type: talk show / film / soundtrack / podcast / interview / documentary / book / article / other",
        "Program or work:",
        "Role:",
        "Related song(s):",
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
      "Full item or clip:",
      "Related record, song, track, or timecode:",
      "Uploader or publisher:",
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
    ? `${titles[params.kind]}: ${params.recordTitle}`
    : titles[params.kind];
  const query = new URLSearchParams({
    title,
    labels: labels[params.kind],
    body: bodyFor(params)
  });

  return `${repositoryIssueUrl}?${query.toString()}`;
}

export function contributionActions(recordType: string, recordTitle: string, recordPath: string): ContributionAction[] {
  return [
    {
      label: "Suggest correction",
      href: contributionIssueUrl({ kind: "correction", recordType, recordTitle, recordPath })
    },
    {
      label: "Add source",
      href: contributionIssueUrl({ kind: "source", recordType, recordTitle, recordPath })
    },
    {
      label: "Add media link",
      href: contributionIssueUrl({ kind: "media", recordType, recordTitle, recordPath })
    }
  ];
}
