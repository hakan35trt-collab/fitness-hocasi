# Fitness Hocası (PWA)

Telefonda çalışan, internetsiz de açılan kişisel fitness uygulaması: 4 günlük program ve videolar, spor/kür gün sayacı, antrenman kayıtları, beslenme ve su takibi, takviye listesi, kilo/vücut ölçüsü grafikleri, ilerleme fotoğrafları ve sağlık kayıtları.
Tüm veriler **sadece telefonda** (localStorage + IndexedDB) saklanır; sunucuya hiçbir şey gönderilmez.

Canlı adres: https://hakan35trt-collab.github.io/fitness-hocasi/

## Yayınlama (GitHub Pages)
`.github/workflows/pages.yml`, `main` dalına her push'ta depo kökünü GitHub Pages'e yayınlar
(Settings → Pages → Source: **GitHub Actions**). Tüm yollar göreli (`./`) olduğu için alt klasörde sorunsuz çalışır.

## Telefona kurma
- **Android (Chrome):** adresi aç → ⋮ menü → **Uygulamayı yükle / Ana ekrana ekle**.
- **iPhone (Safari):** adresi aç → Paylaş → **Ana Ekrana Ekle**.

## Güncelleme yayınlama (otomatik güncelleme)
1. Değişikliği yap.
2. Sürümü yükselt: `./bump.sh 2.0.1`
   (bu komut `sw.js` içindeki `VERSION`, `version.json` ve `index.html` içindeki `?v=` değerlerini birlikte değiştirir).
3. `git commit -am "v2.0.1" && git push`

Uygulama açılışta, uygulamaya her geri dönüşte ve 30 dakikada bir güncelleme kontrol eder.
Yeni sürüm bulunca kendiliğinden kurulur, sayfa **bir kez otomatik yenilenir** ve "Uygulama güncellendi ✓ vX" mesajı çıkar. Buton gerekmez.
Kullanıcı verileri (antrenmanlar, beslenme, ölçümler, fotoğraflar) güncellemelerde **silinmez**; sadece uygulama dosyalarının önbelleği yenilenir.

> `VERSION` değiştirilmezse telefonlar önbellekteki eski dosyaları kullanmaya devam eder.

## Yedek
Ayarlar → Yedekleme → **Yedeği İndir (JSON)** tüm verileri (fotoğraflar dahil) indirir; **Yedekten Yükle** geri yükler.

## Dosyalar
| Dosya | Açıklama |
|---|---|
| `index.html` | Uygulama kabuğu |
| `js/app.js`, `css/style.css` | Uygulama kodu ve tasarım |
| `sw.js` | Service worker (çevrimdışı önbellek, otomatik güncelleme) |
| `version.json` | Yayındaki sürüm |
| `bump.sh` | Sürüm yükseltme betiği |
| `manifest.webmanifest`, `icon-*.png`, `apple-touch-icon.png`, `favicon*` | Kurulum bilgisi ve simgeler |
| `img/` | Arayüz görselleri (webp) |
| `program-gorsel.jpg`, `beslenme-gorsel.jpg` | Program ve beslenme görselleri |

Sağlık bölümü genel bilgilendirmedir, tıbbi tavsiye değildir; uygulamada doz bilgisi yoktur.
