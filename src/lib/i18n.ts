import { archiveLinkDisplayParts, byId, people, releaseCategoryTags } from "./archive";
import { concertCategoryTags } from "./archive";
import type { AlbumRecord } from "./archive";
import type {
  ArchiveLink,
  Appearance,
  Concert,
  ConcertCategory,
  ConcertGroupKind,
  ConcertNature,
  LocalizedText,
  MusicShow,
  Person,
  Release,
  Song,
  SongPerformance,
  Track
} from "./archive";
import { appearances, concerts, musicShows, releases, songs } from "./archive";

export const locales = ["en", "zh-Hant", "zh-Hans"] as const;
export type Locale = (typeof locales)[number];
export type LocaleValues = Record<Locale, string>;

export const languageOptions: Array<{
  locale: Locale;
  shortLabel: string;
  label: LocaleValues;
}> = [
  {
    locale: "en",
    shortLabel: "EN",
    label: {
      en: "English",
      "zh-Hant": "英文",
      "zh-Hans": "英文"
    }
  },
  {
    locale: "zh-Hant",
    shortLabel: "繁",
    label: {
      en: "Traditional Chinese",
      "zh-Hant": "繁體中文",
      "zh-Hans": "繁体中文"
    }
  },
  {
    locale: "zh-Hans",
    shortLabel: "简",
    label: {
      en: "Simplified Chinese",
      "zh-Hant": "簡體中文",
      "zh-Hans": "简体中文"
    }
  }
];

