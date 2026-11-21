'use strict';
/* ===== Fitness Hocası v2 – tüm veriler cihazda (localStorage + IndexedDB) ===== */
const SINGLE_FILE = !!window.SINGLE_FILE;
const IMGS = window.ASSETS || {};
const img = n => IMGS[n] || ('./img/' + n + '.webp');
const IMG_PROGRAM = window.IMG_PROGRAM || './program-gorsel.jpg';
const IMG_FOOD = window.IMG_FOOD || './beslenme-gorsel.jpg';
const KEY = 'fh_v1';
const $ = s => document.querySelector(s);
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const pad = n => String(n).padStart(2, '0');
const ds = d => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
const today = () => ds(new Date());
const ymd = s => { const [y, m, d] = s.split('-').map(Number); return [y, m - 1, d]; };
const parse = s => new Date(...ymd(s));
const diffDays = (a, b) => Math.round((Date.UTC(...ymd(b)) - Date.UTC(...ymd(a))) / 864e5);
const addDays = (s, n) => { const d = parse(s); d.setDate(d.getDate() + n); return ds(d); };
const WD = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
const WDS = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];
const MON = ['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'];
const MONS = ['Oca','Şub','Mar','Nis','May','Haz','Tem','Ağu','Eyl','Eki','Kas','Ara'];
const fmtD = s => { const d = parse(s); return d.getDate() + ' ' + MON[d.getMonth()] + ' ' + WDS[d.getDay()]; };
const fmtS = s => { const d = parse(s); return d.getDate() + ' ' + MONS[d.getMonth()]; };
const fmtY = s => { const d = parse(s); return d.getDate() + ' ' + MONS[d.getMonth()] + ' ' + d.getFullYear(); };
const num = v => { if (v == null || v === '') return null; const n = parseFloat(String(v).replace(',', '.')); return isNaN(n) ? null : n; };
const nf = (v, d = 0) => v == null ? '–' : Number(v).toLocaleString('tr-TR', {minimumFractionDigits: d, maximumFractionDigits: d});
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
const yt = id => 'https://www.youtube.com/watch?v=' + id;

/* ===== İkonlar (altın çizgi) ===== */
const P = {
 menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
 bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/>',
 back: '<path d="M19 12H5M12 19l-7-7 7-7"/>',
 cal: '<rect x="3" y="4" width="18" height="18" rx="3"/><path d="M16 2v4M8 2v4M3 10h18M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01"/>',
 sliders: '<path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6"/>',
 db: '<path d="M6.5 6.5v11M17.5 6.5v11M3.5 9v6M20.5 9v6M6.5 12h11"/>',
 food: '<path d="M7 2v9M4.5 2v6.5a2.5 2.5 0 0 0 5 0V2M7 11v11M17 22V2c-2.2 1.3-3.5 4-3.5 7.5V13H17"/>',
 bars: '<rect x="4" y="13" width="4" height="8" rx="1"/><rect x="10" y="8" width="4" height="13" rx="1"/><rect x="16" y="3" width="4" height="18" rx="1"/>',
 pill: '<path d="M10.5 20.5 3.5 13.5a5 5 0 0 1 7-7l7 7a5 5 0 0 1-7 7z"/><path d="m8.5 8.5 7 7"/>',
 home: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9v12h5v-6h4v6h5V9"/>',
 plus: '<path d="M12 5v14M5 12h14"/>',
 shield: '<path d="M12 2 4 5v6c0 5 3.4 9.4 8 11 4.6-1.6 8-6 8-11V5z"/><path d="m12 7.5 1.3 2.7 3 .4-2.2 2.1.5 3-2.6-1.4-2.6 1.4.5-3-2.2-2.1 3-.4z"/>',
 gear: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
 flame: '<path d="M12 2c.8 3.6 5.5 5.6 5.5 11.5a5.5 5.5 0 0 1-11 0c0-2.8 1.6-4.6 2.6-6.2.8 1.7 1.7 2.6 2.7 2.7-.2-2.9-.6-5.2.2-8z"/>',
 bolt: '<path d="M13 2 3 14h9l-1 8 10-12h-9z"/>',
 jar: '<rect x="5" y="7" width="14" height="14" rx="3"/><path d="M7 3h10v4H7zM9 13h6"/>',
 drop: '<path d="M12 2.7 6.3 9a7 7 0 1 0 11.4 0z"/>',
 user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
 target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
 clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
 info: '<circle cx="12" cy="12" r="9"/><path d="M12 16v-5M12 8h.01"/>',
 up: '<path d="M12 16V4M7 9l5-5 5 5M4 20h16"/>',
 down: '<path d="M12 4v12M7 11l5 5 5-5M4 20h16"/>',
 cloud: '<path d="M7 18a5 5 0 1 1 .9-9.9A6 6 0 0 1 19 10a4 4 0 0 1-1 8"/><path d="M12 13v8M9 16l3-3 3 3"/>',
 trash: '<path d="M3 6h18M8 6V4h8v2M6 6l1 15h10l1-15M10 11v6M14 11v6"/>',
 phone: '<rect x="6" y="2" width="12" height="20" rx="2.5"/><path d="M11 18h2"/>',
 globe: '<path d="M4 5h9M8.5 3v2M6 5c1 4 4 7 7 8M11 5c-1 4-4 7-7 8"/><path d="m13 21 4-9 4 9M14.5 18h5"/>',
 ruler: '<path d="m3 17 14-14 4 4L7 21z"/><path d="m7 13 2 2M10 10l2 2M13 7l2 2"/>',
 camera: '<path d="M4 7h3l2-3h6l2 3h3v13H4z"/><circle cx="12" cy="13" r="4"/>',
 share: '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4"/>',
 list: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 3v2h6V3M9 10h6M9 14h6M9 18h4"/>',
 heart: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8z"/>',
 arm: '<path d="M7 20c-2-3-2-7 0-11l3-5 3 1-1 4 2 2c3-1 6 1 6 4 0 4-4 6-8 6z"/>',
 layers: '<path d="m12 2 10 5-10 5L2 7z"/><path d="m2 12 10 5 10-5M2 17l10 5 10-5"/>',
 wheat: '<path d="M12 22V8M12 12c-3 0-4-2-4-4 2 0 4 1 4 4zM12 12c3 0 4-2 4-4-2 0-4 1-4 4zM12 17c-3 0-4-2-4-4 2 0 4 1 4 4zM12 17c3 0 4-2 4-4-2 0-4 1-4 4zM12 7c-1-1-1-3 0-5 1 2 1 4 0 5z"/>',
 moon: '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>',
 repeat: '<path d="M17 2l4 4-4 4"/><path d="M3 11V9a3 3 0 0 1 3-3h15M7 22l-4-4 4-4"/><path d="M21 13v2a3 3 0 0 1-3 3H3"/>',
 check: '<path d="M20 6 9 17l-5-5"/>',
 play: '<circle cx="12" cy="12" r="9"/><path d="m10 8 6 4-6 4z"/>',
 walk: '<circle cx="13" cy="4" r="2"/><path d="m9 21 2-6 3 3v5M7 12l2-4 4-1 3 4 3 1M11 15l-1-4"/>',
 run: '<circle cx="15" cy="4" r="2"/><path d="m5 21 4-5 3 2 2-5M8 11l3-3 4 1 2 3h3M12 18l-2-5"/>',
 pulse: '<path d="M2 12h4l2-5 4 10 2-5h8"/>',
 scale: '<rect x="3" y="3" width="18" height="18" rx="4"/><path d="M8 9a5 5 0 0 1 8 0M12 11l1.5-2"/>',
 arrowdn: '<path d="M12 4v16M5 13l7 7 7-7"/>',
 stopwatch: '<circle cx="12" cy="14" r="8"/><path d="M12 10v4l2 2M10 2h4M12 2v4"/>',
 kur: '<rect x="3" y="4" width="18" height="18" rx="3"/><path d="M16 2v4M8 2v4M3 10h18"/><path d="m9 16 2 2 4-4"/>'
};
const ic = (n, cls = '') => `<svg class="i ${cls}" viewBox="0 0 24 24">${P[n] || ''}</svg>`;

