import fs from "node:fs";
import { buildSongMatcher } from "./song-match.mjs";

const songs = JSON.parse(fs.readFileSync("data/songs.json", "utf8"));
const concerts = JSON.parse(fs.readFileSync("data/concerts.json", "utf8"));
const sources = JSON.parse(fs.readFileSync("data/sources.json", "utf8"));
const matchSong = buildSongMatcher(songs);

const CHYI = "person-chyi-yu";
const CHI_CHIN = "person-chi-chin";

const newSongs = [
  {
    id: "song-teng-chan-shu",
    slug: "teng-chan-shu",
    title: "藤缠树",
    titleOriginal: "藤纏樹",
    aliases: [],
    language: "Mandarin",
    lyricsBy: [],
    composedBy: [],
    arrangedBy: [],
    relatedReleases: [],
    knownConcerts: ["concert-qi-jia-huan-2004-beijing"],
    knownMusicShows: [],
    mediaLinks: [],
    sources: [],
    notes: "Folk song performed as a duet with Chyi Chin at the 2004 齐家欢 Beijing concert. Concert cover-performance identity; release/credit details incomplete.",
    status: "partial"
  },
  {
    id: "song-qiu-chan",
    slug: "qiu-chan",
    title: "秋蝉",
    titleOriginal: "秋蟬",
    aliases: [],
    language: "Mandarin",
    lyricsBy: [],
    composedBy: [],
    arrangedBy: [],
    relatedReleases: [],
    knownConcerts: ["concert-qi-jia-huan-2004-beijing"],
    knownMusicShows: [],
    mediaLinks: [],
    sources: [],
    notes: "Folk song performed at the 2004 齐家欢 Beijing concert. Concert cover-performance identity; release/credit details incomplete.",
    status: "partial"
  },
  {
    id: "song-xiao-mo-li",
    slug: "xiao-mo-li",
    title: "小茉莉",
    titleOriginal: "小茉莉",
    aliases: [],
    language: "Mandarin",
    lyricsBy: [],
    composedBy: [],
    arrangedBy: [],
    relatedReleases: [],
    knownConcerts: ["concert-qi-jia-huan-2004-beijing"],
    knownMusicShows: [],
    mediaLinks: [],
    sources: [],
    notes: "Folk song performed at the 2004 齐家欢 Beijing concert. Concert cover-performance identity; release/credit details incomplete.",
    status: "partial"
  }
];

