import { byId, people } from "./archive";
import type {
  Appearance,
  Concert,
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
  "nav.releases": { en: "Releases", "zh-Hant": "發行", "zh-Hans": "发行" },
  "nav.concerts": { en: "Concerts", "zh-Hant": "演唱會", "zh-Hans": "演唱会" },
  "nav.musicShows": { en: "Music shows", "zh-Hant": "音樂節目", "zh-Hans": "音乐节目" },
  "nav.appearances": { en: "Appearances", "zh-Hant": "其他出現", "zh-Hans": "其他出现" },
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
    en: "Albums, singles, compilations, collaborations, and soundtracks.",
    "zh-Hant": "專輯、單曲、合輯、合作與原聲資料。",
    "zh-Hans": "专辑、单曲、合辑、合作与原声资料。"
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
    en: "Talk shows, film, soundtrack, podcasts, interviews, and other appearances.",
    "zh-Hant": "訪談、電影、原聲、Podcast、專訪與其他出現。",
    "zh-Hans": "访谈、电影、原声、播客、专访与其他出现。"
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
    en: "Talk shows, film, soundtrack work, podcasts, interviews, documentaries, and other appearances.",
    "zh-Hant": "訪談、電影、原聲工作、Podcast、專訪、紀錄片與其他出現。",
    "zh-Hans": "访谈、电影、原声工作、播客、专访、纪录片与其他出现。"
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
  "label.view": { en: "View", "zh-Hant": "視圖", "zh-Hans": "视图" },
  "label.sort": { en: "Sort", "zh-Hant": "排序", "zh-Hans": "排序" },
  "label.sortTracks": { en: "Sort tracks", "zh-Hant": "曲目排序", "zh-Hans": "曲目排序" },
  "label.keyword": { en: "Keyword", "zh-Hant": "關鍵字", "zh-Hans": "关键词" },
  "label.section": { en: "Section", "zh-Hant": "分類", "zh-Hans": "分类" },
  "label.search": { en: "Search", "zh-Hant": "搜尋", "zh-Hans": "搜索" },
  "label.type": { en: "Type", "zh-Hant": "類型", "zh-Hans": "类型" },
  "label.reliability": { en: "Reliability", "zh-Hant": "可信度", "zh-Hans": "可信度" },
  "label.date": { en: "Date", "zh-Hant": "日期", "zh-Hans": "日期" },
  "label.location": { en: "Location", "zh-Hant": "地點", "zh-Hans": "地点" },
  "label.venue": { en: "Venue", "zh-Hant": "場地", "zh-Hans": "场地" },
  "label.artist": { en: "Artist", "zh-Hant": "藝人", "zh-Hans": "艺人" },
  "label.producer": { en: "Producer", "zh-Hant": "製作人", "zh-Hans": "制作人" },
  "label.label": { en: "Label", "zh-Hant": "廠牌", "zh-Hans": "厂牌" },
  "label.formats": { en: "Formats", "zh-Hant": "格式", "zh-Hans": "格式" },
  "label.program": { en: "Program", "zh-Hant": "節目", "zh-Hans": "节目" },
  "label.platform": { en: "Platform", "zh-Hant": "平台", "zh-Hans": "平台" },
  "label.episode": { en: "Episode", "zh-Hant": "集數", "zh-Hans": "集数" },
  "label.collaborators": { en: "Collaborators", "zh-Hant": "合作者", "zh-Hans": "合作者" },
  "label.guests": { en: "Guests", "zh-Hant": "嘉賓", "zh-Hans": "嘉宾" },
  "label.role": { en: "Role", "zh-Hant": "角色", "zh-Hans": "角色" },
  "label.work": { en: "Work", "zh-Hant": "作品", "zh-Hans": "作品" },
  "label.programOrWork": { en: "Program or work", "zh-Hant": "節目或作品", "zh-Hans": "节目或作品" },
  "label.lyrics": { en: "Lyrics", "zh-Hant": "作詞", "zh-Hans": "作词" },
  "label.music": { en: "Music", "zh-Hant": "作曲", "zh-Hans": "作曲" },
  "label.credits": { en: "Credits", "zh-Hant": "工作人員", "zh-Hans": "工作人员" },
  "label.duration": { en: "Duration", "zh-Hant": "時長", "zh-Hans": "时长" },
  "label.songIdentity": { en: "Song identity", "zh-Hant": "歌曲身份", "zh-Hans": "歌曲身份" },
  "label.originalPerformer": { en: "Original performer", "zh-Hant": "原唱", "zh-Hans": "原唱" },
  "label.performedBy": { en: "Performed by", "zh-Hant": "演唱", "zh-Hans": "演唱" },
  "label.relationships": { en: "Relationships", "zh-Hant": "關聯", "zh-Hans": "关联" },
  "label.roles": { en: "Roles", "zh-Hant": "角色", "zh-Hans": "角色" },
  "label.aliases": { en: "Aliases", "zh-Hant": "別名", "zh-Hans": "别名" },
  "label.status": { en: "Status", "zh-Hant": "狀態", "zh-Hans": "状态" },
  "label.availability": { en: "Availability", "zh-Hant": "可取得性", "zh-Hans": "可取得性" },
  "label.purchase": { en: "Purchase", "zh-Hant": "購買", "zh-Hans": "购买" },
  "label.streaming": { en: "Streaming", "zh-Hant": "串流", "zh-Hans": "流媒体" },
  "label.links": { en: "Links", "zh-Hant": "連結", "zh-Hans": "链接" },
  "label.showLinks": { en: "Show links", "zh-Hant": "演出連結", "zh-Hans": "演出链接" },
  "label.watchLinks": { en: "Watch links", "zh-Hant": "觀看連結", "zh-Hans": "观看链接" },
  "label.releaseLinks": { en: "Release links", "zh-Hant": "發行連結", "zh-Hans": "发行链接" },
  "label.clipLinks": { en: "Clip links", "zh-Hant": "片段連結", "zh-Hans": "片段链接" },
  "label.liveRecords": { en: "Live records", "zh-Hant": "現場紀錄", "zh-Hans": "现场记录" },
  "label.tracks": { en: "Tracks", "zh-Hant": "曲目", "zh-Hans": "曲目" },
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
    "zh-Hant": "提交缺少的專訪、原聲、電影、文章或其他出現紀錄，並附上來源。",
    "zh-Hans": "提交缺少的专访、原声、电影、文章或其他出现记录，并附上来源。"
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
  "contribution.proposeAppearance": { en: "Propose appearance", "zh-Hant": "提交其他出現", "zh-Hans": "提交其他出现" },
  "contribution.proposePerson": { en: "Propose person/credit", "zh-Hant": "提交人物/工作人員", "zh-Hans": "提交人物/工作人员" },
  "contribution.proposeSource": { en: "Propose source", "zh-Hant": "提交來源", "zh-Hans": "提交来源" },
  "option.albums": { en: "Albums", "zh-Hant": "專輯", "zh-Hans": "专辑" },
  "option.songs": { en: "Songs", "zh-Hant": "歌曲", "zh-Hans": "歌曲" },
  "option.oldest": { en: "Oldest", "zh-Hant": "最早", "zh-Hans": "最早" },
  "option.newest": { en: "Newest", "zh-Hant": "最新", "zh-Hans": "最新" },
  "option.mostLive": { en: "Most live", "zh-Hant": "現場最多", "zh-Hans": "现场最多" },
  "option.leastLive": { en: "Least live", "zh-Hant": "現場最少", "zh-Hans": "现场最少" },
  "option.albumOrder": { en: "Album order", "zh-Hant": "專輯順序", "zh-Hans": "专辑顺序" },
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
  "empty.noAppearances": { en: "No appearance records have been added yet.", "zh-Hant": "尚未加入其他出現紀錄。", "zh-Hans": "尚未加入其他出现记录。" },
  "value.ready": { en: "Ready", "zh-Hant": "就緒", "zh-Hans": "就绪" },
  "value.unknown": { en: "Unknown", "zh-Hant": "未知", "zh-Hans": "未知" },
  "value.notRecorded": { en: "Not recorded", "zh-Hant": "未記錄", "zh-Hans": "未记录" },
  "value.noneRecorded": { en: "None recorded", "zh-Hant": "未記錄", "zh-Hans": "未记录" },
  "value.languageNotRecorded": { en: "Language not recorded", "zh-Hant": "語言未記錄", "zh-Hans": "语言未记录" },
  "value.creditsNotRecorded": { en: "Credits not recorded.", "zh-Hant": "尚未記錄工作人員。", "zh-Hans": "尚未记录工作人员。" },
  "value.unmodeledSong": { en: "Unmodeled song", "zh-Hant": "未建模歌曲", "zh-Hans": "未建模歌曲" },
  "value.fanUpload": { en: "fan upload", "zh-Hant": "歌迷上傳", "zh-Hans": "歌迷上传" },
  "value.unofficial": { en: "unofficial", "zh-Hant": "非官方", "zh-Hans": "非官方" },
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

export function titleValues(item: Song | Release | Concert | MusicShow | Appearance): LocaleValues {
  return localizedValues(item.titleLocalized, item.title, "titleOriginal" in item ? item.titleOriginal : undefined);
}

export function trackTitleValues(track: Track): LocaleValues {
  return localizedValues(track.titleOnReleaseLocalized, track.titleOnRelease);
}

export function performanceTitleValues(entry: SongPerformance, fallbackSong?: Song): LocaleValues {
  return localizedValues(entry.titlePerformedLocalized, entry.titlePerformed || fallbackSong?.title || entry.song || "");
}

export function personNameValues(person: Person): LocaleValues {
  return localizedValues(person.nameLocalized, person.displayName, person.nameOriginal);
}

export function personIdValues(id: string): LocaleValues {
  const person = byId(people, id);
  return person ? personNameValues(person) : textValues(id);
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
