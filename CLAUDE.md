# Matroskop — Claude Geliştirme Kuralları

## ⚠️ Her Oturumda İlk Adım

**Her geliştirme oturumuna başlamadan önce şu iki dosyayı oku:**

- **`STATUS.md`** — Ne yapıldı, ne yapılacak. Kodu tarama, buraya bak.
- **`ARCHITECTURE.md`** — Sayfa haritası, API listesi, veri modelleri, akışlar.

Kurallar:
- Biten madde → `STATUS.md`'de `- [ ]` → `- [x]` yap.
- Yeni sayfa/API eklendiyse → `ARCHITECTURE.md`'yi güncelle.
- Yeni görev çıkarsa → önce `STATUS.md`'ye ekle, sonra yap.

---

## Proje Özeti

**Matroskop** — okul tabanlı matematik yetkinlik ölçüm platformu.

**Stack:** Next.js 14 App Router · TypeScript · Tailwind CSS · Prisma · PostgreSQL

**Branch stratejisi:**
- `main` → canlı (Vercel production) — doğrudan commit atma
- `dev` → aktif geliştirme — tüm çalışma burада

---

## Klasör Yapısı

```
src/
├── app/
│   ├── (auth)/             # Giriş sayfası
│   ├── (panel)/            # Role-based panel sayfaları
│   │   ├── sistem-yoneticisi/
│   │   ├── okul-yoneticisi/
│   │   ├── ogretmen/
│   │   ├── ogrenci/
│   │   └── tedarikci/
│   ├── api/                # API route'ları (auth, admin, sinav, roller)
│   └── anasayfa/           # Kurumsal landing page
│
├── components/
│   ├── auth/               # LoginForm
│   ├── panel/              # Sidebar, Topbar, MobilMenu, nav-items
│   ├── sistem-yoneticisi/  # Modal bileşenleri
│   └── ui/                 # Button, Input, Spinner
│
├── lib/
│   ├── prisma.ts           # Prisma client
│   ├── auth.ts             # JWT işlemleri
│   ├── admin-auth.ts       # requireAuth() / requireAdmin()
│   └── validators.ts       # Zod şemaları
│
├── types/
│   ├── user.ts             # Kullanıcı tipleri
│   └── admin.ts            # Admin panel tipleri
│
└── store/
    └── auth.store.ts       # Zustand auth store
```

---

## Kurallar

**Tip tanımları yalnızca `src/types/` altında** — bileşen içinde inline tip yazma.

**API guard'ları her route'da zorunlu:**
```ts
const auth = requireAuth()
if (!auth || auth.role !== "TEACHER") return 401
```

**Supabase/Prisma sorguları `src/lib/` altında** — bileşen içinde direkt `prisma.from(...)` yok.

**Stil:** Tailwind utility class, renk token kullan (`text-brand`, `bg-surface-section`).
Inline `style={{}}` sadece dinamik değerler için.

**Bileşen 150 satırı geçmeye başlarsa** alt bileşenlere böl.

**console.log** production'a gitmesin.

---

## Renkler

| Token             | Hex      |
|-------------------|----------|
| `brand`           | #033147  |
| `brand-dark`      | #06476B  |
| `brand-light`     | #e8eef6  |
| `accent-yellow`   | #e1b12c  |
| `surface`         | #f8f8f8  |
| `surface-section` | #f0f2f6  |
| `cta`             | #382673  |
| `muted`           | #888888  |

---

## Commit Formatı

```
feat: öğretmen sınıf oluşturma eklendi
fix: sınav devam mantığı düzeltildi
refactor: ScoreBar bileşeni ayrıldı
style: mobil görünüm düzenlendi
chore: kullanılmayan importlar temizlendi
```

Commit mesajı branch'e push edildiğinde `dev`'e gider; `main`'e merge onay gerektirir.
