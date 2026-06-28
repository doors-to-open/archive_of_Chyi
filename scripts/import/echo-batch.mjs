import fs from "node:fs";

const concerts = JSON.parse(fs.readFileSync("data/concerts.json", "utf8"));
const sources = JSON.parse(fs.readFileSync("data/sources.json", "utf8"));
const appearances = JSON.parse(fs.readFileSync("data/appearances.json", "utf8"));

const CHYI = "person-chyi-yu";
const PAN = "person-pan-yue-yun";
const WU = "person-wu-tsing-fong";

const newSources = [
  {
    id: "source-playmusic-echo-2018-taipei",
    sourceType: "news",
    title: "PlayMusic news item naming 2018-06-09 19:30 Taipei Arena",
    authorOrPublisher: "PlayMusic",
    date: "2018-06-09",
    url: "https://playmusic.tw/column_info.php?id=11029&type=news",
    accessDate: "2026-06-27",
    citation: null,
    reliability: "medium-high",
    notes: "Search result explicitly names 6/9 19:30 at 台北小巨蛋."
  },
  {
    id: "source-ettoday-echo-2018-taipei",
    sourceType: "news",
    title: "ETtoday report from 2018-06-09 Taipei Echo concert",
    authorOrPublisher: "ETtoday",
    date: "2018-06-09",
    url: "https://star.ettoday.net/news/1187684",
    accessDate: "2026-06-27",
    citation: null,
    reliability: "medium-high",
    notes: "Reports the Taipei concert and the full-house context."
  },
  {
    id: "source-china-com-echo-2018-beijing",
    sourceType: "news",
    title: "中国网 / 中国经济网 article on Beijing Echo concert",
    authorOrPublisher: "china.com.cn",
    date: "2018-08-20",
    url: "http://music.china.com.cn/2018-08/20/content_40467074.htm",
    accessDate: "2026-06-27",
    citation: null,
    reliability: "medium",
    notes: "States the Beijing Echo concert recently sounded at 工体馆."
  },
  {
    id: "source-bjzgh-echo-2018-beijing",
    sourceType: "venue-news",
    title: "北京工体 article on 2018-08-17 Beijing Echo concert",
    authorOrPublisher: "北京工人体育馆",
    date: "2018-08-20",
    url: "https://www.bjzgh.org/ghzz/bjgt/xwdt/201808/20180820/j_2018082010315000017363232416500332.html",
    accessDate: "2026-06-27",
    citation: null,
    reliability: "medium",
    notes: "States 2018-08-17 evening at 北京工人体育馆."
  },
  {
    id: "source-dawuhan-echo-2018-wuhan",
    sourceType: "news",
    title: "大武汉 / 长江日报 article on 2018-09-08 Wuhan Echo concert",
    authorOrPublisher: "大武汉",
    date: "2018-09-08",
    url: "https://m.app.dawuhanapp.com/p/40424.html",
    accessDate: "2026-06-27",
    citation: null,
    reliability: "medium-high",
    notes: "States 2018-09-08 and 武汉客厅."
  },
  {
    id: "source-gevme-echo-2019-singapore",
    sourceType: "ticketing",
    title: "GEVME Singapore Echo event page",
    authorOrPublisher: "GEVME",
    date: "2019-04-27",
    url: "https://www.gevme.com/echo270419",
    accessDate: "2026-06-27",
    citation: null,
    reliability: "medium-high",
    notes: "Lists 2019-04-27 at 星宇表演艺术中心, 1 Vista Exchange Green."
  },
  {
    id: "source-zaobao-echo-2019-singapore",
    sourceType: "news-review",
    title: "联合早报 Singapore Echo concert review",
    authorOrPublisher: "Zaobao",
    date: "2019-04-29",
    url: "https://www.zaobao.com.sg/zentertainment/music/story20190429-952356",
    accessDate: "2026-06-27",
    citation: null,
    reliability: "medium-high",
    notes: "Review after the Singapore concert; describes the program and songs."
  },
  {
    id: "source-ycpai-echo-2019-guangzhou",
    sourceType: "news",
    title: "羊城派 / 羊城晚报 Guangzhou Echo event article",
    authorOrPublisher: "羊城派",
    date: "2019-06-15",
    url: "https://ycpai.ycwb.com/ycppad/content/2019-06/15/content_427260.html",
    accessDate: "2026-06-27",
    citation: null,
    reliability: "medium-high",
    notes: "Lists 2019-08-10 20:00 at 广州中央车站."
  },
  {
    id: "source-wikipedia-chyi-yu-events",
    sourceType: "encyclopedia",
    title: "齊豫 Wikipedia event table",
    authorOrPublisher: "Wikipedia",
    date: null,
    url: "https://zh.wikipedia.org/wiki/%E9%BD%8A%E8%B1%AB",
    accessDate: "2026-06-27",
    citation: null,
    reliability: "medium",
    notes: "Wikipedia event table listing used as an encyclopedia lead for multiple concert dates, venues, and setlist mentions."
  },
  {
    id: "source-cri-echo-2018-nanjing",
    sourceType: "news",
    title: "CRI Jiangsu article on Nanjing Echo concert",
    authorOrPublisher: "CRI Jiangsu",
    date: "2018-07-04",
    url: "https://js.cri.cn/2018-07-04/b95676b5-decf-7ffc-33ea-d857d4ba1fb4.html",
    accessDate: "2026-06-27",
    citation: null,
    reliability: "medium-high",
    notes: "Says the Nanjing Echo concert would be held 2018-10-27 at 南京五台山体育馆."
  },
  {
    id: "source-bilibili-fenghua-2018-taipei-tv",
    sourceType: "platform-metadata",
    title: "Bilibili BV1Vb411S7VY (峰华齐唱 公视 TV recording)",
    authorOrPublisher: "春天的日光 (Bilibili uploader)",
    date: "2018-11-24",
    url: "https://www.bilibili.com/video/BV1Vb411S7VY/",
    accessDate: "2026-06-27",
    citation: null,
    reliability: "medium-high",
    notes: "Official TV recording captured from 公视 by a fan; description gives 2018.11.24, 台北国际会议中心. TV broadcast date was 2019-02-04."
  },
  {
    id: "source-youtube-fenghua-2018-encore",
    sourceType: "platform-metadata",
    title: "YouTube Lxy6zwwS3NE / Bilibili BV1Kb411S7zc (峰华齐唱 encore)",
    authorOrPublisher: "Gugi Chan / 沫言_-",
    date: "2018-11-24",
    url: "https://www.youtube.com/watch?v=Lxy6zwwS3NE",
    accessDate: "2026-06-27",
    citation: null,
    reliability: "medium",
    notes: "Maintainer identified YouTube Lxy6zwwS3NE as the original source and Bilibili BV1Kb411S7zc as the Mainland access copy of the same encore media item."
  },
  {
    id: "source-youtube-aiyuxiwang-2019-jiayi",
    sourceType: "platform-metadata",
    title: "YouTube nep2NzV2Enc / Bilibili BV1ZE411s7Rr (爱与希望 嘉义演唱会)",
    authorOrPublisher: "世界大同 / 在云端云游",
    date: "2019-12-18",
    url: "https://www.youtube.com/watch?v=nep2NzV2Enc",
    accessDate: "2026-06-27",
    citation: null,
    reliability: "medium",
    notes: "Maintainer identified YouTube nep2NzV2Enc as the original source and Bilibili BV1ZE411s7Rr as the Mainland access copy. Bilibili description identifies 20191218 爱与希望、展望未来 演唱会 at 嘉义监狱."
  },
  {
    id: "source-youtube-echoes-back-2022-promo",
    sourceType: "platform",
    title: "Rolling Records official YouTube promo for 回声 Echoes Back 2022",
    authorOrPublisher: "滾石唱片 ROCK RECORDS",
    date: "2022-12-17",
    url: "https://www.youtube.com/watch?v=YRmoo031OAM",
    accessDate: "2026-06-27",
    citation: null,
    reliability: "high",
    notes: "Official promo description lists 2022-12-17 19:30, 台北流行音乐中心, ticketing, and production credits. Promo only; maintainer rejected all concert media for this record."
  },
  {
    id: "source-youtube-da-yun-shi-tang-rouuolhyjxg",
    sourceType: "platform",
    title: "【完整版】齊豫潘越雲 再現經典之音 20221207 大雲時堂",
    authorOrPublisher: "大雲時堂",
    date: "2022-12-07",
    url: "https://www.youtube.com/watch?v=RouuoLHYJXg",
    accessDate: "2026-06-27",
    citation: null,
    reliability: "medium",
    notes: "Maintainer requested routing this YouTube item to appearances instead of concert media."
  }
];

