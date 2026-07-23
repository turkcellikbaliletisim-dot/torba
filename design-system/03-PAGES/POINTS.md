# POINTS — Puan Ekran Standartları

> **Rota:** `/mobile/points`  
> **App Bar:** Pinned — "Puanlarım"  
> **İlke:** Puan anlaşılır olmalıdır; kullanıcı puan bakiyesini ve nasıl kazandığını tek bakışta görür.

---

## 1. Sayfa Düzeni

```text
┌─────────────────────────────────────┐
│  App Bar "Puanlarım"                │
├─────────────────────────────────────┤
│  Büyük Puan Bakiye Kartı            │
│  ✨ 1.250 Puan                      │
│  Seviye: Gümüş 🥈                   │
│  [Progress Bar ██████░░░░ %71]      │
│  (500 puan sonra Altın seviye)      │
├─────────────────────────────────────┤
│  Rozet Galeri (Yatay Scroll)        │
│  🏆 İlk Alışveriş   ⭐ 100 Puan    │
│  🔥 5 Gün Streak    🎯 Referans     │
├─────────────────────────────────────┤
│  Tab: [Geçmiş | Nasıl Kazanırım]   │
├─────────────────────────────────────┤
│  Geçmiş Listesi / Kazanım Rehberi   │
├─────────────────────────────────────┤
│  Bottom Navigation (5 Tab)          │
│  [Ana Sayfa | Yakınımda | Cüzdan |  │
│   Puan | Profil]                    │
└─────────────────────────────────────┘
```

---

## 2. Puan Bakiye Kartı

- **Arka Plan:** `#FFF8DE` (Puan açık yüzeyi), 16px radius
- **Bakiye:** `Sparkles` ikonu + `H1 Bold` "1.250 Puan" (`#7A5900`)
- **Seviye Rozeti:** Gümüş 🥈 seviye etiketi
- **Progress Bar:** Sonraki seviyeye ilerleme çubuğu (`#F4B400` dolgulu)

---

## 3. Seviyeler (Tiers)

| Seviye | Gerekli Puan | Rozet |
|---|---|---|
| **Bronz** | 0 – 499 | 🥉 |
| **Gümüş** | 500 – 1.999 | 🥈 |
| **Altın** | 2.000 – 4.999 | 🥇 |
| **Platin** | 5.000+ | 💎 |

---

## 4. "Nasıl Kazanırım?" Tab İçeriği

- Anlaşılır 3 adımlı dikey liste:
  1. **İşletmelerde harcama yap** → Her harcamaya puan kazan
  2. **Kampanyalara katıl** → Özel kampanyalarda ekstra puan
  3. **Arkadaşını davet et** → Her başarılı davette puan hediye
