# LOADING — Yükleme Gösterge Standartları

---

## 1. Skeleton Shimmer

- **Amaç:** İçerik yüklenirken gerçek düzenin gri placeholder versiyonunu göstermek
- **Arka Plan:** `#EDF3F6` (`neutral-100`)
- **Shimmer Gradient:** Soldan sağa `transparent → #FFFFFF → transparent` kayması
- **Animasyon:** 1.5 sn döngü, `translateX(-100% → 100%)`, sonsuz tekrar
- **Radius:** İçerik türüne eşleşir — metin: `radius-sm` (8px), kart: `radius-lg` (16px), kampanya kartı: `radius-xl` (20px)

---

## 2. Spinner

- **Boyut:** 20px (inline), 32px (buton içi), 48px (tam sayfa)
- **Renk:** `#00B7EB` (`brand-500`) veya `#FFFFFF` (koyu butonlarda)
- **Animasyon:** 360° sonsuz dönüş, 800ms doğrusal zamanlama

---

## 3. Full Page Loading

- **Düzen:** Ekran ortasında Torba turkuaz logosu + altında spinner
- **Arka Plan:** `#F7FAFC` (`neutral-50`)
- **Kullanım:** Uygulama ilk açılışı, oturum doğrulama

---

## 4. Pull-to-Refresh Indicator

- **Çekme:** Üstten dönen dairesel ok ikonu (`#00B7EB`)
- **Bırak:** Spinner dönmeye başlar
- **Tamamlandı:** Spinner `✓` ikonuna dönüşür, 500ms sonra gizlenir