const newConcerts = [
  {
    id: "concert-echo-2018-taipei",
    slug: "echo-2018-taipei",
    title: "三個女人的壯闊人生—三毛·齊豫·潘越雲《回聲》演唱會",
    date: "2018-06-09",
    venue: "Taipei Arena",
    city: "Taipei",
    countryOrRegion: "Taiwan",
    eventType: "concert",
    performers: [CHYI, PAN],
    guests: [PAN],
    tags: ["collaboration", "concert-series"],
    setlist: [],
    mediaLinks: [
      { label: "Full fan upload", platform: "bilibili", url: "https://www.bilibili.com/video/BV1fW411F71w/", kind: "video", isOfficial: false, credit: "是我在弹着古筝" },
      { label: "夢田 clip", platform: "youtube", url: "https://www.youtube.com/watch?v=BgxbCfMKfCM", kind: "video", isOfficial: false, credit: "axo2009" }
    ],
    officialRecording: false,
    sources: ["source-project-concert-reference-list", "source-playmusic-echo-2018-taipei", "source-ettoday-echo-2018-taipei"],
    sourceQuality: "news-backed; fan-upload",
    notes: "Maintainer confirmed the shell. Bilibili BV1fW411F71w confirmed as a full fan upload; YouTube clip BgxbCfMKfCM accepted; YouTube news clip wIvftvwz4hM rejected.",
    status: "partial"
  },
  {
    id: "concert-echo-2018-beijing",
    slug: "echo-2018-beijing",
    title: "三毛·齊豫·潘越雲《回聲》演唱會 北京站",
    date: "2018-08-17",
    venue: "Beijing Workers' Gymnasium",
    city: "Beijing",
    countryOrRegion: "China",
    eventType: "concert",
    performers: [CHYI, PAN],
    guests: [PAN],
    tags: ["collaboration", "concert-series"],
    setlist: [],
    mediaLinks: [
      { label: "Partial concert", platform: "bilibili", url: "https://www.bilibili.com/video/BV11W411X7CR/", kind: "video", isOfficial: false, credit: "是我在弹着古筝" },
      { label: "在那遙遠的地方 / 橄欖樹 clip", platform: "bilibili", url: "https://www.bilibili.com/video/BV1gW411Z7RD/", kind: "video", isOfficial: false, credit: "WeAreLambily" }
    ],
    officialRecording: false,
    sources: ["source-project-concert-reference-list", "source-china-com-echo-2018-beijing", "source-bjzgh-echo-2018-beijing"],
    sourceQuality: "news-backed; partial fan media",
    notes: "Maintainer accepted both media links. Full performance list/setlist has not been collected yet.",
    status: "partial"
  },
  {
    id: "concert-echo-2018-wuhan",
    slug: "echo-2018-wuhan",
    title: "三毛·齊豫·潘越雲《回聲》演唱會 武漢站",
    date: "2018-09-08",
    venue: "Wuhan Keting",
    city: "Wuhan",
    countryOrRegion: "China",
    eventType: "concert",
    performers: [CHYI, PAN],
    guests: [PAN],
    tags: ["collaboration", "concert-series"],
    setlist: [],
    mediaLinks: [],
    officialRecording: false,
    sources: ["source-project-concert-reference-list", "source-dawuhan-echo-2018-wuhan"],
    sourceQuality: "news-backed; no Chyi Yu media confirmed",
    notes: "Maintainer confirmed the event shell but rejected the available Bilibili media candidate because it features Pan Yue-yun rather than Chyi Yu.",
    status: "partial"
  },
  {
    id: "concert-echo-2019-singapore",
    slug: "echo-2019-singapore",
    title: "三個女人的壯闊人生—三毛·齊豫·潘越雲《回聲》演唱會 新加坡站",
    date: "2019-04-27",
    venue: "The Star Performing Arts Centre",
    city: "Singapore",
    countryOrRegion: "Singapore",
    eventType: "concert",
    performers: [CHYI, PAN],
    guests: [PAN],
    tags: ["collaboration", "concert-series"],
    setlist: [],
    mediaLinks: [
      { label: "Partial concert clip", platform: "youtube", url: "https://www.youtube.com/watch?v=0kS-NhcZU8I", kind: "video", isOfficial: false, credit: "M9+1" },
      { label: "不曾告別 clip", platform: "youtube", url: "https://www.youtube.com/watch?v=mP0crKRoHqM", kind: "video", isOfficial: false, credit: "hades" }
    ],
    officialRecording: false,
    sources: ["source-project-concert-reference-list", "source-gevme-echo-2019-singapore", "source-zaobao-echo-2019-singapore"],
    sourceQuality: "news-backed; fan-clip",
    notes: "Maintainer confirmed the shell and accepted YouTube clips 0kS-NhcZU8I and mP0crKRoHqM; rejected NPjf20XSAf0 as a pre-event official/prior-event clip.",
    status: "partial"
  },
  {
    id: "concert-echo-2019-guangzhou",
    slug: "echo-2019-guangzhou",
    title: "三毛·齊豫·潘越雲《回聲》演唱會 廣州站",
    date: "2019-08-10",
    venue: "Guangzhou Central Station Showcase Center",
    city: "Guangzhou",
    countryOrRegion: "China",
    eventType: "concert",
    performers: [CHYI, PAN],
    guests: [PAN],
    tags: ["collaboration", "concert-series"],
    setlist: [],
    mediaLinks: [
      { label: "Full fan recording (禁二传)", platform: "bilibili", url: "https://www.bilibili.com/video/BV1q7411n7Yn/", kind: "video", isOfficial: false, credit: "du_xyii", notes: "Uploader explicitly says 禁二传, 禁商用. Link only; do not repost or mirror." },
      { label: "Partial concert", platform: "bilibili", url: "https://www.bilibili.com/video/BV194411D7XZ/", kind: "video", isOfficial: false, credit: "不为难的胖虎" },
      { label: "Song compilation", platform: "bilibili", url: "https://www.bilibili.com/video/BV1aE41137yP/", kind: "video", isOfficial: false, credit: "GEM_Evonne" },
      { label: "風 clip", platform: "xiaohongshu", url: "https://www.xiaohongshu.com/explore/6975a4e8000000000a032ff0", kind: "video", isOfficial: false, credit: "momo" }
    ],
    officialRecording: false,
    sources: ["source-project-concert-reference-list", "source-ycpai-echo-2019-guangzhou"],
    sourceQuality: "news-backed; fan-upload (rights-sensitive)",
    notes: "Maintainer confirmed the shell and all three Bilibili links plus the XHS canonical link. YouTube VSuvviLw__g rejected for poor quality. The 禁二传 upload is linked only; the archive does not download, mirror, repost, or re-upload fan videos.",
    status: "partial"
  },
  {
    id: "concert-chishang-autumn-harvest-2019-taitung",
    slug: "chishang-autumn-harvest-2019-taitung",
    title: "2019池上秋收稻穗藝術節",
    date: "2019-10-25/2019-10-26",
    venue: "Chishang Rice Fields",
    city: "Taitung Chishang",
    countryOrRegion: "Taiwan",
    eventType: "festival",
    performers: [CHYI, "陳建年"],
    guests: ["陳建年"],
    tags: ["festival", "collaboration"],
    setlist: [],
    mediaLinks: [
      { label: "Official short clip", platform: "youtube", url: "https://www.youtube.com/watch?v=KAik_JrfkrQ", kind: "video", isOfficial: true, credit: "樂事達娛樂有限公司" },
      { label: "Official short clip, 一條日光大道×海洋", platform: "youtube", url: "https://www.youtube.com/watch?v=o_wNaQER-cc", kind: "video", isOfficial: true, credit: "台灣好" },
      { label: "橄欖樹 clip, Radio Taiwan International", platform: "youtube", url: "https://www.youtube.com/watch?v=kGaSifEcs1U", kind: "video", isOfficial: false, credit: "Radio Taiwan International" },
      { label: "船歌+talking clip", platform: "bilibili", url: "https://www.bilibili.com/video/BV1NE411q78K/", kind: "video", isOfficial: false, credit: "陈四毛小朋友" },
      { label: "一條日光大道 clip", platform: "bilibili", url: "https://www.bilibili.com/video/BV1jE411q7Gd/", kind: "video", isOfficial: false, credit: "陈四毛小朋友" },
      { label: "最愛 clip", platform: "bilibili", url: "https://www.bilibili.com/video/BV1jE411q7SN/", kind: "video", isOfficial: false, credit: "陈四毛小朋友" },
      { label: "走在雨中 clip", platform: "bilibili", url: "https://www.bilibili.com/video/BV1PE411q7oY/", kind: "video", isOfficial: false, credit: "陈四毛小朋友" },
      { label: "Amazing Grace clip (day 1)", platform: "bilibili", url: "https://www.bilibili.com/video/BV1LE411q7kv/", kind: "video", isOfficial: false, credit: "陈四毛小朋友" },
      { label: "Amazing Grace clip (day 2)", platform: "bilibili", url: "https://www.bilibili.com/video/BV14E411q7z8/", kind: "video", isOfficial: false, credit: "陈四毛小朋友" },
      { label: "夢田 clip", platform: "bilibili", url: "https://www.bilibili.com/video/BV1NE411q7SC/", kind: "video", isOfficial: false, credit: "陈四毛小朋友" },
      { label: "夢 clip", platform: "bilibili", url: "https://www.bilibili.com/video/BV1jE411q7MT/", kind: "video", isOfficial: false, credit: "陈四毛小朋友" },
      { label: "民歌組曲 clip (1)", platform: "bilibili", url: "https://www.bilibili.com/video/BV1jE411q7nq/", kind: "video", isOfficial: false, credit: "陈四毛小朋友" }
    ],
    officialRecording: false,
    sources: ["source-project-concert-reference-list", "source-wikipedia-chyi-yu-events"],
    sourceQuality: "festival; official and fan clips",
    notes: "Maintainer confirmed the two-day range 2019-10-25/2019-10-26. Kept official YouTube KAik_JrfkrQ (rejected Bilibili repost BV1nJ411U7hR), official o_wNaQER-cc, Radio Taiwan kGaSifEcs1U, and the 陈四毛小朋友 fan clips. Rejected YouTube news clip F9Gy9i4oCQI and the XHS repost. Setlist not modeled as an ordered list; clips confirm individual performances.",
    status: "partial"
  },
  {
    id: "concert-echo-2018-nanjing",
    slug: "echo-2018-nanjing",
    title: "三毛·齊豫·潘越雲《回聲》演唱會 南京站",
    date: "2018-10-27",
    venue: "Wutaishan Stadium",
    city: "Nanjing",
    countryOrRegion: "China",
    eventType: "concert",
    performers: [CHYI, PAN],
    guests: [PAN],
    tags: ["collaboration", "concert-series"],
    setlist: [],
    mediaLinks: [
      { label: "Partial concert", platform: "bilibili", url: "https://www.bilibili.com/video/BV1d4rVBiEfF/", kind: "video", isOfficial: false, credit: "WeAreLambily" },
      { label: "夢田 clip", platform: "youtube", url: "https://www.youtube.com/watch?v=4EM-2daGcZk", kind: "video", isOfficial: false, credit: "sunny大宁" }
    ],
    officialRecording: false,
    sources: ["source-project-concert-reference-list", "source-cri-echo-2018-nanjing"],
    sourceQuality: "news-backed; fan-upload (date corrected from reference)",
    notes: "Reference row listed 2019-10-27, but ticket/news and Bilibili evidence point to 2018-10-27; maintainer confirmed the correction.",
    status: "partial"
  },
  {
    id: "concert-fenghua-charity-2018-taipei",
    slug: "fenghua-charity-2018-taipei",
    title: "峰華齊唱慈善演唱會",
    date: "2018-11-24",
    venue: "Taipei International Convention Center",
    city: "Taipei",
    countryOrRegion: "Taiwan",
    eventType: "concert",
    performers: [CHYI, WU, "趙詠華"],
    guests: [WU, "趙詠華"],
    tags: ["charity", "collaboration"],
    setlist: [],
    mediaLinks: [
      { label: "Official TV recording (公视), fan capture", platform: "bilibili", url: "https://www.bilibili.com/video/BV1Vb411S7VY/", kind: "video", isOfficial: true, credit: "春天的日光", notes: "Official 公视 recording captured from TV by a fan. TV broadcast date was 2019-02-04." },
      { label: "Encore clip (same as YouTube Lxy6zwwS3NE)", platform: "bilibili", url: "https://www.bilibili.com/video/BV1Kb411S7zc/", kind: "video", isOfficial: false, credit: "沫言_-", notes: "Mainland access copy of YouTube Lxy6zwwS3NE." },
      { label: "Encore clip (original)", platform: "youtube", url: "https://www.youtube.com/watch?v=Lxy6zwwS3NE", kind: "video", isOfficial: false, credit: "Gugi Chan" },
      { label: "民歌联唱 clip from official TV recording", platform: "youtube", url: "https://www.youtube.com/watch?v=zek7TbZ7Kv8", kind: "video", isOfficial: true, credit: "齊豫Chyi Yu Unofficial Music Channel" }
    ],
    officialRecording: true,
    sources: ["source-project-concert-reference-list", "source-wikipedia-chyi-yu-events", "source-bilibili-fenghua-2018-taipei-tv", "source-youtube-fenghua-2018-encore"],
    sourceQuality: "official TV recording; charity concert",
    notes: "Date corrected from reference's 2019-11-24 to 2018-11-24 per maintainer; the event was held 2018-11-24 and broadcast on 公视 on 2019-02-04. Charity concert with donation to 菩提長青村. XHS candidate rejected as unauthorized. 趙詠華 listed by display name because no person record exists yet.",
    status: "partial"
  },
  {
    id: "concert-ai-yu-xi-wang-2019-jiayi",
    slug: "ai-yu-xi-wang-2019-jiayi",
    title: "愛與希望 展望未來 關懷演唱會",
    date: "2019-12-18",
    venue: "Chiayi Prison",
    city: "Chiayi",
    countryOrRegion: "Taiwan",
    eventType: "concert",
    performers: [CHYI],
    guests: [],
    tags: ["charity", "solo"],
    setlist: [],
    mediaLinks: [
      { label: "Full performance (original)", platform: "youtube", url: "https://www.youtube.com/watch?v=nep2NzV2Enc", kind: "video", isOfficial: false, credit: "世界大同" },
      { label: "Full performance (Mainland access copy)", platform: "bilibili", url: "https://www.bilibili.com/video/BV1ZE411s7Rr/", kind: "video", isOfficial: false, credit: "在云端云游", notes: "Reposted from YouTube; retained as an access copy for users who cannot access YouTube." }
    ],
    officialRecording: false,
    sources: ["source-project-concert-reference-list", "source-youtube-aiyuxiwang-2019-jiayi"],
    sourceQuality: "maintainer-supplied platform links",
    notes: "Maintainer supplied Bilibili BV1ZE411s7Rr and identified YouTube nep2NzV2Enc as the original source. Bilibili metadata identifies 20191218 爱与希望、展望未来 演唱会 at 嘉义监狱.",
    status: "partial"
  },
  {
    id: "concert-echoes-back-2022-taipei",
    slug: "echoes-back-2022-taipei",
    title: "三個女人的壯闊人生 三毛 齊豫 潘越雲《回聲 Echoes Back ~ 2022》演唱會",
    date: "2022-12-17",
    venue: "Taipei Pop Music Center",
    city: "Taipei",
    countryOrRegion: "Taiwan",
    eventType: "concert",
    performers: [CHYI, PAN],
    guests: [PAN],
    tags: ["collaboration", "concert-series"],
    setlist: [],
    mediaLinks: [],
    officialRecording: false,
    sources: ["source-project-concert-reference-list", "source-youtube-echoes-back-2022-promo"],
    sourceQuality: "official promo; no concert media confirmed",
    notes: "Maintainer confirmed the 2022 Taipei Echoes Back event shell but rejected all media links as concert media. YouTube RouuoLHYJXg routed to appearances instead of this concert record.",
    status: "partial"
  }
];