const ui = {
  "site.title": {
    en: "All for Chyi Yu",
    "zh-Hant": "齊豫資料館",
    "zh-Hans": "齐豫资料馆"
  },
  "site.description": {
    en: "All for Chyi Yu: a quiet fan archive of releases, concerts, appearances, people, sources, and links.",
    "zh-Hant": "齊豫資料館：整理專輯、演唱會、演出、人物、來源與外部連結的歌迷資料庫。",
    "zh-Hans": "齐豫资料馆：整理专辑、演唱会、演出、人物、来源与外部链接的歌迷资料库。"
  },
  "site.footer": {
    en: "Fan archive index. Metadata and links only; no hosted audio or video.",
    "zh-Hant": "歌迷資料索引。僅收錄後設資料與外部連結，不託管音訊或影片。",
    "zh-Hans": "歌迷资料索引。仅收录元数据与外部链接，不托管音频或视频。"
  },
  "nav.search": { en: "Search", "zh-Hant": "搜尋", "zh-Hans": "搜索" },
  "nav.sources": { en: "Sources", "zh-Hant": "來源", "zh-Hans": "来源" },
  "nav.releases": { en: "Releases", "zh-Hant": "音樂發行", "zh-Hans": "音乐发行" },
  "nav.concerts": { en: "Concerts", "zh-Hant": "演唱會", "zh-Hans": "演唱会" },
  "nav.musicShows": { en: "Music shows", "zh-Hant": "音樂節目", "zh-Hans": "音乐节目" },
  "nav.appearances": { en: "Appearances", "zh-Hant": "其他演出", "zh-Hans": "其他演出" },
  "nav.people": { en: "People", "zh-Hant": "人物", "zh-Hans": "人物" },
  "nav.statistics": { en: "Statistics", "zh-Hant": "統計", "zh-Hans": "统计" },
  "nav.contribute": { en: "Contribute", "zh-Hant": "貢獻", "zh-Hans": "贡献" },
  "nav.about": { en: "About", "zh-Hant": "關於", "zh-Hans": "关于" },
  "nav.menu": { en: "Menu", "zh-Hant": "選單", "zh-Hans": "菜单" },
  "page.home.intro": {
    en: "Releases, concerts, music shows, appearances, people, and source-backed links.",
    "zh-Hant": "收錄發行、演唱會、音樂節目、其他出現、人物與有來源支持的連結。",
    "zh-Hans": "收录发行、演唱会、音乐节目、其他出现、人物与有来源支持的链接。"
  },
  "home.releases.text": {
    en: "Albums, singles, compilations, collaborations, and related releases.",
    "zh-Hant": "專輯、單曲、合輯、合作與相關音樂發行。",
    "zh-Hans": "专辑、单曲、合辑、合作与相关音乐发行。"
  },
  "home.concerts.text": {
    en: "Concerts, concert series, setlists, and show links.",
    "zh-Hant": "演唱會、系列演出、曲目表與演出連結。",
    "zh-Hans": "演唱会、系列演出、曲目表与演出链接。"
  },
  "home.musicShows.text": {
    en: "Televised, streamed, and radio music-show performances.",
    "zh-Hant": "電視、串流與廣播音樂節目演出。",
    "zh-Hans": "电视、流媒体与广播音乐节目演出。"
  },
  "home.appearances.text": {
    en: "Talk shows, film soundtrack work, podcasts, interviews, and other appearances.",
    "zh-Hant": "談話節目、電影原聲工作、Podcast、專訪與其他演出。",
    "zh-Hans": "谈话节目、电影原声工作、播客、专访与其他演出。"
  },
  "home.people.text": {
    en: "Writers, composers, producers, collaborators, hosts, and other credits.",
    "zh-Hant": "作詞、作曲、製作、合作、主持與其他工作人員。",
    "zh-Hans": "作词、作曲、制作、合作、主持与其他工作人员。"
  },
  "home.statistics.text": {
    en: "Song performance counts, distribution summaries, and source coverage.",
    "zh-Hant": "歌曲演出次數、分布摘要與來源覆蓋。",
    "zh-Hans": "歌曲演出次数、分布摘要与来源覆盖。"
  },
  "page.releases.intro": {
    en: "Albums by default, with songs available as an expandable identity view.",
    "zh-Hant": "預設顯示專輯，也可切換到可展開的歌曲身份視圖。",
    "zh-Hans": "默认显示专辑，也可切换到可展开的歌曲身份视图。"
  },
  "page.search.intro": {
    en: "Search songs, albums, concerts, and people.",
    "zh-Hant": "搜尋歌曲、專輯、演唱會與人物。",
    "zh-Hans": "搜索歌曲、专辑、演唱会与人物。"
  },
  "page.concerts.intro": {
    en: "Concerts, concert series, setlists, and show-level links.",
    "zh-Hant": "演唱會、系列演出、曲目表與演出層級連結。",
    "zh-Hans": "演唱会、系列演出、曲目表与演出层级链接。"
  },
  "page.musicShows.intro": {
    en: "Televised, streamed, and radio music-show performances.",
    "zh-Hant": "電視、串流與廣播音樂節目演出。",
    "zh-Hans": "电视、流媒体与广播音乐节目演出。"
  },
  "page.appearances.intro": {
    en: "Talk shows, film soundtrack work, podcasts, interviews, documentaries, and other appearances.",
    "zh-Hant": "談話節目、電影原聲工作、Podcast、專訪、紀錄片與其他演出。",
    "zh-Hans": "谈话节目、电影原声工作、播客、专访、纪录片与其他演出。"
  },
  "page.people.intro": {
    en: "Writers, composers, producers, collaborators, hosts, and other credits.",
    "zh-Hant": "作詞、作曲、製作、合作、主持與其他工作人員。",
    "zh-Hans": "作词、作曲、制作、合作、主持与其他工作人员。"
  },
  "page.sources.intro": {
    en: "Appendix for citations, reliability notes, and external reference links.",
    "zh-Hant": "引用、可信度備註與外部參考連結附錄。",
    "zh-Hans": "引用、可信度备注与外部参考链接附录。"
  },
  "page.statistics.intro": {
    en: "Counts from the current reviewed dataset, including live song records and source coverage.",
    "zh-Hant": "目前已審核資料集的統計，包含現場歌曲紀錄與來源覆蓋。",
    "zh-Hans": "当前已审核数据集的统计，包含现场歌曲记录与来源覆盖。"
  },
  "label.view": { en: "View", "zh-Hant": "檢視", "zh-Hans": "视图" },
  "label.sort": { en: "Sort", "zh-Hant": "排序", "zh-Hans": "排序" },
  "label.filter": { en: "Filter", "zh-Hant": "篩選", "zh-Hans": "筛选" },
  "label.category": { en: "Category", "zh-Hant": "分類", "zh-Hans": "分类" },
  "label.sortTracks": { en: "Sort tracks", "zh-Hant": "曲目排序", "zh-Hans": "曲目排序" },
  "label.keyword": { en: "Keyword", "zh-Hant": "關鍵字", "zh-Hans": "关键词" },
  "label.section": { en: "Section", "zh-Hant": "分類", "zh-Hans": "分类" },
  "label.search": { en: "Search", "zh-Hant": "搜尋", "zh-Hans": "搜索" },
  "label.type": { en: "Type", "zh-Hant": "類型", "zh-Hans": "类型" },
  "label.reliability": { en: "Reliability", "zh-Hant": "可信度", "zh-Hans": "可信度" },
  "label.date": { en: "Date", "zh-Hant": "日期", "zh-Hans": "日期" },
  "label.location": { en: "Location", "zh-Hant": "地點", "zh-Hans": "地点" },
  "label.venue": { en: "Venue", "zh-Hant": "場館", "zh-Hans": "场馆" },
  "label.artist": { en: "Artist", "zh-Hant": "藝人", "zh-Hans": "艺人" },
  "label.producer": { en: "Producer", "zh-Hant": "製作人", "zh-Hans": "制作人" },
  "label.label": { en: "Label", "zh-Hant": "廠牌", "zh-Hans": "厂牌" },
  "label.formats": { en: "Formats", "zh-Hant": "格式", "zh-Hans": "格式" },
  "label.program": { en: "Program", "zh-Hant": "節目", "zh-Hans": "节目" },
  "label.platform": { en: "Platform", "zh-Hant": "平台", "zh-Hans": "平台" },
  "label.region": { en: "Region", "zh-Hant": "地區", "zh-Hans": "地区" },
  "label.physicalFormats": { en: "Physical formats", "zh-Hant": "實體格式", "zh-Hans": "实体格式" },
  "label.episode": { en: "Episode", "zh-Hant": "集數", "zh-Hans": "集数" },
  "label.collaborators": { en: "Collaborators", "zh-Hant": "合作者", "zh-Hans": "合作者" },
  "label.coPerformers": { en: "Co-performers", "zh-Hant": "共同演出者", "zh-Hans": "共同演出者" },
  "label.guests": { en: "Guests", "zh-Hant": "嘉賓", "zh-Hans": "嘉宾" },
  "label.role": { en: "Role", "zh-Hant": "角色", "zh-Hans": "角色" },
  "label.work": { en: "Work", "zh-Hant": "作品", "zh-Hans": "作品" },
  "label.programOrWork": { en: "Program or work", "zh-Hant": "節目或作品", "zh-Hans": "节目或作品" },
  "label.lyrics": { en: "Lyrics", "zh-Hant": "作詞", "zh-Hans": "作词" },
  "label.music": { en: "Music", "zh-Hant": "作曲", "zh-Hans": "作曲" },
  "label.credits": { en: "Credits", "zh-Hant": "工作人員", "zh-Hans": "工作人员" },
  "label.duration": { en: "Duration", "zh-Hant": "時長", "zh-Hans": "时长" },
  "label.songIdentity": { en: "Song identity", "zh-Hant": "歌曲身份", "zh-Hans": "歌曲身份" },
  "label.officialRelease": { en: "Official release", "zh-Hant": "正式發行", "zh-Hans": "正式发行" },
  "label.hosts": { en: "Hosts", "zh-Hant": "主持人", "zh-Hans": "主持人" },
  "label.workReleaseDate": { en: "Work release date", "zh-Hant": "作品上映日期", "zh-Hans": "作品上映日期" },
  "label.directors": { en: "Director", "zh-Hant": "導演", "zh-Hans": "导演" },
  "label.leadingCast": { en: "Leading cast", "zh-Hant": "主演", "zh-Hans": "主演" },
  "label.originalPerformer": { en: "Original performer", "zh-Hant": "原唱", "zh-Hans": "原唱" },
  "label.performedBy": { en: "Performed by", "zh-Hant": "演唱", "zh-Hans": "演唱" },
  "label.coPerformedBy": { en: "Co-performed by", "zh-Hant": "共同演唱", "zh-Hans": "共同演唱" },
  "label.relationships": { en: "Relationships", "zh-Hant": "關聯", "zh-Hans": "关联" },
  "label.roles": { en: "Roles", "zh-Hant": "角色", "zh-Hans": "角色" },
  "label.aliases": { en: "Aliases", "zh-Hant": "別名", "zh-Hans": "别名" },
  "label.status": { en: "Status", "zh-Hant": "狀態", "zh-Hans": "状态" },
  "label.availability": { en: "Availability", "zh-Hant": "可用來源", "zh-Hans": "可用来源" },
  "label.purchase": { en: "Purchase", "zh-Hant": "購買", "zh-Hans": "购买" },
  "label.streaming": { en: "Streaming", "zh-Hant": "串流平台", "zh-Hans": "流媒体平台" },
  "label.links": { en: "Links", "zh-Hant": "連結", "zh-Hans": "链接" },
  "label.showLinks": { en: "Show links", "zh-Hant": "演出連結", "zh-Hans": "演出链接" },
  "label.linkNotice": {
    en: "Links point to third-party platforms. Copyright belongs to the original rights holders; please support the uploader and official sources on the original platform.",
    "zh-Hant": "連結指向第三方平台。版權歸原權利人所有；請在原平台支持上傳者與官方來源。",
    "zh-Hans": "链接指向第三方平台。版权归原权利人所有；请在原平台支持上传者与官方来源。"
  },
  "label.watchLinks": { en: "Watch links", "zh-Hant": "觀看連結", "zh-Hans": "观看链接" },
  "label.releaseLinks": { en: "Release links", "zh-Hant": "發行連結", "zh-Hans": "发行链接" },
  "label.clipLinks": { en: "Clip links", "zh-Hant": "片段連結", "zh-Hans": "片段链接" },
  "label.liveRecords": { en: "Live records", "zh-Hant": "現場紀錄", "zh-Hans": "现场记录" },
  "label.tracks": { en: "Tracks", "zh-Hant": "曲目", "zh-Hans": "曲目" },
  "label.appearanceTracks": { en: "Appearance tracks", "zh-Hant": "演出曲目", "zh-Hans": "演出曲目" },
  "label.songs": { en: "Songs", "zh-Hant": "歌曲", "zh-Hans": "歌曲" },
  "label.albums": { en: "Albums", "zh-Hant": "專輯", "zh-Hans": "专辑" },
  "label.clips": { en: "Clips", "zh-Hant": "片段", "zh-Hans": "片段" },
  "label.notes": { en: "Notes", "zh-Hant": "備註", "zh-Hans": "备注" },
  "label.contribute": { en: "Contribute", "zh-Hant": "貢獻", "zh-Hans": "贡献" },
  "contribution.recordText": {
    en: "Send a sourced correction or link for this record.",
    "zh-Hant": "為這筆紀錄送出有來源的修正或連結。",
    "zh-Hans": "为这条记录提交有来源的修正或链接。"
  },
  "contribution.releaseText": {
    en: "Propose a missing release or track-level addition with source links.",
    "zh-Hant": "提交缺少的發行或曲目層級補充，並附上來源連結。",
    "zh-Hans": "提交缺少的发行或曲目层级补充，并附上来源链接。"
  },
  "contribution.concertText": {
    en: "Propose a missing concert or concert-series record with date, location, and sources.",
    "zh-Hant": "提交缺少的演唱會或系列演出紀錄，包含日期、地點與來源。",
    "zh-Hans": "提交缺少的演唱会或系列演出记录，包含日期、地点与来源。"
  },
  "contribution.musicShowText": {
    en: "Propose a missing broadcast, streamed, or radio music-show performance with sources.",
    "zh-Hant": "提交缺少的電視、串流或廣播音樂節目演出，並附上來源。",
    "zh-Hans": "提交缺少的电视、流媒体或广播音乐节目演出，并附上来源。"
  },
  "contribution.appearanceText": {
    en: "Propose a missing interview, soundtrack, film, article, or other appearance record with sources.",
    "zh-Hant": "提交缺少的專訪、原聲、電影、文章或其他演出紀錄，並附上來源。",
    "zh-Hans": "提交缺少的专访、原声、电影、文章或其他演出记录，并附上来源。"
  },
  "contribution.personText": {
    en: "Propose a missing person record or credit relationship with a source.",
    "zh-Hant": "提交缺少的人物紀錄或工作人員關聯，並附上來源。",
    "zh-Hans": "提交缺少的人物记录或工作人员关联，并附上来源。"
  },
  "contribution.sourceText": {
    en: "Propose a source that can support archive facts or improve uncertain records.",
    "zh-Hant": "提交可支持資料館事實或改善不確定紀錄的來源。",
    "zh-Hans": "提交可支持资料馆事实或改善不确定记录的来源。"
  },
  "contribution.suggestCorrection": { en: "Suggest correction", "zh-Hant": "建議修正", "zh-Hans": "建议修正" },
  "contribution.addSource": { en: "Add source", "zh-Hant": "新增來源", "zh-Hans": "新增来源" },
  "contribution.addMediaLink": { en: "Add media link", "zh-Hant": "新增媒體連結", "zh-Hans": "新增媒体链接" },
  "contribution.proposeRelease": { en: "Propose album/release", "zh-Hant": "提交專輯/發行", "zh-Hans": "提交专辑/发行" },
  "contribution.addTrack": { en: "Add release track", "zh-Hant": "新增發行曲目", "zh-Hans": "新增发行曲目" },
  "contribution.proposeConcert": { en: "Propose concert", "zh-Hant": "提交演唱會", "zh-Hans": "提交演唱会" },
  "contribution.proposeMusicShow": { en: "Propose music-show performance", "zh-Hant": "提交音樂節目演出", "zh-Hans": "提交音乐节目演出" },
  "contribution.proposeAppearance": { en: "Propose appearance", "zh-Hant": "提交演出紀錄", "zh-Hans": "提交演出记录" },
  "contribution.proposePerson": { en: "Propose person/credit", "zh-Hant": "提交人物/工作人員", "zh-Hans": "提交人物/工作人员" },
  "contribution.proposeSource": { en: "Propose source", "zh-Hant": "提交來源", "zh-Hans": "提交来源" },
  "option.albums": { en: "Albums", "zh-Hant": "專輯", "zh-Hans": "专辑" },
  "option.songs": { en: "Songs", "zh-Hant": "歌曲", "zh-Hans": "歌曲" },
  "option.oldest": { en: "Oldest", "zh-Hant": "最早", "zh-Hans": "最早" },
  "option.newest": { en: "Newest", "zh-Hant": "最新", "zh-Hans": "最新" },
  "option.mostLive": { en: "Most live", "zh-Hant": "現場最多", "zh-Hans": "现场最多" },
  "option.leastLive": { en: "Least live", "zh-Hant": "現場最少", "zh-Hans": "现场最少" },
  "option.albumOrder": { en: "Album order", "zh-Hant": "專輯順序", "zh-Hans": "专辑顺序" },
  "option.allAppearances": { en: "All appearances", "zh-Hant": "全部其他演出", "zh-Hans": "全部其他演出" },
  "option.allReleases": { en: "All releases", "zh-Hant": "全部音樂發行", "zh-Hans": "全部音乐发行" },
  "option.studioAlbums": { en: "Studio albums", "zh-Hant": "錄音室專輯", "zh-Hans": "录音室专辑" },
  "option.epSingles": { en: "EPs / singles", "zh-Hant": "EP / 單曲", "zh-Hans": "EP / 单曲" },
  "option.ep": { en: "EP", "zh-Hant": "EP", "zh-Hans": "EP" },
  "option.singles": { en: "Singles", "zh-Hant": "單曲", "zh-Hans": "单曲" },
  "option.compilations": { en: "Compilations", "zh-Hant": "合輯", "zh-Hans": "合辑" },
  "option.collaborations": { en: "Collaborations", "zh-Hant": "合作", "zh-Hans": "合作" },
  "option.englishCoverAlbums": { en: "English cover albums", "zh-Hant": "英文翻唱專輯", "zh-Hans": "英文翻唱专辑" },
  "option.religiousAlbums": { en: "Religious / chanting albums", "zh-Hant": "宗教 / 唱經專輯", "zh-Hans": "宗教 / 唱经专辑" },
  "option.liveAlbums": { en: "Live albums", "zh-Hant": "現場專輯", "zh-Hans": "现场专辑" },
  "option.reissues": { en: "Reissues", "zh-Hant": "再版", "zh-Hans": "再版" },
  "option.otherReleases": { en: "Other", "zh-Hant": "其他", "zh-Hans": "其他" },
  "tag.solo": { en: "Solo", "zh-Hant": "個人", "zh-Hans": "个人" },
  "tag.guest": { en: "Guest", "zh-Hant": "嘉賓", "zh-Hans": "嘉宾" },
  "tag.collaboration": { en: "Collaboration", "zh-Hant": "合作", "zh-Hans": "合作" },
  "tag.charity": { en: "Charity", "zh-Hant": "慈善", "zh-Hans": "慈善" },
  "tag.festival": { en: "Festival", "zh-Hant": "音樂節", "zh-Hans": "音乐节" },
  "tag.religious": { en: "Religious", "zh-Hant": "宗教", "zh-Hans": "宗教" },
  "tag.anniversary": { en: "Anniversary", "zh-Hant": "周年", "zh-Hans": "周年" },
  "tag.concert-series": { en: "Concert series", "zh-Hant": "系列演出", "zh-Hans": "系列演出" },
  "tag.other": { en: "Other", "zh-Hant": "其他", "zh-Hans": "其他" },
  "label.yearStage": { en: "Year stage", "zh-Hant": "年代", "zh-Hans": "年代" },
  "label.series": { en: "Series", "zh-Hant": "系列", "zh-Hans": "系列" },
  "label.version": { en: "Version", "zh-Hant": "版本", "zh-Hans": "版本" },
  "label.host": { en: "Host artist", "zh-Hant": "主場藝人", "zh-Hans": "主场艺人" },
  "label.subfilter": { en: "Refine", "zh-Hant": "再篩選", "zh-Hans": "再筛选" },
  "option.allYears": { en: "All years", "zh-Hant": "全部年代", "zh-Hans": "全部年代" },
  "option.allRegions": { en: "All regions", "zh-Hant": "全部地區", "zh-Hans": "全部地区" },
  "option.allSeries": { en: "All series", "zh-Hant": "全部系列", "zh-Hans": "全部系列" },
  "option.allGuests": { en: "All guests", "zh-Hant": "全部嘉賓", "zh-Hans": "全部嘉宾" },
  "option.byYear": { en: "By year", "zh-Hant": "依年份", "zh-Hans": "依年份" },
  "option.allAtOnce": { en: "All at once", "zh-Hant": "一次顯示", "zh-Hans": "一次显示" },
  "stage.early": { en: "Early (≤1999)", "zh-Hant": "早期 (≤1999)", "zh-Hans": "早期 (≤1999)" },
  "stage.2000s": { en: "2000s", "zh-Hant": "2000 年代", "zh-Hans": "2000 年代" },
  "stage.2010s": { en: "2010s", "zh-Hant": "2010 年代", "zh-Hans": "2010 年代" },
  "stage.2020s": { en: "2020s", "zh-Hant": "2020 年代", "zh-Hans": "2020 年代" },
  "region.taiwan": { en: "Taiwan", "zh-Hant": "台灣", "zh-Hans": "台湾" },
  "region.hongkong": { en: "Hong Kong / Macau", "zh-Hant": "港澳", "zh-Hans": "港澳" },
  "region.mainland": { en: "Mainland China", "zh-Hant": "中國大陸", "zh-Hans": "中国大陆" },
  "region.overseas": { en: "Overseas", "zh-Hant": "海外", "zh-Hans": "海外" },
  "series.grace-still": { en: "Grace Still", "zh-Hant": "風采依舊 在", "zh-Hans": "风采依旧 在" },
  "series.rolling-stone-30": { en: "Rolling Stone 30", "zh-Hant": "滾石30", "zh-Hans": "滚石30" },
  "series.minge": { en: "Folk", "zh-Hant": "民歌", "zh-Hans": "民歌" },
  "series.echo": { en: "Echo", "zh-Hant": "回聲", "zh-Hans": "回声" },
  "series.power-woman": { en: "Power Woman", "zh-Hant": "珍愛女人", "zh-Hans": "珍爱女人" },
  "series.angel-wolf": { en: "Angel and Wolf", "zh-Hant": "天使與狼", "zh-Hans": "天使与狼" },
  "option.allSections": { en: "All sections", "zh-Hant": "全部分類", "zh-Hans": "全部分类" },
  "option.allTypes": { en: "All types", "zh-Hant": "全部類型", "zh-Hans": "全部类型" },
  "option.allLevels": { en: "All levels", "zh-Hant": "全部等級", "zh-Hans": "全部等级" },
  "placeholder.searchAll": {
    en: "Title, person, source, date...",
    "zh-Hant": "標題、人物、來源、日期...",
    "zh-Hans": "标题、人物、来源、日期..."
  },
  "placeholder.sources": {
    en: "Title, publisher, URL...",
    "zh-Hant": "標題、出版方、網址...",
    "zh-Hans": "标题、出版方、网址..."
  },
  "empty.searchInitial": {
    en: "Enter a keyword or choose a section.",
    "zh-Hant": "輸入關鍵字或選擇分類。",
    "zh-Hans": "输入关键词或选择分类。"
  },
  "empty.noRecords": { en: "No matching records.", "zh-Hant": "沒有符合的紀錄。", "zh-Hans": "没有符合的记录。" },
  "empty.noSources": { en: "No matching sources.", "zh-Hant": "沒有符合的來源。", "zh-Hans": "没有符合的来源。" },
  "empty.noLinkedAlbum": { en: "No linked album yet.", "zh-Hant": "尚無關聯專輯。", "zh-Hans": "尚无关联专辑。" },
  "empty.noLinkedLiveRecords": { en: "No linked live records yet.", "zh-Hant": "尚無關聯現場紀錄。", "zh-Hans": "尚无关联现场记录。" },
  "empty.noStreaming": { en: "No streaming links recorded.", "zh-Hant": "尚無串流連結紀錄。", "zh-Hans": "尚无流媒体链接记录。" },
  "empty.noPurchase": { en: "No official purchase links recorded.", "zh-Hant": "尚無官方購買連結紀錄。", "zh-Hans": "尚无官方购买链接记录。" },
  "empty.noShowLinks": { en: "No show links added yet.", "zh-Hant": "尚未加入演出連結。", "zh-Hans": "尚未加入演出链接。" },
  "empty.noWatchLinks": { en: "No watch links recorded.", "zh-Hant": "尚無觀看連結紀錄。", "zh-Hans": "尚无观看链接记录。" },
  "empty.noClipLinks": { en: "No clip links added yet.", "zh-Hant": "尚未加入片段連結。", "zh-Hans": "尚未加入片段链接。" },
  "empty.noLinks": { en: "No links recorded.", "zh-Hant": "尚無連結紀錄。", "zh-Hans": "尚无链接记录。" },
  "empty.noMusicShows": { en: "No music-show records have been added yet.", "zh-Hant": "尚未加入音樂節目紀錄。", "zh-Hans": "尚未加入音乐节目记录。" },
  "empty.noAppearances": { en: "No appearance records have been added yet.", "zh-Hant": "尚未加入演出與出現紀錄。", "zh-Hans": "尚未加入演出与出现记录。" },
  "value.ready": { en: "Ready", "zh-Hant": "就緒", "zh-Hans": "就绪" },
  "value.unknown": { en: "Unknown", "zh-Hant": "未知", "zh-Hans": "未知" },
  "value.notRecorded": { en: "Not recorded", "zh-Hant": "未記錄", "zh-Hans": "未记录" },
  "value.noneRecorded": { en: "None recorded", "zh-Hant": "未記錄", "zh-Hans": "未记录" },
  "value.languageNotRecorded": { en: "Language not recorded", "zh-Hant": "語言未記錄", "zh-Hans": "语言未记录" },
  "value.creditsNotRecorded": { en: "Credits not recorded.", "zh-Hant": "尚未記錄工作人員。", "zh-Hans": "尚未记录工作人员。" },
  "value.unmodeledSong": { en: "Unmodeled song", "zh-Hant": "未建模歌曲", "zh-Hans": "未建模歌曲" },
  "value.fanUpload": { en: "fan upload", "zh-Hant": "歌迷上傳", "zh-Hans": "歌迷上传" },
  "value.unofficial": { en: "unofficial", "zh-Hant": "非官方", "zh-Hans": "非官方" },
  "value.official": { en: "official", "zh-Hant": "官方", "zh-Hans": "官方" },
  "count.record": { en: "record", "zh-Hant": "筆紀錄", "zh-Hans": "条记录" },
  "count.records": { en: "records", "zh-Hant": "筆紀錄", "zh-Hans": "条记录" },
  "count.album": { en: "album", "zh-Hant": "張專輯", "zh-Hans": "张专辑" },
  "count.albums": { en: "albums", "zh-Hant": "張專輯", "zh-Hans": "张专辑" },
  "count.song": { en: "song", "zh-Hant": "首歌曲", "zh-Hans": "首歌曲" },
  "count.songs": { en: "songs", "zh-Hant": "首歌曲", "zh-Hans": "首歌曲" },
  "count.entry": { en: "entry", "zh-Hant": "筆", "zh-Hans": "条" },
  "count.entries": { en: "entries", "zh-Hant": "筆", "zh-Hans": "条" },
  "count.link": { en: "link", "zh-Hant": "個連結", "zh-Hans": "个链接" },
  "count.links": { en: "links", "zh-Hant": "個連結", "zh-Hans": "个链接" },
  "count.relationshipLink": { en: "relationship link", "zh-Hant": "個關聯連結", "zh-Hans": "个关联链接" },
  "count.relationshipLinks": { en: "relationship links", "zh-Hant": "個關聯連結", "zh-Hans": "个关联链接" },
  "count.linkedRecord": { en: "linked record", "zh-Hant": "筆關聯紀錄", "zh-Hans": "条关联记录" },
  "count.linkedRecords": { en: "linked records", "zh-Hant": "筆關聯紀錄", "zh-Hans": "条关联记录" },
  "count.linkedLiveRecord": { en: "linked live record", "zh-Hant": "筆關聯現場紀錄", "zh-Hans": "条关联现场记录" },
  "count.linkedLiveRecords": { en: "linked live records", "zh-Hant": "筆關聯現場紀錄", "zh-Hans": "条关联现场记录" },
  "count.liveRecord": { en: "live record", "zh-Hant": "筆現場紀錄", "zh-Hans": "条现场记录" },
  "count.liveRecords": { en: "live records", "zh-Hant": "筆現場紀錄", "zh-Hans": "条现场记录" },
  "count.concert": { en: "concert", "zh-Hant": "場演唱會", "zh-Hans": "场演唱会" },
  "count.concerts": { en: "concerts", "zh-Hant": "場演唱會", "zh-Hans": "场演唱会" },
  "count.musicShow": { en: "music show", "zh-Hant": "個音樂節目", "zh-Hans": "个音乐节目" },
  "count.musicShows": { en: "music shows", "zh-Hant": "個音樂節目", "zh-Hans": "个音乐节目" },
  "count.relatedSong": { en: "related song", "zh-Hant": "首相關歌曲", "zh-Hans": "首相关歌曲" },
  "count.relatedSongs": { en: "related songs", "zh-Hant": "首相關歌曲", "zh-Hans": "首相关歌曲" },
  "count.group": { en: "group", "zh-Hant": "組", "zh-Hans": "组" },
  "count.groups": { en: "groups", "zh-Hant": "組", "zh-Hans": "组" },
  "status.confirmed": { en: "confirmed", "zh-Hant": "已確認", "zh-Hans": "已确认" },
  "status.partial": { en: "partial", "zh-Hant": "部分確認", "zh-Hans": "部分确认" },
  "status.uncertain": { en: "uncertain", "zh-Hant": "待確認", "zh-Hans": "待确认" },
  "status.needs-source": { en: "needs source", "zh-Hant": "需要來源", "zh-Hans": "需要来源" },
  "origin.original": { en: "Original", "zh-Hant": "原創", "zh-Hans": "原创" },
  "origin.cover": { en: "Cover", "zh-Hant": "翻唱", "zh-Hans": "翻唱" },
  "origin.unresolved": { en: "Unresolved", "zh-Hant": "未解析", "zh-Hans": "未解析" }
} satisfies Record<string, LocaleValues>;

