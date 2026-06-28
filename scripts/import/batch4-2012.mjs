import fs from "node:fs";

const concerts = JSON.parse(fs.readFileSync("data/concerts.json", "utf8"));
const sources = JSON.parse(fs.readFileSync("data/sources.json", "utf8"));

const CHYI = "person-chyi-yu";
const PAN = "person-pan-yue-yun";
const WAKIN = "person-wakin-chau";
const WU_BAI = "person-wu-bai";
const CHI_CHIN = "person-chi-chin";

const newSources = [
  { id: "source-epochtimes-yun-duan-2012-taipei", sourceType: "news", title: "Epoch Times post-event report on 云端演唱会 2012-02-11", authorOrPublisher: "Epoch Times", date: "2012-02-12", url: "https://www.epochtimes.com/gb/12/2/12/n3510454.htm", accessDate: "2026-06-28", citation: null, reliability: "high", notes: "Reports Chyi Yu held a small 云端-themed concert on 2012-02-11 in a Live House, ~90 minutes, nearly 20 songs." },
  { id: "source-cts-yun-duan-2012-taipei", sourceType: "news", title: "CTS News report on 2012-02-11 云端演唱会", authorOrPublisher: "CTS News", date: "2012-02-12", url: "https://news.cts.com.tw/cts/entertain/201202/201202120934691.html", accessDate: "2026-06-28", citation: null, reliability: "high", notes: "Reports Chyi Yu performed the prior night at 台北华山艺文中心." },
  { id: "source-pixnet-yun-duan-2012-taipei", sourceType: "attendee-report", title: "Attendee blog: 2012/2/11 齊豫雲端演唱會", authorOrPublisher: "ned921 (Pixnet)", date: "2012-02-11", url: "https://ned921.pixnet.net/blog/posts/4036302726", accessDate: "2026-06-28", citation: null, reliability: "medium", notes: "Blog title gives 2012/2/11 齊豫雲端演唱會 and says venue was 华山艺文中心 Legacy." },
  { id: "source-epochtimes-xin-xing-fu-2012-tainan", sourceType: "news", title: "Epoch Times / Central News Agency report on 心幸福音乐会 台南监狱 2012-04-12", authorOrPublisher: "Epoch Times", date: "2012-04-12", url: "https://www.epochtimes.com/gb/12/4/12/n3563997.htm", accessDate: "2026-06-28", citation: null, reliability: "high", notes: "Reports 法鼓山人文社会基金会 and Ministry of Justice held 心幸福音乐会 at 台南监狱 on 2012-04-12, inviting Chyi Yu." },
  { id: "source-bilibili-xin-xing-fu-2012-tainan", sourceType: "platform-metadata", title: "Bilibili BV1vx411e76P (20120412 心幸福音乐会)", authorOrPublisher: "WeAreLambily (Bilibili uploader)", date: null, url: "https://www.bilibili.com/video/BV1vx411e76P/", accessDate: "2026-06-28", citation: null, reliability: "medium-high", notes: "Title/description match 2012-04-12 心幸福音乐会; 台南 confirmed by news shell evidence, not by video metadata." },
  { id: "source-blogspot-zhen-ai-nv-ren-2012-macau", sourceType: "attendee-report", title: "Attendee blog: Power Woman 珍爱女人 澳门 2012-04-28", authorOrPublisher: "amour322 (Blogspot)", date: "2012-04-28", url: "http://amour322.blogspot.com/2012/04/power-woman.html", accessDate: "2026-06-28", citation: null, reliability: "medium-high", notes: "Gives date 2012-04-28 and venue 澳门威尼斯人金光综艺馆; lists Chyi Yu, Wan Fang, Pan Yue-yun, Shunza." },
  { id: "source-wikipedia-venetian-macau-venue-list", sourceType: "venue-event-list", title: "Venetian Macao Coati Hall venue list (Wikipedia)", authorOrPublisher: "Wikipedia", date: null, url: "https://zh.wikipedia.org/zh-hans/%E5%A8%81%E5%B0%BC%E6%96%AF%E4%BA%BA%E7%B6%9C%E8%97%9D%E9%A4%A8", accessDate: "2026-06-28", citation: null, reliability: "medium", notes: "Lists POWER WOMAN 珍爱女人巡回演唱会 澳门站 2012/04/28 with 齐豫、潘越云、万芳、顺子." },
  { id: "source-hangzhou-com-rollings-tone-30-2012-hangzhou", sourceType: "news", title: "Hangzhou.com artist announcement for 滚石30 杭州 2012-07-21", authorOrPublisher: "Hangzhou.com", date: "2012-06-19", url: "https://hznews.hangzhou.com.cn/wenti/content/2012-06/19/content_4251585_0.htm", accessDate: "2026-06-28", citation: null, reliability: "high", notes: "Reports 2012-07-21 at 黄龙体育场 and lists Chyi Yu among first announced artists." },
  { id: "source-zjol-rollings-tone-30-2012-hangzhou-traffic", sourceType: "news", title: "Zhejiang Online traffic notice for 滚石30 杭州 2012-07-21", authorOrPublisher: "Zhejiang Online", date: "2012-07-19", url: "http://zjnews.zjol.com.cn/system/2012/07/19/018670432.shtml", accessDate: "2026-06-28", citation: null, reliability: "high", notes: "Confirms 2012-07-21 18:00-23:00 at 黄龙体育中心." },
  { id: "source-chinanews-rollings-tone-30-2012-chengdu", sourceType: "news", title: "China News preview for 滚石30 成都 2012-08-11", authorOrPublisher: "China News", date: "2012-08-03", url: "https://www.chinanews.com.cn/yl/2012/08-03/4080871.shtml", accessDate: "2026-06-28", citation: null, reliability: "high", notes: "Confirms Rolling Stone 30 would land at 成都体育中心 on 2012-08-11." },
  { id: "source-cnhubei-rollings-tone-30-2012-wuhan", sourceType: "news", title: "Cnhubei preview for 滚石30 武汉 2012-10-20", authorOrPublisher: "Cnhubei", date: "2012-08-22", url: "http://news.cnhubei.com/xw/wh/201208/t2206349.shtml", accessDate: "2026-06-28", citation: null, reliability: "medium-high", notes: "Reports 2012-10-20 at 武汉体育中心." },
  { id: "source-baike-so-rollings-tone-30-2012-wuhan", sourceType: "secondary-encyclopedia", title: "360/Baidu-style artist list for 滚石30 武汉", authorOrPublisher: "baike.so.com", date: null, url: "https://baike.so.com/doc/7013463-7236350.html", accessDate: "2026-06-28", citation: null, reliability: "medium", notes: "Lists Rolling Stone 30 Wuhan first confirmed artists including Chyi Yu." },
  { id: "source-sina-rollings-tone-30-2012-guangzhou", sourceType: "news", title: "Sina / New Express preview for 滚石30 广州 2012-12-08", authorOrPublisher: "Sina", date: "2012-09-07", url: "https://ent.sina.cn/music/ygangtai/2012-09-07/detail-icesifvx4349351.d.html", accessDate: "2026-06-28", citation: null, reliability: "high", notes: "Reports Rolling Stone 30 Guangzhou would be held 2012-12-08 at 天河体育场." },
  { id: "source-c114-rollings-tone-30-2012-guangzhou", sourceType: "news", title: "C114 post-event report on 滚石30 广州 finale 2012-12-08", authorOrPublisher: "C114", date: "2012-12-08", url: "https://m.c114.com.cn/w41-734105.html", accessDate: "2026-06-28", citation: null, reliability: "medium-high", notes: "Reports 2012-12-08 Guangzhou finale and explicitly lists Chyi Yu among performers." },
  { id: "source-epochtimes-rollings-tone-30-2012-guangzhou", sourceType: "photo-gallery-news", title: "Epoch Times gallery/report on 滚石30 广州 2012-12-08", authorOrPublisher: "Epoch Times", date: "2012-12-11", url: "https://www.epochtimes.com/b5/12/12/11/n3750301.htm", accessDate: "2026-06-28", citation: null, reliability: "medium-high", notes: "Reports the 2012-12-08 Guangzhou finale and lists Chyi Yu among performers." }
];

