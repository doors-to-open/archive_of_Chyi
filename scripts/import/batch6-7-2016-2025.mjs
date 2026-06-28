import fs from "node:fs";

const concerts = JSON.parse(fs.readFileSync("data/concerts.json", "utf8"));
const sources = JSON.parse(fs.readFileSync("data/sources.json", "utf8"));

const CHYI = "person-chyi-yu";
const PAN = "person-pan-yue-yun";
const WAKIN = "person-wakin-chau";

const newSources = [
  { id: "source-cna-dian-deng-2016-taipei", sourceType: "news", title: "CNA post-event report on 点灯迎光看见生命勇士演唱会 2016-03-06", authorOrPublisher: "CNA", date: "2016-03-06", url: "https://www.cna.com.tw/news/ahel/201603060290.aspx", accessDate: "2026-06-28", citation: null, reliability: "high", notes: "Reports 齐豫 and other artists at 「点灯－迎光，看见生命勇士演唱会」." },
  { id: "source-yam-dian-deng-2016-taipei", sourceType: "news", title: "Yam/CNA pre-event listing for 2016-03-06 点灯迎光", authorOrPublisher: "Yam/CNA", date: "2016-01-18", url: "https://n.yam.com/Article/20160118513709", accessDate: "2026-06-28", citation: null, reliability: "high", notes: "Lists 2016-03-06 台北中山堂中正厅 and performers including 齐豫." },
  { id: "source-sohu-minge-40-2016-shenzhen", sourceType: "news-review", title: "Sohu event review for 民歌四十 深圳场 2016-11-19", authorOrPublisher: "Sohu", date: "2016-11-25", url: "https://yule.sohu.com/20161125/n474130145.shtml", accessDate: "2026-06-28", citation: null, reliability: "high", notes: "Post-event review for 民歌四十深圳场; mentions 深圳湾体育馆 and 齐豫等 performers." },
  { id: "source-sznews-minge-40-2016-shenzhen", sourceType: "newspaper-pdf", title: "深圳晚报 2016-11-20 PDF on 民歌40 深圳", authorOrPublisher: "深圳晚报", date: "2016-11-20", url: "https://wb.sznews.com/page/1721/2016-11/20/A09/20161120A09_pdf.pdf", accessDate: "2026-06-28", citation: null, reliability: "high", notes: "Reports 台湾“民歌40”演唱会 the previous night at 深圳春茧体育馆, listing 齐豫." },
  { id: "source-zaobao-gan-en-2017-singapore-review", sourceType: "news-review", title: "Zaobao post-event review on 感恩因为有爱 charity concert 2017-05-06", authorOrPublisher: "Zaobao", date: "2017-05-08", url: "https://www.zaobao.com.sg/zentertainment/music/story20170508-757628", accessDate: "2026-06-28", citation: null, reliability: "high", notes: "Reports 齐豫 and 周华健 performed at The Star Theatre for 感恩——因为有爱 charity concert." },
  { id: "source-zaobao-gan-en-2017-singapore-preview", sourceType: "news", title: "Zaobao pre-event article for 感恩因为有爱 2017-05-06", authorOrPublisher: "Zaobao", date: "2017-01-21", url: "https://www.zaobao.com.sg/zentertainment/music/story20170121-716198", accessDate: "2026-06-28", citation: null, reliability: "high", notes: "Lists date 2017-05-06, 8pm, The Star Theatre, with 齐豫 and 周华健." },
  { id: "source-roundyule-zhen-ai-nv-ren-2017-macau", sourceType: "entertainment-news", title: "南方娱乐网/Roundyule report on Power Woman 珍爱女人澳门 2017-06-10", authorOrPublisher: "Roundyule", date: "2017-06-12", url: "http://m.roundyule.com/music/2017-06-12/10973.html", accessDate: "2026-06-28", citation: null, reliability: "high", notes: "States 2017年度《Power woman珍爱女人澳门演唱会》6月10日在澳门金光综艺馆登台; lists 林晓培/齐豫/万芳/潘越云." },
  { id: "source-youku-chuan-yue-2017-genting", sourceType: "platform-album", title: "Youku album list for 穿越 豫见 云顶演唱会 2017.6.24", authorOrPublisher: "Youku", date: null, url: "http://list.youku.com/albumlist/show/id_50643392", accessDate: "2026-06-28", citation: null, reliability: "high", notes: "Album title gives 2017.6.24 穿越 豫见 云顶演唱会 and includes multiple Chyi Yu/Pan Yueyun song videos." },
  { id: "source-8world-gan-en-2017-news-clip", sourceType: "platform-metadata", title: "8world news/video clip (YouTube 1W5l3l3j5_w / Bilibili BV1Kb411W7cq)", authorOrPublisher: "8world / 思齐96", date: "2017-05-06", url: "https://www.youtube.com/watch?v=1W5l3l3j5_w", accessDate: "2026-06-28", citation: null, reliability: "medium-high", notes: "Maintainer confirmed keep as supporting evidence/video media on both YouTube and Bilibili." },
  { id: "source-youtube-minge-50-2025-taipei-news", sourceType: "news-video", title: "YouTube news result: 民歌五十演唱會首場 2/14", authorOrPublisher: "Party Star Media", date: "2025-02-14", url: "https://www.youtube.com/watch?v=kHtwf82-MqQ", accessDate: "2026-06-28", citation: null, reliability: "high", notes: "Title says 民歌五十演唱會首場2/14 and lists 齐豫 among performers." },
  { id: "source-bilibili-minge-50-2025-taipei-fan", sourceType: "platform-metadata", title: "Bilibili BV1DdAfenEjS (民歌50 齐豫 你是我所有的回忆)", authorOrPublisher: "是我在弹着古筝", date: null, url: "https://www.bilibili.com/video/BV1DdAfenEjS", accessDate: "2026-06-28", citation: null, reliability: "medium-high", notes: "Single-song fan upload; maintainer confirmed keep as 民歌五十 concert media." },
  { id: "source-ren-ji-fu-bao-yong-heng-2025-taipei", sourceType: "official-platform-video", title: "人间福报 official full upload: 永恆的星 佛光山39周年暨人間福報25周年文化音樂會", authorOrPublisher: "人間福報", date: "2025-04-01", url: "https://www.youtube.com/watch?v=7ytRyO-RAhk", accessDate: "2026-06-28", citation: null, reliability: "high", notes: "Official full upload of the 永恆的星 concert; maintainer confirmed keep plus both official excerpts." }
];

