import fs from "node:fs";
import { buildSongMatcher } from "./song-match.mjs";

const songs = JSON.parse(fs.readFileSync("data/songs.json", "utf8"));
const concerts = JSON.parse(fs.readFileSync("data/concerts.json", "utf8"));
const sources = JSON.parse(fs.readFileSync("data/sources.json", "utf8"));
const matchSong = buildSongMatcher(songs);

const CHYI = "person-chyi-yu";
const CHI_CHIN = "person-chi-chin";
const PAN = "person-pan-yue-yun";
const LUO = "person-luo-dayou";
const WAKIN = "person-wakin-chau";
const WU_BAI = "person-wu-bai";

const newSources = [
  { id: "source-epochtimes-jingdian-2008-genting", sourceType: "news", title: "Epoch Times publicity report for 经典好听音乐会 2008 Genting", authorOrPublisher: "Epoch Times", date: "2008-04-13", url: "https://www.epochtimes.com/gb/8/4/13/n2080581.htm", accessDate: "2026-06-28", citation: null, reliability: "high", notes: "Reports Luo Dayou, Chyi Yu, Pan Yue-yun, and Zhou Zhiping would perform at Genting Arena on 2008-05-03." },
  { id: "source-jsclub-jingdian-2008-genting", sourceType: "artist-schedule", title: "J's Club schedule listing 经典好听音乐会2008", authorOrPublisher: "J's Club", date: null, url: "http://www.jsclub.com.tw/page_002.php", accessDate: "2026-06-28", citation: null, reliability: "medium", notes: "Lists 2008.05.03 罗大佑、潘越云、齐豫、周治平 at Malaysia Genting." },
  { id: "source-sohu-tian-shi-yu-lang-2008-beijing", sourceType: "news", title: "Sohu post-event report on 天使与狼 Beijing 2008-03-29", authorOrPublisher: "Sohu Entertainment", date: "2008-03-31", url: "https://yule.sohu.com/20080331/n256003319.shtml", accessDate: "2026-06-28", citation: null, reliability: "high", notes: "Reports the Beijing station at 工人体育馆 and describes Chyi Yu's and Chyi Chin's performances." },
  { id: "source-chinanews-tian-shi-yu-lang-2008-beijing-preview", sourceType: "news", title: "China News preview for 天使与狼 Beijing 2008-03-29", authorOrPublisher: "China News", date: "2008-02-20", url: "http://www.chinanews.com.cn/yl/ytcf/news/2008/02-20/1168044.shtml", accessDate: "2026-06-28", citation: null, reliability: "high", notes: "Preview says 2008-03-29 at 北京工人体育馆." },
  { id: "source-bilibili-tian-shi-yu-lang-2008-beijing-full", sourceType: "platform-metadata", title: "Bilibili BV1fJ4m1K7xF (天使与狼北京场 full fan recording)", authorOrPublisher: "齐豫花园 (Bilibili uploader)", date: null, url: "https://www.bilibili.com/video/BV1fJ4m1K7xF/", accessDate: "2026-06-28", citation: null, reliability: "high", notes: "Description states 天使与狼北京场, 2008年3月29日, 工人体育馆, and provides an 18-part setlist." },
  { id: "source-sina-rollings-tone-30-2011-beijing", sourceType: "news-photo", title: "Sina photo: Chyi Yu 橄榄树 at 滚石30 鸟巢 2011-05-01", authorOrPublisher: "Sina Entertainment", date: "2011-05-01", url: "http://ent.sina.com.cn/y/p/2011-05-01/20293297124.shtml", accessDate: "2026-06-28", citation: null, reliability: "high", notes: "Caption says 2011-05-01 北奥·滚石30鸟巢演唱会 at 国家体育场鸟巢, photo of Chyi Yu performing 橄榄树." },
  { id: "source-cntv-rollings-tone-30-2011-beijing", sourceType: "news", title: "CNTV / NetEase report on 滚石30 Beijing 2011-05-01", authorOrPublisher: "CNTV", date: "2011-05-02", url: "http://news.cntv.cn/ent/20110502/101992.shtml", accessDate: "2026-06-28", citation: null, reliability: "high", notes: "Reports the event opened 2011-05-01 and says Chyi Yu appeared and sang 橄榄树." },
  { id: "source-chinadaily-rollings-tone-30-2011-beijing", sourceType: "news", title: "China Daily report on 滚石30 Beijing 2011-05-01", authorOrPublisher: "China Daily", date: "2011-05-03", url: "https://ent.chinadaily.com.cn/2011-05/03/content_13754603.htm", accessDate: "2026-06-28", citation: null, reliability: "high", notes: "Reports 2011-05-01 at 鸟巢体育场 with Chyi Yu among performers." },
  { id: "source-cnw-zhen-ai-nv-ren-2011-wuhan", sourceType: "news", title: "CNW post-event report on 珍爱女人 武汉 2011-08-21", authorOrPublisher: "CNW News", date: "2011-08-22", url: "https://www.cnwnews.com/html/ent/cn_yykx/20110822/364592.html", accessDate: "2026-06-28", citation: null, reliability: "high", notes: "Published 2011-08-22; says Chyi Yu, Pan Yue-yun, Huang Xiao-hu, and Wan Fang performed for Wuhan fans." },
  { id: "source-sina-zhen-ai-nv-ren-2011-beijing", sourceType: "event-feature", title: "Sina 2011 珍爱女人巡回演唱会专题", authorOrPublisher: "Sina Entertainment", date: null, url: "http://ent.sina.com.cn/y/2011zaxy/index.shtml", accessDate: "2026-06-28", citation: null, reliability: "high", notes: "Lists 珍爱女人北京站 2011-06-03 at 北京万事达中心（原五棵松体育馆）." },
  { id: "source-chinanews-zhen-ai-nv-ren-2011-beijing", sourceType: "news", title: "China News launch report for 珍爱女人 mainland tour", authorOrPublisher: "China News", date: "2011-04-21", url: "https://www.chinanews.com.cn/yl/2011/04-21/2987492.shtml", accessDate: "2026-06-28", citation: null, reliability: "high", notes: "Reports 齐豫、潘越云、黄小琥、万芳 launched the mainland tour; Beijing station set for 2011-06-03 at 五棵松体育馆." },
  { id: "source-newton-rollings-tone-30-2011-shanghai", sourceType: "secondary-encyclopedia", title: "Newton Chinese encyclopedia: 滚石30周年上海演唱会", authorOrPublisher: "Newton", date: null, url: "https://www.newton.com.tw/wiki/2011%E6%BB%BE%E7%9F%B330%E5%91%A8%E5%B9%B4%E4%B8%8A%E6%B5%B7%E6%BC%94%E5%94%B1%E6%9C%83/8262785", accessDate: "2026-06-28", citation: null, reliability: "medium", notes: "Gives 2011-10-05 to 2011-10-07 and 上海世博演艺中心/梅赛德斯-奔驰文化中心." },
  { id: "source-sina-rollings-tone-30-2011-shanghai-preview", sourceType: "news", title: "Sina pre-event report for 滚石30 Shanghai 2011-10-05/07", authorOrPublisher: "Sina", date: "2011-09-30", url: "https://ent.sina.cn/music/ygangtai/2011-09-30/detail-icczmvun2293457.d.html", accessDate: "2026-06-28", citation: null, reliability: "medium-high", notes: "Reports Rolling Stone 30 Shanghai would run 2011-10-05/06/07 at Mercedes-Benz Cultural Center." },
  { id: "source-cnw-rollings-tone-30-2011-shanghai", sourceType: "news", title: "CNW participant list for 滚石30 Shanghai", authorOrPublisher: "CNW News", date: "2011-09-18", url: "https://www.cnwnews.com/html/ent/cn_yykx/20110918/371800.html", accessDate: "2026-06-28", citation: null, reliability: "medium-high", notes: "Reports the Shanghai stop and lists 齐豫 among first announced performers." },
  { id: "source-bilibili-rollings-tone-30-2011-shanghai-chyi-yu", sourceType: "platform-metadata", title: "Bilibili BV1u44y1E78v (滚石30上海站 齐豫 clip)", authorOrPublisher: "人生难得有奇遇Chyiyu", date: null, url: "https://www.bilibili.com/video/BV1u44y1E78v/", accessDate: "2026-06-28", citation: null, reliability: "medium-high", notes: "Title ties Chyi Yu to Rolling Stone 30 Shanghai 2011 with 答案/橄榄树/angel/梦田." },
  { id: "source-cntv-rollings-tone-30-2011-shenzhen", sourceType: "news", title: "CNTV / China News report on 滚石30 Shenzhen 2011-12-18", authorOrPublisher: "CNTV", date: "2011-12-19", url: "http://news.cntv.cn/ent/20111219/115912.shtml", accessDate: "2026-06-28", citation: null, reliability: "high", notes: "Reports Rolling Stone 30 Shenzhen the previous night with Chyi Yu performing 橄榄树." },
  { id: "source-cflac-rollings-tone-30-2011-shenzhen", sourceType: "news", title: "China Federation of Literary and Art Circles report on 滚石30 Shenzhen", authorOrPublisher: "CFLAC", date: "2011-12-20", url: "https://www.cflac.org.cn/yl/zx/201112/t20111220_54533.html", accessDate: "2026-06-28", citation: null, reliability: "medium-high", notes: "Reports the Shenzhen Rolling Stone 30 event and Chyi Yu's 橄榄树 segment." }
];