const newSources = [
  {
    id: "source-project-concert-reference-list",
    sourceType: "internal-reference",
    title: "Project concert reference list",
    authorOrPublisher: "maintainer-provided-reference",
    date: null,
    url: null,
    accessDate: "2026-06-27",
    citation: "task-notes/concert_reference_1.md",
    reliability: "maintainer-provided-reference",
    notes: "Maintainer-supplied reference rows of known Chyi Yu concerts used as the baseline for batched import discovery."
  },
  {
    id: "source-epochtimes-chyi-2003-taipei-concert",
    sourceType: "news",
    title: "苦等24年 齊豫感動開唱",
    authorOrPublisher: "Epoch Times",
    date: "2003-12-28",
    url: "https://www.epochtimes.com/b5/3/12/28/n438164.htm",
    accessDate: "2026-06-27",
    citation: null,
    reliability: "medium-high",
    notes: "Reports the first Taiwan solo concert at 台北國際會議中心."
  },
  {
    id: "source-epochtimes-chyi-2003-taipei-pre-event",
    sourceType: "news",
    title: "齊豫台北演唱會 開先例唱佛歌",
    authorOrPublisher: "Epoch Times",
    date: "2003-12-20",
    url: "https://www.epochtimes.com/b5/3/12/20/n433578.htm",
    accessDate: "2026-06-27",
    citation: null,
    reliability: "medium-high",
    notes: "Pre-event article confirming the 12/27 and 12/28 dates."
  },
  {
    id: "source-sina-qi-jia-huan-2004-beijing-preview",
    sourceType: "news",
    title: "齐豫12月3日登陆北京-等了26年的首场内地个唱",
    authorOrPublisher: "Sina Entertainment",
    date: "2004-10-21",
    url: "http://ent.sina.com.cn/p/p/2004-10-21/1452539999.html",
    accessDate: "2026-06-27",
    citation: null,
    reliability: "medium-high",
    notes: "Sina preview confirming 齐家欢北京演唱会 at 首都体育馆 on 12月3日."
  },
  {
    id: "source-sina-qi-jia-huan-2004-beijing-review",
    sourceType: "news",
    title: "图文：齐豫首体唱响天籁之音 弟弟齐秦全力助阵",
    authorOrPublisher: "Sina Entertainment",
    date: "2004-12-04",
    url: "http://ent.sina.com.cn/p/2004-12-04/1034588671.html",
    accessDate: "2026-06-27",
    citation: null,
    reliability: "medium-high",
    notes: "Post-event Sina item confirming the 2004-12-03 首体 concert."
  },
  {
    id: "source-sina-qi-jia-huan-2004-beijing-setlist",
    sourceType: "news",
    title: "齐豫演唱会曲目曝光 经典曲目无一遗漏",
    authorOrPublisher: "Sina Entertainment",
    date: "2004-11-30",
    url: "http://ent.sina.com.cn/2004-11-30/0729583538.html",
    accessDate: "2026-06-27",
    citation: null,
    reliability: "medium",
    notes: "Pre-event setlist lead for the 首体 show."
  },
  {
    id: "source-bilibili-zhen-qing-nian-lun-2004-shanghai-official",
    sourceType: "platform-metadata",
    title: "Bilibili BV1b1qHYGExJ description (真情年轮 上海演唱会)",
    authorOrPublisher: "齐豫花园 (Bilibili uploader)",
    date: null,
    url: "https://www.bilibili.com/video/BV1b1qHYGExJ/",
    accessDate: "2026-06-27",
    citation: null,
    reliability: "medium-high",
    notes: "Description names 真情年轮, 2004-12-10, 上海大舞台, official recording, with a 23-item track list."
  },
  {
    id: "source-bilibili-nian-lun-2004-shanghai-official-tv",
    sourceType: "platform-metadata",
    title: "Bilibili BV1ts4y1x7QN description (年轮 上海演唱会, 东方电视台)",
    authorOrPublisher: "春天的日光 (Bilibili uploader)",
    date: null,
    url: "https://www.bilibili.com/video/BV1ts4y1x7QN/",
    accessDate: "2026-06-27",
    citation: null,
    reliability: "medium-high",
    notes: "Description states official live recording, 2004-12-10, 上海大舞台, copyright 东方电视台."
  },
  {
    id: "source-epochtimes-tian-shi-yu-lang-2008-tour",
    sourceType: "news",
    title: "天使與狼原音再現 齊豫齊秦演唱會3月登台",
    authorOrPublisher: "Epoch Times",
    date: "2008-01-16",
    url: "https://www.epochtimes.com/b5/8/1/16/n1979443.htm",
    accessDate: "2026-06-27",
    citation: null,
    reliability: "medium-high",
    notes: "Article says the anniversary tour would begin 2008-03-01 and lists 台北小巨蛋, 台中戶外圓滿劇場, 高雄至德堂, 台南市立文化中心."
  },
  {
    id: "source-sohu-tian-shi-yu-lang-2008",
    sourceType: "news",
    title: "齐豫接下“天使与狼”巡演：只为支持弟弟",
    authorOrPublisher: "Sohu Entertainment",
    date: "2008-03-27",
    url: "https://yule.sohu.com/20080327/n255939484.shtml",
    accessDate: "2026-06-27",
    citation: null,
    reliability: "medium",
    notes: "Sohu article discussing the tour and distinguishing the Taiwan concert from the Beijing stop."
  },
  {
    id: "source-pchome-jing-dian-jin-qu-2007",
    sourceType: "blog-attendee-report",
    title: "2007經典金曲「好聽」音樂會 attendee report",
    authorOrPublisher: "PChome Personal Blog",
    date: "2007-09-14",
    url: "https://mypaper.pchome.com.tw/ck8428/post/1295180563",
    accessDate: "2026-06-27",
    citation: null,
    reliability: "medium",
    notes: "Attendee report stating 2007-09-14 19:30 at 台北國際會議中心 with 齊豫, 潘越雲, 羅大佑, 周治平, 金智娟."
  },
  {
    id: "source-bilibili-mei-li-ren-sheng-1999",
    sourceType: "platform-metadata",
    title: "Bilibili fan uploads of 1999 美丽人生歌友会",
    authorOrPublisher: "Bilibili uploaders",
    date: null,
    url: "https://www.bilibili.com/video/BV1ix411r7SP/",
    accessDate: "2026-06-27",
    citation: null,
    reliability: "medium",
    notes: "Multiple maintainer-confirmed fan uploads of the 1999 美丽人生/C'est la vie concert; metadata confirms title and 1999 year but not exact date or venue."
  },
  {
    id: "source-bilibili-unheard-2002-shorter-full",
    sourceType: "platform-metadata",
    title: "Bilibili BV13FunzjEGM / YouTube K6eMTrSvW3c (音樂難得有奇遇 2002 shorter full upload)",
    authorOrPublisher: "优视部落 / 甄想天地",
    date: null,
    url: "https://www.youtube.com/watch?v=K6eMTrSvW3c",
    accessDate: "2026-06-27",
    citation: null,
    reliability: "medium",
    notes: "Maintainer confirmed this is the same video on Bilibili and YouTube, an alternate shorter full upload of the 2002 Hong Kong concert."
  }
];

