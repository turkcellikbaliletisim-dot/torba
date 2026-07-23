# COLORS — Torba Renk Sistemi

> **Ana Marka Rengi:** `#00B7EB` (Turkuaz / Cyan)  
> **Tema:** Light Mode Öncelikli  
> **Erişilebilirlik:** WCAG 2.1 AA Uyumlu (Min 4.5:1 kontrast)

---

## 1. Marka Paleti (Brand Colors)

Torba'nın marka kimliği **turkuaz/cyan** üzerine kuruludur — tazelik, güven ve keşif duygusunu yansıtır.

| Token | HEX | Kullanım Alanı |
|---|---|---|
| **brand-50** | `#F1FBFE` | Büyük açık yüzeyler, seçili kart arka planı |
| **brand-100** | `#DDF6FD` | Açık bilgi alanları, badge arka planı |
| **brand-500** | `#00B7EB` | Ana CTA butonları, aktif navigasyon, seçili filtreler, puan ve kampanya vurguları |
| **brand-600** | `#009BC8` | Basılı (pressed) durum, güçlü vurgu |
| **brand-700** | `#007DA3` | Koyu vurgu, erişilebilir metin |

---

## 2. Nötr Palet (Neutral Scale)

| Token | HEX | Kullanım Alanı |
|---|---|---|
| **neutral-950** | `#10212B` | Başlıklar, birincil metinler |
| **neutral-800** | `#263B46` | Alt başlıklar, güçlü etiketler |
| **neutral-600** | `#647681` | Yardımcı metinler, tarihler, placeholder |
| **neutral-400** | `#9AAAB3` | Pasif metinler, disabled öğeler |
| **neutral-200** | `#DCE6EB` | Kenarlıklar (border), ayırıcılar (divider) |
| **neutral-100** | `#EDF3F6` | İkincil yüzeyler |
| **neutral-50** | `#F7FAFC` | Uygulama zemin rengi |
| **white** | `#FFFFFF` | Ana kart arka planı |

---

## 3. Anlamsal Renkler (Semantic / Status Colors)

Her durum rengi **üç ton** içerir: Ana renk (ikon/badge), açık yüzey (arka plan) ve metin (etiket).

| Amaç | Ana | Açık Yüzey | Metin |
|---|---|---|---|
| **Başarı (Success)** | `#16A56A` | `#E8F8F1` | `#0B6B45` |
| **Uyarı (Warning)** | `#F4A62A` | `#FFF6E4` | `#925B00` |
| **Hata (Error)** | `#E34D59` | `#FDEDEF` | `#A62934` |
| **Bilgi (Info)** | `#2C7BE5` | `#EAF2FD` | `#1F5CA8` |
| **Kampanya** | `#FF6B35` | `#FFF0EA` | `#A83B15` |
| **Puan (Toin)** | `#F4B400` | `#FFF8DE` | `#7A5900` |
| **Premium / VIP** | `#7B61FF` | `#F1EEFF` | `#4A35B8` |

---

## 4. Özel Bakiye Renkleri

| Varlık | Renk | Açıklama |
|---|---|---|
| **Yemek Kartı Bakiyesi** | `#00B7EB` (brand-500) | Kurumsal vergi istisnalı yemek bakiyesi |
| **Toin Puan Bakiyesi** | `#F4B400` (puan sarısı) | Sadakat puan bakiyesi |
| **VIP Seviye** | `#7B61FF` (premium moru) | Üst seviye üye rozetleri |

---

## 5. Kullanım Kuralları

1. Aynı ekranda birden fazla güçlü vurgu rengi yarışmamalıdır.
2. Ana CTA yalnızca `brand-500` veya gerektiğinde `brand-600` kullanır.
3. **Kampanya turuncusu** (`#FF6B35`) yalnızca kampanya veya fırsat bağlamında kullanılır.
4. **Puan sarısı** (`#F4B400`) dekoratif değil, puan değeri ve seviye göstergeleri içindir.
5. Hata mesajları yalnızca kırmızı renkle değil ikon ve açıklamayla gösterilir.
6. Ana renk tüm ekranı kaplayan ağır yüzeylerde kullanılmamalıdır; büyük yüzeylerde `brand-50` veya `brand-100` tercih edilir.