/* ===== Program (4 gün) – egzersiz kimlikleri v1 ile aynı, eski kayıtlar korunur ===== */
const CARDIO = 'Kardiyo: 20-30 dk eğimli yürüyüş (10-12 derece, 5-6 km/s)';
const DAYS = [
 {title: '1. Gün – İtiş A', short: 'İtiş A', sub: 'Göğüs • Omuz • Triseps', m: 'm1', ex: [
  {id: 'd0e0', n: 'Bench Press', s: '3x5-8', mu: 'Göğüs', th: 'ex-0-0', v: 'vcBig73ojpE', t: 'Kürek kemiklerini geriye sıkıştır, ayaklar yere bassın. Barı göğüs ortasına kontrollü indir, dirsekler ~45°.'},
  {id: 'd0e1', n: 'Incline Dumbbell Press', s: '3x8-12', mu: 'Göğüs', th: 'ex-0-1', v: '8iPEnn-ltC8', t: 'Bench 30° olsun. Dumbbell\'ları üst göğse indir, tepede kilitlemeden it.'},
  {id: 'd0e2', n: 'Cable Fly', s: '2x12-15', mu: 'Göğüs', th: 'ex-0-2', v: '7UC_8lsE2w0', t: 'Dirsekler hafif bükük ve sabit. Kucaklar gibi kapat, ortada göğsü sık, dönüşte gerilmeyi hisset.'},
  {id: 'd0e3', n: 'Shoulder Press', s: '2x8-12', mu: 'Omuz', th: 'ex-0-3', v: 'qEwKCR5JCog', t: 'Oturarak, sırt desteğe yaslı, karın sıkı. Dumbbell\'ları kulak hizasına indir, beli kavisleme.'},
  {id: 'd0e4', n: 'Lateral Raise', s: '3x12-20', mu: 'Omuz', th: 'ex-0-4', v: 'mak2T0SFh8Y', t: 'Kabloyla, dirsekten kaldır, omuz hizasında dur. Sallanma yok, inişi yavaş yap.'},
  {id: 'd0e5', n: 'Triceps Pushdown', s: '3x10-15', mu: 'Triseps', th: 'ex-0-5', v: 'vB5OHsJ3EME', tr: 'NeCiGYWsx1k', t: 'İple, dirsekler gövdeye yapışık kalsın. Altta ipi iki yana aç ve trisepsi sık.'},
  {id: 'd0e6', n: 'Overhead Triceps Extension', s: '3x10-12', mu: 'Triseps', th: 'ex-0-6', v: 'YbX7Wd8jQ-Q', t: 'Dirsekler öne baksın, açılmasın. Ağırlığı başın arkasına derin indir, gerilmeyi hisset.'}]},
 {title: '2. Gün – Çekiş A', short: 'Çekiş A', sub: 'Sırt • Arka omuz • Biseps', m: 'm2', ex: [
  {id: 'd1e0', n: 'Barfiks / Lat Pulldown', s: '3x6-10', mu: 'Sırt', th: 'ex-1-0', v: 'K81-SLUFo9c', alt: ['Lat pulldown videosu', 'CAwf7n6Luuc'], t: 'Göğsü bara doğru çek, dirsekleri cebine sokar gibi aşağı indir. Altta tam açıl, kontrollü in.'},
  {id: 'd1e1', n: 'Göğüs Destekli Row', s: '3x8-12', mu: 'Sırt', th: 'ex-1-1', v: 'kX4gtPQeyb8', t: 'Göğüs pede yapışık kalsın. Dirsekleri geriye çek, kürek kemiklerini sık, 1 sn bekle.'},
  {id: 'd1e2', n: 'Tek Kol Cable Row', s: '2x10-15 her taraf', mu: 'Sırt', th: 'ex-1-2', v: 'CrylzZHfO1c', t: 'Gövde sabit, dirseği kalçana doğru çek. Önde kanadı tam esnet.'},
  {id: 'd1e3', n: 'Reverse Pec Deck', s: '3x12-20', mu: 'Arka omuz', th: 'ex-1-3', v: 'vpPjY_2Kq1A', t: 'Kollar hafif bükük, geniş bir yay çiz. Arka omzu hisset, ağırlığı savurma.'},
  {id: 'd1e4', n: 'EZ Bar Curl', s: '3x8-12', mu: 'Biseps', th: 'ex-1-4', v: 'zG2xJ0Q5QtI', t: 'Dirsekler sabit, gövde sallanmasın. Tepede sık, inişi 2-3 saniyede yap.'},
  {id: 'd1e5', n: 'Incline Dumbbell Curl', s: '3x10-12', mu: 'Biseps', th: 'ex-1-5', v: 'soxrZlIl35U', t: '45° bench, kollar sarkık başla. Omuz öne kaymadan kıvır, altta tam gerilme.'},
  {id: 'd1e6', n: 'Hammer Curl', s: '2x10-15', mu: 'Biseps', th: 'ex-1-6', v: 'zC3nLlEvin4', t: 'Avuç içleri birbirine baksın, dirsek sabit. Ön kol ve brakialisi hisset.'}]},
 {title: '3. Gün – Bacak A', short: 'Bacak A', sub: 'Ön bacak • Arka bacak • Baldır', m: 'm3', ex: [
  {id: 'd2e0', n: 'Squat / Hack Squat', s: '3x6-10', mu: 'Bacak', th: 'ex-2-0', v: 'bEv6CCg2BC8', alt: ['Hack squat videosu', '0tn5K9NlCfo'], t: 'Dizler ayak ucu yönünde, göğüs dik. Kalça diz hizasına kadar insin, topuktan it.'},
  {id: 'd2e1', n: 'Leg Press', s: '3x10-15', mu: 'Bacak', th: 'ex-2-1', v: 'IZxyjW7MPJQ', t: 'Bel ve kalça pedden kalkmasın. Dizleri kilitlemeden it.'},
  {id: 'd2e2', n: 'Lying Leg Curl', s: '3x10-15', mu: 'Arka bacak', th: 'ex-2-2', v: 'vl5nUdE9mWM', t: 'Kalçayı pede bastır. Topukları kalçaya çek, inişi yavaş yap.'},
  {id: 'd2e3', n: 'Leg Extension', s: '2x12-20', mu: 'Bacak', th: 'ex-2-3', v: 'YyvSfVjQeL0', t: 'Tepede 1 sn sık, ağırlığı düşürmeden kontrollü indir.'},
  {id: 'd2e4', n: 'Standing Calf Raise', s: '4x10-15', mu: 'Baldır', th: 'ex-2-4', v: 'YMmgqO8Jo-k', t: 'Altta 1-2 sn tam gerilme, tepede parmak ucunda sık. Zıplatma yok.'}]},
 {title: '4. Gün – Karın', short: 'Karın', sub: 'Üst karın • Alt karın • Yan karın', m: 'm4', abs: 1, ex: [
  {id: 'd0e7', n: 'Asılı Bacak Kaldırma', s: '3x12-15', mu: 'Karın', th: 'ex-0-7', v: 'hdng3Nm1x_E', tr: 't4o4Hn_Xl50', t: 'Sallanma. Bacağı değil leğen kemiğini yukarı kıvır, nefesi ver, inişi 3 saniyede yap.'},
  {id: 'd2e5', n: 'Cable Crunch', s: '3x10-15', mu: 'Karın', th: 'ex-2-5', v: '36HK6uPM_PQ', tr: 'Okm7SYZRD-k', t: 'Kalça sabit, sadece sırtını yuvarla. Dirsekleri dizlere götür, nefesi ver ve sık.'},
  {id: 'd2e6', n: 'Reverse Crunch', s: '3x12-15', mu: 'Karın', th: 'ex-2-6', v: 'hyv14e2QDq0', t: 'Bel yere yapışık. Dizleri göğse çekip kalçayı 2-3 cm kaldır, bacağı sallama.'},
  {id: 'd1e7', n: 'Ab Wheel', s: '3x10', mu: 'Karın', th: null, v: 'A3uK5TPzHq8', t: 'Kalçayı sık, beli çökertme. Gidebildiğin kadar uzan, karınla geri çek.'},
  {id: 'd2e7', n: 'Cable Woodchopper', s: '3x12 her taraf', mu: 'Yan karın', th: 'ex-2-7', v: 'pAplQXk3dkU', t: 'Kollar düz, kalça sabit. Dönüşü karınla yap, kabloyu çaprazlamasına karşı dizine çek.'},
  {id: 'd1e8', n: 'Pallof Press', s: '3x10 her taraf', mu: 'Yan karın', th: 'ex-1-7', v: '_2xWmYNnFS8', t: 'Kabloya yan dur, kolları düz öne it, 2 sn bekle. Dönmeye direnirken karnı sık.'}]}
];
DAYS.forEach(d => d.ex.forEach(e => { e.sets = parseInt(e.s, 10) || 3; const m = e.s.match(/x(\d+)(?:-(\d+))?(.*)$/); e.reps = m ? (m[2] ? m[1] + ' – ' + m[2] : m[1]) + ' Tekrar' + (m[3] ? ' (' + m[3].trim() + ')' : '') : e.s; }));
const REST = 4;
const EX_BY_ID = {}; DAYS.forEach((d, i) => d.ex.forEach(e => EX_BY_ID[e.id] = e));

const MEALS = [
 {n: 'Kahvaltı', h: '07:00 – 09:00', m: '2 yumurta, 60 g yulaf, 200 g sade yoğurt, 1 porsiyon meyve', k: 430, p: 28, c: 53, f: 12, col: '#ff3b3b', im: 'f1'},
 {n: 'Öğle Yemeği', h: '12:00 – 14:00', m: '180 g tavuk/hindi, 70 g pirinç, büyük salata, 10 g zeytinyağı', k: 520, p: 45, c: 56, f: 15, col: '#ff8a1f', im: 'f2'},
 {n: 'Antrenman Öncesi', h: '15:00 – 17:00', m: '200 g yüksek proteinli yoğurt, 1 muz', k: 280, p: 20, c: 35, f: 4, col: '#f5b800', im: 'f3'},
 {n: 'Akşam Yemeği', h: '19:00 – 21:00', m: '180 g yağsız balık/et, 250 g patates, bol sebze, 10 g zeytinyağı', k: 520, p: 45, c: 50, f: 14, col: '#2fd45a', im: 'f4'},
 {n: 'Ara Öğün', h: '21:00 – 22:00', m: '250 ml kefir, 15 g badem', k: 220, p: 12, c: 12, f: 15, col: '#2fb4ff', im: 'f5'}];
// [ad, kcal, protein, karb, yağ, emoji, kısa ad, miktar]
const PRESETS = [['Yarım tavuk (derisiz)', 500, 75, 0, 22, '🍗', 'Tavuk', 'yarım'], ['1 yumurta', 70, 6, 0.5, 5, '🥚', 'Yumurta', '1 adet'],
 ['1 ölçek whey', 120, 24, 3, 1.5, '🥤', 'Whey', '1 ölçek'], ['1 muz', 105, 1, 27, 0.4, '🍌', 'Muz', '1 adet'], ['200 g yoğurt', 120, 8, 9, 6, '🥣', 'Yoğurt', '200 g'],
 ['100 g pişmiş pirinç', 130, 3, 28, 0.3, '🍚', 'Pirinç', '100 g'], ['100 g patates', 85, 2, 20, 0.1, '🥔', 'Patates', '100 g'], ['1 yk zeytinyağı', 120, 0, 0, 14, '🫒', 'Zeytinyağı', '1 yk']];
const SUPPS = [
 {id: 'whey', e: '🥤', n: 'Whey protein', d: 'Protein hedefine ulaşmak için pratik destek.'},
 {id: 'kreatin', e: '⚡', n: 'Kreatin monohidrat', d: 'Güç ve performans; her gün düzenli kullanılır.'},
 {id: 'omega3', e: '🐟', n: 'Omega-3', d: 'Kalp ve eklem sağlığı için balık yağı.'},
 {id: 'multi', e: '💊', n: 'Multivitamin', d: 'Diyette eksik kalabilecek vitamin ve mineraller.'},
 {id: 'magnezyum', e: '🌙', n: 'Magnezyum', d: 'Kas krampları ve uyku kalitesi için.'}];

/* ===== Durum ===== */
function defaults() {
  const t = today();
  return {v: 2, settings: {startDate: t, rotation: 'cycle', weekdays: {0: 4, 1: 0, 2: 1, 3: 2, 4: 3, 5: 0, 6: 1},
    kurStart: t, kurWeeks: 5, kurDays: [1, 4], targets: {kcal: 1970, protein: 150, carbs: 206, fat: 60, water: 3500}, targetKg: null, notif: false, units: 'kg, cm, kcal'},
    profile: {name: '', height: '', age: ''}, sessions: [], drafts: {}, food: {}, water: {}, cardio: {}, progress: [], health: [], supp: {}};
}
let S;
function load() {
  try { S = JSON.parse(localStorage.getItem(KEY)); } catch (e) { S = null; }
  const d = defaults();
  if (!S || typeof S !== 'object') S = d;
  const wasV1 = !S.v || S.v < 2;
  for (const k in d) if (S[k] == null) S[k] = d[k];
  for (const k in d.settings) if (S.settings[k] === undefined) S.settings[k] = d.settings[k];
  for (const k in d.settings.targets) if (S.settings.targets[k] == null) S.settings.targets[k] = d.settings.targets[k];
  if (wasV1) { // v1: dinlenme = 3, v2: dinlenme = 4 (4. gün Karın eklendi)
    const w = S.settings.weekdays || {}; for (const k in w) if (+w[k] === 3) w[k] = 4;
    if (S.drafts) { const nd = {}; for (const k in S.drafts) if (+k <= 2) nd[k] = S.drafts[k]; S.drafts = nd; }
    S.v = 2; save();
  }
}
function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { toast('Kaydedilemedi: depolama dolu olabilir'); } }

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
const sportDay = (date = today()) => diffDays(S.settings.startDate, date) + 1;
function planFor(date) { // 0-3 = program günü, 4 = dinlenme, -1 = başlamadı
  const st = S.settings;
  if (st.rotation === 'weekdays') { const v = st.weekdays[parse(date).getDay()]; return v == null ? REST : +v; }
  const n = diffDays(st.startDate, date); if (n < 0) return -1; return n % 5;
}
const planName = p => p === REST ? 'Dinlenme' : p === -1 ? 'Başlamadı' : DAYS[p].short;
function streak() {
  const set = new Set(S.sessions.map(s => s.date)); let d = today(), n = 0, g = 0;
  if (!set.has(d)) d = addDays(d, -1);
  while (g++ < 3000) {
    if (S.settings.rotation === 'cycle' && diffDays(S.settings.startDate, d) < 0) break;
    if (set.has(d)) n++; else if (planFor(d) !== REST) break;
    d = addDays(d, -1);
  }
  return n;
}
function foodDay(date) { if (!S.food[date]) S.food[date] = {meals: [], log: []}; return S.food[date]; }
function foodTotals(date) {
  const f = S.food[date] || {meals: [], log: []}; const t = {k: 0, p: 0, c: 0, f: 0};
  MEALS.forEach((m, i) => { if (f.meals[i]) { t.k += m.k; t.p += m.p; t.c += m.c; t.f += m.f; } });
  (f.log || []).forEach(l => { t.k += +l.k || 0; t.p += +l.p || 0; t.c += +l.c || 0; t.f += +l.f || 0; });
  for (const k in t) t[k] = Math.round(t[k]);
  return t;
}
const hasFood = d => { const f = S.food[d]; return !!f && (f.meals.some(Boolean) || f.log.length > 0); };
function lastEx(id) { for (let i = S.sessions.length - 1; i >= 0; i--) { const e = S.sessions[i].ex.find(x => x.id === id); if (e && e.sets.some(s => s.kg || s.reps)) return {date: S.sessions[i].date, e}; } return null; }
function kur() {
  const st = S.settings; if (!st.kurStart) return null;
  const len = Math.max(1, Math.round(st.kurWeeks * 7)), n = diffDays(st.kurStart, today()) + 1;
  return {n, len, rem: Math.max(0, len - Math.max(n, 0)), active: n >= 1 && n <= len, done: n > len, reminder: st.kurDays.includes(new Date().getDay())};
}
const progSorted = () => S.progress.slice().sort((a, b) => a.date < b.date ? -1 : a.date > b.date ? 1 : 0);
function weekRange() { const t = today(), wd = (parse(t).getDay() + 6) % 7; const mon = addDays(t, -wd); return Array.from({length: 7}, (_, i) => addDays(mon, i)); }
/* ===== UI yardımcıları ===== */
let tT;
function toast(m, ms = 2200) { const t = $('#toast'); t.textContent = m; t.classList.add('on'); clearTimeout(tT); tT = setTimeout(() => t.classList.remove('on'), ms); }
function viewImg(src) { $('#vImg').src = src; $('#viewer').classList.add('on'); }
const pct = (v, m) => Math.max(0, Math.min(100, m ? v / m * 100 : 0));
const bar = (v, m, cls = '') => `<div class="bar ${cls}"><i style="width:${pct(v, m)}%"></i></div>`;
function ring(val, max, size, stroke, colors, inner) {
  const r = (size - stroke) / 2, c = 2 * Math.PI * r, p = pct(val, max) / 100, id = 'g' + Math.random().toString(36).slice(2, 7);
  return `<div class="ring" style="width:${size}px;height:${size}px"><svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1">${colors.map((col, i) => `<stop offset="${i / (colors.length - 1)}" stop-color="${col}"/>`).join('')}</linearGradient></defs>
  <circle cx="${size / 2}" cy="${size / 2}" r="${r}" stroke="#2a2720" stroke-width="${stroke}" fill="none"/>
  <circle cx="${size / 2}" cy="${size / 2}" r="${r}" stroke="url(#${id})" stroke-width="${stroke}" fill="none" stroke-linecap="round" stroke-dasharray="${c * p} ${c}" transform="rotate(-90 ${size / 2} ${size / 2})" style="filter:drop-shadow(0 0 4px ${colors[colors.length - 1]})"/></svg>
  <div class="c">${inner}</div></div>`;
}
function sideWater() {
  const w = S.water[today()] || 0, tg = S.settings.targets.water;
  return `<div style="font-weight:700">💧 Su Takibi</div><div class="sw"><img src="${img('bottle')}" alt=""><div style="flex:1;min-width:0"><div class="v">${nf(w / 1000, 2)} L <small>/ ${nf(tg / 1000, 1)} L</small></div><div style="margin-top:6px">${bar(w, tg, 'b sm')}</div></div></div>
   <div class="row" style="flex-wrap:nowrap;gap:6px"><button class="btn gold" data-act="w+">+250 ml</button><button class="btn" data-act="w-">−250 ml</button></div>`;
}
function waterInner(big) {
  const w = S.water[today()] || 0, tg = S.settings.targets.water;
  return `<div class="v">${nf(w / 1000, 2)} L <small>/ ${nf(tg / 1000, 1)} L</small></div><div style="margin:8px 0 12px">${bar(w, tg, 'b')}</div>
   <div class="row" style="flex-wrap:nowrap"><button class="btn gold ${big ? '' : 'sm'}" style="flex:1" data-act="w+">+250 ml</button><button class="btn ${big ? '' : 'sm'}" style="flex:1" data-act="w-">−250 ml</button></div>`;
}