export type UiKey = keyof typeof ui;

export function uiText(key: UiKey): LocaleValues {
  return ui[key];
}

export function textValues(en: string, zhHant = en, zhHans = zhHant): LocaleValues {
  return {
    en,
    "zh-Hant": zhHant,
    "zh-Hans": zhHans
  };
}

export function valueForLocale(values: Partial<LocaleValues>, locale: Locale = "en") {
  return values[locale] || values.en || values["zh-Hant"] || values["zh-Hans"] || "";
}

export function i18nAttrs(values: Partial<LocaleValues>) {
  return {
    "data-i18n-en": valueForLocale(values, "en"),
    "data-i18n-zh-hant": valueForLocale(values, "zh-Hant"),
    "data-i18n-zh-hans": valueForLocale(values, "zh-Hans")
  };
}

export function i18nPlaceholderAttrs(values: Partial<LocaleValues>) {
  return {
    "data-i18n-placeholder-en": valueForLocale(values, "en"),
    "data-i18n-placeholder-zh-hant": valueForLocale(values, "zh-Hant"),
    "data-i18n-placeholder-zh-hans": valueForLocale(values, "zh-Hans")
  };
}

export function i18nEmptyAttrs(initial: Partial<LocaleValues>, none: Partial<LocaleValues>) {
  return {
    "data-empty-initial-en": valueForLocale(initial, "en"),
    "data-empty-initial-zh-hant": valueForLocale(initial, "zh-Hant"),
    "data-empty-initial-zh-hans": valueForLocale(initial, "zh-Hans"),
    "data-empty-none-en": valueForLocale(none, "en"),
    "data-empty-none-zh-hant": valueForLocale(none, "zh-Hant"),
    "data-empty-none-zh-hans": valueForLocale(none, "zh-Hans")
  };
}

