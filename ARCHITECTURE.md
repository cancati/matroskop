# Matroskop — Proje Mimarisi

> Projenin yaşayan haritası. Yeni sayfa/API/model eklenince burası güncellenir.

---

## Rol Hiyerarşisi

```
🔴 Sistem Yöneticisi
    ├── Okul oluşturur / tedarikçi oluşturur
    ├── Kullanıcıları yönetir
    ├── Soru bankasını düzenler
    ├── Transfer taleplerini onaylar / reddeder
    └── PDF dinamik metinleri yönetir  [ YAPILACAK ]

    🟠 Okul Yöneticisi  (schoolId ile okula bağlı)
        ├── Öğretmen ekler
        ├── Sınıfları görür
        ├── Öğrenci yönetimi + sınav başlatır
        ├── Transfer talebi açar
        └── Okul raporlarını görür

        🟡 Öğretmen  (User.schoolId + Classroom.teacherId)
            ├── Sınıf oluşturur  [ YAPILACAK ]
            ├── Öğrenci ekler (sinifim sayfası modalı)
            └── Sınıf raporlarını görür

            🟢 Öğrenci  (Student → User 1-1)
                ├── Sınava girer (50 soru)
                ├── G76 puanı + A1-C2 seviyesi alır
                └── PDF rapor indirir  [ YAPILACAK ]

🔵 Tedarikçi  (Supplier, User.supplierId ile bağlı)
    ├── Atanmış öğrencileri görür (StudentSupplier tablosu)
    ├── Öğrenciye sınav oluşturur (PENDING)
    └── Öğrenci raporlarına erişir
```

---

## Veritabanı Modelleri

```
Supplier
  id, name, phone, address, isActive
  └── users[]          (User.supplierId)
  └── students[]       (StudentSupplier)

School
  id, name, city, phone, isActive
  └── users[]          (User.schoolId)
  └── classrooms[]
  └── students[]

User
  id, email?, username?, password, name, role, isActive
  ├── schoolId?   → School
  ├── supplierId? → Supplier
  ├── classrooms[] (öğretmen için)
  └── student?    (1-1, öğrenci için)

Classroom
  id, name, grade (1-8)
  ├── schoolId  → School
  ├── teacherId → User
  └── students[]

Student
  id
  ├── userId      → User (unique, 1-1)
  ├── schoolId?   → School
  ├── classroomId? → Classroom
  ├── suppliers[]  → StudentSupplier[]
  ├── exams[]
  └── transfers[]

StudentSupplier
  id, isActive, assignedAt, removedAt?
  ├── studentId → Student
  └── supplierId → Supplier
  @@unique([studentId, supplierId])

Transfer
  id, status (PENDING|APPROVED|REJECTED)
  fromSchoolId?, toSchoolId, note?, requestedAt, resolvedAt?
  └── studentId → Student

Question
  id, content, options (String[]), correctAnswer (int)
  poolId (1-50), grade (1-8), category (G57|G58|G59), isActive

Exam
  id, grade, status (PENDING|IN_PROGRESS|COMPLETED)
  startedAt?, endedAt?, createdAt
  └── studentId → Student

ExamAnswer
  id, selected (int, -1=cevaplanmadı), isCorrect
  ├── examId    → Exam
  └── questionId → Question
  @@unique([examId, questionId])

ExamResult
  id, G57, G58, G59, G76, level (A1-C2)
  └── examId → Exam (unique)
```

---

## Soru Havuzu & Puanlama

```
Kategori   Pool ID   Soru Sayısı   Ağırlık
─────────  ────────  ────────────  ───────
G57        1 – 20    20 soru       %40
G58        21 – 35   15 soru       %30
G59        36 – 50   15 soru       %30

G57 = (doğru_G57 / 20) × 100
G58 = (doğru_G58 / 15) × 100
G59 = (doğru_G59 / 15) × 100
G76 = G57×0.4 + G58×0.3 + G59×0.3

Seviye  G76 Aralığı
──────  ───────────
A1      0  – 29.9
A2      30 – 44.9
B1      45 – 59.9
B2      60 – 74.9
C1      75 – 89.9
C2      90 – 100
```

---

## Sayfa Haritası