/* ===== Durum: sayfalar ===== */
let tab = 'home', sub = null, progDay = null, openEx = null, foodTab = 'plan', foodDate = null, prTab = 'genel', chartKey = 'kg', setTabSel = 'plan', editTargets = false;
const V = {};

function header() {
  const k = kur(), rem = reminders().length;
  if (sub) {
    const T = {health: ['Sağlık', 'Kan tahlili ve tansiyon takibi'], kur: ['Kür Takibi', 'Gün sayacı ve hatırlatmalar'], supp: ['Takviyeler', 'Günlük takviye listesi'], profile: ['Profilim', 'Kişisel bilgilerin']}[sub];
    return `<div class="hdr"><button class="ib" data-act="back" aria-label="Geri">${ic('back')}</button><div class="tt"><h1>${T[0]}</h1><div>${T[1]}</div></div><img class="deco" src="${img('hdr-man')}" alt=""></div>`;
  }
  if (tab === 'home') return `<div class="hdr"><button class="ib" data-act="drawer" aria-label="Menü">${ic('menu')}</button>
    <div class="logo"><img src="${img('hdr-logo')}" alt="Fitness Hocası – Antrenman • Beslenme • Takip"></div>
    <button class="ib" data-act="bell" aria-label="Bildirimler" style="position:relative">${ic('bell')}${rem ? '<span class="dot"></span>' : ''}</button></div>`;
  const H = {program: ['Program', 'Antrenman Planın', 'prog-top', ['cal', 'sliders']], food: ['Beslenme', 'Günlük Beslenme Planın', 'food-top', ['cal', 'sliders']],
    progress: ['İlerleme', 'Gelişimini Takip Et', 'hdr-man', ['cal', 'share']], settings: ['Ayarlar', 'Uygulama ve Plan Ayarları', 'hdr-man', []]}[tab];
  const left = tab === 'settings' ? `<div class="ib round">${ic('gear')}</div>` : `<button class="ib round" data-act="back" aria-label="Geri">${ic('back')}</button>`;
  return `<div class="hdr">${left}<div class="tt"><h1>${H[0]}</h1><div>${H[1]}</div></div><img class="deco" src="${img(H[2])}" alt="">
   <div class="rb">${H[3].map(b => `<button class="ib" data-act="h-${b}" aria-label="${b}">${ic(b)}</button>`).join('')}</div></div>`;
}
function nav() {
  const cur = sub ? (sub === 'kur' || sub === 'health' || sub === 'supp' ? 'home' : sub === 'profile' ? 'settings' : tab) : tab;
  const it = (t, i, l) => `<button data-t="${t}" class="${cur === t ? 'on' : ''}"><span class="w">${ic(i)}</span>${l}</button>`;
  return it('home', 'home', 'Ana Sayfa') + it('program', 'db', 'Program') +
    `<button class="ctr" data-act="kayit" aria-label="Kayıt"><span class="fab">${ic(tab === 'home' && !sub ? 'shield' : 'plus')}</span>Kayıt</button>` +
    it('food', 'food', 'Beslenme') + it('progress', 'bars', 'İlerleme') + it('settings', 'gear', 'Ayarlar');
}
function reminders() {
  const t = today(), p = planFor(t), k = kur(), out = [];
  if (p >= 0 && p < REST && !S.sessions.some(s => s.date === t)) out.push(['db', `Bugün <b>${DAYS[p].short}</b> antrenmanı var.`]);
  if (k && k.active && k.reminder) out.push(['kur', 'Bugün kür hatırlatma günü.']);
  if (k && k.done && k.n - k.len <= 14) out.push(['heart', 'Kür bitti: PCT planını doktorunla netleştir ve kan tahlili yaptır.']);
  const w = S.water[t] || 0; if (w < S.settings.targets.water) out.push(['drop', `Su: ${nf(w / 1000, 2)} / ${nf(S.settings.targets.water / 1000, 1)} L`]);
  return out;
}

V.home = () => {
  const t = today(), sd = sportDay(), p = planFor(t), k = kur(), ft = foodTotals(t), tg = S.settings.targets, name = (S.profile.name || '').trim();
  return `
  <div class="card hero"><div class="av"><img src="${img('hero-man')}" alt=""></div><img class="db" src="${img('hero-db')}" alt="">
   <div class="tx"><div class="hi">Hoş Geldin${name ? ', ' + esc(name) : ''}</div>
   <div class="big">${sd >= 1 ? `Sporun <span class="gold">${sd}.</span> Günü` : `Başlangıca <span class="gold">${1 - sd}</span> gün`}</div>
   <button class="chip" data-act="goToday">${ic('db')}Bugün: ${esc(planName(p))}</button>
   ${S.sessions.some(s => s.date === t) ? ' <span class="chip g" style="margin-top:6px">✓ Yapıldı</span>' : ''}</div></div>
  <div class="qg">
   <button data-act="go" data-t="program">${ic('db')}Program</button><button data-act="go" data-t="food">${ic('food')}Beslenme</button>
   <button data-act="go" data-t="progress">${ic('bars')}İlerleme</button><button data-act="sub" data-s="supp">${ic('pill')}Takviyeler</button>
   <button data-act="sub" data-s="kur">${ic('cal')}Kür Takibi</button></div>
  <div class="card stats">
   <div>${ic('flame')}<div class="v">${nf(ft.k)}</div><div class="l">kcal / ${nf(tg.kcal)}</div></div>
   <div>${ic('db')}<div class="v">${S.sessions.length}</div><div class="l">Antrenman</div></div>
   <div>${ic('jar')}<div class="v">${nf(ft.p)} g</div><div class="l">Protein / ${nf(tg.protein)} g</div></div>
   <div>${ic('bolt')}<div class="v">${streak()}</div><div class="l">Seri (gün)</div></div></div>
  <div class="card water"><img class="sp" src="${img('splash')}" alt=""><div class="bt"><img src="${img('bottle')}" alt=""></div>
   <div class="in"><div style="font-weight:600;margin-bottom:2px">Su Takibi</div>${waterInner(true)}</div></div>
  <div class="card kur" data-act="sub" data-s="kur" style="cursor:pointer"><div class="ch" style="margin-bottom:4px">${ic('kur')}<h2>Kür Takibi</h2></div>
   ${!k ? '<div class="mut">Ayarlar\'dan kür başlangıç tarihini gir.</div>' :
     `<div class="big">${k.n < 1 ? `Başlangıca ${1 - k.n} gün` : k.done ? '<span class="green">Kür Bitti</span>' : `Kürün <span class="gold">${k.n}.</span> Günü <small>/ ${k.len}</small>`}</div>
     <div style="margin:8px 0;max-width:62%">${bar(Math.max(0, Math.min(k.n, k.len)), k.len)}</div><div class="mut" style="font-size:14px">Kalan: ${k.rem} gün${k.reminder && k.active ? ' · <span class="gold">📌 Hatırlatma günü</span>' : ''}</div>`}
   <div class="ic">${ic('kur')}</div></div>
  <div class="card plain" data-act="sub" data-s="health" style="cursor:pointer;display:flex;align-items:center;gap:12px">${ic('heart')}<div style="flex:1"><b>Sağlık</b><div class="mut">Kan tahlili, tansiyon / nabız, uyarı işaretleri</div></div><span class="gold" style="font-size:24px">›</span></div>
  <img class="bgdb" src="${img('bg-db')}" alt="">`;
};

