# QA — Kalite Güvence, Erişilebilirlik ve Test Kontrol Listesi

> **Standart:** WCAG 2.1 AA  
> **Kapsam:** Mobil (iOS/Android), Web Panelleri

---

## 1. Renk Kontrast Doğrulama Tablosu (WCAG AA — Min 4.5:1)

### Dark Theme Kontrastları

| Ön Plan (Metin/İkon) | Arka Plan | Kontrast Oranı | Sonuç |
|---|---|:---:|:---:|
| `#f8fafc` (Slate 50) | `#020617` (Slate 950) | **17.8:1** | ✅ AAA |
| `#f8fafc` (Slate 50) | `#0f172a` (Slate 900) | **14.5:1** | ✅ AAA |
| `#94a3b8` (Slate 400) | `#020617` (Slate 950) | **7.1:1** | ✅ AA |
| `#94a3b8` (Slate 400) | `#0f172a` (Slate 900) | **5.7:1** | ✅ AA |
| `#10b981` (Emerald 500) | `#020617` (Slate 950) | **8.2:1** | ✅ AAA |
| `#10b981` (Emerald 500) | `#0f172a` (Slate 900) | **6.6:1** | ✅ AA |
| `#f59e0b` (Amber 500) | `#020617` (Slate 950) | **9.1:1** | ✅ AAA |
| `#ef4444` (Red 500) | `#020617` (Slate 950) | **5.3:1** | ✅ AA |
| `#ffffff` (White) | `#10b981` (Emerald 500) | **3.4:1** | ⚠️ Large Text Only |
| `#ffffff` (White) | `#059669` (Emerald 600) | **4.6:1** | ✅ AA |

### Light Theme Kontrastları

| Ön Plan | Arka Plan | Kontrast Oranı | Sonuç |
|---|---|:---:|:---:|
| `#0f172a` (Slate 900) | `#ffffff` (White) | **16.3:1** | ✅ AAA |
| `#475569` (Slate 600) | `#ffffff` (White) | **5.9:1** | ✅ AA |
| `#059669` (Emerald 600) | `#ffffff` (White) | **4.6:1** | ✅ AA |
| `#d97706` (Amber 600) | `#ffffff` (White) | **3.8:1** | ⚠️ Large Text Only |

> [!WARNING]
> Beyaz metin, Emerald 500 üzerine konduğunda büyük metin (18px+ Bold veya 24px+ Regular) için yeterlidir ancak küçük metin için Emerald 600 kullanılmalıdır.

---

## 2. Dokunma Hedefi (Touch Target) Kontrol Listesi

| Bileşen | Min Boyut | Durum |
|---|---|:---:|
| Primary / Secondary / Outline Button | 48 × 40 px | ✅ |
| Ghost Button | 44 × 32 px (padding ile 44×44) | ✅ |
| Icon Button | 44 × 44 px | ✅ |
| FAB | 56 × 56 px | ✅ |
| Bottom Navigation Tab | 1/5 ekran × 56px | ✅ |
| Liste Elemanı (Satır) | Full width × 64 px | ✅ |
| Chip | 32 × 32 px (padding ile 44 yükseklik) | ✅ |
| Checkbox / Toggle | 44 × 44 px touch area | ✅ |
| App Bar Geri Butonu | 44 × 44 px | ✅ |

> **iOS Human Interface Guidelines:** Min 44×44 pt  
> **Material Design:** Min 48×48 dp (önerilen)

---

## 3. Responsive Test Matrisi

| Cihaz Kategorisi | Ekran Genişliği | Test Hedefi |
|---|---|---|
| **iPhone SE** | 375 px | En küçük desteklenen iOS cihaz |
| **iPhone 15** | 393 px | Standart iOS |
| **iPhone 15 Pro Max** | 430 px | Büyük iOS |
| **Samsung Galaxy S24** | 360 px | Standart Android |
| **Samsung Galaxy S24 Ultra** | 412 px | Büyük Android |
| **iPad Mini** | 744 px | Tablet (opsiyonel) |
| **Desktop (Paneller)** | 1280 px | İşletme / Kurumsal / Admin panelleri |
| **Desktop Geniş** | 1440 px | Admin dashboard |