// Build the 齐家欢 setlist. Position 13 (大约在冬季/原来的我, 齐秦 solo segment) is
// excluded per the Chyi-Yu-only setlist rule. Medleys use songParts.
function qiJiaHuanSetlist() {
  const raw = [
    [1, "船歌", []],
    [2, "传说", []],
    [3, "一条日光的大道", []],
    [4, "祝福", []],
    [5, "九月的高跟鞋", []],
    [6, "飞鸟与鱼", []],
    [7, "春天的浮雕", []],
    [8, "雨丝", []],
    [9, "你是我所有的回忆", []],
    [10, "藤缠树", [CHI_CHIN]],
    [11, "梦田", [CHI_CHIN]],
    [12, "花祭", [CHI_CHIN]],
    [14, "答案 / Vincent", [], ["song-answer", "song-vincent"]],
    [15, "秋蝉 / 小茉莉 / 如果", [], ["song-qiu-chan", "song-xiao-mo-li", "song-ru-guo"]],
    [16, "乡间的小路", []],
    [17, "Whoever Finds This, I Love You", []],
    [18, "菊叹", []],
    [19, "橄榄树", []],
    [20, "七点钟", []],
    [21, "有一个人", []],
    [22, "C'est la vie", []],
    [23, "Stories", []],
    [24, "走在雨中", []],
    [25, "欢颜", []],
    [26, "大吉祥天女咒", []],
    [27, "梦", []],
    [28, "橄榄树（清唱）", []]
  ];
  return raw.map(([pos, title, collaborators, songParts]) => {
    const entry = {
      position: pos,
      song: songParts ? null : matchSong(title.replace(/（清唱）/, "")),
      titlePerformed: title,
      collaborators
    };
    if (songParts) entry.songParts = songParts;
    if (title.includes("（清唱）")) entry.notes = "A cappella/clear-singing version per setlist source.";
    return entry;
  });
}

