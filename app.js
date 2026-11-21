'use strict';
/* ===== Fitness Hocası – tüm veriler cihazda (localStorage + IndexedDB) ===== */
const IMG_PROGRAM = window.IMG_PROGRAM || './program-gorsel.jpg';
const IMG_FOOD = window.IMG_FOOD || './beslenme-gorsel.jpg';
const SINGLE_FILE = !!window.SINGLE_FILE;
const KEY = 'fh_v1';
const $ = s => document.querySelector(s);
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const pad = n => String(n).padStart(2, '0');
const ds = d => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
const today = () => ds(new Date());
const parse = s => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
const diffDays = (a, b) => Math.round((Date.UTC(...ymd(b)) - Date.UTC(...ymd(a))) / 864e5);
const ymd = s => { const [y, m, d] = s.split('-').map(Number); return [y, m - 1, d]; };
const addDays = (s, n) => { const d = parse(s); d.setDate(d.getDate() + n); return ds(d); };
const WD = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
const WDS = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];
const MON = ['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'];
const fmtD = s => { const d = parse(s); return d.getDate() + ' ' + MON[d.getMonth()] + ' ' + WDS[d.getDay()]; };
const num = v => { const n = parseFloat(String(v).replace(',', '.')); return isNaN(n) ? null : n; };
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
const yt = id => 'https://www.youtube.com/watch?v=' + id;

/* ===== Program ===== */
const CARDIO = 'Kardiyo: 20-30 dk eğimli yürüyüş (10-12 derece, 5-6 km/s)';
const DAYS = [
 {title: '1. GÜN – İTİŞ A', short: 'İtiş A', sub: 'Göğüs · Omuz · Triseps', ex: [
  {n: 'Barbell bench press', s: '3x5-8', v: 'vcBig73ojpE', t: 'Kürek kemiklerini geriye sıkıştır, ayaklar yere bassın. Barı göğüs ortasına kontrollü indir, dirsekler ~45°.'},
  {n: 'Incline dumbbell press', s: '3x8-12', v: '8iPEnn-ltC8', t: 'Bench 30° olsun. Dumbbell\'ları üst göğse indir, tepede kilitlemeden it.'},
  {n: 'Cable fly', s: '2x12-15', v: '7UC_8lsE2w0', t: 'Dirsekler hafif bükük ve sabit. Kucaklar gibi kapat, ortada göğsü sık, dönüşte gerilmeyi hisset.'},
  {n: 'Oturarak dumbbell shoulder press', s: '2x8-12', v: 'qEwKCR5JCog', t: 'Sırt desteğe yaslı, karın sıkı. Dumbbell\'ları kulak hizasına indir, beli kavisleme.'},
  {n: 'Cable lateral raise', s: '3x12-20', v: 'mak2T0SFh8Y', t: 'Dirsekten kaldır, omuz hizasında dur. Sallanma yok, inişi yavaş yap.'},
  {n: 'Rope triceps pushdown', s: '3x10-15', v: 'vB5OHsJ3EME', tr: 'NeCiGYWsx1k', t: 'Dirsekler gövdeye yapışık kalsın. Altta ipi iki yana aç ve trisepsi sık.'},
  {n: 'Overhead triceps extension', s: '3x10-12', v: 'YbX7Wd8jQ-Q', t: 'Dirsekler öne baksın, açılmasın. Ağırlığı başın arkasına derin indir, gerilmeyi hisset.'},
  {n: 'Asılı bacak kaldırma', s: '3x12-15', v: 'hdng3Nm1x_E', tr: 't4o4Hn_Xl50', abs: 1, t: 'Sallanma. Bacağı değil leğen kemiğini yukarı kıvır, nefesi ver, inişi 3 saniyede yap.'}]},
 {title: '2. GÜN – ÇEKİŞ A', short: 'Çekiş A', sub: 'Sırt · Arka omuz · Biseps', ex: [
  {n: 'Barfiks / lat pulldown', s: '3x6-10', v: 'K81-SLUFo9c', alt: ['Lat pulldown videosu', 'CAwf7n6Luuc'], t: 'Göğsü bara doğru çek, dirsekleri cebine sokar gibi aşağı indir. Altta tam açıl, kontrollü in.'},
  {n: 'Göğüs destekli row', s: '3x8-12', v: 'kX4gtPQeyb8', t: 'Göğüs pede yapışık kalsın. Dirsekleri geriye çek, kürek kemiklerini sık, 1 sn bekle.'},
  {n: 'Tek kol cable row', s: '2x10-15 her taraf', v: 'CrylzZHfO1c', t: 'Gövde sabit, dirseği kalçana doğru çek. Önde kanadı tam esnet.'},
  {n: 'Reverse pec deck', s: '3x12-20', v: 'vpPjY_2Kq1A', t: 'Kollar hafif bükük, geniş bir yay çiz. Arka omzu hisset, ağırlığı savurma.'},
  {n: 'EZ bar curl', s: '3x8-12', v: 'zG2xJ0Q5QtI', t: 'Dirsekler sabit, gövde sallanmasın. Tepede sık, inişi 2-3 saniyede yap.'},
  {n: 'Incline dumbbell curl', s: '3x10-12', v: 'soxrZlIl35U', t: '45° bench, kollar sarkık başla. Omuz öne kaymadan kıvır, altta tam gerilme.'},
  {n: 'Hammer curl', s: '2x10-15', v: 'zC3nLlEvin4', t: 'Avuç içleri birbirine baksın, dirsek sabit. Ön kol ve brakialisi hisset.'},
  {n: 'Ab wheel', s: '3x10', v: 'A3uK5TPzHq8', abs: 1, t: 'Kalçayı sık, beli çökertme. Gidebildiğin kadar uzan, karınla geri çek.'},
  {n: 'Pallof press', s: '3x10 her taraf', v: '_2xWmYNnFS8', abs: 1, t: 'Kabloya yan dur, kolları düz öne it, 2 sn bekle. Dönmeye direnirken karnı sık.'}]},
 {title: '3. GÜN – BACAK A VE KARIN', short: 'Bacak + Karın', sub: 'Bacak · Baldır · Karın', ex: [
  {n: 'Squat / hack squat', s: '3x6-10', v: 'bEv6CCg2BC8', alt: ['Hack squat videosu', '0tn5K9NlCfo'], t: 'Dizler ayak ucu yönünde, göğüs dik. Kalça diz hizasına kadar insin, topuktan it.'},
  {n: 'Leg press', s: '3x10-15', v: 'IZxyjW7MPJQ', t: 'Bel ve kalça pedden kalkmasın. Dizleri kilitlemeden it.'},
  {n: 'Lying leg curl', s: '3x10-15', v: 'vl5nUdE9mWM', t: 'Kalçayı pede bastır. Topukları kalçaya çek, inişi yavaş yap.'},
  {n: 'Leg extension', s: '2x12-20', v: 'YyvSfVjQeL0', t: 'Tepede 1 sn sık, ağırlığı düşürmeden kontrollü indir.'},
  {n: 'Standing calf raise', s: '4x10-15', v: 'YMmgqO8Jo-k', t: 'Altta 1-2 sn tam gerilme, tepede parmak ucunda sık. Zıplatma yok.'},
  {n: 'Cable crunch', s: '3x10-15', v: '36HK6uPM_PQ', tr: 'Okm7SYZRD-k', abs: 1, t: 'Kalça sabit, sadece sırtını yuvarla. Dirsekleri dizlere götür, nefesi ver ve sık.'},
  {n: 'Reverse crunch', s: '3x12-15', v: 'hyv14e2QDq0', abs: 1, t: 'Bel yere yapışık. Dizleri göğse çekip kalçayı 2-3 cm kaldır, bacağı sallama.'},
  {n: 'Cable woodchopper', s: '3x12 her taraf', v: 'pAplQXk3dkU', abs: 1, t: 'Kollar düz, kalça sabit. Dönüşü karınla yap, kabloyu çaprazlamasına karşı dizine çek.'}]}
];
DAYS.forEach((d, i) => d.ex.forEach((e, j) => { e.id = 'd' + i + 'e' + j; e.sets = parseInt(e.s, 10) || 3; }));