export function i18nCountLabelAttrs(singular: Partial<LocaleValues>, plural: Partial<LocaleValues>) {
  return {
    "data-count-label-singular-en": valueForLocale(singular, "en"),
    "data-count-label-singular-zh-hant": valueForLocale(singular, "zh-Hant"),
    "data-count-label-singular-zh-hans": valueForLocale(singular, "zh-Hans"),
    "data-count-label-plural-en": valueForLocale(plural, "en"),
    "data-count-label-plural-zh-hant": valueForLocale(plural, "zh-Hant"),
    "data-count-label-plural-zh-hans": valueForLocale(plural, "zh-Hans")
  };
}

export function localizedValues(
  localized: LocalizedText | undefined,
  fallback: string,
  original?: string
): LocaleValues {
  const zhHant = localized?.["zh-Hant"] || original || localized?.en || fallback;
  return {
    en: localized?.en || fallback,
    "zh-Hant": zhHant,
    "zh-Hans": localized?.["zh-Hans"] || zhHant
  };
}

const CONCERT_CITY_VALUES = {
  Beijing: { en: "Beijing", "zh-Hant": "北京", "zh-Hans": "北京" },
  Changhua: { en: "Changhua", "zh-Hant": "彰化", "zh-Hans": "彰化" },
  Changsha: { en: "Changsha", "zh-Hant": "長沙", "zh-Hans": "长沙" },
  Chengdu: { en: "Chengdu", "zh-Hant": "成都", "zh-Hans": "成都" },
  Chiayi: { en: "Chiayi", "zh-Hant": "嘉義", "zh-Hans": "嘉义" },
  "Genting Highlands": { en: "Genting Highlands", "zh-Hant": "雲頂高原", "zh-Hans": "云顶高原" },
  Guangzhou: { en: "Guangzhou", "zh-Hant": "廣州", "zh-Hans": "广州" },
  Hangzhou: { en: "Hangzhou", "zh-Hant": "杭州", "zh-Hans": "杭州" },
  "Hong Kong": { en: "Hong Kong", "zh-Hant": "香港", "zh-Hans": "香港" },
  Kaohsiung: { en: "Kaohsiung", "zh-Hant": "高雄", "zh-Hans": "高雄" },
  Kunming: { en: "Kunming", "zh-Hant": "昆明", "zh-Hans": "昆明" },
  "Kuala Lumpur": { en: "Kuala Lumpur", "zh-Hant": "吉隆坡", "zh-Hans": "吉隆坡" },
  Macau: { en: "Macau", "zh-Hant": "澳門", "zh-Hans": "澳门" },
  Nanjing: { en: "Nanjing", "zh-Hant": "南京", "zh-Hans": "南京" },
  Pingtung: { en: "Pingtung", "zh-Hant": "屏東", "zh-Hans": "屏东" },
  Sanya: { en: "Sanya", "zh-Hant": "三亞", "zh-Hans": "三亚" },
  Shanghai: { en: "Shanghai", "zh-Hant": "上海", "zh-Hans": "上海" },
  Shenzhen: { en: "Shenzhen", "zh-Hant": "深圳", "zh-Hans": "深圳" },
  Singapore: { en: "Singapore", "zh-Hant": "新加坡", "zh-Hans": "新加坡" },
  Taichung: { en: "Taichung", "zh-Hant": "臺中", "zh-Hans": "台中" },
  Tainan: { en: "Tainan", "zh-Hant": "臺南", "zh-Hans": "台南" },
  Taipei: { en: "Taipei", "zh-Hant": "臺北", "zh-Hans": "台北" },
  "Taitung Chishang": { en: "Taitung Chishang", "zh-Hant": "臺東池上", "zh-Hans": "台东池上" },
  Taoyuan: { en: "Taoyuan", "zh-Hant": "桃園", "zh-Hans": "桃园" },
  Wuhan: { en: "Wuhan", "zh-Hant": "武漢", "zh-Hans": "武汉" },
  "Xi'an": { en: "Xi'an", "zh-Hant": "西安", "zh-Hans": "西安" },
  Xiamen: { en: "Xiamen", "zh-Hant": "廈門", "zh-Hans": "厦门" },
  Yilan: { en: "Yilan", "zh-Hant": "宜蘭", "zh-Hans": "宜兰" }
} satisfies Record<string, LocaleValues>;