// 天使与狼北京 setlist. Exclude 大约在冬季 (齐秦 solo). 橄榄树+狼 modeled as
// 橄榄树 with collaborator (齐秦 狼 part noted). 其实都是一样 kept with null song.
function tianShiYuLangBeijingSetlist() {
  const raw = [
    [1, "Stories", []],
    [2, "走在雨中", []],
    [3, "飞鸟与鱼", []],
    [4, "Whoever Finds This, I Love You", []],
    [5, "Vincent", []],
    [6, "九月的高跟鞋", []],
    [7, "其实都是一样", [CHI_CHIN]],
    [8, "你是我所有的回忆", []],
    [9, "星 + 答案", [], ["song-xing", "song-answer"]],
    [10, "菊叹", []],
    [11, "欢颜", []],
    [12, "橄榄树", []],
    [13, "船歌", []],
    [14, "一面湖水", [CHI_CHIN]],
    [15, "橄榄树 + 狼", [CHI_CHIN], ["song-olive-tree"], "Encore medley with Chyi Chin's 狼; Chyi Yu performs 橄榄树."],
    [16, "我愿意", [], null, "Encore."],
    [17, "藤缠树", [], null, "Encore."]
  ];
  return raw.map(([pos, title, collaborators, songParts, notes]) => {
    const entry = {
      position: pos,
      song: songParts ? null : matchSong(title.replace(/\s*\+\s*.*/, "")),
      titlePerformed: title,
      collaborators
    };
    if (songParts) entry.songParts = songParts;
    if (notes) entry.notes = notes;
    return entry;
  });
}

