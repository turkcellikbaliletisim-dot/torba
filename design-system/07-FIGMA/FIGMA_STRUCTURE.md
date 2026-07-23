# FIGMA_STRUCTURE — Figma Dosya, Sayfa ve Bileşen Yapısı Rehberi

> **Amaç:** Figma'da TORBAA tasarım kütüphanesini kurarken kullanılacak yapı, adlandırma ve organizasyon standartları.

---

## 1. Figma Dosya Organizasyonu

```text
TORBAA Design System (Team Library)
├── 📄 Cover Page                    # Kapak sayfası, versiyon ve değişiklik notları
├── 📄 🎨 Foundations                 # Tasarım tokenları (Colors, Typography, Spacing, Shadows, Radius)
├── 📄 🧩 Components                 # Atomik ve Moleküler bileşenler
├── 📄 📱 Mobile Screens             # Mobil uygulama tüm ekranlar (Light + Dark)
├── 📄 🖥️ Panel Screens              # İşletme / Kurumsal / Admin panel ekranları
├── 📄 🔄 Flows & Prototypes         # Kullanıcı akışları, sayfa bağlantıları, prototip
├── 📄 📐 Grids & Layouts            # Grid sistemleri, Safe Area, responsive yapılar
└── 📄 🗃️ Archive                     # Eski versiyonlar ve deneme tasarımları
```

---

## 2. Foundations Sayfası

### 2.1 Color Styles
Figma'da `Local Styles > Color Styles` olarak tanımlanır:

```text
Brand/Primary/Default         → #10b981
Brand/Primary/Hover           → #34d399
Brand/Primary/Surface         → rgba(16,185,129,0.1)
Brand/Secondary/Default       → #f59e0b
Brand/Secondary/Hover         → #d97706
Neutral/Dark/Background       → #020617
Neutral/Dark/Surface          → #0f172a
Neutral/Dark/Border           → #1e293b
Neutral/Dark/Text-Primary     → #f8fafc
Neutral/Dark/Text-Secondary   → #94a3b8
Neutral/Light/Background      → #ffffff
Neutral/Light/Surface         → #f8fafc
Neutral/Light/Text-Primary    → #0f172a
Semantic/Success              → #22c55e
Semantic/Warning              → #eab308
Semantic/Error                → #ef4444
Semantic/Info                 → #3b82f6
```

### 2.2 Text Styles

```text
Display/Display-1             → Inter Bold 36/44
Heading/H1                    → Inter Bold 28/36
Heading/H2                    → Inter SemiBold 22/28
Heading/H3                    → Inter SemiBold 18/24
Body/Subtitle                 → Inter Medium 16/22
Body/Regular                  → Inter Regular 14/20
Body/Medium                   → Inter Medium 14/20
Caption/Regular               → Inter Regular 12/16
Caption/Overline              → Inter SemiBold 10/14 UPPERCASE
```

### 2.3 Effect Styles (Shadows)

```text
Shadow/SM                     → 0 1px 2px rgba(0,0,0,0.05)
Shadow/MD                     → 0 4px 6px rgba(0,0,0,0.1)
Shadow/LG                     → 0 10px 15px rgba(0,0,0,0.1)
Glow/Emerald                  → 0 0 20px rgba(16,185,129,0.25)
Glow/Amber                    → 0 0 20px rgba(245,158,11,0.25)
```

---

## 3. Components Sayfası — Adlandırma Kuralı

Her bileşen `Component Set` olarak oluşturulur ve `Variants` ile yönetilir.

### Adlandırma Formatı:
```
[Kategori] / [Bileşen Adı]
```

### Variant Properties:
```
Property: "Type"     → Primary, Secondary, Outline, Ghost
Property: "Size"     → SM, MD, LG
Property: "State"    → Default, Hover, Pressed, Disabled, Loading
Property: "Theme"    → Light, Dark
```

### Bileşen Listesi:

```text
Buttons/
├── Button                    Variants: Type(4) × Size(3) × State(5) × Theme(2) = 120
├── Icon Button               Variants: Size(3) × State(4) × Theme(2) = 24
└── FAB                       Variants: State(3) × Theme(2) = 6

Inputs/
├── Text Input                Variants: State(6) × Theme(2) = 12
├── Search Input              Variants: State(3) × Theme(2) = 6
├── OTP Input                 Variants: State(3) × Theme(2) = 6
├── Dropdown                  Variants: State(3) × Theme(2) = 6
└── Password Input            Variants: State(4) × Theme(2) = 8

Cards/
├── Campaign Card             Variants: State(2) × Theme(2) = 4
├── Merchant Card             Variants: Layout(2) × Theme(2) = 4
├── Coupon Card               Variants: Status(3) × Theme(2) = 6
├── Points Card               Variants: Theme(2) = 2
└── Category Card             Variants: State(2) × Theme(2) = 4

Badges/
├── Badge                     Variants: Type(7) × Theme(2) = 14
└── Count Badge               Variants: Theme(2) = 2

Chips/
└── Chip                      Variants: Type(3) × State(2) × Theme(2) = 12

Lists/
├── Merchant Item             Variants: Theme(2) = 2
├── Coupon Item               Variants: Theme(2) = 2
├── Transaction Item          Variants: Type(3) × Theme(2) = 6
└── Notification Item         Variants: Read(2) × Theme(2) = 4

Navigation/
├── Bottom Navigation         Variants: ActiveTab(5) × Theme(2) = 10
└── App Bar                   Variants: Type(4) × Theme(2) = 8

Overlays/
├── Bottom Sheet              Variants: Theme(2) = 2
├── Action Sheet              Variants: Theme(2) = 2
├── Dialog                    Variants: Type(2) × Theme(2) = 4
└── Toast                     Variants: Type(4) × Theme(2) = 8

Feedback/
├── Empty State               Variants: Type(5) × Theme(2) = 10
├── Skeleton                  Variants: Type(4) × Theme(2) = 8
└── Spinner                   Variants: Size(3) × Theme(2) = 6
```

**Toplam Tahmini Variant Sayısı: ~400+**

---

## 4. Auto Layout Kuralları

- **Tüm bileşenler** Auto Layout ile oluşturulur (manuel konumlandırma yok)
- **Padding:** Token değerlerine uygun (4, 8, 12, 16, 24, 32)
- **Gap:** Token spacing değerleri
- **Resizing:** Yatay: "Fill container" veya "Hug contents", Dikey: "Hug contents"
- **Constraints:** Responsive davranış için doğru constraint ayarı

---

## 5. Figma Variables (Design Tokens Bağlantısı)

Figma Variables kullanılarak token'lar `Collection` bazında yönetilir:

```text
Collection: "Colors"
├── Mode: "Light"
└── Mode: "Dark"

Collection: "Spacing"
├── space/1 = 4
├── space/2 = 8
├── space/4 = 16
└── ...

Collection: "Radius"
├── radius/sm = 8
├── radius/md = 12
├── radius/lg = 16
└── radius/full = 9999
```

Bu yapı, `tokens.json` dosyasından **Tokens Studio for Figma** eklentisi ile otomatik senkronize edilebilir.