/* ----- Program ----- */
function exRow(e, c) {
  const open = openEx === e.id;
  return `<button class="exr ${open ? 'open' : ''}" data-act="ex" data-id="${e.id}">${e.th ? `<img src="${img(e.th)}" alt="" loading="lazy">` : `<span class="ph">${ic('db')}</span>`}
   <span class="nm"><b>${esc(e.n)}</b><span class="pill ${esc(e.mu.split(' ')[0])}">${esc(e.mu)}</span></span>
   <span class="ss"><b>${e.sets} Set</b>${esc(e.reps)}</span><span class="cv">›</span></button>${open ? exDetail(e) : ''}`;
}
function exDetail(e) {
  const dr = (S.drafts[progDay] || {})[e.id] || [], le = lastEx(e.id), active = !!(S.drafts[progDay] || {})._active;
  return `<div class="exd"><div class="tip">💡 ${esc(e.t)}</div>
   <div class="row"><a class="btn sm gold" href="${yt(e.v)}" target="_blank" rel="noopener">${ic('play')}Videoyu izle</a>
   ${e.tr ? `<a class="btn sm ogold" href="${yt(e.tr)}" target="_blank" rel="noopener">🇹🇷 Türkçe video</a>` : ''}
   ${e.alt ? `<a class="btn sm ogold" href="${yt(e.alt[1])}" target="_blank" rel="noopener">▶ ${esc(e.alt[0])}</a>` : ''}</div>
   ${le ? `<div class="mut" style="margin-top:8px">Son (${fmtS(le.date)}): ${le.e.sets.filter(s => s.kg || s.reps).map(s => `${esc(s.kg || '-')}kg×${esc(s.reps || '-')}`).join(', ')}</div>` : ''}
   ${active ? `<div class="sets"><div class="h">Set</div><div class="h">kg</div><div class="h">Tekrar</div><div class="h">✓</div>
   ${Array.from({length: e.sets}, (_, i) => { const v = dr[i] || {}, l = (le && le.e.sets[i]) || {};
     return `<div class="n">${i + 1}</div><input inputmode="decimal" data-in="kg" data-e="${e.id}" data-i="${i}" value="${esc(v.kg || '')}" placeholder="${esc(l.kg || 'kg')}">
     <input inputmode="numeric" data-in="reps" data-e="${e.id}" data-i="${i}" value="${esc(v.reps || '')}" placeholder="${esc(l.reps || 'tekrar')}">
     <input type="checkbox" class="chk" data-in="done" data-e="${e.id}" data-i="${i}" ${v.done ? 'checked' : ''} aria-label="Set ${i + 1} tamam">`; }).join('')}</div>`
     : '<div class="mut" style="margin-top:8px">Set ve kg girmek için “Antrenmanı Başlat”a dokun.</div>'}</div>`;
}
function absTips() {
  return `<div class="card plain"><div class="ch">${ic('target')}<h2>Karın form ipuçları</h2></div><ul class="ck">
  <li><span><b>Beli yere bastır:</b> göbek deliğini omurgaya çek, bel boşluğunu kapat.</span></li>
  <li><span><b>Kaldırma, kıvır:</b> kaburgayı kalçaya yaklaştır, tepede 2 sn sık.</span></li>
  <li><span><b>Nefes:</b> kasılırken nefesini tamamen ver.</span></li>
  <li><span><b>Yavaşla:</b> inişi 3 saniyede yap.</span></li>
  <li><span><b>Side plank yerine:</b> cable woodchopper ve pallof press.</span></li></ul></div>`;
}
V.program = () => {
  if (progDay == null) { const p = planFor(today()); progDay = p >= 0 && p < REST ? p : 0; }
  const d = DAYS[progDay], dr = S.drafts[progDay] || {}, active = !!dr._active;
  const hist = S.sessions.filter(s => s.day === progDay).slice().reverse();
  return `
  <div class="card phero"><img class="man" src="${img('prog-man')}" alt="">
   <h2>${ic('cal')}<span><span class="gold">4 Günlük</span> Program</span></h2><div class="s">Dengeli • Kas Gelişimi • Definasyon Uyumlu</div>
   <div class="ptags"><div>${ic('arm')}Kas Gelişimi</div><div>${ic('flame')}Yağ Yakımı</div><div>${ic('bolt')}Performans</div><div>${ic('layers')}Dengeli Plan</div></div></div>
  <div class="days">${DAYS.map((x, i) => `<button class="${i === progDay ? 'on' : ''}" data-act="pday" data-d="${i}"><b><span class="n">${i + 1}.</span> Gün</b><span>${esc(x.short)}</span><img src="${img(x.m)}" alt=""></button>`).join('')}</div>
  <div class="notice"><span class="ii">i</span>Her antrenman sonrası: 20-30 dk eğimli yürüyüş önerilir.</div>
  <div class="card"><div class="dh"><span class="ib">${ic('db')}</span><div style="flex:1"><h3>${esc(d.title)}</h3><div class="mut">${esc(d.sub)}</div></div>
   ${active ? '<span class="chip g">● Devam ediyor</span>' : `<button class="btn gold sm" data-act="start">${ic('play')}Antrenmanı Başlat</button>`}</div>
   ${d.ex.map(e => exRow(e)).join('')}
   ${active ? `<label class="line" style="margin-top:6px"><input type="checkbox" class="chk" data-in="cardio" ${dr._cardio ? 'checked' : ''}><span>🚶 ${CARDIO}</span></label>
   <button class="btn gold full" data-act="finish" style="min-height:54px;font-size:16px;margin-top:6px">${ic('check')}Antrenmanı Bitir</button>
   <button class="btn sm full" data-act="cancelW" style="margin-top:8px">Vazgeç</button>` : ''}</div>
  ${d.abs ? absTips() : ''}
  <div class="card plain"><div class="ch">${ic('list')}<h2>Geçmiş – ${esc(d.short)}</h2></div>${hist.length ? `<div class="list">${hist.slice(0, 20).map(s => `<div class="it" style="display:block"><details><summary style="cursor:pointer;min-height:40px;display:flex;align-items:center">${fmtD(s.date)} · ${s.ex.reduce((a, x) => a + x.sets.filter(y => y.done || y.kg || y.reps).length, 0)} set${s.cardio ? ' · 🚶' : ''}</summary>
   ${s.ex.filter(x => x.sets.some(y => y.kg || y.reps)).map(x => `<div class="mut" style="padding:3px 0"><b style="color:#fff">${esc((EX_BY_ID[x.id] || x).n)}</b>: ${x.sets.filter(y => y.kg || y.reps).map(y => `${esc(y.kg || '-')}kg×${esc(y.reps || '-')}`).join(', ')}</div>`).join('') || '<div class="mut">Değer girilmemiş.</div>'}
   <button class="btn sm ored" data-act="delSess" data-id="${s.id}" style="margin:6px 0">Sil</button></details></div>`).join('')}</div>` : '<div class="empty">Henüz kayıt yok. İlk antrenmanını başlat!</div>'}</div>
  <div class="card plain"><div class="ch">${ic('layers')}<h2>Program görseli</h2></div><img src="${IMG_PROGRAM}" alt="Program görseli" data-act="zoom" style="width:100%;border-radius:12px;cursor:zoom-in"></div>`;
};