const newConcerts = [
  {
    id: "concert-jing-dian-hao-ting-2008-genting",
    slug: "jing-dian-hao-ting-2008-genting",
    title: "經典好聽音樂會2008",
    date: "2008-05-03",
    venue: "Genting Arena of the Stars",
    city: "Genting Highlands",
    countryOrRegion: "Malaysia",
    eventType: "concert",
    performers: [LUO, CHYI, PAN, "周治平"],
    guests: [LUO, PAN, "周治平"],
    tags: ["collaboration", "festival"],
    setlist: [],
    mediaLinks: [],
    officialRecording: false,
    sources: ["source-project-concert-reference-list", "source-epochtimes-jingdian-2008-genting", "source-jsclub-jingdian-2008-genting"],
    sourceQuality: "news-backed; no public media found",
    notes: "Date corrected from reference's 2008-03-05 to 2008-05-03 per public evidence and maintainer confirmation. Multi-artist concert with 罗大佑, 齐豫, 潘越云, 周治平 at Genting. 周治平 listed by display name because no person record exists yet.",
    status: "partial"
  },
  {
    id: "concert-tian-shi-yu-lang-2008-beijing",
    slug: "tian-shi-yu-lang-2008-beijing",
    title: "天使與狼演唱會 北京站",
    date: "2008-03-29",
    venue: "Beijing Workers' Gymnasium",
    city: "Beijing",
    countryOrRegion: "China",
    eventType: "concert",
    performers: [CHYI, CHI_CHIN],
    guests: [CHI_CHIN],
    tags: ["collaboration", "anniversary", "concert-series"],
    setlist: tianShiYuLangBeijingSetlist(),
    mediaLinks: [
      { label: "Full fan recording, 18-part", platform: "bilibili", url: "https://www.bilibili.com/video/BV1fJ4m1K7xF/", kind: "video", isOfficial: false, credit: "齐豫花园" },
      { label: "Part 8 clip", platform: "bilibili", url: "https://www.bilibili.com/video/BV1rYPTzmEp7/", kind: "video", isOfficial: false, credit: "战鼓LJ" },
      { label: "飛鳥與魚 fan-shot clip", platform: "bilibili", url: "https://www.bilibili.com/video/BV14h411a7BY/", kind: "video", isOfficial: false, credit: "老爺爺1966" }
    ],
    officialRecording: false,
    sources: ["source-project-concert-reference-list", "source-sohu-tian-shi-yu-lang-2008-beijing", "source-chinanews-tian-shi-yu-lang-2008-beijing-preview", "source-bilibili-tian-shi-yu-lang-2008-beijing-full"],
    sourceQuality: "news-backed; full fan recording with setlist",
    notes: "Beijing stop of the 天使與狼 20th anniversary tour. Maintainer confirmed shell and kept all three Bilibili links; YouTube QO090FLTDFo was moved to the 2008-03-01 Taipei event. 大约在冬季 (齐秦 solo) excluded from setlist per the Chyi-Yu-only rule.",
    status: "partial"
  },
  {
    id: "concert-rollings-tone-30-2011-beijing",
    slug: "rollings-tone-30-2011-beijing",
    title: "快樂天堂 滾石30演唱會 北京站",
    date: "2011-05-01",
    venue: "National Stadium (Bird's Nest)",
    city: "Beijing",
    countryOrRegion: "China",
    eventType: "festival",
    performers: [CHYI, CHI_CHIN, WAKIN, WU_BAI, "五月天", PAN, "辛晓琪", "顺子"],
    guests: [CHI_CHIN, WAKIN, WU_BAI, "五月天", PAN, "辛晓琪", "顺子"],
    tags: ["festival", "collaboration", "anniversary"],
    setlist: [],
    mediaLinks: [],
    officialRecording: false,
    sources: ["source-project-concert-reference-list", "source-sina-rollings-tone-30-2011-beijing", "source-cntv-rollings-tone-30-2011-beijing", "source-chinadaily-rollings-tone-30-2011-beijing"],
    sourceQuality: "news-backed; no Chyi Yu media confirmed",
    notes: "Maintainer confirmed the Beijing shell but rejected all media candidates. Chyi Yu performed 橄榄树 per news/photo evidence. Multi-artist Rolling Stone 30 anniversary concert at the Bird's Nest.",
    status: "partial"
  },
  {
    id: "concert-zhen-ai-nv-ren-2011-wuhan",
    slug: "zhen-ai-nv-ren-2011-wuhan",
    title: "Power Woman 珍愛女人巡迴演唱會 武漢站",
    date: "2011-08-21",
    venue: null,
    city: "Wuhan",
    countryOrRegion: "China",
    eventType: "concert",
    performers: [CHYI, PAN, "黄小琥", "万芳"],
    guests: [PAN, "黄小琥", "万芳"],
    tags: ["collaboration", "concert-series"],
    setlist: [],
    mediaLinks: [],
    officialRecording: false,
    sources: ["source-project-concert-reference-list", "source-cnw-zhen-ai-nv-ren-2011-wuhan"],
    sourceQuality: "news-backed; no public media found",
    notes: "Maintainer confirmed Wuhan shell but rejected all media. Bilibili BV1ax411E78q belongs to a separate 珍爱女人 Singapore event, not Wuhan. 黄小琥 and 万芳 listed by display name because no person records exist yet.",
    status: "partial"
  },
  {
    id: "concert-zhen-ai-nv-ren-2011-beijing",
    slug: "zhen-ai-nv-ren-2011-beijing",
    title: "Power Woman 珍愛女人巡迴演唱會 北京站",
    date: "2011-06-03",
    venue: "MasterCard Center (formerly Wukesong Arena)",
    city: "Beijing",
    countryOrRegion: "China",
    eventType: "concert",
    performers: [CHYI, PAN, "黄小琥", "万芳"],
    guests: [PAN, "黄小琥", "万芳"],
    tags: ["collaboration", "concert-series"],
    setlist: [],
    mediaLinks: [],
    officialRecording: false,
    sources: ["source-project-concert-reference-list", "source-sina-zhen-ai-nv-ren-2011-beijing", "source-chinanews-zhen-ai-nv-ren-2011-beijing"],
    sourceQuality: "news-backed; no public media found",
    notes: "Maintainer-appended during Batch 3 review. Beijing stop of the Power Woman 珍爱女人 tour at 五棵松体育馆.",
    status: "partial"
  },
  {
    id: "concert-zhen-ai-nv-ren-2011-kunming",
    slug: "zhen-ai-nv-ren-2011-kunming",
    title: "Power Woman 珍愛女人巡迴演唱會 昆明站",
    date: "2011-09-03",
    venue: null,
    city: "Kunming",
    countryOrRegion: "China",
    eventType: "concert",
    performers: [CHYI, PAN, "黄小琥", "万芳"],
    guests: [PAN, "黄小琥", "万芳"],
    tags: ["collaboration", "concert-series"],
    setlist: [],
    mediaLinks: [],
    officialRecording: false,
    sources: ["source-project-concert-reference-list"],
    sourceQuality: "reference-only; no independent Kunming source found",
    notes: "Maintainer confirmed the Kunming shell from the reference. Fresh public web search did not find an independent exact Kunming article in this pass.",
    status: "partial"
  },
  {
    id: "concert-rollings-tone-30-2011-shanghai",
    slug: "rollings-tone-30-2011-shanghai",
    title: "滾石30週年上海演唱會",
    date: "2011-10-05/2011-10-07",
    venue: "Mercedes-Benz Arena",
    city: "Shanghai",
    countryOrRegion: "China",
    eventType: "festival",
    performers: [CHYI, WAKIN, WU_BAI, "五月天", "张震岳", "任贤齐", "杜德伟", PAN, "万芳", "赵咏华"],
    guests: [WAKIN, WU_BAI, "五月天", "张震岳", "任贤齐", "杜德伟", PAN, "万芳", "赵咏华"],
    tags: ["festival", "collaboration", "anniversary"],
    setlist: [],
    mediaLinks: [
      { label: "Chyi Yu clip: 答案/橄榄树/angel/梦田", platform: "bilibili", url: "https://www.bilibili.com/video/BV1u44y1E78v/", kind: "video", isOfficial: false, credit: "人生难得有奇遇Chyiyu" }
    ],
    officialRecording: false,
    sources: ["source-project-concert-reference-list", "source-newton-rollings-tone-30-2011-shanghai", "source-sina-rollings-tone-30-2011-shanghai-preview", "source-cnw-rollings-tone-30-2011-shanghai", "source-bilibili-rollings-tone-30-2011-shanghai-chyi-yu"],
    sourceQuality: "news-backed; Chyi Yu clip",
    notes: "Maintainer confirmed shell and kept Bilibili BV1u44y1E78v. Three-day run 2011-10-05/06/07 at Mercedes-Benz Arena. Non-Chyi Yu YouTube clips rejected.",
    status: "partial"
  },
  {
    id: "concert-rollings-tone-30-2011-shenzhen",
    slug: "rollings-tone-30-2011-shenzhen",
    title: "滾石30深圳演唱會",
    date: "2011-12-18",
    venue: "Shenzhen Bay Sports Center Stadium",
    city: "Shenzhen",
    countryOrRegion: "China",
    eventType: "festival",
    performers: [CHYI, WAKIN, PAN, WU_BAI, "五月天", "任贤齐", "刘若英"],
    guests: [WAKIN, PAN, WU_BAI, "五月天", "任贤齐", "刘若英"],
    tags: ["festival", "collaboration", "anniversary"],
    setlist: [],
    mediaLinks: [],
    officialRecording: false,
    sources: ["source-project-concert-reference-list", "source-cntv-rollings-tone-30-2011-shenzhen", "source-cflac-rollings-tone-30-2011-shenzhen"],
    sourceQuality: "news-backed; no Chyi Yu media confirmed",
    notes: "Maintainer confirmed shell and no media. Chyi Yu performed 橄榄树 per news evidence. Bilibili BV1u44y1E78v is Shanghai, not Shenzhen.",
    status: "partial"
  }
];

// Backref helper: ensure songs referenced in setlists list the concert in knownConcerts.
const songIndex = new Map(songs.map((s) => [s.id, s]));
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

for (const concert of newConcerts) concerts.push(concert);
for (const src of newSources) if (!sources.some((s) => s.id === src.id)) sources.push(src);

fs.writeFileSync("data/concerts.json", JSON.stringify(concerts, null, 2) + "\n", "utf8");
fs.writeFileSync("data/songs.json", JSON.stringify(songs, null, 2) + "\n", "utf8");
fs.writeFileSync("data/sources.json", JSON.stringify(sources, null, 2) + "\n", "utf8");

console.log(`Imported ${newConcerts.length} batch3 concerts, ${newSources.length} sources.`);