const newConcerts = [
  {
    id: "concert-mei-li-ren-sheng-1999-taipei",
    slug: "mei-li-ren-sheng-1999-taipei",
    title: "C'est la vie / 美麗人生歌友會",
    date: "1999-12-09",
    venue: null,
    city: "Taipei",
    countryOrRegion: "Taiwan",
    eventType: "concert",
    performers: [CHYI],
    guests: [],
    tags: ["solo"],
    setlist: [],
    mediaLinks: [
      {
        label: "Fan composite, 15-part",
        platform: "bilibili",
        url: "https://www.bilibili.com/video/BV1EM4112757/",
        kind: "video",
        isOfficial: false,
        credit: "大大大象_Ya"
      },
      {
        label: "Full fan recording, C'est la vie",
        platform: "bilibili",
        url: "https://www.bilibili.com/video/BV1ix411r7SP/",
        kind: "video",
        isOfficial: false,
        credit: "WeAreLambily"
      },
      {
        label: "Event segment, learning guitar",
        platform: "bilibili",
        url: "https://www.bilibili.com/video/BV1Cb411W73u/",
        kind: "video",
        isOfficial: false,
        credit: "思齊96"
      },
      {
        label: "Full fan recording, 480P",
        platform: "youtube",
        url: "https://www.youtube.com/watch?v=rEot7d3XNOQ",
        kind: "video",
        isOfficial: false,
        credit: "齊豫Chyi Yu Unofficial Music Channel"
      }
    ],
    officialRecording: false,
    sources: ["source-project-concert-reference-list", "source-bilibili-mei-li-ren-sheng-1999"],
    sourceQuality: "fan-upload; exact venue unconfirmed",
    notes: "Maintainer confirmed the shell and all four media candidates. Reference row gives 1999-12-09 and 台北; fan-upload metadata confirms the 1999 美麗人生 event but not the exact date or venue.",
    status: "partial"
  },
  {
    id: "concert-hui-yi-shi-yu-ge-de-qi-yu-2003-taipei",
    slug: "hui-yi-shi-yu-ge-de-qi-yu-2003-taipei",
    title: "回憶那段詩與歌的奇遇",
    date: "2003-12-27/2003-12-28",
    venue: "Taipei International Convention Center",
    city: "Taipei",
    countryOrRegion: "Taiwan",
    eventType: "concert",
    performers: [CHYI],
    guests: [],
    tags: ["solo"],
    setlist: [],
    mediaLinks: [],
    officialRecording: false,
    sources: [
      "source-project-concert-reference-list",
      "source-epochtimes-chyi-2003-taipei-concert",
      "source-epochtimes-chyi-2003-taipei-pre-event"
    ],
    sourceQuality: "news-backed; no public media found",
    notes: "Maintainer confirmed the event shell. News sources confirm the two-day run at Taipei International Convention Center; no exact public video was found in this pass.",
    status: "partial"
  },
  {
    id: "concert-qi-jia-huan-2004-beijing",
    slug: "qi-jia-huan-2004-beijing",
    title: "齊家歡北京演唱會",
    date: "2004-12-03",
    venue: "Capital Gymnasium",
    city: "Beijing",
    countryOrRegion: "China",
    eventType: "concert",
    performers: [CHYI, CHI_CHIN],
    guests: [CHI_CHIN],
    tags: ["collaboration"],
    setlist: qiJiaHuanSetlist(),
    mediaLinks: [],
    officialRecording: false,
    sources: [
      "source-project-concert-reference-list",
      "source-sina-qi-jia-huan-2004-beijing-preview",
      "source-sina-qi-jia-huan-2004-beijing-review",
      "source-sina-qi-jia-huan-2004-beijing-setlist"
    ],
    sourceQuality: "news-backed setlist; no public media found",
    notes: "Maintainer confirmed the shell and requested saving the setlist. Chyi Chin appears as both performer and guest; duet positions (10-12) are included as Chyi Yu performances. The 齐秦 solo segment (大约在冬季 / 原来的我) is excluded per the Chyi-Yu-only setlist rule.",
    status: "partial"
  },
  {
    id: "concert-zhen-qing-nian-lun-2004-shanghai",
    slug: "zhen-qing-nian-lun-2004-shanghai",
    title: "真情年輪 / 年輪 上海演唱會",
    date: "2004-12-10",
    venue: "Shanghai Grand Stage",
    city: "Shanghai",
    countryOrRegion: "China",
    eventType: "concert",
    performers: [CHYI, CHI_CHIN],
    guests: [CHI_CHIN],
    tags: ["collaboration"],
    setlist: [],
    mediaLinks: [
      {
        label: "Official recording, 720p",
        platform: "bilibili",
        url: "https://www.bilibili.com/video/BV1b1qHYGExJ/",
        kind: "video",
        isOfficial: true,
        credit: "齐豫花园"
      },
      {
        label: "Official TV recording, 东方电视台",
        platform: "bilibili",
        url: "https://www.bilibili.com/video/BV1ts4y1x7QN/",
        kind: "video",
        isOfficial: true,
        credit: "春天的日光 / 东方电视台"
      },
      {
        label: "Long fan upload",
        platform: "bilibili",
        url: "https://www.bilibili.com/video/BV1Tx411W7iH/",
        kind: "video",
        isOfficial: false,
        credit: "WeAreLambily"
      },
      {
        label: "Single-song clip, 有一個人",
        platform: "youtube",
        url: "https://www.youtube.com/watch?v=TAV8K7k23Io",
        kind: "video",
        isOfficial: false,
        credit: "齊豫花園"
      }
    ],
    officialRecording: true,
    sources: [
      "source-project-concert-reference-list",
      "source-bilibili-zhen-qing-nian-lun-2004-shanghai-official",
      "source-bilibili-nian-lun-2004-shanghai-official-tv"
    ],
    sourceQuality: "official-recording-and-platform-metadata",
    notes: "Maintainer confirmed the shell and accepted all three Bilibili candidates plus the YouTube single-song clip. Setlist not modeled in this pass; the Bilibili description includes a 23-item track list for follow-up.",
    status: "partial"
  },
  {
    id: "concert-tian-shi-yu-lang-2008-taipei",
    slug: "tian-shi-yu-lang-2008-taipei",
    title: "天使與狼 20周年巡回演唱會 台北站",
    date: "2008-03-01",
    venue: "Taipei Arena",
    city: "Taipei",
    countryOrRegion: "Taiwan",
    eventType: "concert-series",
    performers: [CHYI, CHI_CHIN],
    guests: [CHI_CHIN],
    tags: ["collaboration", "anniversary", "concert-series"],
    setlist: [],
    mediaLinks: [
      {
        label: "Encore fragment, 2008.3.1",
        platform: "youtube",
        url: "https://www.youtube.com/watch?v=QO090FLTDFo",
        kind: "video",
        isOfficial: false,
        credit: "vul3xu"
      }
    ],
    officialRecording: false,
    sources: [
      "source-project-concert-reference-list",
      "source-epochtimes-tian-shi-yu-lang-2008-tour",
      "source-sohu-tian-shi-yu-lang-2008"
    ],
    sourceQuality: "news-backed; short fragment media",
    notes: "Date corrected from the reference's 2007-03 to 2008-03-01 per maintainer review and news evidence. The anniversary tour also played 台中, 高雄, and 台南; those tour-stop dates remain unknown and are not imported as separate records until stronger sources are found. Treat 1988 天使与狼 media as a separate event.",
    status: "partial"
  },
  {
    id: "concert-jing-dian-jin-qu-hao-ting-2007-taipei",
    slug: "jing-dian-jin-qu-hao-ting-2007-taipei",
    title: "2007經典金曲「好聽」音樂會",
    date: "2007-09-14",
    venue: "Taipei International Convention Center",
    city: "Taipei",
    countryOrRegion: "Taiwan",
    eventType: "concert",
    performers: [CHYI, "person-luo-dayou", "person-pan-yue-yun", "周治平", "金智娟"],
    guests: ["person-luo-dayou", "person-pan-yue-yun", "周治平", "金智娟"],
    tags: ["collaboration"],
    setlist: [],
    mediaLinks: [],
    officialRecording: false,
    sources: ["source-project-concert-reference-list", "source-pchome-jing-dian-jin-qu-2007"],
    sourceQuality: "attendee-report; no public media found",
    notes: "Maintainer confirmed the event shell. Multi-artist concert with 齊豫, 羅大佑, 潘越雲, 周治平, and 金智娟. 周治平 and 金智娟 are listed by display name because no person records exist yet.",
    status: "partial"
  }
];