/* ----- Beslenme ----- */
function foodSummary(d) {
  const t = foodTotals(d), tg = S.settings.targets;
  return `<div class="card"><div class="sum">${ring(t.k, tg.kcal, 98, 10, ['#ff3b3b', '#ff8a1f', '#f5b800'], `<span style="font-size:16px">🔥</span><b>${nf(t.k)} / ${nf(tg.kcal)}</b><span>kcal</span>`)}
   <div class="macs"><div><div class="t"><span style="font-size:20px">💪</span>Protein</div><div class="v">${nf(t.p)} / ${nf(tg.protein)} g</div>${bar(t.p, tg.protein, 'r sm')}</div>
   <div><div class="t"><span style="font-size:20px">🌾</span>Karbonhidrat</div><div class="v">${nf(t.c)} / ${nf(tg.carbs)} g</div>${bar(t.c, tg.carbs, 'sm')}</div>
   <div><div class="t"><span style="font-size:20px">💧</span>Yağ</div><div class="v">${nf(t.f)} / ${nf(tg.fat)} g</div>${bar(t.f, tg.fat, 'b sm')}</div></div></div>
   <div class="tip" style="margin:10px 0 0">💪 Protein hedefini 170 g üstüne çıkarmayı düşün.</div></div>`;
}
function mealsCard(d) {
  const f = S.food[d] || {meals: []};
  return `<div class="card"><div class="ch">${ic('food')}<h2>Günlük Öğün Planı</h2><span style="font-size:13px">Toplam: <b class="gold">${nf(MEALS.reduce((a, m) => a + m.k, 0))} kcal</b></span></div>
   ${MEALS.map((m, i) => `<div class="meal ${f.meals[i] ? 'done' : ''}" style="--mc:${m.col}" data-act="meal" data-i="${i}" role="checkbox" aria-checked="${!!f.meals[i]}">
    <div class="b"><div class="tt"><span class="num">${i + 1}</span>${m.n} <span class="tm">🕒 ${m.h}</span></div><div class="d">${m.m}</div>
    <div class="mm"><span>P: ${m.p} g</span><span>K: ${m.c} g</span><span>Y: ${m.f} g</span></div></div>
    <div class="im"><img src="${img(m.im)}" alt="" loading="lazy"></div>${f.meals[i] ? '<span class="ok">✓ Yendi</span>' : ''}</div>`).join('')}
   <div class="mut" style="text-align:center">Yediğin öğüne dokun, işaretlensin.</div></div>`;
}
function quickAdd() {
  return `<div class="card" style="padding:10px"><div class="qa"><button class="add" data-act="customFood"><span class="e">+</span>Hızlı Ekle</button>
   ${PRESETS.map((p, i) => `<button data-act="preset" data-i="${i}"><span class="e">${p[5]}</span>${p[6]}<small>(${p[7]})</small></button>`).join('')}</div></div>`;
}
function dateStrip() {
  const t = today();
  return `<div class="card"><div class="ch">${ic('cal')}<h2>Geçmiş Günler</h2><button class="lnk" data-act="ftab" data-t="gecmis">Tümünü Gör ›</button></div>
   <div class="dstrip">${Array.from({length: 7}, (_, i) => { const d = addDays(t, -i);
     return `<button class="${d === foodDate ? 'on' : ''}" data-act="fdate" data-d="${d}"><span>${i === 0 ? 'Bugün' : i === 1 ? 'Dün' : fmtS(d)}</span><small>${i < 2 ? fmtS(d) : WDS[parse(d).getDay()]}</small><span class="ck ${hasFood(d) ? '' : 'no'}">${hasFood(d) ? '✓' : (i === 0 ? '•' : '–')}</span></button>`; }).join('')}</div></div>`;
}
function foodLog(d) {
  const f = foodDay(d);
  return `<div class="card"><div class="ch">${ic('plus')}<h2>Gıda ekle</h2></div>
   <div class="list">${PRESETS.map((p, i) => `<div class="it"><span>${p[5]} ${p[0]}</span><span class="row" style="flex-wrap:nowrap"><span class="mut">${p[1]} kcal · ${p[2]} g P</span><button class="btn sm ogold" data-act="preset" data-i="${i}">Ekle</button></span></div>`).join('')}</div>
   <h3 style="font-size:15px;margin:14px 0 6px">Özel gıda</h3>
   <input id="fName" placeholder="Yiyecek adı"><div class="grid2" style="margin-top:8px"><input id="fK" inputmode="numeric" placeholder="kcal"><input id="fP" inputmode="decimal" placeholder="Protein g"><input id="fC" inputmode="decimal" placeholder="Karb g (ops.)"><input id="fF" inputmode="decimal" placeholder="Yağ g (ops.)"></div>
   <button class="btn gold full" style="margin-top:10px" data-act="addFood">Ekle</button></div>
  <div class="card"><div class="ch">${ic('list')}<h2>${d === today() ? 'Bugün eklenenler' : fmtD(d) + ' eklenenler'}</h2></div>
   ${f.log.length ? `<div class="list">${f.log.map((l, i) => `<div class="it"><span>${esc(l.n)}</span><span class="row" style="flex-wrap:nowrap"><span class="mut">${nf(l.k)} kcal · ${nf(l.p)} g</span><button class="x" data-act="delFood" data-i="${i}" aria-label="Sil">×</button></span></div>`).join('')}</div>` : '<div class="empty">Henüz bir şey eklenmedi.</div>'}</div>`;
}
V.food = () => {
  const t = today(); if (!foodDate) foodDate = t; const d = foodDate;
  const tabs = [['plan', 'food', 'Günlük Plan'], ['ogun', 'food', 'Öğünler'], ['gida', 'plus', 'Gıdalar'], ['gecmis', 'clock', 'Geçmiş']];
  const head = `<div class="tabs">${tabs.map(x => `<button class="${foodTab === x[0] ? 'on' : ''}" data-act="ftab" data-t="${x[0]}">${ic(x[1])}${x[2]}</button>`).join('')}</div>
   ${d !== t ? `<div class="notice"><span class="ii">i</span>${fmtD(d)} gösteriliyor · <button class="lnk" style="background:none;border:0;color:var(--gold);font-weight:700" data-act="fdate" data-d="${t}">Bugüne dön</button></div>` : ''}`;
  if (foodTab === 'ogun') return head + mealsCard(d) + `<div class="card plain"><div class="ch">${ic('layers')}<h2>Beslenme görseli</h2></div><img src="${IMG_FOOD}" alt="Beslenme görseli" data-act="zoom" style="width:100%;border-radius:12px;cursor:zoom-in"></div>`;
  if (foodTab === 'gida') return head + foodSummary(d) + foodLog(d);
  if (foodTab === 'gecmis') {
    const days = Object.keys(S.food).filter(x => hasFood(x) || S.water[x]).concat(Object.keys(S.water)).filter((v, i, a) => a.indexOf(v) === i).sort().reverse();
    return head + `<div class="card"><div class="ch">${ic('clock')}<h2>Geçmiş</h2></div>${days.length ? `<div class="list">${days.map(x => { const tt = foodTotals(x);
      return `<div class="it" data-act="fdate" data-d="${x}" style="cursor:pointer"><span><b>${x === t ? 'Bugün' : fmtD(x)}</b><div class="mut">${tt.k} kcal · ${tt.p} g P · K ${tt.c} · Y ${tt.f}</div></span><span class="row" style="flex-wrap:nowrap"><span class="blue">💧 ${nf((S.water[x] || 0) / 1000, 1)} L</span><span class="gold" style="font-size:22px">›</span></span></div>`; }).join('')}</div>` : '<div class="empty">Henüz geçmiş yok.</div>'}</div>`;
  }
  return head + foodSummary(d) + mealsCard(d) + quickAdd() +
   `<div class="side"><div class="card">${sideWater()}</div>
   <div class="card"><div class="row" style="font-weight:700;margin-bottom:6px">💡 İpuçları</div><ul class="ck"><li>Air fryer'da yağı sprey ya da fırçayla kullan.</li><li>Tavuk/hindi derisini soy.</li><li>Günde 3-4 L su iç.</li><li>Meyveyi günde 2-3 porsiyonla sınırla.</li><li>Kalori çok düşük kalırsa metabolizma yavaşlar ve kas risk altına girer.</li></ul></div></div>
   <div style="height:12px"></div>` + dateStrip();
};
/* ----- İlerleme ----- */
const MEAS = [['waist', 'Bel'], ['chest', 'Göğüs'], ['arm', 'Kol'], ['shoulder', 'Omuz'], ['hip', 'Kalça'], ['leg', 'Bacak']];
function areaChart(pts, unit) {
  if (pts.length < 2) return `<div class="empty">${pts.length ? 'Grafik için en az 2 kayıt gerekli. Şu an: ' + nf(pts[0].v, 1) + ' ' + unit : 'Henüz kayıt yok. “Kayıt Ekle” ile ilk ölçümünü gir.'}</div>`;
  const W = 300, H = 180, L = 26, R = 10, T = 10, B = 24, xs = pts.map(p => Date.UTC(...ymd(p.d))), ys = pts.map(p => p.v);
  let x0 = Math.min(...xs), x1 = Math.max(...xs); if (x0 === x1) x1 = x0 + 864e5;
  let y0 = Math.floor(Math.min(...ys) - 1), y1 = Math.ceil(Math.max(...ys) + 1);
  const X = x => L + (x - x0) / (x1 - x0) * (W - L - R), Y = y => T + (1 - (y - y0) / (y1 - y0)) * (H - T - B);
  const line = pts.map((p, i) => (i ? 'L' : 'M') + X(xs[i]).toFixed(1) + ' ' + Y(p.v).toFixed(1)).join(' ');
  const area = line + ` L${X(xs[xs.length - 1]).toFixed(1)} ${H - B} L${X(xs[0]).toFixed(1)} ${H - B} Z`;
  const step = Math.max(1, Math.ceil((y1 - y0) / 7)), g = []; for (let v = y0; v <= y1; v += step) g.push(v);
  const nx = Math.min(5, pts.length), lab = Array.from({length: nx}, (_, i) => pts[Math.round(i * (pts.length - 1) / (nx - 1))]);
  return `<svg class="chart" viewBox="0 0 ${W} ${H}"><defs><linearGradient id="ga" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f5b800" stop-opacity=".75"/><stop offset="1" stop-color="#f5b800" stop-opacity=".04"/></linearGradient></defs>
   ${g.map(v => `<line x1="${L}" x2="${W - R}" y1="${Y(v)}" y2="${Y(v)}" stroke="#2a2720"/><text x="2" y="${Y(v) + 3}" fill="#bbb" font-size="9">${v}</text>`).join('')}
   <path d="${area}" fill="url(#ga)"/><path d="${line}" fill="none" stroke="#ffd23d" stroke-width="2.2" stroke-linejoin="round" style="filter:drop-shadow(0 0 3px #f5b800)"/>
   ${pts.map((p, i) => `<circle cx="${X(xs[i])}" cy="${Y(p.v)}" r="${i === pts.length - 1 ? 5 : 3}" fill="#ffd23d" ${i === pts.length - 1 ? 'stroke="#fff" stroke-width="1.5"' : ''}/>`).join('')}
   ${lab.map((p, i) => `<text x="${X(Date.UTC(...ymd(p.d)))}" y="${H - 6}" fill="#bbb" font-size="9" text-anchor="${i === 0 ? 'start' : i === lab.length - 1 ? 'end' : 'middle'}">${fmtS(p.d)}</text>`).join('')}</svg>`;
}
function series(key) { return progSorted().filter(p => p[key] != null).map(p => ({d: p.date, v: p[key]})); }
function photoTag(id, cls = '') { return id ? `<img data-photo="${id}" class="${cls}" alt="">` : ''; }
V.progress = () => {
  const tabs = [['genel', 'bars', 'Genel Bakış'], ['ekle', 'plus', 'Kayıt Ekle'], ['olcum', 'ruler', 'Ölçümler'], ['foto', 'camera', 'Fotoğraflar']];
  const head = `<div class="tabs">${tabs.map(x => `<button class="${prTab === x[0] ? 'on' : ''}" data-act="prtab" data-t="${x[0]}">${ic(x[1])}${x[2]}</button>`).join('')}</div>`;
  const pr = progSorted();
  if (prTab === 'ekle') return head + `<div class="card"><div class="ch">${ic('plus')}<h2>Yeni Kayıt</h2></div><div class="mut">Haftada bir, sabah aç karnına ölç. Fotoğrafı aynı ışıkta çek.</div>
   <label class="f">Tarih</label><input type="date" id="pDate" value="${today()}">
   <label class="f">Kilo (kg)</label><input id="pKg" inputmode="decimal" placeholder="örn. 82,5">
   <div class="grid2">${MEAS.map(m => `<div><label class="f">${m[1]} (cm)</label><input id="p_${m[0]}" inputmode="decimal" placeholder="cm"></div>`).join('')}</div>
   <label class="f">Not</label><input id="pNote" placeholder="İsteğe bağlı">
   <label class="f">Fotoğraf (isteğe bağlı)</label><input type="file" id="pPhoto" accept="image/*">
   <button class="btn gold full" style="margin-top:12px" data-act="addProg">${ic('check')}Kaydet</button></div>`;
  if (prTab === 'olcum') return head + `<div class="card"><div class="ch">${ic('list')}<h2>Tüm Kayıtlar</h2></div>${pr.length ? `<div class="list">${pr.slice().reverse().map(p => `<div class="it"><div class="row" style="flex-wrap:nowrap;align-items:flex-start">${p.photo ? photoTag(p.photo, 'thumb') : ''}<div><b>${fmtY(p.date)}</b>
     <div class="mut">${[p.kg != null ? nf(p.kg, 1) + ' kg' : '', ...MEAS.filter(m => p[m[0]] != null).map(m => m[1] + ' ' + nf(p[m[0]], 0) + ' cm')].filter(Boolean).join(' · ')}</div>${p.note ? `<div class="mut">${esc(p.note)}</div>` : ''}</div></div>
     <button class="x" data-act="delProg" data-id="${p.id}" aria-label="Sil">×</button></div>`).join('')}</div>` : '<div class="empty">Henüz kayıt yok.</div>'}</div>`;
  if (prTab === 'foto') { const ph = pr.filter(p => p.photo).reverse();
    return head + `<div class="card"><div class="ch">${ic('camera')}<h2>İlerleme Fotoğrafları</h2></div>${ph.length ? `<div class="pgrid">${ph.map(p => `<div>${photoTag(p.photo)}<div class="mut" style="text-align:center">${fmtS(p.date)}</div></div>`).join('')}</div>` : '<div class="empty">Henüz fotoğraf yok. “Kayıt Ekle”den ekleyebilirsin.</div>'}</div>`; }
  // genel bakış
  const kg = series('kg'), cur = kg.length ? kg[kg.length - 1] : null, first = kg[0], tgt = S.settings.targetKg, k = kur();
  let wk = null, wkLbl = ''; if (cur && kg.length > 1) { const ref = kg.slice().reverse().find(p => diffDays(p.d, cur.d) >= 7) || first; wk = cur.v - ref.v; wkLbl = diffDays(ref.d, cur.d) >= 7 ? '(Son 7 gün)' : '(İlk kayıt)'; }
  const tp = cur && tgt && first && first.v !== tgt ? pct(first.v - cur.v, first.v - tgt) : 0;
  const total = cur && first ? cur.v - first.v : null, active = pr.length ? diffDays(pr[0].date, today()) + 1 : 0;
  const ser = series(chartKey), last = pr.length ? pr[pr.length - 1] : null;
  const latestM = {}; MEAS.forEach(m => { const s = series(m[0]); latestM[m[0]] = s.length ? s[s.length - 1].v : null; });
  const ph = pr.filter(p => p.photo), wr = weekRange(), wsess = S.sessions.filter(s => wr.includes(s.date));
  const planned = wr.filter(d => { const p = planFor(d); return p >= 0 && p < REST; }).length;
  return head + `
  <div class="k3"><div class="card"><div class="t">${ic('scale')}Güncel Kilo</div><div class="v">${cur ? nf(cur.v, 1) + ' <small>kg</small>' : '–'}</div>
    ${wk != null ? `<span class="dchip ${wk > 0 ? 'up' : ''}">${wk > 0 ? '▲ +' : '▼ '}${nf(wk, 1)} kg</span> <span class="mut" style="font-size:10.5px">${wkLbl}</span>` : '<span class="mut" style="font-size:11px">Kayıt ekle</span>'}</div>
   <div class="card" data-act="editTargetKg" style="cursor:pointer"><div class="t">${ic('target')}Hedef Kilo</div><div class="v">${tgt ? nf(tgt, 1) + ' <small>kg</small>' : '<small class="gold">Belirle ✎</small>'}</div>
    ${tgt ? `<div class="row" style="flex-wrap:nowrap;gap:6px"><div style="flex:1">${bar(tp, 100, 'sm')}</div><span class="mut" style="font-size:11px">%${Math.round(tp)}</span></div>` : '<span class="mut" style="font-size:11px">Dokun ve gir</span>'}</div>
   <div class="card"><div class="t">${ic('cal')}Kür Süresi</div><div class="v">${k && k.n >= 1 ? Math.min(k.n, k.len) + '. <small>Gün / ' + k.len + '</small>' : '–'}</div>${k ? bar(Math.max(0, Math.min(k.n, k.len)), k.len, 'sm') : ''}</div></div>
  <div class="chartrow"><div class="card" style="padding:10px"><div class="ch" style="margin-bottom:4px">${ic('bars')}<h2>${chartKey === 'kg' ? 'Kilo' : MEAS.find(m => m[0] === chartKey)[1]} Grafiği</h2>
    <select id="chartSel" style="width:auto;min-height:34px;padding:4px 8px;font-size:13px">${[['kg', 'Kilo'], ...MEAS].map(m => `<option value="${m[0]}" ${chartKey === m[0] ? 'selected' : ''}>${m[1]}</option>`).join('')}</select></div>${areaChart(ser, chartKey === 'kg' ? 'kg' : 'cm')}</div>
   <div class="sst"><div class="card">${ic('arrowdn')}<div><b class="${total > 0 ? 'red' : 'green'}">${total == null ? '–' : (total > 0 ? '+' : '') + nf(total, 1) + ' kg'}</b><span>Toplam Değişim</span></div></div>
    <div class="card">${ic('flame')}<div><b>${nf(S.settings.targets.kcal)} kcal</b><span>Günlük Hedef</span></div></div>
    <div class="card">${ic('stopwatch')}<div><b>${active} Gün</b><span>Aktif Takip</span></div></div></div></div>
  <div class="mrow"><div class="card" style="padding:10px"><div class="ch" style="margin-bottom:6px">${ic('ruler')}<h2 style="font-size:15px">Vücut Ölçüleri</h2><button class="lnk" data-act="prtab" data-t="olcum">›</button></div>
    <div class="bodym"><img src="${img('body')}" alt=""><table>${MEAS.map(m => `<tr><td>${m[1]}</td><td>${latestM[m[0]] != null ? nf(latestM[m[0]], 0) + ' <span class="mut">cm</span>' : '–'}</td></tr>`).join('')}</table></div></div>
   <div class="card" style="padding:10px"><div class="ch" style="margin-bottom:6px">${ic('camera')}<h2 style="font-size:15px">İlerleme Fotoğrafları</h2><button class="lnk" data-act="prtab" data-t="foto">›</button></div>
    <div class="photos"><div><div class="p">${ph.length ? photoTag(ph[0].photo) : 'Fotoğraf yok'}</div>Başlangıç<div class="mut" style="font-size:10px">${ph.length ? fmtY(ph[0].date) : ''}</div></div><span class="ar">→</span>
    <div><div class="p">${ph.length > 1 ? photoTag(ph[ph.length - 1].photo) : 'Fotoğraf yok'}</div>Güncel<div class="mut" style="font-size:10px">${ph.length > 1 ? fmtY(ph[ph.length - 1].date) : ''}</div></div></div></div></div>
  <div class="card"><div class="ch">${ic('list')}<h2>Kayıtlarım</h2><button class="lnk" data-act="prtab" data-t="olcum">Tüm Kayıtlar →</button></div>
   ${pr.length ? pr.slice().reverse().slice(0, 3).map((p, i) => `<div class="rec ${i === 0 ? 'first' : ''}">${ic('cal')}<span>${fmtY(p.date)}</span><b>${p.kg != null ? nf(p.kg, 1) + ' kg' : '–'}</b><span>${p.waist != null ? 'Bel: ' + nf(p.waist, 0) + ' cm' : ''}</span><span class="gold">${p.photo ? '📷' : ''}</span></div>`).join('') : '<div class="empty">Henüz kayıt yok. <button class="lnk" style="background:none;border:0;color:var(--gold);font-weight:700" data-act="prtab" data-t="ekle">İlk kaydı ekle</button></div>'}</div>
  <div class="ovr"><div class="card" style="padding:10px"><div class="ch" style="margin-bottom:6px">${ic('db')}<h2 style="font-size:13px">Antrenman Özeti</h2><span class="mut" style="font-size:10px">Bu Hafta</span></div>
    <div class="ws">${ring(wsess.length, Math.max(planned, 1), 86, 9, ['#178f3a', '#3dff8a'], `<b>${wsess.length} / ${planned}</b><span>Antrenman</span>`)}
    <div class="lst">${DAYS.map((d, i) => `<div><span class="row" style="gap:4px;flex-wrap:nowrap">${ic(i === 3 ? 'target' : 'db')}${esc(d.short)}</span><b>${wsess.filter(s => s.day === i).length}</b></div>`).join('')}<div><span class="row" style="gap:4px;flex-wrap:nowrap">${ic('pulse')}Kardiyo</span><b>${wsess.filter(s => s.cardio).length}</b></div></div></div></div>
   <div class="card" style="padding:10px;text-align:center" data-act="sub" data-s="kur"><div class="ch" style="margin-bottom:6px">${ic('kur')}<h2 style="font-size:15px">Kür Takibi</h2></div>
    ${k ? ring(Math.max(0, Math.min(k.n, k.len)), k.len, 92, 9, ['#b98500', '#ffd23d'], `<span class="gold" style="font-weight:800">%${Math.round(pct(Math.max(0, Math.min(k.n, k.len)), k.len))}</span><b>${Math.max(0, Math.min(k.n, k.len))} / ${k.len}</b><span>Gün</span>`) + `<div class="chip" style="margin-top:8px;font-size:12px">Kalan: ${k.rem} gün</div>` : '<div class="empty">Kür tarihi yok</div>'}</div></div>`;
};