const newConcerts = [
  {
    id: "concert-dian-deng-ying-guang-2016-taipei",
    slug: "dian-deng-ying-guang-2016-taipei",
    title: "點燈・迎光－看見生命勇士公益演唱會",
    date: "2016-03-06",
    venue: "Taipei Zhongshan Hall Zhongzheng Auditorium",
    city: "Taipei",
    countryOrRegion: "Taiwan",
    eventType: "concert",
    performers: [CHYI, "李建复", "林宥嘉", "家家", "黄裕翔", "刘铭"],
    guests: ["李建复", "林宥嘉", "家家", "黄裕翔", "刘铭"],
    tags: ["charity", "collaboration"],
    setlist: [],
    mediaLinks: [
      { label: "Chyi Yu CUT, 36:57", platform: "youtube", url: "https://www.youtube.com/watch?v=xR6m16yrS2I", kind: "video", isOfficial: false, credit: "齊豫Chyi Yu Unofficial Music Channel" },
      { label: "隱形的翅膀 clip", platform: "bilibili", url: "https://www.bilibili.com/video/BV1Pb411m786", kind: "video", isOfficial: false, credit: "思齊96" }
    ],
    officialRecording: false,
    sources: ["source-project-concert-reference-list", "source-cna-dian-deng-2016-taipei", "source-yam-dian-deng-2016-taipei"],
    sourceQuality: "news-backed; fan clips",
    notes: "Maintainer confirmed the 2016-03-06 event shell. BV1qR4y1M77p belongs to a separate 2016-03-26 event (向国军致敬演唱会 点灯节目) and is not kept here. Performers listed by display name where no person records exist.",
    status: "partial"
  },
  {
    id: "concert-minge-40-2016-shenzhen",
    slug: "minge-40-2016-shenzhen",
    title: "民歌40：再唱一段思想起 深圳演唱會",
    date: "2016-11-19",
    venue: "Shenzhen Bay Sports Center (ChunJian)",
    city: "Shenzhen",
    countryOrRegion: "China",
    eventType: "festival",
    performers: [CHYI, PAN, "李宗盛", "万芳"],
    guests: [PAN, "李宗盛", "万芳"],
    tags: ["festival", "collaboration", "anniversary"],
    setlist: [],
    mediaLinks: [
      { label: "齊豫部分 clip", platform: "youtube", url: "https://www.youtube.com/watch?v=wU1rdzm90F8", kind: "video", isOfficial: false, credit: "Chyi's Fan" }
    ],
    officialRecording: false,
    sources: ["source-project-concert-reference-list", "source-sohu-minge-40-2016-shenzhen", "source-sznews-minge-40-2016-shenzhen"],
    sourceQuality: "news-backed; fan clip",
    notes: "Maintainer confirmed the Shenzhen shell. Kept YouTube wU1rdzm90F8 only; rejected Bilibili BV12x411k7gd (belongs to Taipei 民歌四十) and YouTube N1mT2QlV6XA (meet-and-greet side activity).",
    status: "partial"
  },
  {
    id: "concert-gan-en-charity-2017-singapore",
    slug: "gan-en-charity-2017-singapore",
    title: "感恩－因為有愛慈善演唱會",
    date: "2017-05-06",
    venue: "The Star Theatre",
    city: "Singapore",
    countryOrRegion: "Singapore",
    eventType: "concert",
    performers: [CHYI, WAKIN],
    guests: [WAKIN],
    tags: ["charity", "collaboration"],
    setlist: [],
    mediaLinks: [
      { label: "8world news/video clip (YouTube source)", platform: "youtube", url: "https://www.youtube.com/watch?v=1W5l3l3j5_w", kind: "video", isOfficial: false, credit: "8world" },
      { label: "8world news/video clip (Bilibili alternate)", platform: "bilibili", url: "https://www.bilibili.com/video/BV1Kb411W7cq", kind: "video", isOfficial: false, credit: "思齊96", notes: "Mainland alternate for the same 8world clip." }
    ],
    officialRecording: false,
    sources: ["source-project-concert-reference-list", "source-zaobao-gan-en-2017-singapore-review", "source-zaobao-gan-en-2017-singapore-preview", "source-8world-gan-en-2017-news-clip"],
    sourceQuality: "news-backed; supporting-evidence video",
    notes: "Maintainer confirmed the shell and kept the 8world news/video clip on both YouTube and Bilibili as supporting evidence and video media. 齐豫 and 周华健 performed zero-fee; raised over 5 million SGD.",
    status: "partial"
  },
  {
    id: "concert-zhen-ai-nv-ren-2017-macau",
    slug: "zhen-ai-nv-ren-2017-macau",
    title: "Power Woman 珍愛女人澳門演唱會",
    date: "2017-06-10",
    venue: "Venetian Macao Coati Hall",
    city: "Macau",
    countryOrRegion: "Macau",
    eventType: "concert",
    performers: [CHYI, PAN, "万芳", "林晓培"],
    guests: [PAN, "万芳", "林晓培"],
    tags: ["collaboration", "concert-series"],
    setlist: [],
    mediaLinks: [
      { label: "齐豫部分 fan recording, 17:55", platform: "bilibili", url: "https://www.bilibili.com/video/BV1Yx41187ZR", kind: "video", isOfficial: false, credit: "Tinyking_" }
    ],
    officialRecording: false,
    sources: ["source-project-concert-reference-list", "source-roundyule-zhen-ai-nv-ren-2017-macau"],
    sourceQuality: "news-backed; fan recording",
    notes: "Maintainer confirmed the shell and kept only Bilibili BV1Yx41187ZR; rejected the two short YES娱乐 clips (BV1Xb411p7ff and BV1kx41187xs).",
    status: "partial"
  },
  {
    id: "concert-chuan-yue-yu-jian-2017-genting",
    slug: "chuan-yue-yu-jian-2017-genting",
    title: "穿越・豫見雲頂演唱會",
    date: "2017-06-24",
    venue: "Arena of the Stars",
    city: "Genting Highlands",
    countryOrRegion: "Malaysia",
    eventType: "concert",
    performers: [CHYI, PAN],
    guests: [PAN],
    tags: ["collaboration"],
    setlist: [],
    mediaLinks: [
      { label: "Full fan upload, 73:15 (YouTube source)", platform: "youtube", url: "https://www.youtube.com/watch?v=vTVNbawZ9kg", kind: "video", isOfficial: false, credit: "齊豫Chyi Yu Unofficial Music Channel" },
      { label: "Full fan upload, 73:15 (Bilibili alternate)", platform: "bilibili", url: "https://www.bilibili.com/video/BV1Pu4y1S7kc", kind: "video", isOfficial: false, credit: "OMGPattiLuPone", notes: "Mainland alternate for YouTube vTVNbawZ9kg." },
      { label: "Partial fan upload, 42:53", platform: "bilibili", url: "https://www.bilibili.com/video/BV1XK4y1x7pV", kind: "video", isOfficial: false, credit: "潘氏小尾巴" },
      { label: "You Raise Me Up clip", platform: "bilibili", url: "https://www.bilibili.com/video/BV1UC411J7wE", kind: "video", isOfficial: false, credit: null },
      { label: "You Raise Me Up clip (alternate)", platform: "bilibili", url: "https://www.bilibili.com/video/BV1qN411W7GJ", kind: "video", isOfficial: false, credit: null },
      { label: "飛鳥與魚 clip", platform: "youtube", url: "https://www.youtube.com/watch?v=e2eSpk2OwtQ", kind: "video", isOfficial: false, credit: "齊豫花園" },
      { label: "Youku album (evidence/media lead)", platform: "youku", url: "http://list.youku.com/albumlist/show/id_50643392", kind: "video", isOfficial: false, credit: null, notes: "Youku album with multiple listed songs." }
    ],
    officialRecording: false,
    sources: ["source-project-concert-reference-list", "source-youku-chuan-yue-2017-genting"],
    sourceQuality: "platform-album and fan uploads",
    notes: "Maintainer confirmed the shell. Kept YouTube vTVNbawZ9kg and Bilibili BV1Pu4y1S7kc as alternate links for the same 73-minute fan upload, plus partial/clips and the Youku album lead. Rejected BV1xmu8zNE36 (duplicate repost) and kbRpHhWFZqU (official short clip, retained only as shell evidence).",
    status: "partial"
  },
  {
    id: "concert-minge-50-2025-taipei",
    slug: "minge-50-2025-taipei",
    title: "民歌五十演唱會",
    date: "2025-02-14/2025-02-15",
    venue: "Taipei Arena",
    city: "Taipei",
    countryOrRegion: "Taiwan",
    eventType: "festival",
    performers: [CHYI],
    guests: [],
    tags: ["festival", "anniversary"],
    setlist: [],
    mediaLinks: [
      { label: "你是我所有的回憶 clip", platform: "bilibili", url: "https://www.bilibili.com/video/BV1DdAfenEjS", kind: "video", isOfficial: false, credit: "是我在弹着古筝" }
    ],
    officialRecording: false,
    sources: ["source-project-concert-reference-list", "source-youtube-minge-50-2025-taipei-news", "source-bilibili-minge-50-2025-taipei-fan"],
    sourceQuality: "news-backed; fan clip",
    notes: "Maintainer confirmed the two-day shell and venue 台北小巨蛋. Kept only Bilibili BV1DdAfenEjS; rejected YouTube news clips kHtwf82-MqQ, s2nfwuxAMMU, and ncXKKpF8FjQ as media.",
    status: "partial"
  },
  {
    id: "concert-yong-heng-de-xing-2025-taipei",
    slug: "yong-heng-de-xing-2025-taipei",
    title: "永恆的星──佛光山39周年暨人間福報25周年文化音樂會",
    date: "2025-04-01",
    venue: null,
    city: "Taipei",
    countryOrRegion: "Taiwan",
    eventType: "concert",
    performers: [CHYI, "赵咏华"],
    guests: ["赵咏华"],
    tags: ["religious", "charity", "collaboration"],
    setlist: [],
    mediaLinks: [
      { label: "Official full upload", platform: "youtube", url: "https://www.youtube.com/watch?v=7ytRyO-RAhk", kind: "video", isOfficial: true, credit: "人間福報" },
      { label: "夢田 excerpt (齊豫、趙詠華)", platform: "youtube", url: "https://www.youtube.com/watch?v=2k-7qLDuGLs", kind: "video", isOfficial: true, credit: "人間福報" },
      { label: "大吉祥天女咒 excerpt (齊豫、趙詠華)", platform: "youtube", url: "https://www.youtube.com/watch?v=94uOgD-nVVo", kind: "video", isOfficial: true, credit: "人間福報" }
    ],
    officialRecording: true,
    sources: ["source-project-concert-reference-list", "source-ren-ji-fu-bao-yong-heng-2025-taipei"],
    sourceQuality: "official recording",
    notes: "Maintainer confirmed the shell and kept the official 人間福報 full upload plus both official excerpts. 趙詠華 listed by display name because no person record exists yet. Religious/charity cultural concert for 佛光山 39th anniversary and 人間福報 25th anniversary.",
    status: "partial"
  }
];

for (const concert of newConcerts) concerts.push(concert);
for (const src of newSources) if (!sources.some((s) => s.id === src.id)) sources.push(src);

fs.writeFileSync("data/concerts.json", JSON.stringify(concerts, null, 2) + "\n", "utf8");
fs.writeFileSync("data/sources.json", JSON.stringify(sources, null, 2) + "\n", "utf8");

console.log(`Imported ${newConcerts.length} batch6+7 concerts, ${newSources.length} sources.`);