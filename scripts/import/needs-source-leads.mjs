import fs from "node:fs";

const concerts = JSON.parse(fs.readFileSync("data/concerts.json", "utf8"));
const sources = JSON.parse(fs.readFileSync("data/sources.json", "utf8"));

const CHYI = "person-chyi-yu";
const CHI_CHIN = "person-chi-chin";

const newSources = [
  { id: "source-baidu-baike-chyi-yu-biography", sourceType: "biography", title: "Baidu Baike 齊豫 biography excerpt", authorOrPublisher: "Baidu Baike", date: null, url: "https://baike.baidu.com/item/%E9%BD%90%E8%B1%AB", accessDate: "2026-06-28", citation: null, reliability: "medium", notes: "Biography-style source used for 心幸福音乐会 2014 桃园少年辅育院 and other lead-level event mentions." },
  { id: "source-360-baike-chyi-yu-biography", sourceType: "biography", title: "360 Baike 齊豫 biography excerpt", authorOrPublisher: "360 Baike", date: null, url: "https://upimg.baike.so.com/doc/5033760-5260190.html", accessDate: "2026-06-28", citation: null, reliability: "medium", notes: "Biography-style source mirroring the 2014-04-18 桃园少年辅育院 心幸福音乐会 mention." }
];

const newConcerts = [
  {
    id: "concert-jing-dian-yin-le-ye-2019-macau",
    slug: "jing-dian-yin-le-ye-2019-macau",
    title: "齊豫·齊秦經典音樂夜",
    date: "2019-10-20",
    venue: null,
    city: "Macau",
    countryOrRegion: "Macau",
    eventType: "concert",
    performers: [CHYI, CHI_CHIN],
    guests: [CHI_CHIN],
    tags: ["collaboration"],
    setlist: [],
    mediaLinks: [],
    officialRecording: false,
    sources: ["source-project-concert-reference-list"],
    sourceQuality: "reference lead; needs independent source",
    notes: "Imported as a needs-source lead. Bilibili/YouTube searches returned unrelated Chyi Yu, Chyi Chin, 2002, or TV-program results; no reliable exact match found in this pass. Needs stronger public evidence before promotion.",
    status: "needs-source"
  },
  {
    id: "concert-tian-lai-zhi-yin-yun-ding-2008-malaysia",
    slug: "tian-lai-zhi-yin-yun-ding-2008-malaysia",
    title: "天籟之音雲頂演唱會",
    date: "2008-05",
    venue: "Arena of the Stars",
    city: "Genting Highlands",
    countryOrRegion: "Malaysia",
    eventType: "concert",
    performers: [CHYI],
    guests: [],
    tags: ["solo"],
    setlist: [],
    mediaLinks: [],
    officialRecording: false,
    sources: ["source-project-concert-reference-list"],
    sourceQuality: "reference lead; needs independent source",
    notes: "Imported as a needs-source lead. The 2008 reference row may conflict with the 2011 天籟之音绕云顶 evidence; maintainer chose not to merge this into the 2008 经典好听 shell and to treat 2011 evidence as a likely separate future event lead. Exact 2008 source not found.",
    status: "needs-source"
  },
  {
    id: "concert-xin-xing-fu-2013-pingdong",
    slug: "xin-xing-fu-2013-pingdong",
    title: "心幸福音樂會",
    date: "2013-04-24",
    venue: null,
    city: "Pingtung",
    countryOrRegion: "Taiwan",
    eventType: "concert",
    performers: [CHYI],
    guests: [],
    tags: ["charity", "solo"],
    setlist: [],
    mediaLinks: [],
    officialRecording: false,
    sources: ["source-project-concert-reference-list"],
    sourceQuality: "reference lead; needs independent source",
    notes: "Imported as a needs-source lead. Targeted search returned the 2012-04-12 台南监狱 event, later 2014 桃园少年辅育院 references, and unrelated 2025 屏东民歌 results; no public Bilibili or YouTube performance candidate retained.",
    status: "needs-source"
  },
  {
    id: "concert-xin-xing-fu-2014-taoyuan",
    slug: "xin-xing-fu-2014-taoyuan",
    title: "心幸福音樂會·齊豫唱心歌",
    date: "2014-04-18",
    venue: "Taoyuan Youth Correctional Institution",
    city: "Taoyuan",
    countryOrRegion: "Taiwan",
    eventType: "concert",
    performers: [CHYI],
    guests: [],
    tags: ["charity", "solo"],
    setlist: [],
    mediaLinks: [],
    officialRecording: false,
    sources: ["source-project-concert-reference-list", "source-baidu-baike-chyi-yu-biography", "source-360-baike-chyi-yu-biography"],
    sourceQuality: "reference lead; biography-style evidence only",
    notes: "Imported as a needs-source lead. Reference row said 台北, but biography-style evidence consistently points to 桃园少年辅育院; maintainer confirmed correcting the place and keeping as needs-source because no primary news article was located.",
    status: "needs-source"
  },
  {
    id: "concert-xin-xing-fu-2016-yilan",
    slug: "xin-xing-fu-2016-yilan",
    title: "心幸福音樂會",
    date: "2016-04-14",
    venue: "Yilan Prison",
    city: "Yilan",
    countryOrRegion: "Taiwan",
    eventType: "concert",
    performers: [CHYI],
    guests: [],
    tags: ["charity", "solo"],
    setlist: [],
    mediaLinks: [],
    officialRecording: false,
    sources: ["source-project-concert-reference-list"],
    sourceQuality: "reference lead; needs independent source",
    notes: "Imported as a needs-source lead. Biography excerpts mention 法鼓山人文社会基金会 心幸福音乐会 at 宜兰监狱, but no primary page was located. No performance media found.",
    status: "needs-source"
  },
  {
    id: "concert-xin-xing-fu-2017-taizhong",
    slug: "xin-xing-fu-2017-taizhong",
    title: "心幸福音樂會",
    date: "2017-05-03",
    venue: null,
    city: "Taichung",
    countryOrRegion: "Taiwan",
    eventType: "concert",
    performers: [CHYI],
    guests: [],
    tags: ["charity", "solo"],
    setlist: [],
    mediaLinks: [],
    officialRecording: false,
    sources: ["source-project-concert-reference-list"],
    sourceQuality: "reference lead; needs independent source",
    notes: "Imported as a needs-source lead. Search results surfaced a 2014 法鼓山 台中戒治所 心幸福 lead, but not a clean 2017-05-03 public source. No performance media found.",
    status: "needs-source"
  },
  {
    id: "concert-ai-ci-bei-guan-huai-2024-changhua",
    slug: "ai-ci-bei-guan-huai-2024-changhua",
    title: "愛、慈悲與關懷音樂會",
    date: "2024-11-06",
    venue: null,
    city: "Changhua",
    countryOrRegion: "Taiwan",
    eventType: "concert",
    performers: [CHYI],
    guests: [],
    tags: ["charity", "solo"],
    setlist: [],
    mediaLinks: [],
    officialRecording: false,
    sources: ["source-project-concert-reference-list"],
    sourceQuality: "reference lead; needs independent source",
    notes: "Imported as a needs-source lead. Reference row gives 2024-11-06 彰化; Bilibili/YouTube searches mostly found older unrelated 慈悲/关怀 charity performances. No performance media found.",
    status: "needs-source"
  },
  {
    id: "concert-a-na-ya-sanya-2025-hainan",
    slug: "a-na-ya-sanya-2025-hainan",
    title: "阿那亞・三亞新春音樂會",
    date: "2025-02-02",
    venue: "Aranya Sanya",
    city: "Sanya",
    countryOrRegion: "China",
    eventType: "concert",
    performers: [CHYI],
    guests: [],
    tags: ["solo"],
    setlist: [],
    mediaLinks: [],
    officialRecording: false,
    sources: ["source-project-concert-reference-list"],
    sourceQuality: "reference lead; needs independent source",
    notes: "Imported as a needs-source lead. Reference row gives 2025-02-02 阿那亚·三亚新春音乐会 海南; Bilibili/YouTube searches returned unrelated 阿那亚 content or no results. No performance media found.",
    status: "needs-source"
  }
];

for (const concert of newConcerts) concerts.push(concert);
for (const src of newSources) if (!sources.some((s) => s.id === src.id)) sources.push(src);

fs.writeFileSync("data/concerts.json", JSON.stringify(concerts, null, 2) + "\n", "utf8");
fs.writeFileSync("data/sources.json", JSON.stringify(sources, null, 2) + "\n", "utf8");

console.log(`Imported ${newConcerts.length} needs-source leads, ${newSources.length} sources.`);