/* ----- Sağlık / Kür / Takviye / Profil ----- */
V.health = () => {
  const h = S.health.slice().sort((a, b) => a.date < b.date ? 1 : -1);
  return `<div class="warn">Bu bölüm genel bilgilendirmedir, tıbbi tavsiye değildir. İlaç ve doz kararları için mutlaka doktoruna danış.</div>
  <div class="card"><div class="ch">${ic('drop')}<h2>Kan tahlili</h2></div><div class="mut">Kür öncesi, ortası ve bitiminden sonra yaptır:</div><ul class="ck" style="margin-top:8px">
   <li><span><b>Hemogram</b> – özellikle hematokrit</span></li><li><span><b>Karaciğer</b> – ALT / AST</span></li><li><span><b>Lipid profili</b> – kolesterol (HDL/LDL), trigliserid</span></li><li><span><b>Hormon paneli</b></span></li><li><span><b>Böbrek değerleri</b> – kreatinin, üre</span></li></ul></div>
  <div class="card"><div class="ch">${ic('heart')}<h2>Uyarı işaretleri</h2></div><ul class="tips">
   <li>Tansiyon <b>140/90</b> üstündeyse doktora git.</li>
   <li>Klenbuterol kullanırken <b>çarpıntı, göğüs ağrısı</b> ya da <b>dinlenme nabzı 100 üstü</b> olursa bırak ve doktora git.</li>
   <li>Kür sonrası <b>PCT</b>'yi doktorunla planla.</li></ul></div>
  <div class="card"><div class="ch">${ic('pulse')}<h2>Tansiyon / nabız kaydı</h2></div>
   <div class="grid2"><div><label class="f">Büyük (sistolik)</label><input id="hS" inputmode="numeric" placeholder="120"></div><div><label class="f">Küçük (diastolik)</label><input id="hD" inputmode="numeric" placeholder="80"></div>
   <div><label class="f">Nabız (dinlenme)</label><input id="hP" inputmode="numeric" placeholder="70"></div><div><label class="f">Tarih</label><input type="date" id="hDate" value="${today()}"></div></div>
   <button class="btn gold full" style="margin-top:10px" data-act="addHealth">Kaydet</button>
   ${h.length ? `<div class="list" style="margin-top:10px">${h.map(x => { const bad = (x.sys >= 140 || x.dia >= 90), bp = x.pulse > 100;
     return `<div class="it"><span>${fmtD(x.date)}</span><span class="row" style="flex-wrap:nowrap"><span class="${bad ? 'bad' : 'ok'}">${x.sys || '-'}/${x.dia || '-'}</span><span class="${bp ? 'bad' : 'mut'}">❤️ ${x.pulse || '-'}</span><button class="x" data-act="delHealth" data-id="${x.id}" aria-label="Sil">×</button></span></div>${bad || bp ? '<div class="warn" style="margin:4px 0">Bu değer sınırın üstünde. Doktora danış.</div>' : ''}`; }).join('')}</div>` : '<div class="empty">Henüz kayıt yok.</div>'}</div>`;
};
V.kur = () => {
  const k = kur(), st = S.settings;
  if (!k) return '<div class="card"><div class="empty">Kür başlangıç tarihi girilmemiş.</div><button class="btn gold full" data-act="go" data-t="settings">Ayarlar\'a git</button></div>';
  const n = Math.max(0, Math.min(k.n, k.len));
  return `<div class="card" style="text-align:center">${ring(n, k.len, 170, 14, ['#b98500', '#ffd23d'], `<span class="gold" style="font-weight:800">%${Math.round(pct(n, k.len))}</span><b style="font-size:26px">${n} / ${k.len}</b><span>Gün</span>`)}
   <div style="font-size:22px;font-weight:800;margin-top:10px">${k.n < 1 ? `Başlangıca ${1 - k.n} gün` : k.done ? '<span class="green">Kür bitti</span>' : `Kürün <span class="gold">${k.n}.</span> Günü`}</div>
   <div class="mut" style="font-size:14px">Başlangıç: ${fmtY(st.kurStart)} · Bitiş: ${fmtY(addDays(st.kurStart, k.len - 1))} · Kalan: <b class="gold">${k.rem}</b> gün</div>
   ${k.reminder && k.active ? '<div class="chip" style="margin-top:10px">📌 Bugün hatırlatma günü</div>' : ''}</div>
  <div class="card"><div class="ch">${ic('bell')}<h2>Hatırlatma günleri</h2></div><div class="wdc">${[1, 2, 3, 4, 5, 6, 0].map(d => `<button class="${st.kurDays.includes(d) ? 'on' : ''}" data-act="kd" data-d="${d}">${WDS[d]}</button>`).join('')}</div>
   <div class="mut" style="margin-top:8px">Bu günlerde ana sayfada ve bildirimlerde hatırlatma görünür.</div></div>
  ${k.done ? '<div class="warn">Kür bitti: PCT (kür sonrası toparlanma) planını doktorunla netleştir ve kan tahlili yaptır.</div>' : ''}
  <div class="card plain" data-act="sub" data-s="health" style="cursor:pointer;display:flex;align-items:center;gap:12px">${ic('heart')}<div style="flex:1"><b>Sağlık ve kan tahlili</b><div class="mut">Tansiyon, nabız ve uyarı işaretleri</div></div><span class="gold" style="font-size:24px">›</span></div>
  <button class="btn ogold full" data-act="go" data-t="settings">${ic('gear')}Kür ayarlarını değiştir</button>`;
};
V.supp = () => {
  const t = today(), done = S.supp[t] || [];
  const streakDays = Object.keys(S.supp).filter(d => (S.supp[d] || []).length).length;
  return `<div class="card"><div class="ch">${ic('pill')}<h2>Bugünkü takviyeler</h2><span class="chip">${done.length} / ${SUPPS.length}</span></div>
   ${SUPPS.map(s => `<label class="sup"><span class="e">${s.e}</span><span class="t"><b>${s.n}</b><span>${s.d}</span></span><input type="checkbox" class="chk" data-in="supp" data-id="${s.id}" ${done.includes(s.id) ? 'checked' : ''}></label>`).join('')}</div>
  <div class="card plain"><div class="mut">Kullanım miktarı için ürün etiketine uy, sağlık durumun varsa doktoruna danış. Takviye işaretlenen gün sayısı: <b class="gold">${streakDays}</b></div></div>`;
};
V.profile = () => `<div class="card"><div class="ch">${ic('user')}<h2>Profilim</h2></div>
  <label class="f">Adın</label><input data-prof="name" value="${esc(S.profile.name)}" placeholder="Adın">
  <div class="grid2"><div><label class="f">Boy (cm)</label><input data-prof="height" inputmode="numeric" value="${esc(S.profile.height)}" placeholder="180"></div><div><label class="f">Yaş</label><input data-prof="age" inputmode="numeric" value="${esc(S.profile.age)}" placeholder="30"></div></div>
  <label class="f">Hedef kilo (kg)</label><input data-set="targetKg" inputmode="decimal" value="${S.settings.targetKg != null ? S.settings.targetKg : ''}" placeholder="örn. 75"></div>`;

