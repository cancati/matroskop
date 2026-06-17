# Matroskop — Kurumsal Website

Şu an sadece kurumsal site geliştiriliyor. Panel, auth, sınav motoru sonraki fazlar.

## Stack
Next.js 14 · TypeScript · Tailwind CSS · Plus Jakarta Sans

---

## Klasör Yapısı

```
src/
├── app/
│   ├── layout.tsx              # Root layout (font, metadata)
│   ├── page.tsx                # → /anasayfa yönlendir
│   ├── anasayfa/page.tsx       # Tüm section'ları birleştirir
│   ├── kvkk/page.tsx
│   └── cerez-politikasi/page.tsx
│
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   ├── sections/               # Her section ayrı bileşen
│   │   ├── Hero.tsx
│   │   ├── Product.tsx
│   │   ├── HowItWorks.tsx
│   │   ├── About.tsx
│   │   ├── Testimonials.tsx
│   │   ├── Dealers.tsx
│   │   ├── Contact.tsx
│   │   └── FAQ.tsx
│   └── ui/                     # Tekrar kullanılan küçük parçalar
│       ├── Button.tsx
│       ├── SectionTitle.tsx
│       ├── Badge.tsx
│       └── TestimonialCard.tsx
│
├── styles/
│   └── variants.ts             # cva() ile buton, badge varyantları
│
├── types/
│   └── site.ts                 # Site'e özel tipler
│
└── data/
    └── site.ts                 # Tüm içerikler (metin, link, iletişim)
```

---

## Kurallar

**page.tsx sadece birleştirir** — veri çekme, state, JSX yok.
```tsx
// ✅
export default function AnasayfaPage() {
  return <><Hero /><Product /><HowItWorks />...</>;
}
```

**Stil varyantları styles/variants.ts'de** — bileşen içine class string gömme.
```ts
// styles/variants.ts
export const buttonVariants = cva("...", {
  variants: { intent: { primary: "...", outline: "..." } }
});
```

**İçerikler data/site.ts'de** — bileşen içine Türkçe metin yazma.
```tsx
// ✅
import { testimonials } from "@/data/site";

// ❌
const items = [{ name: "Murat Y.", quote: "..." }]; // bileşen içinde
```

**Renk token kullan** — `text-brand`, `bg-surface-section` gibi. `text-[#033147]` yazma.

---

## Renkler

| Token             | Hex      |
|-------------------|----------|
| `brand`           | #033147  |
| `brand-dark`      | #06476B  |
| `brand-light`     | #e8eef6  |
| `accent-yellow`   | #e1b12c  |
| `accent-blue`     | #82c9ff  |
| `accent-green`    | #a8e6cf  |
| `surface`         | #f8f8f8  |
| `surface-section` | #f0f2f6  |
| `cta`             | #382673  |
| `muted`           | #888888  |

---

## Sayfalar & Section'lar

| Section       | Anchor       | İçerik                                      |
|---------------|--------------|---------------------------------------------|
| Hero          | #giris       | Badge'ler, başlık, slogan, CTA butonu       |
| Product       | #matroskop   | Kapsam listesi, ne sağlar listesi           |
| HowItWorks    | #nasil       | 4 adımlı süreç                              |
| About         | #hakkimizda  | 3 yaklaşım kartı, ekip metni                |
| Testimonials  | —            | 4 referans kartı                            |
| Dealers       | #bayiler     | Bayi ağı bilgisi, başvuru CTA               |
| Contact       | #iletisim    | İletişim bilgileri + form                   |
| FAQ           | —            | 4 soru-cevap                                |

Nav: Anasayfa · Matroskop · Hakkımızda · Bayiler · İletişim + **Giriş Yap** (CTA)

---

## İletişim & Logo

```
Tel:   +90 (324) 000 00 00
Email: info@matroskop.com
Adres: Aydınlıkevler Mah. Yenişehir/MERSİN
Logo:  https://matroskop.com/wp-content/uploads/2025/10/matroskoplogo2.png
```