### Her Cihaz İçin Kontrol Edilecekler
- [ ] Metin taşması (overflow/truncation) yok
- [ ] Görseller kırpılmıyor veya bozulmuyor
- [ ] Bottom Navigation Safe Area doğru hesaplanıyor
- [ ] Kart düzeni kırılmıyor (grid → tek kolon geçişi)
- [ ] Modallar ve Bottom Sheet'ler doğru yükseklikte açılıyor
- [ ] Arama çubuğu ve filtre tam genişliğe uyuyor

---

## 4. Animasyon Performans Limitleri

| Kural | Limit | Açıklama |
|---|---|---|
| **Animasyon FPS** | ≥ 60 FPS | Tüm geçişler ve micro-animasyonlar |
| **JS Thread Block** | < 16ms | Ana iş parçacığını bloke etmemeli |
| **GPU Katmanları** | Sadece `transform` ve `opacity` | `width`, `height`, `top`, `left` animasyonları yasak |
| **Skeleton Shimmer** | Max 1 gradient, sonsuz döngü | Performans dostu tek gradient kayması |
| **Bottom Sheet Spring** | < 400ms | Yavaş hissettirmemeli |
| **Reduced Motion** | `prefers-reduced-motion` desteği | Animasyonlar devre dışı bırakılabilmeli |

---

## 5. Erişilebilirlik (Accessibility) Kontrol Listesi

### 5.1 Ekran Okuyucu Uyumu
- [ ] Tüm görsellere `alt` / `accessibilityLabel` tanımlı
- [ ] Tüm butonlara anlamlı `aria-label` / `accessibilityHint` tanımlı
- [ ] Dekoratif görseller `aria-hidden="true"` / `isAccessibilityElement = false`
- [ ] Bakiye değerleri ekran okuyucu tarafından doğru okunuyor ("Dört bin beş yüz Türk Lirası")
- [ ] İkon-only butonlarda erişilebilir etiket var ("Geri", "Bildirimler", "Favori")

### 5.2 Klavye ve Odak Yönetimi
- [ ] Tab sırası mantıklı (soldan sağa, yukarıdan aşağıya)
- [ ] Modal açıldığında odak modal içine taşınıyor (focus trap)
- [ ] Modal kapandığında odak tetikleyici elemana geri dönüyor
- [ ] Klavye ile tüm işlemler yapılabiliyor (web paneller)

### 5.3 Renk Körlüğü Uyumluluğu
- [ ] Bilgi yalnızca renkle değil, ikon ve metin etiketiyle de iletiliyor
- [ ] Başarılı: Yeşil + ✓ ikonu + "Başarılı" metni
- [ ] Hata: Kırmızı + ✗ ikonu + "Hata" metni
- [ ] Bekliyor: Amber + ⏳ ikonu + "Bekliyor" metni
- [ ] Deuteranopia (yeşil-kırmızı körlüğü) simülasyonu ile test edildi

### 5.4 Metin ve Ölçekleme
- [ ] Sistem font büyütme (%150) uygulandığında arayüz kırılmıyor
- [ ] Dinamik Type (iOS) / Font Scale (Android) desteği
- [ ] Minimum metin boyutu 12px (hiçbir UI metni daha küçük olmamalı)

---

## 6. Güvenlik UX Kontrol Listesi

- [ ] Şifre alanları `secureTextEntry` / `type="password"` kullanıyor
- [ ] OTP alanları `autoComplete="one-time-code"` ile SMS otomatik doldurma destekliyor
- [ ] Bakiye ve kart bilgileri ekran görüntüsü alınırken maskeleniyor (opsiyonel güvenlik)
- [ ] Oturum süre aşımında otomatik çıkış ve bilgilendirme gösteriliyor
- [ ] Hassas verilerde clipboard kopyalama uyarısı var