const MEALS = [
 {n: 'Kahvaltı', h: '07-09', m: '2 yumurta, 60 g yulaf, 200 g sade yoğurt, 1 porsiyon meyve', k: 430, p: 28, c: 53, f: 12},
 {n: 'Öğle', h: '12-14', m: '180 g tavuk/hindi, 70 g pirinç, büyük salata, 10 g zeytinyağı', k: 520, p: 45, c: 56, f: 15},
 {n: 'Antrenman öncesi', h: '15-17', m: '200 g yüksek proteinli yoğurt, 1 muz', k: 280, p: 20, c: 35, f: 4},
 {n: 'Akşam', h: '19-21', m: '180 g yağsız balık/et, 250 g patates, bol sebze, 10 g zeytinyağı', k: 520, p: 45, c: 50, f: 14},
 {n: 'Ara öğün', h: '21-22', m: '250 ml kefir, 15 g badem', k: 220, p: 12, c: 12, f: 15}];
const PRESETS = [['Yarım tavuk (derisiz)', 500, 75], ['1 yumurta', 70, 6], ['1 ölçek whey', 120, 24], ['1 muz', 105, 1],
 ['200 g yoğurt', 120, 8], ['100 g pişmiş pirinç', 130, 3], ['100 g patates', 85, 2], ['1 yk zeytinyağı', 120, 0]];

/* ===== Durum ===== */
function defaults() {
  const t = today();
  return {v: 1, settings: {startDate: t, rotation: 'cycle', weekdays: {0: 3, 1: 0, 2: 1, 3: 2, 4: 3, 5: 0, 6: 1},
    kurStart: t, kurWeeks: 5, kurDays: [1, 4], targets: {kcal: 1970, protein: 150, water: 3500}},
    sessions: [], drafts: {}, food: {}, water: {}, cardio: {}, progress: [], health: []};
}
let S;
function load() {
  try { S = JSON.parse(localStorage.getItem(KEY)); } catch (e) { S = null; }
  const d = defaults();
  if (!S || typeof S !== 'object') S = d;
  for (const k in d) if (S[k] == null) S[k] = d[k];
  for (const k in d.settings) if (S.settings[k] == null) S.settings[k] = d.settings[k];
  for (const k in d.settings.targets) if (S.settings.targets[k] == null) S.settings.targets[k] = d.settings.targets[k];
}
function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { toast('Kaydedilemedi: depolama dolu olabilir'); } }
load();

/* ===== Fotoğraflar (IndexedDB, olmazsa localStorage) ===== */
const PDB = {
  db: null,
  open() {
    if (this.db) return Promise.resolve(this.db);
    return new Promise((res, rej) => {
      if (!window.indexedDB) return rej(new Error('no idb'));
      const r = indexedDB.open('fh_photos', 1);
      r.onupgradeneeded = () => r.result.createObjectStore('photos');
      r.onsuccess = () => { this.db = r.result; res(this.db); };
      r.onerror = () => rej(r.error);
    });
  },
  async put(id, data) {
    try { const db = await this.open(); await new Promise((res, rej) => { const tx = db.transaction('photos', 'readwrite'); tx.objectStore('photos').put(data, id); tx.oncomplete = res; tx.onerror = () => rej(tx.error); }); }
    catch (e) { localStorage.setItem('fh_photo_' + id, data); }
  },
  async get(id) {
    try { const db = await this.open(); const v = await new Promise((res, rej) => { const r = db.transaction('photos').objectStore('photos').get(id); r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); }); if (v) return v; } catch (e) {}
    return localStorage.getItem('fh_photo_' + id);
  },
  async del(id) {
    try { const db = await this.open(); db.transaction('photos', 'readwrite').objectStore('photos').delete(id); } catch (e) {}
    localStorage.removeItem('fh_photo_' + id);
  },
  async clear() {
    try { const db = await this.open(); db.transaction('photos', 'readwrite').objectStore('photos').clear(); } catch (e) {}
    Object.keys(localStorage).filter(k => k.startsWith('fh_photo_')).forEach(k => localStorage.removeItem(k));
  }
};
function compress(file, max = 800) {
  return new Promise((res, rej) => {
    const fr = new FileReader();
    fr.onload = () => { const im = new Image(); im.onload = () => {
      const sc = Math.min(1, max / Math.max(im.width, im.height)); const c = document.createElement('canvas');
      c.width = Math.round(im.width * sc); c.height = Math.round(im.height * sc);
      c.getContext('2d').drawImage(im, 0, 0, c.width, c.height); res(c.toDataURL('image/jpeg', 0.75)); };
      im.onerror = rej; im.src = fr.result; };
    fr.onerror = rej; fr.readAsDataURL(file);
  });
}

