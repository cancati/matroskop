# Matroskop — Proje Durum Takibi

> Bu dosya her geliştirme oturumunun başında okunur, biten maddeler `- [x]` yapılır.
> Yeni görevler buraya eklenir — başka yere not tutulmaz.

---

## Roller & Yetkiler

| Rol | Renk | Özet |
|-----|------|------|
| Sistem Yöneticisi | 🔴 | Tüm platformu yönetir |
| Okul Yöneticisi | 🟠 | Kendi okulunu yönetir |
| Öğretmen | 🟡 | Kendi sınıfını yönetir |
| Öğrenci | 🟢 | Sınava girer, PDF rapor indirir |
| Tedarikçi | 🔵 | Atanmış öğrencileri takip eder |

---

## ✅ Tamamlananlar

### Altyapı
- [x] Next.js 14 App Router kurulumu
- [x] TypeScript + Tailwind CSS
- [x] Prisma + PostgreSQL entegrasyonu (`prisma.config.ts`, `PrismaPg` adapter)
- [x] JWT httpOnly cookie auth sistemi
- [x] Role-based yönlendirme (5 rol)
- [x] `dev` / `main` branch ayrımı (main → canlı, dev → geliştirme)
- [x] Kapsamlı seed script (3 okul, 6 öğretmen, 12 sınıf, 108 öğrenci, 100 soru)

### Kurumsal Site (main branch)
- [x] Landing page (Hero, Product, HowItWorks, About, Testimonials, Dealers, Contact, FAQ)
- [x] Navbar + Footer
- [x] Mobil responsive

### Auth
- [x] Login formu (email veya username)
- [x] Test hesapları hızlı doldurma (geliştirme ortamı)
- [x] Logout
- [x] `requireAuth()` / `requireAdmin()` guard'ları

### 🔴 Sistem Yöneticisi Paneli
- [x] Dashboard (istatistik kartları)
- [x] Okul listesi + okul ekleme/düzenleme modalı
- [x] Okul detay sayfası (kullanıcılar, sınıflar, öğrenciler)
- [x] Tedarikçi listesi + tedarikçi ekleme/düzenleme modalı
- [x] Tedarikçi detay sayfası
- [x] Kullanıcı listesi + kullanıcı ekleme/düzenleme modalı
- [x] Soru bankası (listeleme + ekleme + düzenleme + silme)
- [x] Transfer talepleri listesi + onay/red işlemi
- [x] Raporlar sayfası

### 🟠 Okul Yöneticisi Paneli
- [x] Dashboard
- [x] Öğretmen listesi (görüntüleme)
- [x] Sınıf listesi (görüntüleme)
- [x] Öğrenci listesi + sınav durumu
- [x] Öğrenciye sınav başlatma
- [x] Transfer talebi oluşturma + geçmiş listesi
- [x] Raporlar (accordion, ScoreBar)

### 🟡 Öğretmen Paneli
- [x] Dashboard (4 stat kart, son sınavlar tablosu, seviye dağılım barları)
- [x] Sınıfım sayfası (öğrenci listesi, öğrenci ekleme modalı)
- [x] Raporlar (accordion, ScoreBar)

### 🟢 Öğrenci Paneli
- [x] Dashboard
- [x] Sınav motoru (50 soru, çoktan seçmeli, fire-and-forget cevaplama)
- [x] Sınav başlat / devam et / bitir akışı
- [x] PENDING sınavda "0 cevap → devam et gösterme" fix
- [x] G76 = G57×0.4 + G58×0.3 + G59×0.3 hesabı
- [x] A1–C2 seviye belirleme
- [x] Raporlarım sayfası (geçmiş sınavlar)

### 🔵 Tedarikçi Paneli
- [x] Dashboard
- [x] Öğrenci listesi (aktif sınav durumu, son sınav sonucu)
- [x] Öğrenciye sınav oluşturma (PENDING olarak)
- [x] Raporlar (accordion, ScoreBar)

---

## 🔲 Yapılacaklar

### Yüksek Öncelik
- [ ] **Öğretmen — Sınıf oluşturma** (`POST /api/teacher/sinifim` + UI butonu)
- [ ] **Okul Yöneticisi — Öğretmen ekleme** (ogretmenler sayfasına form/modal ekle)
- [ ] **Öğrenci — PDF rapor indirme** (sınav bitince veya raporlarım sayfasından)

### Orta Öncelik
- [ ] **Sistem Yöneticisi — PDF dinamik metin yönetimi** (raporda gösterilecek bölüm metinleri)
- [ ] Öğrenci şifre değiştirme
- [ ] Okul Yöneticisi dashboard istatistikleri (şu an stub)
- [ ] Tedarikçi dashboard istatistikleri (şu an stub)

### Düşük Öncelik / Sonraki Faz
- [ ] Şifremi unuttum akışı (sıfırlama maili)
- [ ] Toplu öğrenci import (CSV)
- [ ] Sınav süresi limiti (opsiyonel timer)
- [ ] Mobil sınav görünümü iyileştirmesi

---

## Teknik Notlar

- Soru havuzu: G57 poolId 1–20, G58 poolId 21–35, G59 poolId 36–50
- Sınav oluşturma: her havuzdan 1 soru seçilir → 50 soru
- `selected: -1` → cevaplanmamış soru sentinel değeri
- Tedarikçi oluşturduğu sınavlar `PENDING` statüsüyle başlar
- Seed çalıştırma: `npx prisma db seed`
- Branch: `dev` → geliştirme, `main` → canlı (Vercel production)
