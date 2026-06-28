// Normalizes Chinese song titles for matching against songs.json,
// collapsing traditional/simplified variants and stripping punctuation/filler.
const tradSimp = {
  "憶":"忆","臺":"台","體":"体","鳥":"鸟","魚":"鱼","樹":"树","夢":"梦",
  "歡":"欢","顏":"颜","點":"点","鐘":"钟","間":"间","鄉":"乡","灣":"湾",
  "傳":"传","說":"说","聽":"听","場":"场","館":"馆","劇":"剧","動":"动",
  "嘆":"叹","纏":"缠","蟬":"蝉","蘿":"萝","蘇":"苏","蘭":"兰","們":"们",
  "個":"个","這":"这","條":"条","塵":"尘","歲":"岁","髮":"发","駱":"骆",
  "駝":"驼","騮":"骝","齊":"齐","齒":"齿","齡":"龄","齣":"出","齦":"龈",
  "齧":"啮","齪":"龊","齬":"龉","齲":"龋","齷":"龎","齶":"龁",
  "薔":"蔷","蕭":"萧","灑":"洒","蘋":"苹","蝕":"蚀","蟲":"虫","鐮":"镰",
  "鐵":"铁","鐳":"镭","鐶":"镮","鐸":"铎","鐺":"铛","鐵":"铁","鐙":"镫",
  "鐨":"镨","鐩":"镩","鐪":"镬","鐫":"镌","鐭":"镱","鐮":"镰","鐲":"镯",
  "鐵":"铁","鐷":"镟","鐸":"铎","鐹":"镟","鐺":"铛","鐻":"镟","鐼":"镟",
  "鐽":"镟","鐾":"镟","鐿":"镱","籬":"篱","鴿":"鸽","鵝":"鹅","鵬":"鹏",
  "鄰":"邻","鄒":"邹","鄲":"郸","鄺":"邝","鄴":"邺","鄱":"鄱","駒":"驹"
};
export function normalizeTitle(t) {
  let s = String(t || "").toLowerCase();
  s = s.replace(/\s+/g, "");
  s = s.replace(/[（(].*?[)）]/g, "");
  s = s.replace(/[、,，/／·・?!！？.。:：;；'’""]/g, "");
  s = s.replace(/的/g, "");
  s = s.replace(/live$/g, "").replace(/清唱$/g, "").replace(/清唱版$/g, "");
  let out = "";
  for (const ch of s) out += tradSimp[ch] || ch;
  return out;
}
export function buildSongMatcher(songs) {
  const map = new Map();
  for (const x of songs) {
    for (const k of [x.title, x.titleOriginal, ...(x.aliases || [])]) {
      const n = normalizeTitle(k);
      if (n && !map.has(n)) map.set(n, x.id);
    }
  }
  return (title) => map.get(normalizeTitle(title)) || null;
}