// Appearance carry-over: 大雲時堂 interview from the 2022 Echoes Back batch.
const newAppearance = {
  id: "appearance-da-yun-shi-tang-chyi-yu-pan-yueyun-2022",
  slug: "da-yun-shi-tang-chyi-yu-pan-yueyun-2022",
  title: "Da Yun Shi Tang: Chyi Yu and Pan Yue-yun",
  titleOriginal: "大雲時堂：齊豫、潘越雲 再現經典之音",
  titleLocalized: {
    en: "Da Yun Shi Tang: Chyi Yu and Pan Yue-yun",
    "zh-Hant": "大雲時堂：齊豫、潘越雲 再現經典之音",
    "zh-Hans": "大云时堂：齐豫、潘越云 再现经典之音"
  },
  date: "2022-12-07",
  appearanceType: "interview",
  programOrWork: "大雲時堂",
  role: "Guest interview / promo appearance",
  relatedSongs: [],
  mediaLinks: [
    { label: "YouTube full episode", platform: "youtube", url: "https://www.youtube.com/watch?v=RouuoLHYJXg", kind: "watch", isOfficial: false, accessRegion: "Global", notes: "Uploader 大雲時堂; duration 47:18; upload date 2022-12-07." }
  ],
  sources: ["source-youtube-da-yun-shi-tang-rouuolhyjxg"],
  notes: "Maintainer-requested appearance carry-over from the 2022 Taipei Echoes Back concert batch. Routed to appearances instead of concert media.",
  status: "partial"
};

for (const concert of newConcerts) concerts.push(concert);
if (!appearances.some((a) => a.id === newAppearance.id)) appearances.push(newAppearance);
for (const src of newSources) if (!sources.some((s) => s.id === src.id)) sources.push(src);

fs.writeFileSync("data/concerts.json", JSON.stringify(concerts, null, 2) + "\n", "utf8");
fs.writeFileSync("data/appearances.json", JSON.stringify(appearances, null, 2) + "\n", "utf8");
fs.writeFileSync("data/sources.json", JSON.stringify(sources, null, 2) + "\n", "utf8");

console.log(`Imported ${newConcerts.length} echo concerts, 1 appearance, ${newSources.length} sources.`);