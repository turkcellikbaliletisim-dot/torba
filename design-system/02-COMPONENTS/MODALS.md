# MODALS — Diyalog ve Overlay Standartları

> **Overlay Arka Plan:** `rgba(16, 33, 43, 0.4)` (neutral-950 %40 opak)  
> **Gölge:** `0 20px 50px rgba(16, 33, 43, 0.16)`  
> **Animasyon Süresi:** 250–350ms

---

## 1. Bottom Sheet

- **Konum:** Ekranın altından yukarı kayarak gelir
- **Üst Köşe Radius:** `radius-2xl` (24px)
- **Arka Plan:** `#FFFFFF` (`white`)
- **Tutamaç (Handle):** Üstte ortalı, 32×4 px, `#DCE6EB` yuvarlak çubuk
- **Yükseklik:** İçeriğe göre dinamik. Max: Ekranın %85'i
- **Kapatma:** Aşağı sürükleme, overlay'e tıklama veya `X` butonu
- **Kullanım:** Filtre paneli, kupon kullanım detayları, işletme seçenekleri

---

## 2. Action Sheet

- **Konum:** Bottom Sheet gibi alttan gelir
- **İçerik:** Dikey aksiyon butonları listesi (her biri 52px yükseklik)
- **Ayırıcı:** Aksiyonlar arasında `1px solid #DCE6EB`
- **İptal:** Listenin altında ayrı bir "Vazgeç" butonu (`#647681`)
- **Tehlikeli Aksiyon:** Kırmızı metin (`#E34D59`) — "Hesabı Sil", "Kuponu İptal Et"

---

## 3. Popup Dialog (Center Modal)

- **Konum:** Ekranın ortasında
- **Genişlik:** Min 280px, max 340px
- **Border Radius:** `radius-lg` (16px) veya `radius-xl` (20px)
- **Arka Plan:** `#FFFFFF`
- **İçerik Düzeni:** İkon (48px) → Başlık (H3 `#10212B`) → Açıklama (Body `#647681`) → Butonlar
- **Kullanım:** Hata mesajı, bilgilendirme, hızlı onay

---

## 4. Confirmation Dialog

- **Popup Dialog'un özel varyantı**
- **İkon:** `AlertTriangle` (`#F4A62A`) veya `CheckCircle` (`#00B7EB`)
- **Başlık:** "Kuponu kullanmak istiyor musunuz?"
- **Butonlar:** 
  - Sol: "Vazgeç" (Ghost Button)
  - Sağ: "Kullan" (Primary Button `#00B7EB`)
