# INPUTS — Form Girdi Bileşen Standartları

> **Yükseklik:** 48px (LG) varsayılan mobil, 40px (MD) web paneller  
> **Border Radius:** `radius-md` (12px)  
> **Arka Plan:** `#FFFFFF` (white) veya `#EDF3F6` (neutral-100)

---

## 1. Text Input

- **Kenarlık:** 1px solid `#DCE6EB` (`neutral-200`)
- **Focus Kenarlık:** 2px solid `#00B7EB` (`brand-500`)
- **Arka Plan:** `#FFFFFF` (`white`)
- **Metin:** `#10212B` (`neutral-950`), Body Regular 14px
- **Placeholder:** `#9AAAB3` (`neutral-400`)
- **Hata Durumu:** Kenarlık `#E34D59` (`error`), altında 12px hata metni (`#A62934`)
- **Başarı Durumu:** Kenarlık `#16A56A` (`success`), sağda ✓ ikonu

---

## 2. Search Input

- **Sol İkon:** `Search` (20px, `#647681`)
- **Sağ İkon (Temizle):** `X` butonu, metin girildiğinde görünür
- **Arka Plan:** `#EDF3F6` (`neutral-100`) ile yuvarlatılmış `radius-full` (pill şeklinde)
- **Yükseklik:** 44px
- **Kullanım:** Ana Sayfa, Keşfet, İşletme arama

---

## 3. OTP Input (6 Haneli Doğrulama Kodu)

- **Düzen:** 6 adet bağımsız kare kutu, her biri 48×48 px
- **Aralarındaki Boşluk:** `space-2` (8px)
- **Font:** `H2 SemiBold` (22px), ortaya hizalı
- **Focus Durumu:** Aktif kutuda kenarlık `#00B7EB`, diğerleri `#DCE6EB`
- **Otomatik İlerleme:** Her rakam girildiğinde sonraki kutuya otomatik geçiş

---

## 4. Dropdown / Select

- **Görünüm:** Text Input gibi, sağda `ChevronDown` ikonu
- **Açılır Liste:** Bottom Sheet (mobil) veya floating dropdown (web)
- **Seçili Değer:** `#10212B`, Medium 14px

---

## 5. Genel Input Durumları

| Durum | Kenarlık | Arka Plan | Açıklama |
|---|---|---|---|
| **Default** | `#DCE6EB` (1px) | `#FFFFFF` | Boş, henüz dokunulmamış |
| **Focus** | `#00B7EB` (2px) | `#FFFFFF` | Aktif yazım |
| **Filled** | `#DCE6EB` (1px) | `#FFFFFF` | Dolu, odak dışı |
| **Error** | `#E34D59` (2px) | `#FDEDEF` | Hata uyarısı |
| **Disabled** | `#DCE6EB` opacity 0.4 | `#EDF3F6` | Düzenlenemez |
