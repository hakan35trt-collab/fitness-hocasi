# Fitness Hocası (PWA)

Telefonda çalışan, internet gerektirmeyen kişisel fitness uygulaması: gün gün program ve videolar, spor/kür gün sayacı, antrenman kayıtları, beslenme ve su takibi, kilo/bel grafikleri, sağlık kayıtları.
Tüm veriler **sadece telefonunda** (localStorage + IndexedDB) saklanır; sunucuya hiçbir şey gönderilmez.

## Yayınlama (GitHub Pages)
1. GitHub'da yeni bir depo aç ve bu klasörü `main` dalına gönder (push).
2. Depo → **Settings → Pages → Build and deployment → Source: GitHub Actions** seç.
3. `.github/workflows/pages.yml` her `main` push'unda siteyi yayınlar. Adres: `https://<kullanıcı>.github.io/<depo>/`
4. Tüm yollar göreli (`./`) olduğu için alt klasörde sorunsuz çalışır.

## Telefona kurma
- **Android (Chrome):** adresi aç → ⋮ menü → **Ana ekrana ekle / Uygulamayı yükle**.
- **iPhone (Safari):** adresi aç → Paylaş → **Ana Ekrana Ekle**.
Bir kez açıldıktan sonra internetsiz de çalışır.

## Güncelleme yayınlama
1. Dosyalarda değişikliği yap.
2. **`sw.js` içindeki `VERSION`** değerini artır (örn. `1.0.0` → `1.0.1`).
3. **`version.json`** içindeki `version` değerini aynı yap.
4. Commit + push. Birkaç dakika içinde Pages yayınlar.

Uygulama açılışta ve her 30 dakikada bir güncelleme kontrol eder. Yeni sürüm bulununca üstte **"Yeni sürüm var — Güncelle"** çıkar; dokununca yeni sürüm yüklenir.
Kullanıcı verileri (antrenmanlar, beslenme, ölçümler, fotoğraflar) güncellemelerde **silinmez**; sadece uygulama dosyalarının önbelleği yenilenir.

> Not: `VERSION` değiştirilmezse telefonlar eski önbellekteki dosyaları kullanmaya devam edebilir.

## Yedek
Ayarlar → **Yedeği indir (JSON)** ile tüm veriler (fotoğraflar dahil) indirilir; **Yedekten yükle** ile geri yüklenir. Telefon değiştirirken veya tarayıcı verisini silmeden önce yedek al.

## Dosyalar
| Dosya | Açıklama |
|---|---|
| `index.html`, `style.css`, `app.js` | Uygulama |
| `sw.js` | Service worker (çevrimdışı önbellek, sürüm) |
| `version.json` | Yayındaki sürüm |
| `manifest.webmanifest`, `icon-*.png` | Kurulum bilgisi ve simgeler |
| `program-gorsel.jpg`, `beslenme-gorsel.jpg` | Program ve beslenme görselleri |

Sağlık bölümü genel bilgilendirmedir, tıbbi tavsiye değildir; uygulamada doz bilgisi yoktur.
