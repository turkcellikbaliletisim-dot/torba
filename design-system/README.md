# Torba Design System — Mobil & Web Arayüz Standartları

> **Versiyon:** 1.0.0  
> **Ana Marka Rengi:** `#00B7EB` (Turkuaz / Cyan)  
> **Durum:** Aktif Tasarım Sistemi  
> **Kapsam:** Mobil Uygulama (iOS/Android), İşletme Paneli, Kurumsal İK Portalı ve Admin Paneli

---

## 📌 Ana Ürün Yaklaşımı

Torba bir finans uygulaması değildir. Uygulamanın ana değeri:

- İşletmeleri ve kampanyaları keşfetmek,
- Sadakat puanı kazanmak ve kullanmak,
- Kuponları tek yerde yönetmek,
- Yakındaki fırsatlara ulaşmak,
- İşletmelerle kalıcı müşteri ilişkisi kurmaktır.

---

## 📱 Mobil Ana Navigasyon

1. **Ana Sayfa:** Kampanyalar, öne çıkan fırsatlar, bakiye özeti
2. **Yakınımda:** Harita ve liste görünümü ile yakındaki işletmeler ve fırsatlar
3. **Cüzdan:** Kuponlar, üyelik kartları ve kullanılabilir avantajlar
4. **Puan:** Toin puan bakiyesi, seviye durumu ve kazanım geçmişi
5. **Profil:** Kullanıcı bilgileri, bildirim tercihleri ve ayarlar

---

## 🗂️ Doküman ve Modül Haritası

```text
design-system/
├── README.md                           # Tasarım sistemi ana rehberi
├── DESIGN_SYSTEM.md                    # Tasarım prensipleri ve mimari genel bakış
├── 01-FOUNDATIONS/                     # Temel Tasarım Tokenları
│   ├── COLORS.md                       # Renk paleti (#00B7EB Turkuaz, Neutral, Anlamsal)
│   ├── TYPOGRAPHY.md                   # Tipografi hiyerarşisi, ölçek ve font sistemleri
│   ├── SPACING.md                      # 4px grid, padding (20px horizontal), margin standartları
│   ├── ICONS.md                        # İkon seti, boyutlar, stroke ve durumlar
│   ├── SHADOWS.md                      # Gölge ve elevation seviyeleri (Sıcak nötr gölgeler)
│   ├── RADIUS.md                       # Köşe yuvarlama (Border radius) standartları (8, 12, 16, 20, 24px)
│   └── ANIMATIONS.md                   # Geçiş, modal, skeleton ve micro-animation kuralları
├── 02-COMPONENTS/                      # Bileşen Kütüphanesi Spesifikasyonları
├── 03-PAGES/                           # Ekran Standartları & Layoutlar (Ana Sayfa, Yakınımda, Cüzdan, Puan, Profil)
├── 04-TOKENS/                          # Kodlanmış Tasarım Tokenları (json, css, scss, tailwind)
├── 05-AI-RULES/                        # AI Destekli Geliştirme Yönergeleri
├── 06-PLATFORMS/                       # Geliştirici & Platform Eşlemeleri (Flutter, RN, SwiftUI, Compose)
├── 07-FIGMA/                           # Figma Yapısı ve Variant Organizasyonu
└── 08-QA/                              # QA, WCAG Kontrast ve Erişilebilirlik Kontrol Listesi
```