### 🔴 Sistem Yöneticisi `/sistem-yoneticisi`
| Sayfa | Açıklama |
|-------|----------|
| `/` | Dashboard — istatistik kartları |
| `/okullar` | Okul listesi + ekleme/düzenleme modalı |
| `/okullar/[id]` | Okul detayı (kullanıcılar, sınıflar, öğrenciler) |
| `/tedarikciler` | Tedarikçi listesi + modal |
| `/tedarikciler/[id]` | Tedarikçi detayı |
| `/kullanicilar` | Tüm kullanıcılar + modal |
| `/soru-bankasi` | Soru listesi + ekleme/düzenleme/silme |
| `/sinav-sablonlari` | Şablon listesi |
| `/sinav-sablonlari/[id]` | Şablon detayı |
| `/transferler` | Transfer talepleri + onay/red |
| `/raporlar` | Platform geneli raporlar |

### 🟠 Okul Yöneticisi `/okul-yoneticisi`
| Sayfa | Açıklama |
|-------|----------|
| `/` | Dashboard |
| `/ogretmenler` | Öğretmen listesi — **ekleme yok** `[ YAPILACAK ]` |
| `/siniflar` | Sınıf listesi |
| `/ogrenciler` | Öğrenci listesi + sınav durumu |
| `/sinav-baslat` | Öğrenciye sınav oluştur |
| `/transfer` | Transfer talebi oluştur + geçmiş |
| `/raporlar` | Okul geneli sınav raporları |

### 🟡 Öğretmen `/ogretmen`
| Sayfa | Açıklama |
|-------|----------|
| `/` | Dashboard (stat, son sınavlar, seviye dağılımı) |
| `/sinifim` | Sınıf görüntüleme + öğrenci ekleme modalı |
| `/raporlar` | Sınıf öğrencilerinin sınav raporları |
| ~~`/sinif-olustur`~~ | **Yok** `[ YAPILACAK ]` |

### 🟢 Öğrenci `/ogrenci`
| Sayfa | Açıklama |
|-------|----------|
| `/` | Dashboard |
| `/sinav` | Sınav motoru (başlat / devam / bitir) |
| `/raporlarim` | Geçmiş sınav sonuçları |
| ~~`/rapor/[id]/pdf`~~ | **Yok** `[ YAPILACAK ]` |

### 🔵 Tedarikçi `/tedarikci`
| Sayfa | Açıklama |
|-------|----------|
| `/` | Dashboard |
| `/ogrenciler` | Atanmış öğrenciler + son sınav durumu |
| `/sinav-baslat` | Öğrenciye sınav oluştur (PENDING) |
| `/raporlar` | Öğrenci sınav raporları |

---

## API Haritası

### Auth
| Method | Route | Açıklama |
|--------|-------|----------|
| POST | `/api/auth/login` | Email veya username + şifre → JWT cookie |
| POST | `/api/auth/logout` | Cookie sil |

### Sistem Yöneticisi (`requireAdmin()`)
| Method | Route | Açıklama |
|--------|-------|----------|
| GET/POST | `/api/admin/okullar` | Okul listesi / oluştur |
| GET/PUT/DELETE | `/api/admin/okullar/[id]` | Okul detay / güncelle / sil |
| GET/POST | `/api/admin/tedarikciler` | Tedarikçi listesi / oluştur |
| GET/PUT/DELETE | `/api/admin/tedarikciler/[id]` | Tedarikçi detay |
| GET/POST | `/api/admin/kullanicilar` | Kullanıcı listesi / oluştur |
| PUT/DELETE | `/api/admin/kullanicilar/[id]` | Kullanıcı güncelle / sil |
| GET/POST | `/api/admin/sorular` | Soru listesi / oluştur |
| PUT/DELETE | `/api/admin/sorular/[id]` | Soru güncelle / sil |
| GET/POST | `/api/admin/sinav-sablonlari` | Şablon listesi / oluştur |
| PUT/DELETE | `/api/admin/sinav-sablonlari/[id]` | Şablon güncelle / sil |
| GET | `/api/admin/transferler` | Transfer listesi |
| PUT | `/api/admin/transferler/[id]` | Transfer onayla / reddet |
| GET | `/api/admin/stats` | Dashboard istatistikleri |
| GET | `/api/admin/ogrenciler` | Öğrenci listesi |
| PUT | `/api/admin/ogrenciler/[id]` | Öğrenci güncelle |
| POST | `/api/admin/ogrenciler/toplu` | Toplu öğrenci import |