// Update the existing 2002 Hong Kong record with the maintainer-confirmed
// alternate-platform links and source.
const existing2002 = concerts.find((c) => c.id === "concert-unheard-of-chyi-2002-hong-kong");
if (existing2002) {
  const hasUrl = (url) => existing2002.mediaLinks.some((l) => l.url === url);
  const toAdd = [
    {
      label: "Full fan upload, alternate (same as YouTube K6eMTrSvW3c)",
      platform: "bilibili",
      url: "https://www.bilibili.com/video/BV13FunzjEGM/",
      kind: "video",
      isOfficial: false,
      credit: "优视部落"
    },
    {
      label: "Full fan upload, alternate (same as Bilibili BV13FunzjEGM)",
      platform: "youtube",
      url: "https://www.youtube.com/watch?v=K6eMTrSvW3c",
      kind: "video",
      isOfficial: false,
      credit: "甄想天地【1】"
    }
  ];
  for (const link of toAdd) if (!hasUrl(link.url)) existing2002.mediaLinks.push(link);
  if (!existing2002.sources.includes("source-bilibili-unheard-2002-shorter-full")) {
    existing2002.sources.push("source-bilibili-unheard-2002-shorter-full");
  }
}

// Apply: append new concerts, songs, sources. Update song.knownConcerts backrefs.
for (const concert of newConcerts) concerts.push(concert);
const songIndex = new Map(songs.map((s) => [s.id, s]));
for (const ns of newSongs) {
  if (!songIndex.has(ns.id)) {
    songs.push(ns);
    songIndex.set(ns.id, ns);
  }
}
for (const src of newSources) {
  if (!sources.some((s) => s.id === src.id)) sources.push(src);
}
// Backref: ensure any setlist song (existing or new) lists this concert in knownConcerts.
for (const concert of newConcerts) {
  for (const entry of concert.setlist) {
    const ids = [entry.song, ...(entry.songParts || [])].filter(Boolean);
    for (const songId of ids) {
      const song = songIndex.get(songId);
      if (song && !song.knownConcerts.includes(concert.id)) {
        song.knownConcerts.push(concert.id);
      }
    }
  }
}

fs.writeFileSync("data/concerts.json", JSON.stringify(concerts, null, 2) + "\n", "utf8");
fs.writeFileSync("data/songs.json", JSON.stringify(songs, null, 2) + "\n", "utf8");
fs.writeFileSync("data/sources.json", JSON.stringify(sources, null, 2) + "\n", "utf8");

console.log(`Imported ${newConcerts.length} new concerts, ${newSongs.length} new songs, ${newSources.length} new sources.`);
console.log("Updated existing 2002 Hong Kong record with alternate links.");