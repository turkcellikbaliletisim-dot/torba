# TYPOGRAPHY — Tipografi Hiyerarşisi ve Font Standartları

> **Font Ailesi:** `Inter` (Birincil Sans-serif) / System Fallback  
> **Yaklaşım:** Anlaşılır, okunaklı, fırsat ve ödül duygusunu öne çıkaran mikro-metin stili.

---

## 1. Font Ağırlıkları (Font Weights)

- **Regular (400):** Gövde metinleri, açıklamalar, yardımcı detaylar.
- **Medium (500):** Form girdileri, etiketler, sekme başlıkları, ikincil butonlar.
- **SemiBold (600):** Kart başlıkları, liste başlıkları, bölüm başlıkları.
- **Bold (700):** Sayfa başlıkları, kampanya sloganları, puan/bakiye sayısal vurguları.

---

## 2. Tipografi Ölçeği

| Seviye | Size (px) | Weight | Line Height | Letter Spacing | Kullanım Alanı |
|---|---|---|---|---|---|
| **Display 1** | 36px | Bold (700) | 44px | -0.02em | Ana Kampanya Banner Başlıkları |
| **Heading 1 (H1)**| 28px | Bold (700) | 36px | -0.01em | Sayfa Başlıkları (Ana Sayfa, Cüzdan vb.) |
| **Heading 2 (H2)**| 22px | SemiBold (600)| 28px | -0.01em | Bölüm Başlıkları, Modal Başlıkları |
| **Heading 3 (H3)**| 18px | SemiBold (600)| 24px | 0em | Kart Başlıkları, İşletme Adları |
| **Subtitle 1** | 16px | Medium (500) | 22px | 0em | Liste Başlıkları, Önemli Etiketler |
| **Body Regular** | 14px | Regular (400) | 20px | 0em | Ana Gövde Metni, Açıklamalar |
| **Body Medium** | 14px | Medium (500) | 20px | 0em | Butonlar, Tab Başlıkları |
| **Caption** | 12px | Regular (400) | 16px | +0.01em | Tarihler, Mesafeler, Dipnotlar |
| **Overline** | 10px | SemiBold (600)| 14px | +0.05em | Kategori Etiketleri, Rozetler (UPPERCASE) |

---

## 3. Sayısal Gösterim Standartları

- **Puan / Toin Bakiyesi:** `#F4B400` (Puan Sarısı) ile `H2 Bold` veya `H1 Bold` -> `250 Puan`
- **Yemek Kartı Bakiyesi:** `#00B7EB` (Brand Turkuaz) ile `H1 Bold` -> `₺4.500,00`
- Rakamlarda hizalama için `font-variant-numeric: tabular-nums` kullanılır.

---

## 4. Mikro-Metin ve Dil İlkeleri

Metinler kısa, sıcak, anlaşılır ve doğrudan olmalıdır.

- ✅ **Doğru:** `Kuponu kullan`, `250 puan kazan`, `2 gün kaldı`, `Yakınındaki fırsatlar`
- ❌ **Kaçınılacak:** Uzun resmi açıklamalar, karmaşık finansal terimler, bağlamsız belirsiz butonlar (`Devam`, `İşlem yap`).
