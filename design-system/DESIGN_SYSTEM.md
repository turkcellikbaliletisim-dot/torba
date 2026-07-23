# Torba Design System v1.0 — Mimari Dokümanı

> **Sürüm:** 1.0  
> **Temel İlke:** Torba bir finans uygulaması değildir; fırsat, keşif ve ödül duygusunu öne çıkaran mobil öncelikli yerel ticaret platformudur.

---

## 1. Ürün Karakteri

Torba; kullanıcıların yakınlarındaki işletmeleri, kampanyaları, kuponları ve sadakat avantajlarını keşfettiği mobil öncelikli bir platformdur. Arayüz finans uygulaması gibi görünmemeli; fırsat, keşif ve ödül duygusunu öne çıkarmalıdır.

---

## 2. Temel İlkeler

1. **Kampanya önce gelir:** Ana ekranın en görünür alanında fırsatlar yer alır.
2. **Puan anlaşılır olmalıdır:** Kullanıcı puan bakiyesini ve nasıl kazandığını tek bakışta görür.
3. **Yerellik güçlüdür:** Yakındaki işletmeler, mesafe ve harita bağlamıyla sunulur.
4. **Cüzdan sade olmalıdır:** Kuponlar, üyelik kartları ve kullanılabilir avantajlar tek yerde tutulur.
5. **Her işlem güven verir:** Kullanım koşulları, geçerlilik tarihi ve kazanım miktarı açıkça gösterilir.

---

## 3. Marka Rengi ve Kullanımı

**Ana Marka Rengi:** `#00B7EB` (Turkuaz / Cyan)

Kullanım alanları:
- Ana CTA butonları
- Aktif alt navigasyon öğesi
- Seçili filtreler
- Puan ve avantaj vurguları
- Doğrulanmış işletme işaretleri

Ana renk tüm ekranı kaplayan ağır yüzeylerde kullanılmamalıdır. Büyük yüzeylerde açık `brand-50` (`#F1FBFE`) veya `brand-100` (`#DDF6FD`) tonları tercih edilmelidir.

---

## 4. Yüzeyler (Light Mode Priority)

- **Uygulama zemini:** `#F7FAFC` (neutral-50)
- **Ana kart:** `#FFFFFF` (white)
- **İkincil yüzey:** `#F1FBFE` (brand-50) veya `#EEF9FD`
- **Ayırıcı:** `#DCE6EB` (neutral-200) veya `#E5EDF2`
- **Koyu metin:** `#10212B` (neutral-950)
- **İkincil metin:** `#647681` (neutral-600)

---

## 5. Köşe Yarıçapları (Border Radius)

- **Küçük etiket:** 8 px (`radius-sm`)
- **Girdi ve küçük kart:** 12 px (`radius-md`)
- **Standart kart:** 16 px (`radius-lg`)
- **Büyük kampanya kartı:** 20 px (`radius-xl`)
- **Modal ve bottom sheet:** 24 px (`radius-2xl`)
- **Yuvarlak ikon butonu:** Tam daire (`radius-full`)

---

## 6. Gölgeler (Shadows)

Gölgeler hafif ve düşük kontrastlı olmalıdır.

- **Kart:** `0 6px 20px rgba(16, 33, 43, 0.07)`
- **Yüzen alt menü:** `0 -8px 28px rgba(16, 33, 43, 0.10)`
- **Modal:** `0 20px 50px rgba(16, 33, 43, 0.16)`

---

## 7. Grid ve Ekran Yapısı

- **Mobil tasarım referansı:** 390 × 844 px
- **Yatay sayfa boşluğu:** 20 px
- **Kartlar arası boşluk:** 12 px veya 16 px
- **Bölümler arası boşluk:** 24 px veya 32 px
- **Alt navigasyon yüksekliği:** 72–80 px + Safe Area
- **Dokunma alanı:** Minimum 44 × 44 px

---

## 8. Görsel Dil ve Fotoğraflar

- Fotoğraflar canlı, doğal ve işletmeyi anlaşılır biçimde göstermelidir.
- Kampanya görsellerinde fazla metin kullanılmamalıdır.
- İkonlar yuvarlatılmış, sade ve aynı stroke kalınlığında olmalıdır.
- Gradient yalnızca vurgu alanlarında ve kontrollü kullanılmalıdır.
- Cam efekti dekoratif amaçla sınırlı kullanılmalı; okunabilirliği düşürmemelidir.

---

## 9. Erişilebilirlik

- Normal metinde en az 4.5:1 kontrast hedeflenir.
- Renk tek başına durum belirtmez; ikon veya metinle desteklenir.
- Dinamik yazı boyutu desteklenir.
- Butonlar yalnızca ikon içeriyorsa erişilebilir etiket (`aria-label`) taşır.
- Hareket azaltma tercihi bulunan kullanıcılarda animasyonlar sadeleştirilir.

---

## 10. Bileşen Durumları

Her temel bileşen şu durumları tanımlamalıdır:
- `default`, `pressed`, `focused`, `disabled`, `loading`, `success`, `error`, `empty`.

---

## 11. Dil ve Mikro-Metin

Dil kısa, sıcak ve doğrudan olmalıdır.

- ✅ **Doğru:** `Kuponu kullan`, `250 puan kazan`, `2 gün kaldı`, `Yakınındaki fırsatlar`
- ❌ **Kaçınılacak:** Uzun resmi açıklamalar, karmaşık finansal terimler, belirsiz butonlar (`Devam`, `İşlem yap`).