/* ===== Hesaplar ===== */
function sportDay(date = today()) { return diffDays(S.settings.startDate, date) + 1; }
function planFor(date) { // 0,1,2 = program günü, 3 = dinlenme, -1 = başlamadı
  const st = S.settings;
  if (st.rotation === 'weekdays') { const v = st.weekdays[parse(date).getDay()]; return v == null ? 3 : +v; }
  const n = diffDays(st.startDate, date); if (n < 0) return -1; return n % 4;
}
const planName = p => p === 3 ? 'Dinlenme' : p === -1 ? 'Henüz başlamadı' : DAYS[p].short;
function sessionDates() { return new Set(S.sessions.map(s => s.date)); }
function streak() {
  const set = sessionDates(); let d = today(), n = 0, guard = 0;
  if (!set.has(d)) d = addDays(d, -1);
  while (guard++ < 2000) {
    if (diffDays(S.settings.startDate, d) < 0 && S.settings.rotation === 'cycle') break;
    if (set.has(d)) n++;
    else if (planFor(d) !== 3) break;
    d = addDays(d, -1);
  }
  return n;
}
function foodDay(date = today()) { if (!S.food[date]) S.food[date] = {meals: [], log: []}; return S.food[date]; }
function foodTotals(date = today()) {
  const f = S.food[date] || {meals: [], log: []}; const t = {k: 0, p: 0, c: 0, f: 0};
  MEALS.forEach((m, i) => { if (f.meals[i]) { t.k += m.k; t.p += m.p; t.c += m.c; t.f += m.f; } });
  f.log.forEach(l => { t.k += +l.k || 0; t.p += +l.p || 0; });
  return t;
}
function lastSession(day) { for (let i = S.sessions.length - 1; i >= 0; i--) if (S.sessions[i].day === day) return S.sessions[i]; return null; }
function kur() {
  const st = S.settings; if (!st.kurStart) return null;
  const len = Math.max(1, Math.round(st.kurWeeks * 7)); const n = diffDays(st.kurStart, today()) + 1;
  return {n, len, rem: Math.max(0, len - n), active: n >= 1 && n <= len, reminder: st.kurDays.includes(new Date().getDay())};
}

/* ===== Yardımcı UI ===== */
let tT;
function toast(m) { const t = $('#toast'); t.textContent = m; t.classList.add('on'); clearTimeout(tT); tT = setTimeout(() => t.classList.remove('on'), 2000); }
function viewImg(src) { $('#vImg').src = src; $('#viewer').classList.add('on'); }
$('#vClose').onclick = () => $('#viewer').classList.remove('on');
function bar(v, max, cls = '') { const p = Math.min(100, max ? v / max * 100 : 0); return `<div class="bar ${cls}"><i style="width:${p}%"></i></div>`; }
function waterCard() {
  const w = S.water[today()] || 0, tg = S.settings.targets.water;
  return `<div class="card"><h2>💧 Su takibi</h2><div class="water"><div class="glass"><i style="height:${Math.min(100, w / tg * 100)}%"></i></div>
  <div style="flex:1"><div class="big blue">${(w / 1000).toFixed(2).replace('.', ',')} <small>/ ${(tg / 1000).toFixed(1).replace('.', ',')} L</small></div>
  <div class="row" style="margin-top:8px"><button class="btn blue" data-act="w+">+250 ml</button><button class="btn sm" data-act="w-">−250</button></div></div></div></div>`;
}

/* ===== Görünümler ===== */
let tab = 'home', progDay = null, sub = null;
const V = {};

V.home = () => {
  const t = today(), sd = sportDay(), p = planFor(t), k = kur(), ft = foodTotals(), tg = S.settings.targets;
  const doneToday = S.sessions.some(s => s.date === t);
  return `
  <div class="card hero"><div class="mut">${fmtD(t)}</div>
   <div class="big">${sd >= 1 ? `Sporun <span class="red">${sd}.</span> günü` : `Başlangıca ${1 - sd} gün`}</div>
   <div class="row" style="margin-top:10px"><span class="badge ${p === 3 ? 'g' : ''}">Bugün: ${esc(planName(p))}</span>${doneToday ? '<span class="badge g">✓ Antrenman yapıldı</span>' : ''}
   ${k && k.reminder && k.active ? '<span class="badge b">📌 Kür hatırlatma günü</span>' : ''}</div>
   ${p >= 0 && p < 3 ? `<button class="btn red full" style="margin-top:12px" data-act="goDay" data-d="${p}">Bugünkü antrenmana git →</button>` :
     p === 3 ? '<p class="mut" style="margin:10px 0 0">Dinlenme günü: hafif yürüyüş, esneme ve bol su. Kaslar dinlenirken büyür.</p>' : ''}
  </div>
  <div class="grid2" style="margin-bottom:14px">
   <div class="stat"><div class="v red">${S.sessions.length}</div><div class="l">Toplam antrenman</div></div>
   <div class="stat"><div class="v yel">🔥 ${streak()}</div><div class="l">Seri (gün)</div></div>
   <div class="stat"><div class="v green">${ft.k}</div><div class="l">kcal / ${tg.kcal}</div>${bar(ft.k, tg.kcal, 'g')}</div>
   <div class="stat"><div class="v blue">${ft.p} g</div><div class="l">protein / ${tg.protein} g</div>${bar(ft.p, tg.protein, 'b')}</div>
  </div>
  ${waterCard()}
  <div class="card"><h2>🗓️ Kür takibi</h2>${!k ? '<p class="mut">Ayarlar\'dan kür başlangıç tarihini gir.</p>' :
   `<div class="big">${k.n < 1 ? `Başlangıca ${1 - k.n} gün` : k.n > k.len ? '<span class="green">Kür bitti</span>' : `Kürün <span class="blue">${k.n}.</span> günü <small>/ ${k.len}</small>`}</div>
   ${k.active ? `<div style="margin:8px 0">${bar(k.n, k.len, 'b')}</div><div class="mut">Kalan: <b>${k.rem}</b> gün</div>` : ''}
   ${k.n > k.len ? '<div class="warn" style="margin-top:8px">Kür bitti: PCT (kür sonrası toparlanma) planını doktorunla netleştir ve kan tahlili yaptır.</div>' : ''}
   <div class="mut" style="margin-top:6px">Hatırlatma günleri: ${S.settings.kurDays.slice().sort().map(d => WD[d]).join(', ') || '—'}</div>`}</div>
  <div class="card"><h2>❤️ Sağlık</h2><p class="mut" style="margin:0 0 10px">Kan tahlili, tansiyon ve nabız takibi, uyarı işaretleri.</p>
   <button class="btn o-red full" data-act="health">Sağlık sayfasını aç →</button></div>
  <div class="card"><h2>📅 Önümüzdeki günler</h2><div class="list">${[0, 1, 2, 3, 4, 5, 6].map(i => { const d = addDays(t, i), pp = planFor(d);
    return `<div class="it"><span>${i === 0 ? '<b>Bugün</b>' : fmtD(d)}</span><span class="${pp === 3 ? 'green' : 'mut'}">${esc(planName(pp))}${S.settings.kurDays.includes(parse(d).getDay()) && k && diffDays(S.settings.kurStart, d) >= 0 && diffDays(S.settings.kurStart, d) < k.len ? ' · 📌' : ''}</span></div>`; }).join('')}</div></div>`;
};