/* ----- Ayarlar ----- */
V.settings = () => {
  const st = S.settings, k = kur(), tg = st.targets;
  const tabs = [['plan', 'cal', 'Plan & Hedef'], ['app', 'phone', 'Uygulama'], ['backup', 'cloud', 'Yedekleme'], ['about', 'info', 'Hakkında']];
  const tile = (key, icon, label, unit, f = 0) => `<div><span style="font-size:20px">${icon}</span><span class="t">${label}</span>${editTargets ? `<input type="number" inputmode="numeric" data-tg="${key}" value="${tg[key]}">` : `<b>${nf(tg[key], f)}${unit}</b>`}</div>`;
  return `<div class="card prof" data-act="sub" data-s="profile"><div class="av">${ic('user')}</div><div><b>${S.profile.name ? esc(S.profile.name) : 'Profilim'}</b><div class="mut">Hedeflerin ve kişisel bilgilerin</div></div><span class="cv">›</span></div>
  <div class="tabs">${tabs.map(x => `<button class="${setTabSel === x[0] ? 'on' : ''}" data-act="stab" data-t="${x[0]}">${ic(x[1])}${x[2]}</button>`).join('')}</div>
  <div class="card" id="sec-plan"><div class="ch">${ic('cal')}<h2>Tarih ve Kür Ayarları</h2><span class="badge ${k && k.active ? '' : 'off'}">${k && k.active ? 'Kür Takibi Aktif' : 'Kür Pasif'}</span></div>
   <div class="grid2"><div><label class="f">🏃 Spor Başlangıç Tarihi</label><input type="date" data-set="startDate" value="${st.startDate}"></div>
   <div><label class="f">🗓️ Kür Başlangıç Tarihi</label><input type="date" data-set="kurStart" value="${st.kurStart || ''}"></div>
   <div><label class="f">Kür Süresi (Hafta)</label><select data-set="kurWeeks">${Array.from({length: 16}, (_, i) => i + 1).map(w => `<option value="${w}" ${+st.kurWeeks === w ? 'selected' : ''}>${w} Hafta</option>`).join('')}</select></div>
   </div><label class="f">🔔 Kür Hatırlatma Günleri</label><div class="wdc">${[1, 2, 3, 4, 5, 6, 0].map(d => `<button class="${st.kurDays.includes(d) ? 'on' : ''}" data-act="kd" data-d="${d}">${WDS[d]}</button>`).join('')}</div></div>
  <div class="card"><div class="ch">${ic('target')}<h2>Hedeflerim</h2><button class="btn sm ogold" data-act="editT">${editTargets ? '✓ Bitti' : '✎ Hedefleri Düzenle'}</button></div><div class="sub">Günlük beslenme ve takip hedeflerin</div>
   <div class="tiles">${tile('kcal', '🔥', 'Kalori', ' kcal')}${tile('protein', '💪', 'Protein', ' g')}${tile('carbs', '🌾', 'Karbonhidrat', ' g')}${tile('fat', '🟡', 'Yağ', ' g')}${tile('water', '💧', 'Su', ' ml')}</div></div>
  <div class="card"><div class="ch">${ic('cal')}<h2>Program Düzeni</h2></div><div class="sub">Antrenman planı döngünü belirle</div>
   <div class="opt"><button class="${st.rotation === 'cycle' ? 'on' : ''}" data-act="rot" data-r="cycle">${ic('repeat')}<span>4 gün antrenman<br>1 gün dinlenme (döngü)</span>${st.rotation === 'cycle' ? '<span class="ck">✓</span>' : ''}</button>
   <button class="${st.rotation === 'weekdays' ? 'on' : ''}" data-act="rot" data-r="weekdays">${ic('cal')}<span>Haftanın günlerine<br>göre seç</span>${st.rotation === 'weekdays' ? '<span class="ck">✓</span>' : ''}</button></div>
   ${st.rotation === 'weekdays' ? '<div style="margin-top:10px">' + [1, 2, 3, 4, 5, 6, 0].map(d => `<div class="wsel"><span>${WD[d]}</span><select data-wd="${d}">${[0, 1, 2, 3, 4].map(v => `<option value="${v}" ${+st.weekdays[d] === v ? 'selected' : ''}>${v === REST ? 'Dinlenme' : (v + 1) + '. Gün – ' + DAYS[v].short}</option>`).join('')}</select></div>`).join('') + '</div>' : ''}</div>
  <div class="card" id="sec-app"><div class="ch">${ic('gear')}<h2>Uygulama Ayarları</h2></div>
   <div class="setr">${ic('bell')}<div class="t"><b>Bildirimler</b><span>Antrenman, su ve kür hatırlatmaları</span></div><button class="tg ${st.notif ? 'on' : ''}" data-act="notif" aria-label="Bildirimler"></button></div>
   <div class="setr">${ic('moon')}<div class="t"><b>Koyu Tema</b><span>Göz yormayan arayüz</span></div><button class="tg on" data-act="theme" aria-label="Koyu tema"></button></div>
   <div class="setr">${ic('globe')}<div class="t"><b>Dil</b></div><span class="vv">Türkçe ›</span></div>
   <div class="setr">${ic('ruler')}<div class="t"><b>Birimler</b></div><span class="vv">kg, cm, kcal ›</span></div></div>
  <div class="card" id="sec-backup"><div class="ch">${ic('cloud')}<h2>Yedekleme ve Veri</h2></div><div class="sub">Verilerini güvenle sakla ve geri yükle</div>
   <div class="grid2"><button class="btn ogold" data-act="export">${ic('down')}Yedeği İndir (JSON)</button><label class="btn" style="cursor:pointer">${ic('up')}Yedekten Yükle<input type="file" id="imp" accept=".json,application/json" hidden></label></div></div>
  <div class="card danger" data-act="reset">${ic('trash')}<div style="flex:1"><b>Tüm Verileri Sıfırla</b><div class="mut">Uygulamadaki tüm veriler kalıcı olarak silinir.</div></div><span style="color:#ff4d4d;font-size:24px">›</span></div>
  <div class="card plain" id="sec-about"><div class="ch">${ic('info')}<h2>Hakkında</h2></div><div class="mut">Fitness Hocası – antrenman, beslenme ve ilerleme takibi. Tüm verilerin sadece bu cihazda saklanır. Sağlık bölümü genel bilgilendirmedir, tıbbi tavsiye değildir; uygulamada doz bilgisi yoktur.</div></div>
  <p class="mut" style="text-align:right;margin:0 4px">Sürüm: <b id="verLbl">${SINGLE_FILE ? 'tek dosya' : (localStorage.getItem('fh_ver') || '…')}</b></p>`;
};

/* ----- Sayfalar dışı: çekmece, alt sayfa ----- */
function openDrawer() {
  $('#drawer').innerHTML = `<img src="${img('logo')}" alt="">` + [['home', 'home', 'Ana Sayfa'], ['program', 'db', 'Program'], ['food', 'food', 'Beslenme'], ['progress', 'bars', 'İlerleme'], ['s:supp', 'pill', 'Takviyeler'], ['s:kur', 'kur', 'Kür Takibi'], ['s:health', 'heart', 'Sağlık'], ['settings', 'gear', 'Ayarlar']]
    .map(x => `<button data-dr="${x[0]}">${ic(x[1])}${x[2]}</button>`).join('');
  $('#drawer').classList.add('on'); $('#scrim').classList.add('on');
}
function openSheet(html) { $('#sheet').innerHTML = html; $('#sheet').classList.add('on'); $('#scrim').classList.add('on'); }
function closeAll() { ['#drawer', '#sheet', '#scrim'].forEach(s => $(s).classList.remove('on')); }
function kayitSheet() {
  const p = planFor(today());
  openSheet(`<h3>Hızlı Kayıt</h3><div class="sgrid">
   <button data-sh="workout">${ic('db')}${p >= 0 && p < REST ? DAYS[p].short + ' başlat' : 'Antrenman'}</button>
   <button data-sh="water">${ic('drop')}+250 ml su</button><button data-sh="food">${ic('food')}Yiyecek ekle</button>
   <button data-sh="prog">${ic('scale')}Ölçüm ekle</button><button data-sh="health">${ic('pulse')}Tansiyon / nabız</button><button data-sh="supp">${ic('pill')}Takviye</button></div>
   <button class="btn full" style="margin-top:12px" data-sh="close">Kapat</button>`);
}
function calSheet() {
  const t = today(), k = kur();
  openSheet(`<h3>Önümüzdeki 7 gün</h3><div class="list">${Array.from({length: 7}, (_, i) => { const d = addDays(t, i), p = planFor(d);
    const kd = k && S.settings.kurDays.includes(parse(d).getDay()) && diffDays(S.settings.kurStart, d) >= 0 && diffDays(S.settings.kurStart, d) < k.len;
    return `<div class="it"><span>${i === 0 ? '<b>Bugün</b>' : fmtD(d)}</span><span class="${p === REST ? 'green' : 'gold'}">${esc(planName(p))}${kd ? ' · 📌' : ''}</span></div>`; }).join('')}</div>
    <button class="btn full" style="margin-top:12px" data-sh="close">Kapat</button>`);
}
function bellSheet() {
  const r = reminders();
  openSheet(`<h3>Bildirimler</h3><div class="notif">${r.length ? r.map(x => `<div class="it">${ic(x[0])}<span>${x[1]}</span></div>`).join('') : '<div class="empty">Her şey tamam! 🎉</div>'}</div>
   <button class="btn full" style="margin-top:12px" data-sh="close">Kapat</button>`);
}
/* ===== Render ===== */
function render() {
  $('#hdr').innerHTML = header();
  $('#nav').innerHTML = nav();
  $('#view').innerHTML = V[sub || tab]();
  document.querySelectorAll('img[data-photo]').forEach(async im => { const d = await PDB.get(im.dataset.photo); if (d) im.src = d; });
  if (tab === 'settings' && !sub) showVersion();
}
function go(t) { tab = t; sub = null; openEx = null; closeAll(); render(); window.scrollTo(0, 0); }
function goSub(s) { sub = s; closeAll(); render(); window.scrollTo(0, 0); }
$('#vClose').onclick = () => $('#viewer').classList.remove('on');
$('#scrim').onclick = closeAll;
$('#nav').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; if (b.dataset.act === 'kayit') return kayitSheet(); go(b.dataset.t); });
$('#drawer').addEventListener('click', e => { const b = e.target.closest('[data-dr]'); if (!b) return; const v = b.dataset.dr; v.startsWith('s:') ? goSub(v.slice(2)) : go(v); });
$('#sheet').addEventListener('click', e => {
  const b = e.target.closest('[data-sh]'); if (!b) return; const a = b.dataset.sh;
  if (a === 'close') return closeAll();
  if (a === 'workout') { const p = planFor(today()); progDay = p >= 0 && p < REST ? p : 0; startWorkout(); return go('program'); }
  if (a === 'water') { addWater(250); closeAll(); return render(); }
  if (a === 'food') { foodTab = 'gida'; foodDate = today(); return go('food'); }
  if (a === 'prog') { prTab = 'ekle'; return go('progress'); }
  if (a === 'health') return goSub('health');
  if (a === 'supp') return goSub('supp');
});
$('#hdr').addEventListener('click', e => {
  const b = e.target.closest('[data-act]'); if (!b) return; const a = b.dataset.act;
  if (a === 'drawer') return openDrawer();
  if (a === 'bell') return bellSheet();
  if (a === 'back') { if (sub === 'profile') { sub = null; tab = 'settings'; render(); return; } return go('home'); }
  if (a === 'h-cal') return calSheet();
  if (a === 'h-sliders') { setTabSel = 'plan'; return go('settings'); }
  if (a === 'h-share') return shareProgress();
});
function addWater(ml) { const t = today(); const before = S.water[t] || 0; S.water[t] = Math.max(0, before + ml); save();
  if (ml > 0 && before < S.settings.targets.water && S.water[t] >= S.settings.targets.water) toast('💧 Su hedefi tamam!'); }
function startWorkout() { const dr = S.drafts[progDay] = S.drafts[progDay] || {}; dr._active = true; openEx = DAYS[progDay].ex[0].id; save(); }
async function shareProgress() {
  const kg = series('kg'), c = kg.length ? kg[kg.length - 1].v : null;
  const txt = `Fitness Hocası – Sporun ${sportDay()}. günü. ${S.sessions.length} antrenman${c ? ', güncel kilo ' + nf(c, 1) + ' kg' : ''}${kg.length > 1 ? ' (' + (c - kg[0].v > 0 ? '+' : '') + nf(c - kg[0].v, 1) + ' kg)' : ''}.`;
  if (navigator.share) { try { await navigator.share({text: txt}); } catch (e) {} }
  else { try { await navigator.clipboard.writeText(txt); toast('Özet panoya kopyalandı'); } catch (e) { toast(txt, 4000); } }
}

