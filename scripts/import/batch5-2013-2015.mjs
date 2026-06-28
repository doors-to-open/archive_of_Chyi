import fs from "node:fs";

const concerts = JSON.parse(fs.readFileSync("data/concerts.json", "utf8"));
const sources = JSON.parse(fs.readFileSync("data/sources.json", "utf8"));

const CHYI = "person-chyi-yu";
const PAN = "person-pan-yue-yun";
const CHI_CHIN = "person-chi-chin";

const newSources = [
  { id: "source-ettoday-olive-tree-2014-taipei", sourceType: "news", title: "ETtoday pre-event report on 橄欖樹2014台北演唱會", authorOrPublisher: "ETtoday", date: "2014-04-11", url: "https://star.ettoday.net/news/326038", accessDate: "2026-06-28", citation: null, reliability: "high", notes: "Reports the 2014-04-11 TICC concert title 橄欖樹2014台北演唱會 齊豫." },
  { id: "source-cna-olive-tree-2014-taipei", sourceType: "news", title: "CNA post-event report on 橄欖樹2014台北演唱會", authorOrPublisher: "CNA", date: "2014-04-12", url: "https://www.cna.com.tw/news/amov/201404120087.aspx", accessDate: "2026-06-28", citation: null, reliability: "high", notes: "Post-event report says Chyi Yu performed 橄欖樹2014台北演唱會 the previous night." },
  { id: "source-pixnet-olive-tree-2014-taipei", sourceType: "attendee-report", title: "Attendee blog review of 2014 橄欖樹 concert", authorOrPublisher: "ned921 (Pixnet)", date: "2014-04-11", url: "https://ned921.pixnet.net/blog/posts/4041071093", accessDate: "2026-06-28", citation: null, reliability: "medium", notes: "Detailed attendee review of 2014 Chyi Yu 橄欖樹 concert." },
  { id: "source-sina-olive-tree-2014-guangzhou", sourceType: "news", title: "Sina ticket/event report for 橄榄树2014 广州 2014-09-27", authorOrPublisher: "Sina", date: "2014-09-11", url: "https://news.sina.cn/2014-09-11/detail-icfkptvx3485179.d.html", accessDate: "2026-06-28", citation: null, reliability: "high", notes: "Reports 2014-09-27 20:00 广州 at 羊城创意产业园展演中心·中央车站." },
  { id: "source-biography-olive-tree-2014-singapore", sourceType: "biography", title: "Biography/event chronology listing 橄榄树2014新加坡演唱会", authorOrPublisher: "02263.com", date: null, url: "https://02263.com/star/qiyu/", accessDate: "2026-06-28", citation: null, reliability: "medium", notes: "Lists 2014-12-20 at 新加坡滨海湾金沙剧院 for 橄榄树2014新加坡演唱会." },
  { id: "source-xinmin-minge-2015-shanghai", sourceType: "news", title: "Xinmin Evening News on 两岸校园民歌经典名曲演唱会 上海 2015-07-18", authorOrPublisher: "Xinmin Evening News", date: "2015-05-14", url: "https://xmwb.xinmin.cn/html/2015-05/14/content_21_3.htm", accessDate: "2026-06-28", citation: null, reliability: "high", notes: "Reports the concert would be held 2015-07-18 at 上海大舞台 and lists 齐豫." },
  { id: "source-tongji-minge-2015-shanghai", sourceType: "institutional-news", title: "Tongji University post-event report on 两岸校园民歌 2015-07-18", authorOrPublisher: "Tongji University", date: "2015-07-18", url: "http://news.tongji.edu.cn/info/1003/40516.htm", accessDate: "2026-06-28", citation: null, reliability: "high", notes: "Post-event report says 2015-07-18 evening 两岸校园民歌经典名曲演唱会 succeeded at 上海大舞台." },
  { id: "source-today-huai-nian-2015-singapore", sourceType: "news-review", title: "TODAY concert review: Chyi Yu's Love and Remembrance Charity Concert 2015", authorOrPublisher: "TODAY", date: "2015-11-14", url: "https://www.todayonline.com/entertainment/music/concert-review-chyi-yus-love-and-remembrance-charity-concert", accessDate: "2026-06-28", citation: null, reliability: "high", notes: "Reviews Chyi Yu's Love and Remembrance Charity Concert on 2015-11-14 at The Star Theatre." },
  { id: "source-rmzxw-huai-nian-2015-singapore", sourceType: "news", title: "People CPPCC report on 2015-11-14 Singapore charity concert", authorOrPublisher: "rmzxw.com.cn", date: "2015-11-17", url: "http://www.rmzxw.com.cn/c/2015-11-17/624667.shtml", accessDate: "2026-06-28", citation: null, reliability: "high", notes: "Reports the 2015-11-14 Singapore charity concert and guests 齐秦、李宗盛、孙燕姿." }
];