function absTipsCard() {
  return `<div class="card"><details><summary>🎯 Karın form ipuçları</summary><ul class="tips">
  <li><b>Beli yere bastır:</b> göbek deliğini omurgaya çek, bel boşluğunu kapat.</li>
  <li><b>Kaldırma, kıvır:</b> kaburgayı kalçaya yaklaştır, tepede 2 sn sık.</li>
  <li><b>Nefes:</b> kasılırken nefesini tamamen ver.</li>
  <li><b>Yavaşla:</b> inişi 3 saniyede yap.</li>
  <li><b>Side plank yerine:</b> cable woodchopper ve pallof press.</li></ul></details></div>`;
}
V.program = () => {
  if (progDay == null) { const p = planFor(today()); progDay = p >= 0 && p < 3 ? p : 0; }
  const d = DAYS[progDay], dr = S.drafts[progDay] || {}, last = lastSession(progDay), c = 'c' + progDay;
  const hist = S.sessions.filter(s => s.day === progDay).slice().reverse();
  return `<div class="card imgwrap"><img src="${IMG_PROGRAM}" alt="Program görseli" data-act="zoom"><div class="mut" style="margin-top:6px;text-align:center">Büyütmek için dokun</div></div>
  <div class="tabs">${DAYS.map((x, i) => `<button class="c${i} ${i === progDay ? 'on' : ''}" data-act="pday" data-d="${i}">${i + 1}. ${esc(x.short)}</button>`).join('')}</div>
  <div class="card"><h2 class="${['red', 'blue', 'green'][progDay]}">${esc(d.title)}</h2><div class="mut">${esc(d.sub)}${last ? ' · Son: ' + fmtD(last.date) : ''}</div></div>
  ${d.ex.map(e => { const le = last && last.ex.find(x => x.id === e.id); const de = dr[e.id] || [];
    return `<div class="card ex ${c}"><div class="hd"><div class="nm">${esc(e.n)}</div><div class="sc">${esc(e.s)}</div></div>
    <div class="tip">💡 ${esc(e.t)}</div>
    <div class="row"><a class="btn sm red" href="${yt(e.v)}" target="_blank" rel="noopener">▶ Videoyu izle</a>
    ${e.tr ? `<a class="btn sm o-blue" href="${yt(e.tr)}" target="_blank" rel="noopener">🇹🇷 Türkçe video</a>` : ''}
    ${e.alt ? `<a class="btn sm o-blue" href="${yt(e.alt[1])}" target="_blank" rel="noopener">▶ ${esc(e.alt[0])}</a>` : ''}</div>
    <div class="sets"><div class="h">Set</div><div class="h">kg</div><div class="h">Tekrar</div><div class="h">✓</div>
    ${Array.from({length: e.sets}, (_, i) => { const v = de[i] || {}, l = (le && le.sets[i]) || {};
      return `<div class="n">${i + 1}</div><input inputmode="decimal" data-in="kg" data-e="${e.id}" data-i="${i}" value="${esc(v.kg || '')}" placeholder="${esc(l.kg || 'kg')}">
      <input inputmode="numeric" data-in="reps" data-e="${e.id}" data-i="${i}" value="${esc(v.reps || '')}" placeholder="${esc(l.reps || 'tekrar')}">
      <input type="checkbox" class="chk" data-in="done" data-e="${e.id}" data-i="${i}" ${v.done ? 'checked' : ''} aria-label="Set ${i + 1} tamam">`; }).join('')}</div></div>`; }).join('')}
  <div class="card"><label class="line"><input type="checkbox" class="chk" data-in="cardio" ${dr._cardio ? 'checked' : ''}><span>🚶 ${CARDIO}</span></label></div>
  ${absTipsCard()}
  <button class="btn green full" data-act="finish" style="min-height:56px;font-size:17px">✓ Antrenmanı bitir</button>
  <div class="card hist" style="margin-top:14px"><h2>📜 Geçmiş – ${esc(d.short)}</h2>${hist.length ? `<div class="list">${hist.map(s => `<div class="it"><details><summary>${fmtD(s.date)} · ${s.ex.reduce((a, x) => a + x.sets.filter(y => y.done || y.kg || y.reps).length, 0)} set${s.cardio ? ' · 🚶' : ''}</summary>
   ${s.ex.filter(x => x.sets.some(y => y.kg || y.reps)).map(x => `<div class="mut" style="padding:3px 0"><b style="color:var(--tx)">${esc(x.n)}</b>: ${x.sets.filter(y => y.kg || y.reps).map(y => `${esc(y.kg || '-')}kg×${esc(y.reps || '-')}`).join(', ')}</div>`).join('') || '<div class="mut">Değer girilmemiş.</div>'}
   <button class="btn sm o-red" data-act="delSess" data-id="${s.id}" style="margin-top:6px">Sil</button></details></div>`).join('')}</div>` : '<p class="mut">Henüz kayıt yok.</p>'}</div>`;
};