const newConcerts = [
  {
    id: "concert-yun-duan-2012-taipei",
    slug: "yun-duan-2012-taipei",
    title: "雲端演唱會",
    date: "2012-02-11",
    venue: "Huashan Art Center Legacy Taipei",
    city: "Taipei",
    countryOrRegion: "Taiwan",
    eventType: "concert",
    performers: [CHYI],
    guests: [],
    tags: ["solo"],
    setlist: [],
    mediaLinks: [],
    officialRecording: false,
    sources: ["source-project-concert-reference-list", "source-epochtimes-yun-duan-2012-taipei", "source-cts-yun-duan-2012-taipei", "source-pixnet-yun-duan-2012-taipei"],
    sourceQuality: "news-backed; no public media found",
    notes: "Maintainer confirmed the shell and rejected YouTube QvOnod7ZS7Y as a news clip, not performance media. Small Live House concert, ~90 minutes, nearly 20 songs.",
    status: "partial"
  },
  {
    id: "concert-xin-xing-fu-2012-tainan",
    slug: "xin-xing-fu-2012-tainan",
    title: "心幸福音樂會",
    date: "2012-04-12",
    venue: "Tainan Prison",
    city: "Tainan",
    countryOrRegion: "Taiwan",
    eventType: "concert",
    performers: [CHYI],
    guests: [],
    tags: ["charity", "solo"],
    setlist: [],
    mediaLinks: [
      { label: "20120412 聆听心灵的奇遇·齐豫心幸福演唱会", platform: "bilibili", url: "https://www.bilibili.com/video/BV1vx411e76P/", kind: "video", isOfficial: false, credit: "WeAreLambily" }
    ],
    officialRecording: false,
    sources: ["source-project-concert-reference-list", "source-epochtimes-xin-xing-fu-2012-tainan", "source-bilibili-xin-xing-fu-2012-tainan"],
    sourceQuality: "news-backed; fan-upload",
    notes: "Maintainer confirmed shell and kept Bilibili BV1vx411e76P. Venue/city from news shell evidence; Bilibili metadata confirms date/title. Charity concert at 台南监狱 organized by 法鼓山人文社会基金会 and Ministry of Justice.",
    status: "partial"
  },
  {
    id: "concert-zhen-ai-nv-ren-2012-macau",
    slug: "zhen-ai-nv-ren-2012-macau",
    title: "Power Woman 珍愛女人巡迴演唱會 澳門站",
    date: "2012-04-28",
    venue: "Venetian Macao Coati Hall",
    city: "Macau",
    countryOrRegion: "Macau",
    eventType: "concert",
    performers: [CHYI, PAN, "万芳", "顺子"],
    guests: [PAN, "万芳", "顺子"],
    tags: ["collaboration", "concert-series"],
    setlist: [],
    mediaLinks: [],
    officialRecording: false,
    sources: ["source-project-concert-reference-list", "source-blogspot-zhen-ai-nv-ren-2012-macau", "source-wikipedia-venetian-macau-venue-list"],
    sourceQuality: "news-backed; no 2012 media found",
    notes: "Maintainer confirmed shell and rejected all media for this 2012 Macau event. 2017 Macau 珍爱女人 clips belong to a separate event (Batch 6). 2009 Genting 珍爱女人 clips are a separate future lead.",
    status: "partial"
  },
  {
    id: "concert-rollings-tone-30-2012-hangzhou",
    slug: "rollings-tone-30-2012-hangzhou",
    title: "2012 滾石30 杭州演唱會",
    date: "2012-07-21",
    venue: "Huanglong Sports Center Stadium",
    city: "Hangzhou",
    countryOrRegion: "China",
    eventType: "festival",
    performers: [CHYI, WAKIN, PAN, "任贤齐", "黄品源", "阿牛", "杨乃文", WU_BAI, "辛晓琪", "赵咏华", "万芳"],
    guests: [WAKIN, PAN, "任贤齐", "黄品源", "阿牛", "杨乃文", WU_BAI, "辛晓琪", "赵咏华", "万芳"],
    tags: ["festival", "collaboration", "anniversary"],
    setlist: [],
    mediaLinks: [],
    officialRecording: false,
    sources: ["source-project-concert-reference-list", "source-hangzhou-com-rollings-tone-30-2012-hangzhou", "source-zjol-rollings-tone-30-2012-hangzhou-traffic"],
    sourceQuality: "news-backed; no Chyi Yu media found",
    notes: "Maintainer confirmed shell and rejected unrelated Shanghai/Taipei Rolling Stone media candidates.",
    status: "partial"
  },
  {
    id: "concert-rollings-tone-30-2012-chengdu",
    slug: "rollings-tone-30-2012-chengdu",
    title: "全城熱戀 滾石30 成都演唱會",
    date: "2012-08-11",
    venue: "Chengdu Sports Center",
    city: "Chengdu",
    countryOrRegion: "China",
    eventType: "festival",
    performers: [CHYI, WAKIN, PAN, "任贤齐", "张震岳", "万芳", "辛晓琪", "赵咏华"],
    guests: [WAKIN, PAN, "任贤齐", "张震岳", "万芳", "辛晓琪", "赵咏华"],
    tags: ["festival", "collaboration", "anniversary"],
    setlist: [],
    mediaLinks: [],
    officialRecording: false,
    sources: ["source-project-concert-reference-list", "source-chinanews-rollings-tone-30-2012-chengdu"],
    sourceQuality: "news-backed; no Chyi Yu media found",
    notes: "Maintainer confirmed shell and rejected unrelated 1993 Chyi Chin Chengdu videos.",
    status: "partial"
  },
  {
    id: "concert-rollings-tone-30-2012-wuhan",
    slug: "rollings-tone-30-2012-wuhan",
    title: "2012 滾石30 武漢演唱會",
    date: "2012-10-20",
    venue: "Wuhan Sports Center Stadium (Zhuankou)",
    city: "Wuhan",
    countryOrRegion: "China",
    eventType: "festival",
    performers: [CHYI, WAKIN, "张震岳", "任贤齐", "五月天", "杜德伟", PAN, "梁静茹", "辛晓琪", "陈绮贞", "赵咏华", "万芳"],
    guests: [WAKIN, "张震岳", "任贤齐", "五月天", "杜德伟", PAN, "梁静茹", "辛晓琪", "陈绮贞", "赵咏华", "万芳"],
    tags: ["festival", "collaboration", "anniversary"],
    setlist: [],
    mediaLinks: [],
    officialRecording: false,
    sources: ["source-project-concert-reference-list", "source-cnhubei-rollings-tone-30-2012-wuhan", "source-baike-so-rollings-tone-30-2012-wuhan"],
    sourceQuality: "news-backed; no Chyi Yu media found",
    notes: "Maintainer confirmed shell and rejected the Shanghai 2011 clip for this Wuhan item.",
    status: "partial"
  },
  {
    id: "concert-rollings-tone-30-2012-guangzhou",
    slug: "rollings-tone-30-2012-guangzhou",
    title: "滾石30 廣州演唱會",
    date: "2012-12-08",
    venue: "Tianhe Stadium",
    city: "Guangzhou",
    countryOrRegion: "China",
    eventType: "festival",
    performers: [CHYI, CHI_CHIN, "张震岳", "顺子", "任贤齐", "光良", "品冠", "刘若英", WAKIN, WU_BAI, PAN, "万芳", "陈绮贞"],
    guests: [CHI_CHIN, "张震岳", "顺子", "任贤齐", "光良", "品冠", "刘若英", WAKIN, WU_BAI, PAN, "万芳", "陈绮贞"],
    tags: ["festival", "collaboration", "anniversary"],
    setlist: [],
    mediaLinks: [],
    officialRecording: false,
    sources: ["source-project-concert-reference-list", "source-sina-rollings-tone-30-2012-guangzhou", "source-c114-rollings-tone-30-2012-guangzhou", "source-epochtimes-rollings-tone-30-2012-guangzhou"],
    sourceQuality: "news-backed; no Chyi Yu media found",
    notes: "Maintainer confirmed shell and rejected the promo/thanks clip and unrelated Shanghai 2011 clip. Rolling Stone 30 tour finale.",
    status: "partial"
  }
];

for (const concert of newConcerts) concerts.push(concert);
for (const src of newSources) if (!sources.some((s) => s.id === src.id)) sources.push(src);

fs.writeFileSync("data/concerts.json", JSON.stringify(concerts, null, 2) + "\n", "utf8");
fs.writeFileSync("data/sources.json", JSON.stringify(sources, null, 2) + "\n", "utf8");

console.log(`Imported ${newConcerts.length} batch4 concerts, ${newSources.length} sources.`);