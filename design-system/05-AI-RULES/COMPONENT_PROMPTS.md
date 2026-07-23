# COMPONENT_PROMPTS — AI Bileşen Üretme Prompt Kalıpları

> **Amaç:** Tek bir UI bileşenini AI ile üretmek / geliştirmek için optimize edilmiş prompt şablonları.

---

## 1. Genel Bileşen Prompt Şablonu

```
Torba tasarım sistemi için [BİLEŞEN ADI] bileşenini oluştur.

Teknoloji: [React / React Native / Flutter / SwiftUI]
Props/Parametreler:
- variant: [primary | secondary | outline | ghost]
- size: [sm | md | lg]
- disabled: boolean
- loading: boolean

Stil Kuralları:
- Ana marka rengi: #00B7EB (brand-500)
- Zemin: #F7FAFC (neutral-50), Kart: #FFFFFF (white), Kenarlık: #DCE6EB (neutral-200)
- Metin: #10212B (neutral-950), Yardımcı metin: #647681 (neutral-600)
- Kampanya turuncusu: #FF6B35, Puan sarısı: #F4B400
- Border radius: 12px (md) veya 16px (lg)
- Font: Inter, SemiBold 14px
- Touch target minimum 44x44 px
- Hover/Press: scale(0.97), 150ms ease
- Shadow: 0 6px 20px rgba(16, 33, 43, 0.07)
```

---

## 2. Spesifik Bileşen Promptları

### 2.1 Kampanya Kartı
```
Torba Kampanya Kartı bileşeni oluştur. Dikey kart: Üstte kapak görseli (16:9, 20px radius üst köşeler), sol üst köşede turuncu (#FF6B35) kampanya rozeti ("%20 İndirim"), altta işletme adı (neutral-600 caption), kampanya başlığı (H3 neutral-950, max 2 satır), "250 puan kazan" (#F4B400 puan sarısı etiket), kalan süre ("2 gün kaldı"). Kart zemini #FFFFFF, shadow: 0 6px 20px rgba(16,33,43,0.07), hover scale(0.98).
```

### 2.2 Bottom Navigation Bar
```
Torba 5 sekmeli mobil alt navigasyon çubuğu: Ana Sayfa, Yakınımda, Cüzdan, Puan, Profil (Lucide ikonları). Yükseklik 72px + safe area. Arka plan #FFFFFF opak + üst border #DCE6EB. Pasif: #647681 stroke ikon + 10px caption. Aktif: #00B7EB turkuaz ikon + bold caption. Yüzen gölge: 0 -8px 28px rgba(16,33,43,0.10).
```