V.food = () => {
  const f = foodDay(), t = foodTotals(), tg = S.settings.targets;
  const past = Object.keys(S.food).filter(d => d !== today()).sort().reverse().slice(0, 14);
  return `<div class="card imgwrap"><img src="${IMG_FOOD}" alt="Beslenme görseli" data-act="zoom"></div>
  <div class="card"><h2>📊 Bugün</h2>
   <div class="row" style="justify-content:space-between"><b>Kalori</b><span><b class="green">${t.k}</b> / ${tg.kcal} kcal</span></div>${bar(t.k, tg.kcal, 'g')}
   <div class="row" style="justify-content:space-between;margin-top:10px"><b>Protein</b><span><b class="blue">${t.p}</b> / ${tg.protein} g</span></div>${bar(t.p, tg.protein, 'b')}
   <div class="mut" style="margin-top:8px">Karb: ${t.c} g · Yağ: ${t.f} g (öğünlerden)</div>
   <div class="tip">💪 Protein hedefini 170 g üstüne çıkarmayı düşün.</div></div>
  <div class="card"><h2>🍽️ Öğünler</h2>${MEALS.map((m, i) => `<label class="meal"><input type="checkbox" class="chk" data-in="meal" data-i="${i}" ${f.meals[i] ? 'checked' : ''}>
   <div><div class="t">${i + 1}. ${m.n} <span class="mut">${m.h}</span></div><div class="m">${m.m}</div>
   <div class="mac"><b>${m.k} kcal</b> · P ${m.p} · K ${m.c} · Y ${m.f}</div></div></label>`).join('')}</div>
  <div class="card"><h2>➕ Hızlı ekle</h2><div class="chips">${PRESETS.map((p, i) => `<button class="chip" data-act="preset" data-i="${i}">${p[0]} <small>${p[1]}/${p[2]}g</small></button>`).join('')}</div>
   <h3>Özel</h3><div class="grid2"><div style="grid-column:1/3"><input id="fName" placeholder="Yiyecek adı"></div>
   <input id="fK" inputmode="numeric" placeholder="kcal"><input id="fP" inputmode="decimal" placeholder="Protein g"></div>
   <button class="btn blue full" style="margin-top:8px" data-act="addFood">Ekle</button>
   ${f.log.length ? `<div class="list" style="margin-top:10px">${f.log.map((l, i) => `<div class="it"><span>${esc(l.n)}</span><span class="row"><span class="mut">${l.k} kcal · ${l.p} g</span><button class="x" data-act="delFood" data-i="${i}" aria-label="Sil">×</button></span></div>`).join('')}</div>` : ''}</div>
  ${waterCard()}
  <div class="card"><h2>📝 İpuçları</h2><ul class="tips"><li>Air fryer'da yağı sprey ya da fırçayla kullan.</li><li>Tavuğun derisini soy.</li><li>Günde 3-4 L su iç.</li><li>Meyveyi günde 2-3 porsiyonla sınırla.</li><li>Kalori çok düşük kalırsa metabolizma yavaşlar ve kas risk altına girer.</li></ul></div>
  <div class="card"><h2>📅 Geçmiş günler</h2>${past.length ? `<div class="list">${past.map(d => { const x = foodTotals(d); return `<div class="it"><span>${fmtD(d)}</span><span class="mut">${x.k} kcal · ${x.p} g P · ${((S.water[d] || 0) / 1000).toFixed(1)} L</span></div>`; }).join('')}</div>` : '<p class="mut">Henüz geçmiş yok.</p>'}</div>`;
};

function chart(pts, color, unit) {
  if (pts.length < 2) return '<p class="mut">Grafik için en az 2 kayıt gerekli.</p>';
  const W = 340, H = 170, P = 30, xs = pts.map(p => Date.UTC(...ymd(p.d))), ys = pts.map(p => p.v);
  let x0 = Math.min(...xs), x1 = Math.max(...xs); if (x0 === x1) x1 = x0 + 1;
  let y0 = Math.min(...ys), y1 = Math.max(...ys); if (y0 === y1) { y0 -= 1; y1 += 1; } const pd = (y1 - y0) * .1; y0 -= pd; y1 += pd;
  const X = x => P + (x - x0) / (x1 - x0) * (W - P - 10), Y = y => 10 + (1 - (y - y0) / (y1 - y0)) * (H - 40);
  const path = pts.map((p, i) => (i ? 'L' : 'M') + X(xs[i]).toFixed(1) + ' ' + Y(p.v).toFixed(1)).join(' ');
  const g = [y0 + pd, (y0 + y1) / 2, y1 - pd];
  return `<svg class="chart" viewBox="0 0 ${W} ${H}">${g.map(v => `<line x1="${P}" x2="${W - 10}" y1="${Y(v)}" y2="${Y(v)}" stroke="#26262f"/><text x="2" y="${Y(v) + 4}" fill="#9a9aa8" font-size="10">${v.toFixed(1)}</text>`).join('')}
  <path d="${path}" fill="none" stroke="${color}" stroke-width="3" stroke-linejoin="round"/>${pts.map((p, i) => `<circle cx="${X(xs[i])}" cy="${Y(p.v)}" r="4" fill="${color}"/>`).join('')}
  <text x="${P}" y="${H - 8}" fill="#9a9aa8" font-size="10">${fmtD(pts[0].d)}</text><text x="${W - 10}" y="${H - 8}" fill="#9a9aa8" font-size="10" text-anchor="end">${fmtD(pts[pts.length - 1].d)}</text></svg>`;
}
function delta(pts, unit) {
  if (pts.length < 2) return ''; const d = pts[pts.length - 1].v - pts[0].v;
  return `<div style="margin-top:6px">İlk kayıttan beri: <b class="${d <= 0 ? 'ok' : 'bad'}">${d > 0 ? '+' : ''}${d.toFixed(1)} ${unit}</b> <span class="mut">(şu an ${pts[pts.length - 1].v} ${unit})</span></div>`;
}
V.progress = () => {
  const pr = S.progress.slice().sort((a, b) => a.date < b.date ? -1 : 1);
  const kg = pr.filter(p => p.kg != null).map(p => ({d: p.date, v: p.kg})), bel = pr.filter(p => p.waist != null).map(p => ({d: p.date, v: p.waist}));
  return `<div class="card"><h2>➕ Yeni ölçüm</h2><p class="mut" style="margin:0">Haftada bir, sabah aç karnına ölç. Fotoğrafı aynı ışıkta çek.</p>
   <label class="f">Tarih</label><input type="date" id="pDate" value="${today()}">
   <div class="grid2"><div><label class="f">Kilo (kg)</label><input id="pKg" inputmode="decimal" placeholder="örn. 82,5"></div><div><label class="f">Bel (cm)</label><input id="pW" inputmode="decimal" placeholder="örn. 90"></div></div>
   <label class="f">Not</label><input id="pNote" placeholder="İsteğe bağlı">
   <label class="f">Fotoğraf (isteğe bağlı)</label><input type="file" id="pPhoto" accept="image/*">
   <button class="btn red full" style="margin-top:10px" data-act="addProg">Kaydet</button></div>
  <div class="card"><h2 class="red">⚖️ Kilo</h2>${chart(kg, '#ff2d55')}${delta(kg, 'kg')}</div>
  <div class="card"><h2 class="blue">📏 Bel çevresi</h2>${chart(bel, '#2fa8ff')}${delta(bel, 'cm')}</div>
  <div class="card"><h2>📋 Kayıtlar</h2>${pr.length ? `<div class="list">${pr.slice().reverse().map(p => `<div class="it"><div class="row" style="flex-wrap:nowrap">${p.photo ? `<img class="thumb" data-photo="${p.photo}" alt="">` : ''}<div><b>${fmtD(p.date)}</b><div class="mut">${p.kg != null ? p.kg + ' kg' : ''}${p.kg != null && p.waist != null ? ' · ' : ''}${p.waist != null ? p.waist + ' cm' : ''}</div>${p.note ? `<div class="mut">${esc(p.note)}</div>` : ''}</div></div><button class="x" data-act="delProg" data-id="${p.id}" aria-label="Sil">×</button></div>`).join('')}</div>` : '<p class="mut">Henüz kayıt yok.</p>'}</div>
  <div class="card"><h2>🏋️ Antrenman özeti</h2><div class="grid2">${DAYS.map((d, i) => `<div class="stat"><div class="v ${['red', 'blue', 'green'][i]}">${S.sessions.filter(s => s.day === i).length}</div><div class="l">${esc(d.short)}</div></div>`).join('')}<div class="stat"><div class="v yel">${S.sessions.filter(s => s.cardio).length}</div><div class="l">Kardiyo</div></div></div></div>`;
};

