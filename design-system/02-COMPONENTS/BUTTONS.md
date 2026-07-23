# BUTTONS — Buton Bileşen Standartları

> **Dokunma Hedefi (Touch Target):** Minimum 44×44 px  
> **Border Radius:** `radius-md` (12px) — Pill varyantında `radius-full` (9999px)

---

## 1. Buton Tipleri

### 1.1 Primary Button
- **Arka Plan:** `#00B7EB` (`brand-500`)
- **Metin:** `#FFFFFF` — SemiBold 14px
- **Hover/Press:** `#009BC8` (`brand-600`) ile `scale(0.97)` (150ms)
- **Disabled:** Opacity `0.4`, cursor `not-allowed`
- **Kullanım:** Ana CTA — "Kuponu kullan", "Kayıt ol", "Kampanyaya katıl"

### 1.2 Secondary Button
- **Arka Plan:** `#F1FBFE` (`brand-50`) veya `#DDF6FD` (`brand-100`)
- **Metin:** `#007DA3` (`brand-700`) — SemiBold 14px
- **Hover/Press:** Arka plan `#DDF6FD` ile `scale(0.97)`
- **Kullanım:** İkincil eylemler — "Detayı gör", "Haritada göster"

### 1.3 Outline Button
- **Arka Plan:** Şeffaf
- **Kenarlık:** 1.5px solid `#00B7EB` (`brand-500`)
- **Metin:** `#00B7EB` (`brand-500`) — Medium 14px
- **Hover:** Arka plan `brand-50` (%10 opacity dolgu)
- **Kullanım:** Alternatif aksiyonlar — "Filtrele", "Profili düzenle"

### 1.4 Ghost Button
- **Arka Plan:** Şeffaf, kenarlık yok
- **Metin:** `#00B7EB` (`brand-500`) veya `#647681` (`neutral-600`) — Medium 14px
- **Hover:** Arka plan `neutral-100` (`#EDF3F6`)
- **Kullanım:** Metin bağlantıları — "Tümünü gör", "Vazgeç", "İptal"

### 1.5 Icon Button
- **Boyut:** 40×40 veya 44×44 px dairesel (`radius-full`)
- **Arka Plan:** `#FFFFFF` veya şeffaf
- **İkon:** 20×20 px, `#647681` (`neutral-600`) rengi
- **Kullanım:** Geri butonu, favori, paylaş, bildirim zili

### 1.6 Floating Action Button (FAB)
- **Boyut:** 56×56 px dairesel (`radius-full`)
- **Arka Plan:** `#00B7EB` (`brand-500`)
- **Gölge:** `0 -8px 28px rgba(16, 33, 43, 0.10)`
- **İkon:** 24×24 px beyaz
- **Konum:** Ekranın sağ alt köşesi, bottom navigation üstünde `bottom: 88px`
- **Kullanım:** QR Tarat, Haritada Gör

---

## 2. Buton Boyutları

| Boyut | Yükseklik | Yatay Padding | Font Size |
|---|---|---|---|
| **Small (SM)** | 32px | 12px | 12px |
| **Medium (MD)** | 40px | 16px | 14px |
| **Large (LG)** | 48px | 20px | 16px |

---

## 3. Buton Durumları

| Durum | Görsel Değişiklik |
|---|---|
| **Default** | Varsayılan renk ve boyut |
| **Pressed** | `scale(0.97)`, arka plan `#009BC8` (`brand-600`) (150ms) |
| **Loading** | Metin gizlenir, ortada 16px beyaz spinner döner |
| **Disabled** | Opacity `0.4`, etkileşim devre dışı |

---

## 4. Full-Width Kuralı

Mobil ekranlarda CTA butonları (`Primary LG`) tam genişlik (`width: 100%`) uygulanır ve ekranın altına sabitlenir (`position: sticky; bottom: safe-area-inset-bottom + 16px`).
