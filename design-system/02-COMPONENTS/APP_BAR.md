# APP_BAR — Üst Navigasyon Çubuğu Standartları

> **Yükseklik:** 56px + Safe Area (`env(safe-area-inset-top)`)  
> **Arka Plan:** `#FFFFFF` (`white`) veya saydam (scroll'da opaklaşır)

---

## 1. Ana Sayfa App Bar (Home Header)

| Alan | Sol | Orta | Sağ |
|---|---|---|---|
| **İçerik** | Torba logosu (Turkuaz "T" mark + "Torba" metin) | Arama input (pill) | `Bell` bildirim ikonu (badge), `User` profil avatarı |

---

## 2. Alt Sayfa App Bar (Sub-page Header)

| Alan | Sol | Orta | Sağ |
|---|---|---|---|
| **İçerik** | `ArrowLeft` geri butonu (44×44 touch) | Sayfa başlığı (`Subtitle 1`, ortalı) | Bağlama göre aksiyon ikonu (`Filter`, `Share`, `MoreVertical`) |

---

## 3. Arama App Bar (Search Header)

| Alan | Tam Genişlik |
|---|---|
| **İçerik** | `Search` ikonu + tam genişlik text input (pill, `#EDF3F6`) + `X` temizle butonu |

---

## 4. Scroll Davranışı

- **Aşağı Kaydırma:** App Bar yumuşakça gizlenir (`translateY(-100%)`, 200ms)
- **Yukarı Kaydırma:** App Bar tekrar görünür
- **Pinned Mod (Cüzdan/Profil):** App Bar sabit kalır, altında `#DCE6EB` ince ayırıcı çizgi görünür