V.health = () => {
  const h = S.health.slice().sort((a, b) => a.date < b.date ? 1 : -1);
  return `<div class="warn">Bu bölüm genel bilgilendirmedir, tıbbi tavsiye değildir. İlaç ve doz kararları için mutlaka doktoruna danış.</div><div style="height:14px"></div>
  <div class="card"><h2>🩸 Kan tahlili</h2><p class="mut" style="margin:0 0 6px">Kür öncesi, ortası ve bitiminden sonra yaptır:</p><ul class="tips">
   <li><b>Hemogram</b> – özellikle hematokrit</li><li><b>Karaciğer</b> – ALT / AST</li><li><b>Lipid profili</b> – kolesterol (HDL/LDL), trigliserid</li><li><b>Hormon paneli</b></li><li><b>Böbrek değerleri</b> – kreatinin, üre</li></ul></div>
  <div class="card"><h2>⚠️ Uyarı işaretleri</h2><ul class="tips">
   <li>Tansiyon <b>140/90</b> üstündeyse doktora git.</li>
   <li>Klenbuterol kullanırken <b>çarpıntı, göğüs ağrısı</b> ya da <b>dinlenme nabzı 100 üstü</b> olursa bırak ve doktora git.</li>
   <li>Kür sonrası <b>PCT</b>'yi doktorunla planla.</li></ul></div>
  <div class="card"><h2>📝 Tansiyon / nabız kaydı</h2>
   <div class="grid2"><div><label class="f">Büyük (sistolik)</label><input id="hS" inputmode="numeric" placeholder="120"></div><div><label class="f">Küçük (diastolik)</label><input id="hD" inputmode="numeric" placeholder="80"></div>
   <div><label class="f">Nabız (dinlenme)</label><input id="hP" inputmode="numeric" placeholder="70"></div><div><label class="f">Tarih</label><input type="date" id="hDate" value="${today()}"></div></div>
   <button class="btn red full" style="margin-top:10px" data-act="addHealth">Kaydet</button>
   ${h.length ? `<div class="list" style="margin-top:10px">${h.map(x => { const bad = (x.sys >= 140 || x.dia >= 90), bp = x.pulse > 100;
     return `<div class="it"><span>${fmtD(x.date)}</span><span class="row"><span class="${bad ? 'bad' : 'ok'}">${x.sys || '-'}/${x.dia || '-'}</span><span class="${bp ? 'bad' : 'mut'}">❤️ ${x.pulse || '-'}</span><button class="x" data-act="delHealth" data-id="${x.id}" aria-label="Sil">×</button></span></div>${bad || bp ? '<div class="warn">Bu değer sınırın üstünde. Doktora danış.</div>' : ''}`; }).join('')}</div>` : ''}</div>`;
};

V.settings = () => {
  const st = S.settings;
  return `<div class="card"><h2>📅 Tarihler</h2><label class="f">Spor başlangıç tarihi (1. gün)</label><input type="date" data-set="startDate" value="${st.startDate}">
   <label class="f">Kür başlangıç tarihi</label><input type="date" data-set="kurStart" value="${st.kurStart || ''}">
   <label class="f">Kür süresi (hafta)</label><input type="number" min="1" max="52" inputmode="numeric" data-set="kurWeeks" value="${st.kurWeeks}">
   <label class="f">Kür hatırlatma günleri</label><div class="wd">${[1, 2, 3, 4, 5, 6, 0].map(d => `<label><input type="checkbox" class="chk" data-kd="${d}" ${st.kurDays.includes(d) ? 'checked' : ''}>${WDS[d]}</label>`).join('')}</div></div>
  <div class="card"><h2>🔁 Program düzeni</h2>
   <label class="line"><input type="radio" name="rot" class="chk" data-rot="cycle" ${st.rotation === 'cycle' ? 'checked' : ''}><span>3 gün antrenman, 1 gün dinlenme (döngü)</span></label>
   <label class="line"><input type="radio" name="rot" class="chk" data-rot="weekdays" ${st.rotation === 'weekdays' ? 'checked' : ''}><span>Haftanın günlerine göre seç</span></label>
   ${st.rotation === 'weekdays' ? [1, 2, 3, 4, 5, 6, 0].map(d => `<div class="wsel"><span>${WD[d]}</span><select data-wd="${d}">${[0, 1, 2, 3].map(v => `<option value="${v}" ${+st.weekdays[d] === v ? 'selected' : ''}>${v === 3 ? 'Dinlenme' : DAYS[v].short}</option>`).join('')}</select></div>`).join('') : ''}</div>
  <div class="card"><h2>🎯 Hedefler</h2><div class="grid2">
   <div><label class="f">Kalori (kcal)</label><input type="number" inputmode="numeric" data-tg="kcal" value="${st.targets.kcal}"></div>
   <div><label class="f">Protein (g)</label><input type="number" inputmode="numeric" data-tg="protein" value="${st.targets.protein}"></div>
   <div><label class="f">Su (ml)</label><input type="number" inputmode="numeric" step="250" data-tg="water" value="${st.targets.water}"></div></div></div>
  <div class="card"><h2>💾 Yedek</h2><p class="mut" style="margin-top:0">Verilerin sadece bu telefonda. Ara sıra yedek al.</p>
   <button class="btn blue full" data-act="export">⬇ Yedeği indir (JSON)</button>
   <label class="btn full" style="margin-top:8px">⬆ Yedekten yükle<input type="file" id="imp" accept=".json,application/json" hidden></label></div>
  <div class="card"><h2 class="red">🗑️ Sıfırla</h2><button class="btn o-red full" data-act="reset">Tüm verileri sil</button></div>
  <p class="mut" style="text-align:center">Sürüm: <b id="verLbl">${SINGLE_FILE ? 'tek dosya' : '…'}</b></p>`;
};