const CONCERT_REGION_VALUES = {
  China: { en: "Mainland China", "zh-Hant": "中國大陸", "zh-Hans": "中国大陆" },
  "Hong Kong": { en: "Hong Kong", "zh-Hant": "香港", "zh-Hans": "香港" },
  Macau: { en: "Macau", "zh-Hant": "澳門", "zh-Hans": "澳门" },
  Malaysia: { en: "Malaysia", "zh-Hant": "馬來西亞", "zh-Hans": "马来西亚" },
  Singapore: { en: "Singapore", "zh-Hant": "新加坡", "zh-Hans": "新加坡" },
  Taiwan: { en: "Taiwan", "zh-Hant": "台灣", "zh-Hans": "台湾" }
} satisfies Record<string, LocaleValues>;

const CONCERT_VENUE_VALUES = {
  "Aranya Sanya": { en: "Aranya Sanya", "zh-Hant": "阿那亞三亞", "zh-Hans": "阿那亚三亚" },
  "Arena of the Stars": { en: "Arena of the Stars", "zh-Hant": "雲星劇場", "zh-Hans": "云星剧场" },
  "Beijing Exhibition Theater": { en: "Beijing Exhibition Theater", "zh-Hant": "北京展覽館劇場", "zh-Hans": "北京展览馆剧场" },
  "Beijing Workers' Gymnasium": { en: "Beijing Workers' Gymnasium", "zh-Hant": "北京工人體育館", "zh-Hans": "北京工人体育馆" },
  "Capital Gymnasium": { en: "Capital Gymnasium", "zh-Hant": "首都體育館", "zh-Hans": "首都体育馆" },
  "Chengdu Sports Center": { en: "Chengdu Sports Center", "zh-Hant": "成都體育中心", "zh-Hans": "成都体育中心" },
  "Chiayi Prison": { en: "Chiayi Prison", "zh-Hant": "嘉義監獄", "zh-Hans": "嘉义监狱" },
  "Chishang Rice Fields": { en: "Chishang Rice Fields", "zh-Hant": "池上稻田", "zh-Hans": "池上稻田" },
  "Genting Arena of the Stars": { en: "Genting Arena of the Stars", "zh-Hant": "雲頂雲星劇場", "zh-Hans": "云顶云星剧场" },
  "Guangzhou Central Station Showcase Center": { en: "Guangzhou Central Station Showcase Center", "zh-Hant": "廣州中央車站展演中心", "zh-Hans": "广州中央车站展演中心" },
  "Hong Kong Coliseum": { en: "Hong Kong Coliseum", "zh-Hant": "香港體育館", "zh-Hans": "香港体育馆" },
  "Huanglong Sports Center Stadium": { en: "Huanglong Sports Center Stadium", "zh-Hant": "黃龍體育中心體育場", "zh-Hans": "黄龙体育中心体育场" },
  "Huashan Art Center Legacy Taipei": { en: "Huashan Art Center Legacy Taipei", "zh-Hant": "華山藝文中心 Legacy Taipei", "zh-Hans": "华山艺文中心 Legacy Taipei" },
  "Huaxi Live Wukesong": { en: "Huaxi Live Wukesong", "zh-Hant": "華熙LIVE·五棵松體育館", "zh-Hans": "华熙LIVE·五棵松体育馆" },
  "Kaohsiung Arena": { en: "Kaohsiung Arena", "zh-Hant": "高雄巨蛋", "zh-Hans": "高雄巨蛋" },
  "Marina Bay Sands Theater": { en: "Marina Bay Sands Theater", "zh-Hant": "濱海灣金沙劇院", "zh-Hans": "滨海湾金沙剧院" },
  "MasterCard Center (formerly Wukesong Arena)": { en: "MasterCard Center (formerly Wukesong Arena)", "zh-Hant": "萬事達中心（原五棵松體育館）", "zh-Hans": "万事达中心（原五棵松体育馆）" },
  "Mercedes-Benz Arena": { en: "Mercedes-Benz Arena", "zh-Hant": "梅賽德斯-奔馳文化中心", "zh-Hans": "梅赛德斯-奔驰文化中心" },
  "National Stadium (Bird's Nest)": { en: "National Stadium (Bird's Nest)", "zh-Hant": "國家體育場（鳥巢）", "zh-Hans": "国家体育场（鸟巢）" },
  "Shanghai Oriental Sports Center": { en: "Shanghai Oriental Sports Center", "zh-Hant": "上海浦發銀行東方體育中心", "zh-Hans": "上海浦发银行东方体育中心" },
  "Shanghai Grand Stage": { en: "Shanghai Grand Stage", "zh-Hant": "上海大舞臺", "zh-Hans": "上海大舞台" },
  "Shenzhen Bay Sports Center (ChunJian)": { en: "Shenzhen Bay Sports Center (ChunJian)", "zh-Hant": "深圳灣體育中心「春繭」", "zh-Hans": "深圳湾体育中心“春茧”" },
  "Shenzhen Bay Sports Center Stadium": { en: "Shenzhen Bay Sports Center Stadium", "zh-Hant": "深圳灣體育中心體育場", "zh-Hans": "深圳湾体育中心体育场" },
  "Tainan Prison": { en: "Tainan Prison", "zh-Hant": "臺南監獄", "zh-Hans": "台南监狱" },
  "Taipei Arena": { en: "Taipei Arena", "zh-Hant": "臺北小巨蛋", "zh-Hans": "台北小巨蛋" },
  "Taipei International Convention Center": { en: "Taipei International Convention Center", "zh-Hant": "臺北國際會議中心", "zh-Hans": "台北国际会议中心" },
  "Taipei Pop Music Center": { en: "Taipei Pop Music Center", "zh-Hant": "臺北流行音樂中心", "zh-Hans": "台北流行音乐中心" },
  "Taipei Zhongshan Hall Zhongzheng Auditorium": { en: "Taipei Zhongshan Hall Zhongzheng Auditorium", "zh-Hant": "臺北中山堂中正廳", "zh-Hans": "台北中山堂中正厅" },
  "Taoyuan Youth Correctional Institution": { en: "Taoyuan Youth Correctional Institution", "zh-Hant": "桃園少年輔育院", "zh-Hans": "桃园少年辅育院" },
  "The Star Performing Arts Centre": { en: "The Star Performing Arts Centre", "zh-Hant": "星宇表演藝術中心", "zh-Hans": "星宇表演艺术中心" },
  "The Star Theatre": { en: "The Star Theatre", "zh-Hant": "星宇劇院", "zh-Hans": "星宇剧院" },
  "Tianhe Stadium": { en: "Tianhe Stadium", "zh-Hant": "天河體育場", "zh-Hans": "天河体育场" },
  "Venetian Macao Coati Hall": { en: "Venetian Macao Coati Hall", "zh-Hant": "澳門威尼斯人金光綜藝館", "zh-Hans": "澳门威尼斯人金光综艺馆" },
  "Wuhan Keting": { en: "Wuhan Keting", "zh-Hant": "武漢客廳", "zh-Hans": "武汉客厅" },
  "Wuhan Sports Center Stadium (Zhuankou)": { en: "Wuhan Sports Center Stadium (Zhuankou)", "zh-Hant": "武漢體育中心體育場（沌口）", "zh-Hans": "武汉体育中心体育场（沌口）" },
  "Wutaishan Stadium": { en: "Wutaishan Stadium", "zh-Hant": "五臺山體育場", "zh-Hans": "五台山体育场" },
  "Yangcheng Creative Industry Park Showcase Center, Central Station": { en: "Yangcheng Creative Industry Park Showcase Center, Central Station", "zh-Hant": "羊城創意產業園中央車站展演中心", "zh-Hans": "羊城创意产业园中央车站展演中心" },
  "Yilan Prison": { en: "Yilan Prison", "zh-Hant": "宜蘭監獄", "zh-Hans": "宜兰监狱" }
} satisfies Record<string, LocaleValues>;

