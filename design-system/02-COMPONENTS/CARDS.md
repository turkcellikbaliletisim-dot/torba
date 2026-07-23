# CARDS — Kart Bileşen Standartları

> **Border Radius:** `radius-lg` (16px) — Büyük kampanya kartlarında `radius-xl` (20px)  
> **Arka Plan:** `#FFFFFF` (`white`)  
> **Gölge:** `0 6px 20px rgba(16, 33, 43, 0.07)`  
> **Padding:** `space-4` (16px)

---

## 1. Kampanya Kartı (Campaign Card)

**Düzen:** Dikey kart, üstte görsel, altta bilgi alanı.

| Alan | Detay |
|---|---|
| **Kapak Görseli** | `aspect-ratio: 16/9`, `radius-xl` (20px) üst köşeler, lazy load |
| **Rozet** | Sol üst köşede turuncu `#FF6B35` kampanya rozeti ("%20 İndirim") |
| **İşletme Adı** | `Caption` (12px, `#647681` `neutral-600`) |
| **Kampanya Başlığı** | `Heading 3` (18px, `#10212B` `neutral-950`, max 2 satır) |
| **Puan Kazanımı** | `Sparkles` ikonu + "250 puan kazan" — `#F4B400` (Puan Sarısı) |
| **Süre Sayacı** | Kampanya bitimine kalan gün/saat — `Caption`, `#F4A62A` (Warning) |
| **CTA Alanı** | "Kuponu kullan" Primary / Ghost Button |

---

## 2. İşletme Kartı (Merchant Card)

**Düzen:** Yatay kart (thumbnail sol, bilgi sağ) veya dikey grid kart.

| Alan | Detay |
|---|---|
| **Logo / Kapak** | 64×64 px kare, `radius-md` (12px) |
| **İşletme Adı** | `Subtitle 1` (16px Medium, `#10212B`) |
| **Kategori + Mesafe**| `Caption` (12px, `#647681`) — "Restoran · 350m" |
| **Puan** | `Star` ikonu + "4.7" — `Caption`, `#F4B400` |
| **Doğrulanmış Rozet**| Doğrulanmış işletmelerde `#00B7EB` turkuaz tik rozeti |
| **Aktif Kampanya** | "3 aktif kampanya" — `Caption`, `#FF6B35` (Kampanya Turuncusu) |

---

## 3. Kupon Kartı (Coupon Card)

**Düzen:** Yatay, sol tarafta kesikli delikli çizgi (bilet efekti).

| Alan | Detay |
|---|---|
| **Sol Alan** | İndirim tutarı veya oranı — `H1 Bold`, `#FF6B35` |
| **Sağ Alan** | Kupon başlığı, geçerlilik tarihi, koşullar |
| **Durum** | Kullanılabilir (Turkuaz kenarlık) / Kullanılmış (Gri, çizgili) / Süresi Dolmuş (Kırmızı) |
| **CTA** | "Kuponu kullan" (#00B7EB) |

---

## 4. Puan Kartı (Points Balance Card)

**Düzen:** Geniş yatay kart, sarı/amber hafif dolgulu.

| Alan | Detay |
|---|---|
| **Arka Plan** | `#FFF8DE` (`puan açık yüzeyi`) |
| **Kenarlık** | 1px solid `#F4B400` (%30 opacity) |
| **İkon** | `Sparkles` (32px, `#F4B400`) |
| **Bakiye** | `H1 Bold` — "1.250 Puan" (`#7A5900`) |
| **Seviye Rozetleri** | Bronz / Gümüş 🥈 / Altın 🥇 / Platin 💎 tier rozeti |

---

## 5. Kategori Kartı (Category Card)

**Düzen:** Kare veya yuvarlak, ikon + etiket.

| Alan | Detay |
|---|---|
| **Boyut** | 72×72 px (Kare) veya 64 px çap (Daire) |
| **Arka Plan** | `#EDF3F6` (`neutral-100`), seçili: `#F1FBFE` (`brand-50`) |
| **İkon** | 28×28 px merkezi ikon |
| **Etiket** | `Caption` (12px, `#10212B`), altta ortalı |
| **Seçili** | Kenarlık `#00B7EB` (2px) |