/* ===== Render ===== */
function render() {
  document.querySelectorAll('nav.bb button').forEach(b => b.classList.toggle('on', b.dataset.t === (sub ? 'home' : tab)));
  $('#backBtn').hidden = !sub;
  $('#ttl').innerHTML = sub === 'health' ? 'Sağlık' : {home: 'Fitness <b>Hocası</b>', program: 'Program', food: 'Beslenme', progress: 'İlerleme', settings: 'Ayarlar'}[tab];
  $('#todayLbl').textContent = fmtD(today());
  $('#view').innerHTML = V[sub || tab]();
  if (tab === 'progress' && !sub) document.querySelectorAll('img[data-photo]').forEach(async im => { const d = await PDB.get(im.dataset.photo); if (d) im.src = d; });
  if (tab === 'settings' && !sub) showVersion();
}
function go(t) { tab = t; sub = null; render(); window.scrollTo(0, 0); }
$('#nav').onclick = e => { const b = e.target.closest('button'); if (b) go(b.dataset.t); };
$('#backBtn').onclick = () => go('home');

/* ===== Olaylar ===== */
const view = $('#view');
view.addEventListener('click', async e => {
  const el = e.target.closest('[data-act]'); if (!el) return;
  const a = el.dataset.act, t = today();
  if (a === 'zoom') return viewImg(el.src);
  if (a === 'goDay') { progDay = +el.dataset.d; return go('program'); }
  if (a === 'health') { sub = 'health'; render(); return window.scrollTo(0, 0); }
  if (a === 'pday') { progDay = +el.dataset.d; render(); return; }
  if (a === 'w+' || a === 'w-') { S.water[t] = Math.max(0, (S.water[t] || 0) + (a === 'w+' ? 250 : -250)); save(); render(); if (a === 'w+' && S.water[t] === S.settings.targets.water) toast('💧 Su hedefi tamam!'); return; }
  if (a === 'finish') {
    const dr = S.drafts[progDay] || {}, d = DAYS[progDay];
    const ex = d.ex.map(x => ({id: x.id, n: x.n, sets: Array.from({length: x.sets}, (_, i) => { const v = (dr[x.id] || [])[i] || {}; return {kg: v.kg || '', reps: v.reps || '', done: !!v.done}; })}));
    const any = ex.some(x => x.sets.some(s => s.done || s.kg || s.reps)) || dr._cardio;
    if (!any && !confirm('Hiç set girilmedi. Yine de antrenmanı kaydetmek istiyor musun?')) return;
    S.sessions.push({id: uid(), date: t, day: progDay, ex, cardio: !!dr._cardio});
    delete S.drafts[progDay]; save(); render(); window.scrollTo(0, 0); return toast('💪 Antrenman kaydedildi!');
  }
  if (a === 'delSess') { if (confirm('Bu antrenman kaydı silinsin mi?')) { S.sessions = S.sessions.filter(s => s.id !== el.dataset.id); save(); render(); } return; }
  if (a === 'preset') { const p = PRESETS[+el.dataset.i]; foodDay().log.push({n: p[0], k: p[1], p: p[2]}); save(); render(); return toast(p[0] + ' eklendi'); }
  if (a === 'addFood') { const n = $('#fName').value.trim(), k = num($('#fK').value), p = num($('#fP').value) || 0;
    if (!n || k == null) return toast('Ad ve kalori gir'); foodDay().log.push({n, k, p}); save(); render(); return toast(n + ' eklendi'); }
  if (a === 'delFood') { foodDay().log.splice(+el.dataset.i, 1); save(); render(); return; }
  if (a === 'addProg') {
    const kg = num($('#pKg').value), w = num($('#pW').value), note = $('#pNote').value.trim(), date = $('#pDate').value || t, f = $('#pPhoto').files[0];
    if (kg == null && w == null && !note && !f) return toast('En az bir değer gir');
    const it = {id: uid(), date, kg, waist: w, note};
    if (f) { try { const data = await compress(f); it.photo = 'ph_' + it.id; await PDB.put(it.photo, data); } catch (er) { toast('Fotoğraf eklenemedi'); } }
    S.progress.push(it); save(); render(); return toast('Ölçüm kaydedildi');
  }
  if (a === 'delProg') { if (!confirm('Bu kayıt silinsin mi?')) return; const p = S.progress.find(x => x.id === el.dataset.id); if (p && p.photo) PDB.del(p.photo);
    S.progress = S.progress.filter(x => x.id !== el.dataset.id); save(); render(); return; }
  if (a === 'addHealth') { const sys = num($('#hS').value), dia = num($('#hD').value), pulse = num($('#hP').value);
    if (sys == null && dia == null && pulse == null) return toast('Değer gir');
    S.health.push({id: uid(), date: $('#hDate').value || t, sys, dia, pulse}); save(); render();
    return toast((sys >= 140 || dia >= 90 || pulse > 100) ? '⚠️ Değer yüksek – doktora danış' : 'Kaydedildi'); }
  if (a === 'delHealth') { S.health = S.health.filter(x => x.id !== el.dataset.id); save(); render(); return; }
  if (a === 'export') return exportData();
  if (a === 'reset') { if (!confirm('TÜM veriler silinecek (antrenman, beslenme, ölçümler, fotoğraflar). Emin misin?')) return; if (!confirm('Son kez soruyorum: geri alınamaz. Silinsin mi?')) return;
    localStorage.removeItem(KEY); await PDB.clear(); load(); progDay = null; render(); return toast('Veriler sıfırlandı'); }
});
view.addEventListener('click', e => { const im = e.target.closest('img[data-photo]'); if (im && im.src) viewImg(im.src); });
view.addEventListener('input', e => {
  const el = e.target;
  if (el.dataset.in === 'kg' || el.dataset.in === 'reps') { const dr = S.drafts[progDay] = S.drafts[progDay] || {}; const arr = dr[el.dataset.e] = dr[el.dataset.e] || [];
    arr[+el.dataset.i] = Object.assign(arr[+el.dataset.i] || {}, {[el.dataset.in]: el.value}); save(); }
});
view.addEventListener('change', async e => {
  const el = e.target, st = S.settings;
  if (el.dataset.in === 'done') { const dr = S.drafts[progDay] = S.drafts[progDay] || {}; const arr = dr[el.dataset.e] = dr[el.dataset.e] || [];
    arr[+el.dataset.i] = Object.assign(arr[+el.dataset.i] || {}, {done: el.checked});
    // boş bırakılan alanları önceki değerle doldur
    const row = arr[+el.dataset.i]; if (el.checked) { const ins = view.querySelectorAll(`input[data-e="${el.dataset.e}"][data-i="${el.dataset.i}"]`);
      ins.forEach(i => { if ((i.dataset.in === 'kg' || i.dataset.in === 'reps') && !i.value && i.placeholder && !/kg|tekrar/.test(i.placeholder)) { i.value = i.placeholder; row[i.dataset.in] = i.value; } }); }
    save(); return; }
  if (el.dataset.in === 'cardio') { const dr = S.drafts[progDay] = S.drafts[progDay] || {}; dr._cardio = el.checked; save(); return; }
  if (el.dataset.in === 'meal') { const f = foodDay(); f.meals[+el.dataset.i] = el.checked; save(); render(); return; }
  if (el.dataset.set) { let v = el.value; if (el.dataset.set === 'kurWeeks') v = Math.max(1, num(v) || 5); if (el.dataset.set === 'startDate' && !v) v = today(); st[el.dataset.set] = v; save(); return toast('Kaydedildi'); }
  if (el.dataset.kd) { const d = +el.dataset.kd; st.kurDays = el.checked ? [...new Set([...st.kurDays, d])] : st.kurDays.filter(x => x !== d); save(); return; }
  if (el.dataset.rot) { st.rotation = el.dataset.rot; save(); render(); return; }
  if (el.dataset.wd) { st.weekdays[el.dataset.wd] = +el.value; save(); return toast('Kaydedildi'); }
  if (el.dataset.tg) { const v = num(el.value); if (v > 0) { st.targets[el.dataset.tg] = v; save(); toast('Hedef güncellendi'); } return; }
  if (el.id === 'imp' && el.files[0]) {
    try { const data = JSON.parse(await el.files[0].text()); if (!data || !data.settings) throw 0;
      if (!confirm('Mevcut veriler yedekteki verilerle değiştirilecek. Devam?')) return;
      const photos = data._photos || {}; delete data._photos; S = data; save(); load();
      for (const k in photos) await PDB.put(k, photos[k]); render(); toast('Yedek yüklendi');
    } catch (er) { toast('Geçersiz yedek dosyası'); }
  }
});
async function exportData() {
  const out = JSON.parse(JSON.stringify(S)); out._photos = {};
  for (const p of S.progress) if (p.photo) { const d = await PDB.get(p.photo); if (d) out._photos[p.photo] = d; }
  const blob = new Blob([JSON.stringify(out)], {type: 'application/json'}); const a = document.createElement('a');
  a.href = URL.createObjectURL(blob); a.download = 'fitness-hocasi-yedek-' + today() + '.json'; document.body.appendChild(a); a.click();
  setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000); toast('Yedek indirildi');
}