const KNOWN_PERSON_NAME_VALUES: Record<string, LocaleValues> = {
  "万芳": { en: "Wan Fang", "zh-Hant": "萬芳", "zh-Hans": "万芳" },
  "五月天": { en: "Mayday", "zh-Hant": "五月天", "zh-Hans": "五月天" },
  "任贤齐": { en: "Richie Jen", "zh-Hant": "任賢齊", "zh-Hans": "任贤齐" },
  "光良": { en: "Michael Wong", "zh-Hant": "光良", "zh-Hans": "光良" },
  "刘若英": { en: "Rene Liu", "zh-Hant": "劉若英", "zh-Hans": "刘若英" },
  "刘铭": { en: "Liu Ming", "zh-Hant": "劉銘", "zh-Hans": "刘铭" },
  "叶佳修": { en: "Yeh Chia-hsiu", "zh-Hant": "葉佳修", "zh-Hans": "叶佳修" },
  "周治平": { en: "Chou Chih-ping", "zh-Hant": "周治平", "zh-Hans": "周治平" },
  "品冠": { en: "Victor Wong", "zh-Hant": "品冠", "zh-Hans": "品冠" },
  "孙燕姿": { en: "Stefanie Sun", "zh-Hant": "孫燕姿", "zh-Hans": "孙燕姿" },
  "家家": { en: "Jia Jia", "zh-Hant": "家家", "zh-Hans": "家家" },
  "张震岳": { en: "Chang Chen-yue", "zh-Hant": "張震嶽", "zh-Hans": "张震岳" },
  "李宗盛": { en: "Jonathan Lee", "zh-Hant": "李宗盛", "zh-Hans": "李宗盛" },
  "李建复": { en: "Li Chien-fu", "zh-Hant": "李建復", "zh-Hans": "李建复" },
  "杜德伟": { en: "Alex To", "zh-Hant": "杜德偉", "zh-Hans": "杜德伟" },
  "杨乃文": { en: "Faith Yang", "zh-Hant": "楊乃文", "zh-Hans": "杨乃文" },
  "林宥嘉": { en: "Yoga Lin", "zh-Hant": "林宥嘉", "zh-Hans": "林宥嘉" },
  "林晓培": { en: "Shino Lin", "zh-Hant": "林曉培", "zh-Hans": "林晓培" },
  "梁静茹": { en: "Fish Leong", "zh-Hant": "梁靜茹", "zh-Hans": "梁静茹" },
  "王梦麟": { en: "Wang Meng-lin", "zh-Hant": "王夢麟", "zh-Hans": "王梦麟" },
  "王海玲": { en: "Wang Hai-ling", "zh-Hant": "王海玲", "zh-Hans": "王海玲" },
  "苏芮": { en: "Julie Sue", "zh-Hant": "蘇芮", "zh-Hans": "苏芮" },
  "赵咏华": { en: "Cyndi Chaw", "zh-Hant": "趙詠華", "zh-Hans": "赵咏华" },
  "趙詠華": { en: "Cyndi Chaw", "zh-Hant": "趙詠華", "zh-Hans": "赵咏华" },
  "辛晓琪": { en: "Winnie Hsin", "zh-Hant": "辛曉琪", "zh-Hans": "辛晓琪" },
  "金智娟": { en: "Wa Wa", "zh-Hant": "金智娟", "zh-Hans": "金智娟" },
  "阿牛": { en: "Ah Niu", "zh-Hant": "阿牛", "zh-Hans": "阿牛" },
  "陈绮贞": { en: "Cheer Chen", "zh-Hant": "陳綺貞", "zh-Hans": "陈绮贞" },
  "陳建年": { en: "Chen Chien-nien", "zh-Hant": "陳建年", "zh-Hans": "陈建年" },
  "顺子": { en: "Shunza", "zh-Hant": "順子", "zh-Hans": "顺子" },
  "黄品源": { en: "Huang Pin-yuan", "zh-Hant": "黃品源", "zh-Hans": "黄品源" },
  "黄小琥": { en: "Tiger Huang", "zh-Hant": "黃小琥", "zh-Hans": "黄小琥" },
  "黄裕翔": { en: "Huang Yu-siang", "zh-Hant": "黃裕翔", "zh-Hans": "黄裕翔" }
};

const TRADITIONAL_TO_SIMPLIFIED_CHARS: Record<string, string> = {
  齊: "齐",
  雲: "云",
  陳: "陈",
  遠: "远",
  蓮: "莲",
  銘: "铭",
  吳: "吴",
  歡: "欢",
  嘯: "啸",
  翹: "翘",
  張: "张",
  羅: "罗",
  趙: "赵",
  詠: "咏",
  華: "华",
  劉: "刘",
  楊: "杨",
  黃: "黄",
  綺: "绮",
  薩: "萨",
  頂: "顶",
  蕭: "萧",
  紘: "纮",
  寶: "宝",
  壽: "寿",
  復: "复",
  鄭: "郑",
  葉: "叶",
  維: "维",
  麗: "丽",
  國: "国",
  圓: "圆",
  長: "长",
  萬: "万",
  賢: "贤",
  嶽: "岳",
  偉: "伟",
  曉: "晓",
  靜: "静",
  夢: "梦",
  蘇: "苏",
  貞: "贞",
  順: "顺",
  憶: "忆",
  廉: "廉",
  廣: "广",
  義: "义",
  門: "门",
  東: "东",
  亞: "亚",
  園: "园",
  漢: "汉",
  蘭: "兰",
  灣: "湾",
  臺: "台",
  體: "体",
  館: "馆",
  場: "场",
  劇: "剧",
  獄: "狱",
  藝: "艺",
  濱: "滨",
  賽: "赛",
  馳: "驰",
  鳥: "鸟",
  巢: "巢",
  繭: "茧",
  際: "际",
  議: "议",
  廳: "厅",
  輔: "辅",
  兒: "儿",
  創: "创",
  業: "业",
  產: "产",
  車: "车",
  覽: "览",
  願: "愿"
};

const SIMPLIFIED_TO_TRADITIONAL_CHARS = Object.fromEntries(
  Object.entries(TRADITIONAL_TO_SIMPLIFIED_CHARS).map(([traditional, simplified]) => [simplified, traditional])
) as Record<string, string>;

function containsHan(value: string | null | undefined) {
  return Boolean(value && /[\u3400-\u9fff]/.test(value));
}

function convertHan(value: string, map: Record<string, string>) {
  return Array.from(value).map((char) => map[char] || char).join("");
}

function toSimplifiedText(value: string) {
  return convertHan(value, TRADITIONAL_TO_SIMPLIFIED_CHARS);
}

function toTraditionalText(value: string) {
  return convertHan(value, SIMPLIFIED_TO_TRADITIONAL_CHARS);
}

function hasTraditionalHint(value: string) {
  return Array.from(value).some((char) => Boolean(TRADITIONAL_TO_SIMPLIFIED_CHARS[char]));
}

function hasSimplifiedHint(value: string) {
  return Array.from(value).some((char) => Boolean(SIMPLIFIED_TO_TRADITIONAL_CHARS[char]));
}

function localizedPlaceValues(
  localized: LocalizedText | undefined,
  fallback: string | null | undefined,
  knownValues: Record<string, LocaleValues>
): LocaleValues {
  const base = fallback ? knownValues[fallback] || textValues(fallback) : textValues("");
  if (!localized) return base;
  return {
    en: localized.en || base.en,
    "zh-Hant": localized["zh-Hant"] || base["zh-Hant"],
    "zh-Hans": localized["zh-Hans"] || base["zh-Hans"]
  };
}

function personChineseVariants(person: Person) {
  return [
    person.nameLocalized?.["zh-Hant"],
    person.nameLocalized?.["zh-Hans"],
    person.nameOriginal,
    ...person.aliases
  ].filter((value): value is string => containsHan(value));
}

function preferredChineseName(person: Person, locale: "zh-Hant" | "zh-Hans") {
  const variants = personChineseVariants(person);
  if (locale === "zh-Hant") {
    return variants.find(hasTraditionalHint) || variants.find((value) => !hasSimplifiedHint(value));
  }
  return variants.find(hasSimplifiedHint) || variants.find((value) => !hasTraditionalHint(value));
}