const newConcerts = [
  {
    id: "concert-olive-tree-2014-taipei",
    slug: "olive-tree-2014-taipei",
    title: "橄欖樹2014台北演唱會",
    date: "2014-04-11",
    venue: "Taipei International Convention Center",
    city: "Taipei",
    countryOrRegion: "Taiwan",
    eventType: "concert",
    performers: [CHYI],
    guests: [],
    tags: ["solo", "charity"],
    setlist: [],
    mediaLinks: [
      { label: "Official MV (橄榄树), kept for concert context", platform: "youtube", url: "https://www.youtube.com/watch?v=5tOEP4WCCj8", kind: "video", isOfficial: true, credit: "滚石唱片 ROCK RECORDS" },
      { label: "橄欖樹（安可重唱）— Bilibili P1", platform: "bilibili", url: "https://www.bilibili.com/video/BV13u411r7Vg/?p=1", kind: "video", isOfficial: false, credit: "ssssshou", notes: "Mainland alternate for YouTube npaDlC3Bd58." },
      { label: "橄欖樹（安可重唱）— YouTube source", platform: "youtube", url: "https://www.youtube.com/watch?v=npaDlC3Bd58", kind: "video", isOfficial: false, credit: null },
      { label: "城裡的月光 — Bilibili P2", platform: "bilibili", url: "https://www.bilibili.com/video/BV13u411r7Vg/?p=2", kind: "video", isOfficial: false, credit: "ssssshou", notes: "Mainland alternate for YouTube KFgWE-EVJo0." },
      { label: "城裡的月光 — YouTube source", platform: "youtube", url: "https://www.youtube.com/watch?v=KFgWE-EVJo0", kind: "video", isOfficial: false, credit: null },
      { label: "Angel — Bilibili P3", platform: "bilibili", url: "https://www.bilibili.com/video/BV13u411r7Vg/?p=3", kind: "video", isOfficial: false, credit: "ssssshou", notes: "Mainland alternate for YouTube KZUWBaVza-0." },
      { label: "Angel — YouTube source", platform: "youtube", url: "https://www.youtube.com/watch?v=KZUWBaVza-0", kind: "video", isOfficial: false, credit: null }
    ],
    officialRecording: false,
    sources: ["source-project-concert-reference-list", "source-ettoday-olive-tree-2014-taipei", "source-cna-olive-tree-2014-taipei", "source-pixnet-olive-tree-2014-taipei"],
    sourceQuality: "news-backed; fan clips with cross-platform alternates",
    notes: "Maintainer confirmed shell and kept YouTube 5tOEP4WCCj8, rejected YouTube x_QgBYY42G8. Each performance item has a Bilibili (Mainland alternate) and YouTube (global source) link. 公益演唱会，感念李泰祥；票房盈余捐赠慈善团体.",
    status: "partial"
  },
  {
    id: "concert-olive-tree-2014-guangzhou",
    slug: "olive-tree-2014-guangzhou",
    title: "橄欖樹2014廣州演唱會",
    date: "2014-09-27",
    venue: "Yangcheng Creative Industry Park Showcase Center, Central Station",
    city: "Guangzhou",
    countryOrRegion: "China",
    eventType: "concert",
    performers: [CHYI],
    guests: [],
    tags: ["solo"],
    setlist: [],
    mediaLinks: [
      { label: "Full fan recording (YouTube source)", platform: "youtube", url: "https://www.youtube.com/watch?v=QntwxDPtFAA", kind: "video", isOfficial: false, credit: null },
      { label: "Full fan recording (Mainland alternate)", platform: "bilibili", url: "https://www.bilibili.com/video/BV1PauhzNEyq", kind: "video", isOfficial: false, credit: "优视部落", notes: "Mainland alternate; does not state repost/source." }
    ],
    officialRecording: false,
    sources: ["source-project-concert-reference-list", "source-sina-olive-tree-2014-guangzhou"],
    sourceQuality: "news-backed; full fan recording",
    notes: "Maintainer confirmed shell and rejected YouTube x5ELT6ZdOSM (promo clip). YouTube QntwxDPtFAA is the global source; Bilibili BV1PauhzNEyq is the Mainland alternate.",
    status: "partial"
  },
  {
    id: "concert-olive-tree-2014-singapore",
    slug: "olive-tree-2014-singapore",
    title: "橄欖樹2014新加坡演唱會",
    date: "2014-12-20",
    venue: "Marina Bay Sands Theater",
    city: "Singapore",
    countryOrRegion: "Singapore",
    eventType: "concert",
    performers: [CHYI],
    guests: [],
    tags: ["solo"],
    setlist: [],
    mediaLinks: [
      { label: "民歌組曲 — YouTube source", platform: "youtube", url: "https://www.youtube.com/watch?v=frPJQ8DER5E", kind: "video", isOfficial: false, credit: null },
      { label: "民歌組曲 — Bilibili alternate", platform: "bilibili", url: "https://www.bilibili.com/video/BV1tx411Q77d", kind: "video", isOfficial: false, credit: null, notes: "Mainland alternate for YouTube frPJQ8DER5E." },
      { label: "百樂門組曲 — YouTube source", platform: "youtube", url: "https://www.youtube.com/watch?v=qUoE8U1d9K4", kind: "video", isOfficial: false, credit: null },
      { label: "百樂門組曲 — Bilibili alternate", platform: "bilibili", url: "https://www.bilibili.com/video/BV1tx411Q7Ef", kind: "video", isOfficial: false, credit: null, notes: "Mainland alternate for YouTube qUoE8U1d9K4." },
      { label: "菩提樹 clip", platform: "youtube", url: "https://www.youtube.com/watch?v=b5dR_H9zyKw", kind: "video", isOfficial: false, credit: null }
    ],
    officialRecording: false,
    sources: ["source-project-concert-reference-list", "source-biography-olive-tree-2014-singapore"],
    sourceQuality: "biography-style shell; fan clips",
    notes: "Maintainer confirmed shell and all listed media. 民歌組曲 and 百樂門組曲 each have a Bilibili/YouTube alternate pair; 菩提樹 is a standalone YouTube clip.",
    status: "partial"
  },
  {
    id: "concert-minge-classics-2015-shanghai",
    slug: "minge-classics-2015-shanghai",
    title: "兩岸校園民歌經典名曲演唱會",
    date: "2015-07-18",
    venue: "Shanghai Grand Stage",
    city: "Shanghai",
    countryOrRegion: "China",
    eventType: "festival",
    performers: ["苏芮", CHYI, "叶佳修", PAN, "李建复", "王梦麟", "王海玲", "金智娟"],
    guests: ["苏芮", "叶佳修", PAN, "李建复", "王梦麟", "王海玲", "金智娟"],
    tags: ["festival", "collaboration"],
    setlist: [],
    mediaLinks: [
      { label: "Encore segment", platform: "bilibili", url: "https://www.bilibili.com/video/BV1Gg4y1C7VU", kind: "video", isOfficial: false, credit: "古牧在线找羊" },
      { label: "走在雨中 clip", platform: "bilibili", url: "https://www.bilibili.com/video/BV1B64y1V77c", kind: "video", isOfficial: false, credit: "古牧在线找羊" }
    ],
    officialRecording: false,
    sources: ["source-project-concert-reference-list", "source-xinmin-minge-2015-shanghai", "source-tongji-minge-2015-shanghai"],
    sourceQuality: "news-backed; fan clips",
    notes: "Maintainer confirmed shell, kept both Bilibili clips, and rejected BV1Ei4y1e7Kt (慶功宴講話 clip). BV1P4411s71u preserved as a lead for another 2007 event. Multi-artist folk-song concert; most performers listed by display name because no person records exist yet.",
    status: "partial"
  },
  {
    id: "concert-huai-nian-charity-2015-singapore",
    slug: "huai-nian-charity-2015-singapore",
    title: "懷念～因為有愛 慈善演唱會",
    date: "2015-11-14",
    venue: "The Star Theatre",
    city: "Singapore",
    countryOrRegion: "Singapore",
    eventType: "concert",
    performers: [CHYI],
    guests: [CHI_CHIN, "李宗盛", "孙燕姿"],
    tags: ["charity", "collaboration"],
    setlist: [],
    mediaLinks: [
      { label: "HOME 家 — YouTube foundation source", platform: "youtube", url: "https://www.youtube.com/watch?v=oZ5RmcL9T_U", kind: "video", isOfficial: false, credit: "吴丽香纪念基金 Goh Lee Hiang Memorial Fund" },
      { label: "HOME 家 — Bilibili alternate", platform: "bilibili", url: "https://www.bilibili.com/video/BV1Nb411W7d1", kind: "video", isOfficial: false, credit: "思齐96", notes: "Mainland alternate for YouTube oZ5RmcL9T_U." },
      { label: "How Great Thou Art", platform: "youtube", url: "https://www.youtube.com/watch?v=Vps_DnxfCDw", kind: "video", isOfficial: false, credit: "吴丽香纪念基金 Goh Lee Hiang Memorial Fund" },
      { label: "橄欖樹 (齊豫&孫燕姿 short clip)", platform: "youtube", url: "https://www.youtube.com/watch?v=Uhj1biJzKNc", kind: "video", isOfficial: false, credit: null },
      { label: "愛的代價 (齊豫 李宗盛)", platform: "youtube", url: "https://www.youtube.com/watch?v=Fm8kGypX-wE", kind: "video", isOfficial: false, credit: null },
      { label: "橄欖樹 (齊豫&孫燕姿)", platform: "youtube", url: "https://www.youtube.com/watch?v=LEacDUi3UiE", kind: "video", isOfficial: false, credit: null },
      { label: "走在雨中 (現場版)", platform: "youtube", url: "https://www.youtube.com/watch?v=SYm5cL6oBJs", kind: "video", isOfficial: false, credit: null }
    ],
    officialRecording: false,
    sources: ["source-project-concert-reference-list", "source-today-huai-nian-2015-singapore", "source-rmzxw-huai-nian-2015-singapore"],
    sourceQuality: "news-backed; foundation and fan clips",
    notes: "Charity concert for Ren Ci Hospital / 仁慈医院. Maintainer confirmed shell and accepted keeps/rejects. HOME 家 has a foundation-channel YouTube source and a Bilibili Mainland alternate. 李宗盛 and 孙燕姿 listed by display name because no person records exist yet.",
    status: "partial"
  }
];

for (const concert of newConcerts) concerts.push(concert);
for (const src of newSources) if (!sources.some((s) => s.id === src.id)) sources.push(src);

fs.writeFileSync("data/concerts.json", JSON.stringify(concerts, null, 2) + "\n", "utf8");
fs.writeFileSync("data/sources.json", JSON.stringify(sources, null, 2) + "\n", "utf8");

console.log(`Imported ${newConcerts.length} batch5 concerts, ${newSources.length} sources.`);