/* ===== Güncelleme / Service Worker ===== */
let swReg = null;
async function showVersion() {
  const lbl = $('#verLbl'); if (!lbl || SINGLE_FILE) return;
  let v = null;
  try { const c = navigator.serviceWorker && navigator.serviceWorker.controller; if (c) v = await new Promise(res => { const ch = new MessageChannel(); ch.port1.onmessage = m => res(m.data); c.postMessage({type: 'GET_VERSION'}, [ch.port2]); setTimeout(() => res(null), 1500); }); } catch (e) {}
  if (!v) try { v = (await (await fetch('./version.json', {cache: 'no-store'})).json()).version; } catch (e) {}
  const l = $('#verLbl'); if (l) l.textContent = v || 'bilinmiyor';
}
function showUpdate(w) {
  $('#upd').classList.add('on');
  $('#updBtn').onclick = () => { $('#updBtn').textContent = 'Güncelleniyor…'; w.postMessage({type: 'SKIP_WAITING'}); setTimeout(() => location.reload(), 3000); };
}
if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol) && !SINGLE_FILE) {
  let refreshing = false, hadController = !!navigator.serviceWorker.controller;
  navigator.serviceWorker.addEventListener('controllerchange', () => { if (!hadController) { hadController = true; return; } if (refreshing) return; refreshing = true; location.reload(); });
  window.addEventListener('load', async () => {
    try {
      swReg = await navigator.serviceWorker.register('./sw.js', {scope: './'});
      const watch = w => w && w.addEventListener('statechange', () => { if (w.state === 'installed' && navigator.serviceWorker.controller) showUpdate(w); });
      if (swReg.waiting && navigator.serviceWorker.controller) showUpdate(swReg.waiting);
      swReg.addEventListener('updatefound', () => watch(swReg.installing));
      const check = () => swReg.update().catch(() => {});
      check(); setInterval(check, 30 * 60 * 1000);
      document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') check(); });
    } catch (e) { /* çevrimdışı veya desteklenmiyor */ }
  });
}

/* Gün değişince yenile (uygulama açık kalırsa) */
let lastDay = today();
setInterval(() => { if (today() !== lastDay) { lastDay = today(); render(); } }, 60000);
render();