export function titleValues(item: Song | Release | Concert | MusicShow | Appearance): LocaleValues {
  return localizedValues(item.titleLocalized, item.title, "titleOriginal" in item ? item.titleOriginal : undefined);
}

export function concertCityValues(concert: Concert): LocaleValues {
  return localizedPlaceValues(concert.cityLocalized, concert.city, CONCERT_CITY_VALUES);
}

export function concertCountryOrRegionValues(concert: Concert): LocaleValues {
  return localizedPlaceValues(concert.countryOrRegionLocalized, concert.countryOrRegion, CONCERT_REGION_VALUES);
}

export function concertLocationValues(concert: Concert): LocaleValues {
  return joinValues([concertCityValues(concert), concertCountryOrRegionValues(concert)], ", ");
}

export function concertVenueValues(concert: Concert): LocaleValues {
  return localizedPlaceValues(concert.venueLocalized, concert.venue, CONCERT_VENUE_VALUES);
}

export function concertDisplayTitleValues(concert: Concert): LocaleValues {
  const base = titleValues(concert);
  const qualifier = concert.version || concert.anniversaryYear || "";
  const year = (concert.date || "").split("/")[0].slice(0, 4);
  const place = concertCityValues(concert);
  return locales.reduce((values, locale) => {
    const title = [base[locale], qualifier].filter(Boolean).join(" ");
    values[locale] = [title, year, place[locale]].filter(Boolean).join(" / ");
    return values;
  }, {} as LocaleValues);
}

export function concertEventTypeValues(type: string): LocaleValues {
  const values: Record<string, LocaleValues> = {
    concert: { en: "Concert", "zh-Hant": "演唱會", "zh-Hans": "演唱会" },
    "concert-series": { en: "Concert series", "zh-Hant": "系列演出", "zh-Hans": "系列演出" },
    festival: { en: "Festival", "zh-Hant": "音樂節", "zh-Hans": "音乐节" }
  };
  return values[type] || textValues(type);
}

export function trackTitleValues(track: Track): LocaleValues {
  return localizedValues(track.titleOnReleaseLocalized, track.titleOnRelease);
}

export function originalReleaseTitle(release: Release): string {
  const isEnglishCover = releaseCategoryTags(release).includes("english-cover");
  if (isEnglishCover) {
    return release.titleLocalized?.en || release.title;
  }
  return release.titleOriginal || release.title;
}

export function originalAlbumTitle(album: AlbumRecord): string {
  if (album.id.startsWith("appearance-")) {
    return album.titleOriginal || album.title;
  }
  return originalReleaseTitle(album as Release);
}

export function originalTrackTitle(track: Track): string {
  return track.titleOnRelease;
}

export function originalSongTitle(song: Song): string {
  if (song.language === "English") {
    return song.titleLocalized?.en || song.title;
  }
  return song.titleOriginal || song.title;
}

export function performanceTitleValues(entry: SongPerformance, fallbackSong?: Song): LocaleValues {
  return localizedValues(entry.titlePerformedLocalized, entry.titlePerformed || fallbackSong?.title || entry.song || "");
}

export function noteValues(note: string | null | undefined, localized?: LocalizedText): LocaleValues {
  return localizedValues(localized, note || "");
}

export function personNameValues(person: Person): LocaleValues {
  const zhHant = person.nameLocalized?.["zh-Hant"] ||
    preferredChineseName(person, "zh-Hant") ||
    (person.nameOriginal ? toTraditionalText(person.nameOriginal) : person.displayName);
  const zhHans = person.nameLocalized?.["zh-Hans"] ||
    preferredChineseName(person, "zh-Hans") ||
    (containsHan(zhHant) ? toSimplifiedText(zhHant) : zhHant);

  return {
    en: person.nameLocalized?.en || person.displayName,
    "zh-Hant": containsHan(zhHant) ? toTraditionalText(zhHant) : zhHant,
    "zh-Hans": containsHan(zhHans) ? toSimplifiedText(zhHans) : zhHans
  };
}

function literalPersonNameValues(value: string): LocaleValues {
  const known = KNOWN_PERSON_NAME_VALUES[value];
  if (known) return known;
  if (!containsHan(value)) return textValues(value);
  return {
    en: value,
    "zh-Hant": toTraditionalText(value),
    "zh-Hans": toSimplifiedText(value)
  };
}

export function personIdValues(id: string): LocaleValues {
  const person = byId(people, id);
  return person ? personNameValues(person) : literalPersonNameValues(id);
}

export function personIdsValues(ids: string[] | undefined, fallback: LocaleValues = textValues("")): LocaleValues {
  if (!ids?.length) return fallback;
  return locales.reduce((values, locale) => {
    values[locale] = ids.map((id) => valueForLocale(personIdValues(id), locale)).join(", ");
    return values;
  }, {} as LocaleValues);
}

export function sourceCategoryValues(category: string): LocaleValues {
  const categories: Record<string, LocaleValues> = {
    album: { en: "Album", "zh-Hant": "專輯", "zh-Hans": "专辑" },
    song: { en: "Song", "zh-Hant": "歌曲", "zh-Hans": "歌曲" },
    concert: { en: "Concert", "zh-Hant": "演唱會", "zh-Hans": "演唱会" },
    person: { en: "Person", "zh-Hant": "人物", "zh-Hans": "人物" }
  };
  return categories[category] || textValues(category);
}

export function releaseTypeValues(type: string): LocaleValues {
  const types: Record<string, LocaleValues> = {
    "studio-album": uiText("option.studioAlbums"),
    single: uiText("option.singles"),
    ep: uiText("option.ep"),
    compilation: uiText("option.compilations"),
    collaboration: uiText("option.collaborations"),
    "live-album": uiText("option.liveAlbums"),
    reissue: uiText("option.reissues"),
    other: uiText("option.otherReleases")
  };
  return types[type] || textValues(type);
}

export function releaseCategoryValues(category: string): LocaleValues {
  const categories: Record<string, LocaleValues> = {
    studio: uiText("option.studioAlbums"),
    "ep-single": uiText("option.epSingles"),
    compilation: uiText("option.compilations"),
    collaboration: uiText("option.collaborations"),
    "english-cover": uiText("option.englishCoverAlbums"),
    religious: uiText("option.religiousAlbums"),
    live: uiText("option.liveAlbums"),
    reissue: uiText("option.reissues"),
    other: uiText("option.otherReleases")
  };
  return categories[category] || releaseTypeValues(category);
}

export function concertTagValues(tag: string): LocaleValues {
  const tags: Record<string, LocaleValues> = {
    solo: uiText("tag.solo"),
    guest: uiText("tag.guest"),
    collaboration: uiText("tag.collaboration"),
    charity: uiText("tag.charity"),
    festival: uiText("tag.festival"),
    religious: uiText("tag.religious"),
    anniversary: uiText("tag.anniversary"),
    "concert-series": uiText("tag.concert-series"),
    other: uiText("tag.other")
  };
  return tags[tag] || textValues(tag);
}

export function concertNatureValues(nature: ConcertNature): LocaleValues {
  const values: Record<ConcertNature, LocaleValues> = {
    commercial: { en: "Commercial", "zh-Hant": "\u5546\u696d", "zh-Hans": "\u5546\u4e1a" },
    "non-commercial": { en: "Non-Commercial", "zh-Hant": "\u975e\u5546\u696d", "zh-Hans": "\u975e\u5546\u4e1a" }
  };
  return values[nature] || textValues(nature);
}

export function concertCategoryValues(category: ConcertCategory): LocaleValues {
  const values: Record<ConcertCategory, LocaleValues> = {
    solo: uiText("tag.solo"),
    collaboration: uiText("tag.collaboration"),
    anniversary: uiText("tag.anniversary"),
    guest: uiText("tag.guest"),
    charity: uiText("tag.charity"),
    religion: { en: "Religion", "zh-Hant": "\u5b97\u6559", "zh-Hans": "\u5b97\u6559" },
    festival: uiText("tag.festival"),
    other: uiText("tag.other")
  };
  return values[category] || textValues(category);
}

export function concertGroupKindValues(kind: ConcertGroupKind | null | undefined): LocaleValues {
  const values: Record<ConcertGroupKind, LocaleValues> = {
    tour: { en: "Tour", "zh-Hant": "\u5de1\u6f14", "zh-Hans": "\u5de1\u6f14" },
    theme: { en: "Theme", "zh-Hant": "\u4e3b\u984c", "zh-Hans": "\u4e3b\u9898" },
    host: uiText("label.host")
  };
  return kind ? values[kind] || textValues(kind) : textValues("");
}

export function concertTagsValues(concert: Concert): LocaleValues {
  const tags = concertCategoryTags(concert);
  return locales.reduce((values, locale) => {
    values[locale] = tags.map((tag) => valueForLocale(concertTagValues(tag), locale)).join(", ");
    return values;
  }, {} as LocaleValues);
}

