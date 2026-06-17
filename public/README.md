# Matroskop — Public Dosyaları

## Klasör Yapısı

```
public/
├── logo.svg                    # Navbar logosu
├── favicon.ico                 # Tarayıcı ikonu (isteğe bağlı)
├── images/
│   ├── hero-left.svg          # Hero section sol görsel
│   ├── hero-right.svg         # Hero section sağ görsel
│   ├── about.svg              # Hakkımızda section görseli
│   ├── map.svg                # Bayiler haritası
│   └── ... (diğer görseller)
└── icons/
    └── ... (SVG iconlar)
```

## Görselleri Nasıl Değiştireceğim?

### 1. Logo Değiştirme
`public/logo.svg` dosyasını kendi logo dosyanızla değiştirin veya:
- Matroskop PNG/SVG logonuzu `public/logo.png` olarak kaydedin
- `src/app/anasayfa/page.tsx` içinde `src="/logo.svg"` yerine `src="/logo.png"` yazın

### 2. Resim Placeholder'ları Değiştirme
Her SVG placeholder'ı kendi görselleriyle değiştirin:

#### Hero Section Görselleri
- `public/images/hero-left.svg` → Kapsam/Bilimsel görselini koyun
- `public/images/hero-right.svg` → Olimpiyat görseli

**Örnek:**
```tsx
// page.tsx'te
<img src="/images/hero-left.svg" alt="Bilimsel Dayanaklı" className="w-full rounded-3xl" />
```

#### Hakkımızda Görsel
- `public/images/about.svg` → Şirket/ekip fotoğrafı veya ilustrasyon

#### Harita
- `public/images/map.svg` → Türkiye haritası (PNG/JPG/SVG)

### 3. Yeni Görseller Ekleme

```bash
# Resim ekle
cp ~/Downloads/my-image.png public/images/my-image.png

# Sonra page.tsx'te kullan
<img src="/images/my-image.png" alt="Açıklama" />
```

## Desteklenen Format'lar

- **SVG** (ideal, optimize edilmiş)
- **PNG** (şeffaflık için)
- **JPG/JPEG** (fotoğraflar için)
- **WebP** (modern tarayıcılar, daha küçük dosya boyutu)

## Next.js Image Component (İsteğe Bağlı)

Performans için Next.js Image component'ini kullanabilirsiniz:

```tsx
import Image from 'next/image';

<Image
  src="/images/about.svg"
  alt="Hakkımızda"
  width={500}
  height={400}
  className="rounded-3xl"
/>
```

## Dosya Boyutu İpuçları

- SVG dosyaları optimize edin (SVGO aracı)
- JPG dosyaları 80-90 kalitede kaydedin
- WebP formatını tercih edin (daha küçük)
- Hero görselleri en fazla 500KB olmalı