const view = $('#view');
view.addEventListener('click', async e => {
  const im = e.target.closest('img[data-photo]'); if (im && im.src) return viewImg(im.src);
  const el = e.target.closest('[data-act]'); if (!el) return;
  const a = el.dataset.act, t = today();
  if (a === 'zoom') return viewImg(el.src);
  if (a === 'go') return go(el.dataset.t);
  if (a === 'sub') return goSub(el.dataset.s);
  if (a === 'goToday') { const p = planFor(t); progDay = p >= 0 && p < REST ? p : 0; return go('program'); }
  if (a === 'w+' || a === 'w-') { addWater(a === 'w+' ? 250 : -250); return render(); }
  // program
  if (a === 'pday') { progDay = +el.dataset.d; openEx = null; return render(); }
  if (a === 'ex') { openEx = openEx === el.dataset.id ? null : el.dataset.id; return render(); }
  if (a === 'start') { startWorkout(); render(); return toast('💪 Antrenman başladı! Setleri girip işaretle.'); }
  if (a === 'cancelW') { if (!confirm('Bu antrenmandaki girişler silinsin mi?')) return; delete S.drafts[progDay]; openEx = null; save(); return render(); }
  if (a === 'finish') {
    const dr = S.drafts[progDay] || {}, d = DAYS[progDay];
    const ex = d.ex.map(x => ({id: x.id, n: x.n, sets: Array.from({length: x.sets}, (_, i) => { const v = (dr[x.id] || [])[i] || {}; return {kg: v.kg || '', reps: v.reps || '', done: !!v.done}; })}));
    const any = ex.some(x => x.sets.some(s => s.done || s.kg || s.reps)) || dr._cardio;
    if (!any && !confirm('Hiç set girilmedi. Yine de antrenmanı kaydetmek istiyor musun?')) return;
    S.sessions.push({id: uid(), date: t, day: progDay, ex, cardio: !!dr._cardio});
    delete S.drafts[progDay]; openEx = null; save(); render(); window.scrollTo(0, 0); return toast('💪 Antrenman kaydedildi!');
  }
  if (a === 'delSess') { if (confirm('Bu antrenman kaydı silinsin mi?')) { S.sessions = S.sessions.filter(s => s.id !== el.dataset.id); save(); render(); } return; }
  // beslenme
  if (a === 'ftab') { foodTab = el.dataset.t; render(); return window.scrollTo(0, 0); }
  if (a === 'fdate') { foodDate = el.dataset.d; if (foodTab === 'gecmis') foodTab = 'plan'; render(); return window.scrollTo(0, 0); }
  if (a === 'meal') { const f = foodDay(foodDate); const i = +el.dataset.i; f.meals[i] = !f.meals[i]; save(); return render(); }
  if (a === 'preset') { const p = PRESETS[+el.dataset.i]; foodDay(foodDate).log.push({n: p[0], k: p[1], p: p[2], c: p[3], f: p[4]}); save(); render(); return toast(p[0] + ' eklendi'); }
  if (a === 'customFood') { foodTab = 'gida'; render(); setTimeout(() => { const i = $('#fName'); if (i) { i.scrollIntoView({block: 'center'}); i.focus(); } }, 50); return; }
  if (a === 'addFood') { const n = $('#fName').value.trim(), k = num($('#fK').value), p = num($('#fP').value) || 0, c = num($('#fC').value) || 0, f = num($('#fF').value) || 0;
    if (!n || k == null) return toast('Ad ve kalori gir'); foodDay(foodDate).log.push({n, k, p, c, f}); save(); render(); return toast(n + ' eklendi'); }
  if (a === 'delFood') { foodDay(foodDate).log.splice(+el.dataset.i, 1); save(); return render(); }
  // ilerleme
  if (a === 'prtab') { prTab = el.dataset.t; render(); return window.scrollTo(0, 0); }
  if (a === 'editTargetKg') { const v = prompt('Hedef kilo (kg):', S.settings.targetKg != null ? S.settings.targetKg : ''); if (v === null) return; const n = num(v); S.settings.targetKg = n && n > 0 ? n : null; save(); return render(); }
  if (a === 'addProg') {
    const kg = num($('#pKg').value), note = $('#pNote').value.trim(), date = $('#pDate').value || t, f = $('#pPhoto').files[0];
    const it = {id: uid(), date, kg, note}; let any = kg != null || !!note || !!f;
    MEAS.forEach(m => { const v = num($('#p_' + m[0]).value); it[m[0]] = v; if (v != null) any = true; });
    if (!any) return toast('En az bir değer gir');
    if (f) { try { const data = await compress(f); it.photo = 'ph_' + it.id; await PDB.put(it.photo, data); } catch (er) { toast('Fotoğraf eklenemedi'); } }
    S.progress.push(it); save(); prTab = 'genel'; render(); window.scrollTo(0, 0); return toast('Ölçüm kaydedildi');
  }
  if (a === 'delProg') { if (!confirm('Bu kayıt silinsin mi?')) return; const p = S.progress.find(x => x.id === el.dataset.id); if (p && p.photo) PDB.del(p.photo);
    S.progress = S.progress.filter(x => x.id !== el.dataset.id); save(); return render(); }
  // sağlık
  if (a === 'addHealth') { const sys = num($('#hS').value), dia = num($('#hD').value), pulse = num($('#hP').value);
    if (sys == null && dia == null && pulse == null) return toast('Değer gir');
    S.health.push({id: uid(), date: $('#hDate').value || t, sys, dia, pulse}); save(); render();
    return toast((sys >= 140 || dia >= 90 || pulse > 100) ? '⚠️ Değer yüksek – doktora danış' : 'Kaydedildi'); }
  if (a === 'delHealth') { S.health = S.health.filter(x => x.id !== el.dataset.id); save(); return render(); }
  // ayarlar
  if (a === 'stab') { setTabSel = el.dataset.t; const sec = $('#sec-' + setTabSel); document.querySelectorAll('[data-act="stab"]').forEach(b => b.classList.toggle('on', b === el)); if (sec) window.scrollTo({top: sec.getBoundingClientRect().top + scrollY - 10, behavior: 'smooth'}); return; }
  if (a === 'kd') { const d = +el.dataset.d, st = S.settings; st.kurDays = st.kurDays.includes(d) ? st.kurDays.filter(x => x !== d) : [...st.kurDays, d]; save(); return render(); }
  if (a === 'editT') { editTargets = !editTargets; return render(); }
  if (a === 'rot') { S.settings.rotation = el.dataset.r; save(); return render(); }
  if (a === 'notif') { const st = S.settings; st.notif = !st.notif; save(); render();
    if (st.notif && 'Notification' in window && Notification.permission === 'default') { try { await Notification.requestPermission(); } catch (er) {} }
    return toast(st.notif ? 'Hatırlatmalar açık' : 'Hatırlatmalar kapalı'); }
  if (a === 'theme') return toast('Uygulama koyu temayla tasarlandı 🌙');
  if (a === 'export') return exportData();
  if (a === 'reset') { if (!confirm('TÜM veriler silinecek (antrenman, beslenme, ölçümler, fotoğraflar). Emin misin?')) return; if (!confirm('Son kez soruyorum: geri alınamaz. Silinsin mi?')) return;
    localStorage.removeItem(KEY); await PDB.clear(); load(); progDay = null; foodDate = null; go('home'); return toast('Veriler sıfırlandı'); }
});
view.addEventListener('input', e => {
  const el = e.target;
  if (el.dataset.in === 'kg' || el.dataset.in === 'reps') { const dr = S.drafts[progDay] = S.drafts[progDay] || {}; const arr = dr[el.dataset.e] = dr[el.dataset.e] || [];
    arr[+el.dataset.i] = Object.assign(arr[+el.dataset.i] || {}, {[el.dataset.in]: el.value}); save(); }
});
view.addEventListener('change', async e => {
  const el = e.target, st = S.settings;
  if (el.dataset.in === 'done') { const dr = S.drafts[progDay] = S.drafts[progDay] || {}; const arr = dr[el.dataset.e] = dr[el.dataset.e] || [];
    const row = arr[+el.dataset.i] = Object.assign(arr[+el.dataset.i] || {}, {done: el.checked});
    if (el.checked) view.querySelectorAll(`input[data-e="${el.dataset.e}"][data-i="${el.dataset.i}"]`).forEach(i => {
      if ((i.dataset.in === 'kg' || i.dataset.in === 'reps') && !i.value && i.placeholder && !/kg|tekrar/.test(i.placeholder)) { i.value = i.placeholder; row[i.dataset.in] = i.value; } });
    save(); return; }
  if (el.dataset.in === 'cardio') { const dr = S.drafts[progDay] = S.drafts[progDay] || {}; dr._cardio = el.checked; save(); return; }
  if (el.dataset.in === 'supp') { const t = today(), arr = S.supp[t] = S.supp[t] || [], id = el.dataset.id; S.supp[t] = el.checked ? [...new Set([...arr, id])] : arr.filter(x => x !== id); save(); return render(); }
  if (el.id === 'chartSel') { chartKey = el.value; return render(); }
  if (el.dataset.prof) { S.profile[el.dataset.prof] = el.value.trim(); save(); return toast('Kaydedildi'); }
  if (el.dataset.set) { let v = el.value, k = el.dataset.set;
    if (k === 'kurWeeks') v = Math.max(1, num(v) || 5); if (k === 'startDate' && !v) v = today(); if (k === 'targetKg') { v = num(v); if (!(v > 0)) v = null; }
    st[k] = v; save(); if (k !== 'targetKg') render(); return toast('Kaydedildi'); }
  if (el.dataset.wd) { st.weekdays[el.dataset.wd] = +el.value; save(); return toast('Kaydedildi'); }
  if (el.dataset.tg) { const v = num(el.value); if (v > 0) { st.targets[el.dataset.tg] = v; save(); toast('Hedef güncellendi'); } return; }
  if (el.id === 'imp' && el.files[0]) {
    try { const data = JSON.parse(await el.files[0].text()); if (!data || !data.settings) throw 0;
      if (!confirm('Mevcut veriler yedekteki verilerle değiştirilecek. Devam?')) return;
      const photos = data._photos || {}; delete data._photos; localStorage.setItem(KEY, JSON.stringify(data)); load();
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

/* ===== Otomatik güncelleme (Service Worker) ===== */
async function swVersion() {
  try { const c = navigator.serviceWorker && navigator.serviceWorker.controller; if (c) { const v = await new Promise(res => { const ch = new MessageChannel(); ch.port1.onmessage = m => res(m.data); c.postMessage({type: 'GET_VERSION'}, [ch.port2]); setTimeout(() => res(null), 1500); }); if (v) return v; } } catch (e) {}
  try { return (await (await fetch('./version.json', {cache: 'no-store'})).json()).version; } catch (e) { return null; }
}
async function showVersion() { if (SINGLE_FILE) return; const v = await swVersion(); const l = $('#verLbl'); if (l && v) l.textContent = v; }
async function versionToast() {
  const v = await swVersion(); if (!v) return; const prev = localStorage.getItem('fh_ver');
  if (prev && prev !== v) toast('Uygulama güncellendi ✓ v' + v, 3500);
  localStorage.setItem('fh_ver', v);
}
function maybeNotify() {
  try {
    if (!S.settings.notif || !('Notification' in window) || Notification.permission !== 'granted') return;
    const t = today(); if (localStorage.getItem('fh_notified') === t) return;
    const r = reminders().filter(x => x[0] !== 'drop'); if (!r.length) return;
    const body = r.map(x => x[1].replace(/<[^>]+>/g, '')).join('\n');
    localStorage.setItem('fh_notified', t);
    if (navigator.serviceWorker && navigator.serviceWorker.ready) navigator.serviceWorker.ready.then(reg => reg.showNotification('Fitness Hocası', {body, icon: './icon-192.png', badge: './icon-192.png'})).catch(() => {});
  } catch (e) {}
}
if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol) && !SINGLE_FILE) {
  const hadController = !!navigator.serviceWorker.controller;
  let reloading = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!hadController || reloading) return; // ilk kurulumda yenileme yok
    const last = +sessionStorage.getItem('fh_upd_reload') || 0;
    if (Date.now() - last < 15000) return; // döngü koruması
    reloading = true; sessionStorage.setItem('fh_upd_reload', Date.now()); location.reload();
  });
  window.addEventListener('load', async () => {
    try {
      const reg = await navigator.serviceWorker.register('./sw.js', {scope: './'});
      const check = () => reg.update().catch(() => {});
      check(); setInterval(check, 30 * 60 * 1000);
      document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') check(); });
      await navigator.serviceWorker.ready; versionToast(); maybeNotify();
    } catch (e) { /* çevrimdışı veya desteklenmiyor */ }
  });
}

/* Başlat */
load();
let lastDay = today();
setInterval(() => { if (today() !== lastDay) { lastDay = today(); if (foodDate && foodDate !== lastDay) foodDate = lastDay; render(); } }, 60000);
render();
setTimeout(() => $('#splash').classList.add('hide'), 450);
setTimeout(() => $('#splash').remove(), 1000);