export function yearStageValues(stage: string): LocaleValues {
  const stages: Record<string, LocaleValues> = {
    early: uiText("stage.early"),
    "2000s": uiText("stage.2000s"),
    "2010s": uiText("stage.2010s"),
    "2020s": uiText("stage.2020s"),
    unknown: uiText("value.unknown")
  };
  return stages[stage] || textValues(stage);
}

export function regionValues(region: string): LocaleValues {
  const regions: Record<string, LocaleValues> = {
    taiwan: uiText("region.taiwan"),
    hongkong: uiText("region.hongkong"),
    mainland: uiText("region.mainland"),
    overseas: uiText("region.overseas")
  };
  return regions[region] || textValues(region);
}

export function seriesValues(seriesKey: string): LocaleValues {
  const known: Record<string, LocaleValues> = {
    "grace-still": uiText("series.grace-still"),
    "rolling-stone-30": uiText("series.rolling-stone-30"),
    minge: uiText("series.minge"),
    echo: uiText("series.echo"),
    "power-woman": uiText("series.power-woman"),
    "angel-wolf": uiText("series.angel-wolf")
  };
  return known[seriesKey] || textValues(seriesKey);
}

export function appearanceTypeValues(type: string): LocaleValues {
  const types: Record<string, LocaleValues> = {
    "ost-vocal-appearance": { en: "OST vocal appearance", "zh-Hant": "原聲演唱", "zh-Hans": "原声演唱" },
    soundtrack: { en: "OST vocal appearance", "zh-Hant": "原聲演唱", "zh-Hans": "原声演唱" },
    "album-guest-vocal": { en: "Guest vocal for album/single", "zh-Hant": "專輯／單曲客座演唱", "zh-Hans": "专辑／单曲客座演唱" },
    collaboration: { en: "Collaboration", "zh-Hant": "合作演出", "zh-Hans": "合作演出" },
    "talk-show": { en: "Talk show", "zh-Hant": "談話節目", "zh-Hans": "谈话节目" },
    interview: { en: "Interview", "zh-Hant": "專訪", "zh-Hans": "专访" },
    "screen-guest-appearance": { en: "Guest appearance in movie/series", "zh-Hant": "影視客串", "zh-Hans": "影视客串" },
    film: { en: "Guest appearance in movie/series", "zh-Hant": "影視客串", "zh-Hans": "影视客串" },
    documentary: { en: "Documentary", "zh-Hant": "紀錄片", "zh-Hans": "纪录片" },
    podcast: { en: "Podcast", "zh-Hant": "Podcast", "zh-Hans": "播客" },
    article: { en: "Article", "zh-Hant": "文章", "zh-Hans": "文章" },
    other: uiText("option.otherReleases")
  };
  return types[type] || textValues(type);
}

export function originValues(label: string): LocaleValues {
  if (label === "Original") return uiText("origin.original");
  if (label === "Cover") return uiText("origin.cover");
  return uiText("origin.unresolved");
}

export function countValues(count: number, singular: UiKey, plural: UiKey): LocaleValues {
  const label = count === 1 ? uiText(singular) : uiText(plural);
  return locales.reduce((values, locale) => {
    values[locale] = `${count} ${label[locale]}`;
    return values;
  }, {} as LocaleValues);
}

export function labelValueValues(label: UiKey, value: string | LocaleValues | null | undefined): LocaleValues {
  const labelValues = uiText(label);
  const resolved = typeof value === "string" || !value ? textValues(value || "") : value;
  return locales.reduce((values, locale) => {
    values[locale] = `${labelValues[locale]}: ${resolved[locale] || uiText("value.unknown")[locale]}`;
    return values;
  }, {} as LocaleValues);
}

export function withCountValues(values: LocaleValues, count: number): LocaleValues {
  return locales.reduce((output, locale) => {
    output[locale] = `${values[locale]} (${count})`;
    return output;
  }, {} as LocaleValues);
}

export function joinValues(parts: Array<string | LocaleValues | null | undefined | false>, separator = " / "): LocaleValues {
  return locales.reduce((values, locale) => {
    values[locale] = parts
      .map((part) => (typeof part === "string" ? part : part ? part[locale] : ""))
      .filter(Boolean)
      .join(separator);
    return values;
  }, {} as LocaleValues);
}

export function availabilityValues(label: string): LocaleValues {
  const normalized = label.toLocaleLowerCase("en-US");
  const known: Record<string, LocaleValues> = {
    "official recording": { en: "Official recording", "zh-Hant": "官方錄音", "zh-Hans": "官方录音" },
    "official release": uiText("label.officialRelease"),
    video: { en: "Video", "zh-Hant": "影片", "zh-Hans": "视频" },
    audio: { en: "Audio", "zh-Hant": "音訊", "zh-Hans": "音频" },
    clips: uiText("label.clips"),
    watch: { en: "Watch", "zh-Hant": "觀看", "zh-Hans": "观看" },
    streaming: uiText("label.streaming"),
    buy: { en: "Buy", "zh-Hant": "購買", "zh-Hans": "购买" },
    metadata: { en: "Metadata", "zh-Hant": "後設資料", "zh-Hans": "元数据" },
    cd: textValues("CD"),
    dvd: textValues("DVD"),
    vinyl: { en: "Vinyl", "zh-Hant": "黑膠", "zh-Hans": "黑胶" },
    cassette: { en: "Cassette", "zh-Hant": "卡帶", "zh-Hans": "卡带" }
  };
  return known[normalized] || textValues(label);
}

export function archiveLinkDisplayValues(link: ArchiveLink): LocaleValues {
  const status = link.isOfficial
    ? { en: "official release", "zh-Hant": "正式發行", "zh-Hans": "正式发行" }
    : { en: "fan upload", "zh-Hant": "歌迷上傳", "zh-Hans": "歌迷上传" };
  const credit = link.credit
    ? textValues(`Credit: ${link.credit}`, `來源：${link.credit}`, `来源：${link.credit}`)
    : textValues("Credit: not recorded", "來源：未記錄", "来源：未记录");
  const resolution = link.resolution
    ? textValues(link.resolution)
    : textValues("resolution not recorded", "解析度未記錄", "分辨率未记录");
  const parts = archiveLinkDisplayParts(link);
  const optionalParts = parts.slice(5);
  return joinValues([
    credit,
    status,
    link.platform || link.label,
    link.kind || "media",
    resolution,
    ...optionalParts
  ]);
}

export function contributionValues(value: string): LocaleValues {
  const known: Record<string, LocaleValues> = {
    Contribute: uiText("label.contribute"),
    "Send a sourced correction or link for this record.": uiText("contribution.recordText"),
    "Propose a missing release or track-level addition with source links.": uiText("contribution.releaseText"),
    "Propose a missing concert or concert-series record with date, location, and sources.": uiText("contribution.concertText"),
    "Propose a missing broadcast, streamed, or radio music-show performance with sources.": uiText("contribution.musicShowText"),
    "Propose a missing interview, soundtrack, film, article, or other appearance record with sources.": uiText("contribution.appearanceText"),
    "Propose a missing person record or credit relationship with a source.": uiText("contribution.personText"),
    "Propose a source that can support archive facts or improve uncertain records.": uiText("contribution.sourceText"),
    "Suggest correction": uiText("contribution.suggestCorrection"),
    "Add source": uiText("contribution.addSource"),
    "Add media link": uiText("contribution.addMediaLink"),
    "Propose album/release": uiText("contribution.proposeRelease"),
    "Add release track": uiText("contribution.addTrack"),
    "Propose concert": uiText("contribution.proposeConcert"),
    "Propose music-show performance": uiText("contribution.proposeMusicShow"),
    "Propose appearance": uiText("contribution.proposeAppearance"),
    "Propose person/credit": uiText("contribution.proposePerson"),
    "Propose source": uiText("contribution.proposeSource")
  };
  return known[value] || textValues(value);
}

export function creditTitleValues(credit: { href: string; title: string }): LocaleValues {
  const [, section, slug] = credit.href.split("/");
  if (section === "releases") {
    const release = releases.find((item) => item.slug === slug);
    return release ? titleValues(release) : textValues(credit.title);
  }
  if (section === "concerts") {
    const concert = concerts.find((item) => item.slug === slug);
    return concert ? titleValues(concert) : textValues(credit.title);
  }
  if (section === "music-shows") {
    const show = musicShows.find((item) => item.slug === slug);
    return show ? titleValues(show) : textValues(credit.title);
  }
  if (section === "appearances") {
    const appearance = appearances.find((item) => item.slug === slug);
    return appearance ? titleValues(appearance) : textValues(credit.title);
  }
  if (section === "people") {
    const person = people.find((item) => item.slug === slug);
    return person ? personNameValues(person) : textValues(credit.title);
  }
  const song = songs.find((item) => item.title === credit.title || item.titleOriginal === credit.title);
  return song ? titleValues(song) : textValues(credit.title);
}

export function creditSummaryValues(credit: { href: string; summary: string }): LocaleValues {
  const [, section, slug] = credit.href.split("/");
  if (section === "concerts") {
    const concert = concerts.find((item) => item.slug === slug);
    return concert
      ? joinValues([
        concert.date || "",
        concertEventTypeValues(concert.eventType),
        concertVenueValues(concert),
        concertLocationValues(concert)
      ])
      : textValues(credit.summary);
  }
  return textValues(credit.summary);
}
