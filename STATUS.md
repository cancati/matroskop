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

### 📄 PDF Rapor Sistemi
- [x] `SectionText` modeli (schema) — 1808 dinamik metin kaydı
- [x] `ExamResult` modeli genişletildi — `categoryScores` + `profileSlugs` JSON alanları eklendi
- [x] `lib/scoring.ts` — 50 havuz ağırlık matrisi, `calculateExamResult()`, `scoreToThreshold()`, `scoreToLevel()`
- [x] `lib/section-texts.ts` — `fetchSectionTexts()` (score-based + slug-based tek sorguda)
- [x] `scripts/import-bolum-metinleri.ts` — Excel → DB import (idempotent, upsert)
- [x] `components/pdf/StudentReportPDF.tsx` — @react-pdf/renderer ile 3 sayfalık PDF şablonu
- [x] `GET /api/rapor/[examId]` — PDF stream endpoint (yetki kontrolü dahil)
- [x] `POST /api/exam/[examId]/complete` — Sınav tamamlama + skor hesaplama + ExamResult kaydetme

---

## 🔲 Yapılacaklar

### Yüksek Öncelik — Öğretmen
- [ ] Sınıf oluşturma (`POST /api/teacher/sinifim` + UI butonu)
- [ ] Sınıf düzenleme / silme

### Yüksek Öncelik — Okul Yöneticisi
- [ ] Öğretmen ekleme (ogretmenler sayfasına form/modal)
- [ ] Sınıf CRUD (ekle / düzenle / sil — şu an sadece listeleme var)
- [ ] Transfer sayfasında okul seçme dropdown'ı (şu an ID elle giriliyor)

### Yüksek Öncelik — Sistem Yöneticisi
- [ ] Kullanıcı aramasına username desteği (şu an sadece name + email aranıyor)
- [ ] Tedarikçiye öğrenci atama UI'ı
- [ ] PDF bölüm metinleri yönetimi (SectionText CRUD — liste, filtre, düzenleme)

### Yüksek Öncelik — Öğrenci
- [ ] PDF rapor indirme butonu (raporlarım sayfasından)

### Orta Öncelik
- [ ] Öğrenci şifre değiştirme (profil sayfası)
- [ ] Okul Yöneticisi dashboard istatistikleri (şu an stub)
- [ ] Tedarikçi dashboard istatistikleri (şu an stub)
- [ ] `scripts/import-bolum-metinleri.ts` çalıştırılacak (1808 kayıt DB'ye yüklenecek)
- [ ] `scripts/import-questions.ts` çalıştırılacak (1019 soru + Supabase Storage görselleri)

### Düşük Öncelik / Sonraki Faz
- [ ] Şifremi unuttum akışı (e-posta ile sıfırlama)
- [ ] Toplu öğrenci import (CSV)
- [ ] Sınav süresi limiti (opsiyonel timer)
- [ ] Mobil sınav görünümü iyileştirmesi
- [ ] Bildirim sistemi

---

## Teknik Notlar

### Sınav & Skor
- Sınav: 50 havuzdan her birinden 1 rastgele soru → toplam 50 soru
- `selected: -1` → cevaplanmamış soru sentinel değeri
- Tedarikçi oluşturduğu sınavlar `PENDING` statüsüyle başlar

### Havuz Yapısı (matroskop algoritma.xlsx)
- Havuz 1–25: G57 / G58 / G59 alt boyutlarına karma ağırlık + slug sinyalleri
- Havuz 26–32: Hata kaynakları (kavramsal, işlem, dikkat, strateji, temsil, mantıksal, transfer)
- Havuz 33–39: Üst biliş becerileri (planlama, kendini düzenleme, bilişsel farkındalık vb.)
- Havuz 40–43: Öğrenme modeli (şu an boş)
- Havuz 44–47: Öne çıkan beceriler (sayısal akıl yürütme, problem çözme, analitik vb.)
- Havuz 48–50: Duyuşsal faktörler (şu an boş)

### Skor Formülleri
- G57 = Akademik Matematik (havuz 1–25 ağırlıklı ortalama, 5 alt boyut)
- G58 = İleri Matematik (havuz 1–25, 4 alt boyut)
- G59 = Matematik Okuryazarlığı (havuz 1–25, 4 alt boyut)
- G76 = G57 × 0.4 + G58 × 0.3 + G59 × 0.3
- Seviyeler: A1 (<30) · A2 (<45) · B1 (<60) · B2 (<75) · C1 (<90) · C2 (≤100)

### Slug Seçimi
- Hata tipi → yanlış cevaplardan birikmeli, argmax
- Üst biliş → yanlış cevaplardan birikmeli, argmax
- Öne çıkan beceri → doğru cevaplardan birikmeli, argmax

### Genel
- Seed: `npx prisma db seed`
- Branch: `dev` → geliştirme · `main` → canlı (Vercel production)
- Bölüm metinleri import: `npx ts-node --project tsconfig.scripts.json scripts/import-bolum-metinleri.ts`
- Soru import: `npx ts-node --project tsconfig.scripts.json scripts/import-questions.ts`
- Soru import öncesi migration: `npx prisma migrate deploy` (externalId alanı eklendi)