### Okul Yöneticisi (`role === SCHOOL_ADMIN`)
| Method | Route | Açıklama |
|--------|-------|----------|
| GET | `/api/okul-yoneticisi/ogretmenler` | Okulun öğretmenleri |
| GET | `/api/okul-yoneticisi/siniflar` | Okulun sınıfları |
| GET | `/api/okul-yoneticisi/ogrenciler` | Okulun öğrencileri |
| POST | `/api/okul-yoneticisi/sinav-olustur` | Öğrenciye sınav oluştur |
| GET/POST | `/api/okul-yoneticisi/transfer` | Transfer geçmişi / yeni talep |
| GET | `/api/okul-yoneticisi/raporlar` | Okul raporları |

### Öğretmen (`role === TEACHER`)
| Method | Route | Açıklama |
|--------|-------|----------|
| GET | `/api/ogretmen/dashboard` | Dashboard verileri |
| GET | `/api/teacher/sinifim` | Sınıf + öğrenci listesi |
| POST | `/api/teacher/ogrenci` | Öğrenci ekle |
| GET | `/api/ogretmen/raporlar` | Sınıf raporları |
| POST | `/api/teacher/sinifim` | Sınıf oluştur `[ YAPILACAK ]` |

### Öğrenci (`role === STUDENT`)
| Method | Route | Açıklama |
|--------|-------|----------|
| GET | `/api/sinav/durum` | Aktif sınav var mı? |
| POST | `/api/sinav/baslat` | Yeni sınav başlat |
| POST | `/api/sinav/cevapla` | Cevap kaydet (fire-and-forget) |
| POST | `/api/sinav/bitir` | Sınavı bitir + ExamResult oluştur |
| GET | `/api/sinav/raporlar` | Kişisel sınav geçmişi |
| GET | `/api/ogrenci/rapor/[id]/pdf` | PDF rapor `[ YAPILACAK ]` |

### Tedarikçi (`role === SUPPLIER`)
| Method | Route | Açıklama |
|--------|-------|----------|
| GET | `/api/tedarikci/ogrenciler` | Atanmış öğrenciler + sınav durumu |
| POST | `/api/tedarikci/sinav-olustur` | Öğrenciye PENDING sınav oluştur |
| GET | `/api/tedarikci/raporlar` | Öğrenci raporları |

---

## Auth Akışı

```
Kullanıcı giriş yapar
  → POST /api/auth/login
  → bcrypt doğrulama
  → JWT oluştur (id, role, name → 7 gün)
  → httpOnly cookie "token" olarak set edilir
  → auth.store.ts güncellenir (Zustand)

Her API isteğinde:
  → requireAuth() cookie'yi okur, JWT doğrular
  → { id, role } döner ya da null

Yönlendirme:
  → (panel)/layout.tsx → useAuthStore → role'e göre /rol-adresine push
```

---

## Sınav Akışı

```
1. Öğrenci /ogrenci/sinav açar
   → GET /api/sinav/durum
   → hasActive=false → "Yeni Sınav" göster
   → hasActive=true && answeredCount > 0 → "Devam Et" göster
   → hasActive=true && answeredCount = 0 (PENDING) → "Yeni Sınav" göster

2. Sınav Başlat
   → POST /api/sinav/baslat
   → Her pool (1-50) için 1 aktif soru seçilir
   → Exam (IN_PROGRESS) + 50 ExamAnswer (selected:-1) oluşturulur

3. Cevaplama (fire-and-forget)
   → POST /api/sinav/cevapla { examId, questionId, selected }
   → ExamAnswer güncellenir (selected, isCorrect)

4. Bitirme
   → POST /api/sinav/bitir
   → G57, G58, G59 hesaplanır
   → G76 = G57×0.4 + G58×0.3 + G59×0.3
   → level belirlenir (A1-C2)
   → ExamResult oluşturulur, Exam COMPLETED olur
```

---

## Ortam Değişkenleri (`.env.local`)

```
DATABASE_URL     PostgreSQL bağlantı string'i
JWT_SECRET       Token imzalama anahtarı
```
